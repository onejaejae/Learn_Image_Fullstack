import React from "react";
import "./ProgressBar.css";

export const ProgressBar = ({ percent }) => {
  return (
    <div className="progress-bar-boundary">
      <div style={{ width: `${percent || 0}%` }}>{percent}%</div>
    </div>
  );
};
