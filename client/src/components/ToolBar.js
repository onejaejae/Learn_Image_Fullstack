import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import axios from "axios";

const ToolBar = () => {
  const [me, setMe] = useContext(AuthContext);

  const logoutHandler = async () => {
    try {
      await axios.patch("/users/logout");
      setMe();
    } catch (error) {
      toast.error(error.message);
      console.error(error);
    }
  };

  return (
    <div>
      <Link to="/">
        <span>홈</span>
      </Link>
      {me ? (
        <span
          onClick={logoutHandler}
          style={{ float: "right", cursor: "pointer" }}
        >
          로그아웃({me.name})
        </span>
      ) : (
        <>
          {" "}
          <Link to="/auth/login">
            <span style={{ float: "right" }}>로그인</span>
          </Link>
          <Link to="/auth/register">
            <span style={{ float: "right", marginRight: 15 }}>회원가입</span>
          </Link>
        </>
      )}
    </div>
  );
};

export default ToolBar;
