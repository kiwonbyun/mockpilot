import React from "react";

interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  variant?: "error" | "description" | "default";
}

const Text = ({ variant = "default", ...props }: TextProps) => {
  const errorStyle = {
    color: "#f56565",
    fontSize: "0.875rem",
    marginTop: "0.25rem",
  };

  const descriptionStyle = {
    fontSize: "0.75rem",
    color: "#718096",
    marginTop: "0.25rem",
  };

  switch (variant) {
    case "error":
      return (
        <p style={errorStyle} {...props}>
          {props.children}
        </p>
      );
    case "description":
      return (
        <p style={descriptionStyle} {...props}>
          {props.children}
        </p>
      );
    default:
      return <p {...props}>{props.children}</p>;
  }
};

export default Text;
