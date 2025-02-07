import React from "react";
import "./Button.css";
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button(
  props: ButtonProps & {
    mode?: "default" | "invert";
  }
) {
  return (
    <button
      {...props}
      className={`default-button ${props.mode == "invert" ? "invert" : "default"} ${props.className}`}
    >
      {props.children}
    </button>
  );
}
