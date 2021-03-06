import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoginPage from "./pages/LoginPage";
import MainPage from "./pages/MainPage";
import RegisterPage from "./pages/RegisterPage";
import ToolBar from "./components/ToolBar";
import { Switch, Route } from "react-router-dom";
import ImagePage from "./pages/ImagePage";

const App = () => {
  return (
    <div style={{ maxWidth: 600, margin: "auto", marginRight: "auto" }}>
      <ToolBar />
      <ToastContainer />
      <Switch>
        <Route path="/images/:imageId" exact component={ImagePage} />
        <Route path="/auth/register" exact component={RegisterPage} />
        <Route path="/auth/login" exact component={LoginPage} />
        <Route path="/" component={MainPage} />
      </Switch>
    </div>
  );
};

export default App;
