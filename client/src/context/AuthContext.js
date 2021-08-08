import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [me, setMe] = useState();

  useEffect(() => {
    const sessionId = localStorage.getItem("sessionId");

    if (me) {
      axios.defaults.headers.common.sessionid = me.sessionId;
      localStorage.setItem("sessionId", me.sessionId);
    } else if (sessionId) {
      console.log("sessionId", sessionId);
      axios
        .get("/users/me", { headers: { sessionid: sessionId } })
        .then((result) =>
          setMe({
            name: result.data.name,
            userId: result.data.userId,
            sessionId: result.data.sessionId,
          })
        )
        .catch((error) => {
          console.error(error);
          delete axios.defaults.headers.common.sessionid;
          localStorage.removeItem("sessionId");
        });
    } else {
      // eslint-disable-next-line no-unused-expressions
      delete axios.defaults.headers.common.sessionid;
    }
  }, [me]);

  return (
    <AuthContext.Provider value={[me, setMe]}>{children}</AuthContext.Provider>
  );
};

export default AuthContext;
