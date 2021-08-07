import React, { useState, useContext } from "react";
import CustomInput from "../components/CustomInput";
import { toast } from "react-toastify";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passworkCheck, setPasswordCheck] = useState("");
  const [me, setMe] = useContext(AuthContext);

  const submitHandler = async (e) => {
    try {
      e.preventDefault();

      if (username.length < 3)
        throw new Error("회원ID가 너무 짧습니다. 3자 이상으로 해주세요.");
      if (password.length < 6)
        throw new Error("비밀번호가 너무 짧습니다. 6자 이상으로 해주세요.");
      if (password !== passworkCheck)
        throw new Error("비밀번호가 다릅니다. 비밀번호를 확인해주세요.");

      const { data } = await axios.post("/users/register", {
        name,
        username,
        password,
      });

      setMe({
        userId: data.userId,
        sessionId: data.sessionId,
        name: data.name,
      });

      toast.success("회원가입 성공!");
      console.log(data);
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  return (
    <div
      style={{
        marginTop: 100,
        maxWidth: 350,
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      <h3>회원가입</h3>
      <form onSubmit={submitHandler}>
        <CustomInput label="이름" Value={name} setValue={setName} />
        <CustomInput label="회원ID" Value={username} setValue={setUsername} />
        <CustomInput
          label="비밀번호"
          Value={password}
          type="password"
          setValue={setPassword}
        />
        <CustomInput
          label="비밀번호 확인"
          Value={passworkCheck}
          type="password"
          setValue={setPasswordCheck}
        />
        <button type="submit">회원가입</button>
      </form>
    </div>
  );
};

export default RegisterPage;
