import aws from "aws-sdk";
import dotenv from "dotenv";
dotenv.config();

const { AWS_ACCESS_KEY, AWS_SECRET_KEY } = process.env;

export const s3 = new aws.S3({
  secretAccessKey: AWS_SECRET_KEY,
  accessKeyId: AWS_ACCESS_KEY,
  region: "ap-northeast-2",
});

// promise(비동기)로 만들어줌
// 외부에서 좀 더 간결하게 호출하기 위해
export const getSignedUrl = ({ key }) => {
  return new Promise((resolve, reject) => {
    s3.createPresignedPost(
      {
        Bucket: "imagefullstack",
        Fields: {
          key,
        },
        // url 만료시간
        // 초단위, 5분
        Expires: 300,
        Conditions: [
          ["content-length-range", 0, 50 * 1000 * 1000],
          ["starts-with", "$Content-Type", "image/"],
        ],
      },
      (err, data) => {
        if (err) reject(err);
        resolve(data);
      }
    );
  });
};
