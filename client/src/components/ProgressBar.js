import React from "react";
import "./ProgressBar.css";

export const ProgressBar = ({ percent }) => {
  return (
    <div className="progress-bar-boundary">
      <div style={{ width: `${percent}%` }}>{percent}%</div>
    </div>
  );
};
