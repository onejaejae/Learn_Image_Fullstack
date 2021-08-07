import React from "react";

const CustomInput = ({ label, Value, setValue, type = "text" }) => {
  return (
    <div>
      <label>{label}</label>
      <input
        style={{ width: "100%" }}
        value={Value}
        type={type}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
};

export default CustomInput;
