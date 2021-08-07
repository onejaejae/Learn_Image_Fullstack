import { User } from "../models/User";
const { hash, compare } = require("bcryptjs");

export const postRegister = async (req, res, next) => {
  try {
    const { name, username, password } = req.body;

    if (password.length < 6)
      throw new Error("비밀번호를 6자 이상으로 해주세요.");
    const hashedPassword = await hash(password, 10);

    const user = await new User({
      name,
      username,
      hashedPassword,
      sessions: [{ createAt: new Date() }],
    }).save();

    const session = user.sessions[0];
    res.json({
      message: "user registered",
      sessionId: session._id,
      name: user.name,
      userId: user.username,
    });
  } catch (error) {
    next(error);
  }
};

export const patchLogin = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    let isValid = false;
    let session = null;

    if (user) {
      isValid = await compare(password, user.hashedPassword);
    }

    if (!isValid) throw new Error("입력하신 정보가 올바르지 않습니다");
    // 로그인 인증을 완료하면 세션에 추가
    else {
      user.sessions.push({ createAt: new Date() });
      session = user.sessions[user.sessions.length - 1];
      await user.save();
    }

    return res.status(200).json({
      message: "user Validated",
      sessionId: session._id,
      name: user.name,
    });
  } catch (error) {
    next(error);
  }
};

export const patchLogout = async (req, res, next) => {
  try {
    console.log(req.user);
    if (!req.user) throw new Error("invalid sessionid");

    await User.updateOne(
      { _id: req.user._id },
      { $pull: { sessions: { _id: req.headers.sessionid } } }
    );

    res.json({ message: "user is logged out" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
