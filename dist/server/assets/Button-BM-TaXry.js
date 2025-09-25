import { jsx } from "react/jsx-runtime";
import { Button as Button$1, Spinner } from "@heroui/react";
const Button = ({
  loading,
  leftIcon,
  rightIcon,
  children,
  disabled,
  className,
  ...props
}) => {
  return /* @__PURE__ */ jsx(
    Button$1,
    {
      ...props,
      isDisabled: disabled || loading,
      startContent: loading ? /* @__PURE__ */ jsx(Spinner, { size: "sm", color: "white" }) : leftIcon,
      endContent: !loading ? rightIcon : void 0,
      className: `${className || ""} ${props.color === "primary" || !props.color ? "shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105" : ""}`,
      classNames: {
        base: "font-semibold",
        ...props.classNames
      },
      children
    }
  );
};
export {
  Button as B
};
