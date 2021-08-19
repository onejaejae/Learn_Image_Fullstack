const sharp = require("sharp");
const aws = require("aws-sdk");
const s3 = new aws.S3();

const transformationOptions = [
  {
    name: "w140",
    width: 140,
  },
  {
    name: "w600",
    width: 600,
  },
];

exports.handler = async (event) => {
  try {
    const key = event.Records[0].s3.object.key;
    const keyOnly = key.split("/")[1];
    console.log(`Image Resizing: ${keyOnly}`);

    // s3.getObject()는 promise를 return하지 않기 때문에 promise()를 써주었다
    const image = await s3
      .getObject({ Bucket: "imagefullstack", Key: key })
      .promise();

    await Promise.all(
      transformationOptions.map(async ({ name, width }) => {
        try {
          const newKey = `${name}/${keyOnly}`;
          const resizedImage = await sharp(image.Body)
            .rotate()
            .resize({ width, height: width, fit: "outside" })
            .toBuffer();

          await s3
            .putObject({
              Bucket: "imagefullstack",
              Body: resizedImage,
              Key: newKey,
            })
            .promise();
        } catch (error) {
          throw error;
        }
      })
    );

    return {
      statusCode: 200,
      body: event,
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: event,
    };
  }
};
