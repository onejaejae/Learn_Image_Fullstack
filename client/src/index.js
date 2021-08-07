import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import { ImageProvider } from "./context/ImageContext";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthContext>
        <ImageProvider>
          <App />
        </ImageProvider>
      </AuthContext>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
