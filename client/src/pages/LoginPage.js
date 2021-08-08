import React, { useState, useContext } from "react";
import CustomInput from "../components/CustomInput";
import { toast } from "react-toastify";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useHistory } from "react-router-dom";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [, setMe] = useContext(AuthContext);
  const history = useHistory();

  const loginHandler = async (e) => {
    try {
      e.preventDefault();
      if (username.length < 3 || password.length < 6)
        throw new Error("입력하신 정보가 올바르지 않습니다");

      const { data } = await axios.patch("/users/login", {
        username,
        password,
      });

      setMe({
        userId: data.userId,
        sessionId: data.sessionId,
        name: data.name,
      });
      history.push("/");
      toast.success("로그인!");
    } catch (error) {
      console.error(error.response);
      toast.error(error.response.data.message);
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
      <h3>로그인</h3>
      <form onSubmit={loginHandler}>
        <CustomInput label="회원ID" Value={username} setValue={setUsername} />
        <CustomInput
          label="비밀번호"
          Value={password}
          setValue={setPassword}
          type="password"
        />
        <button type="submit">로그인</button>
      </form>
    </div>
  );
};

export default LoginPage;
