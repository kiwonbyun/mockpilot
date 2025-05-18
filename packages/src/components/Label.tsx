import React from "react";

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

const Label = ({ required = false, ...props }: LabelProps) => {
  return (
    <label
      style={{
        display: "block",
        marginBottom: "0.5rem",
        fontWeight: "500",
        ...props.style,
      }}
      {...props}
    >
      {props.children}
      {required && (
        <span style={{ color: "red", marginLeft: "0.25rem" }}>*</span>
      )}
    </label>
  );
};

export default Label;
