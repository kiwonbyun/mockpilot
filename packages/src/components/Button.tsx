import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

const Button = ({ variant = "primary", style, ...props }: ButtonProps) => {
  const primaryStyle = {
    padding: "0.5rem 1rem",
    borderRadius: "4px",
    border: "none",
    backgroundColor: "#3182ce",
    color: "white",
    cursor: "pointer",
  };

  const secondaryStyle = {
    padding: "0.5rem 1rem",
    borderRadius: "4px",
    border: "1px solid #e2e8f0",
    backgroundColor: "white",
    cursor: "pointer",
  };

  const computedStyle = variant === "primary" ? primaryStyle : secondaryStyle;

  return (
    <button style={{ ...computedStyle, ...style }} {...props}>
      {props.children}
    </button>
  );
};

export default Button;
