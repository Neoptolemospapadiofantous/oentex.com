import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { u as useAuth, I as Icons, e as authService, a as showErrorToast, b as showSuccessToast } from "../entry-server.js";
import "react-dom/server";
import "react-router-dom/server.mjs";
import "@tanstack/react-query";
import "@heroui/react";
import "./react-B6hsMDRz.js";
import "react-fast-compare";
import "invariant";
import "shallowequal";
import "@tanstack/react-query-devtools";
import "@supabase/supabase-js";
import "@heroicons/react/24/outline";
import "react-hot-toast";
const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isValidSession, setIsValidSession] = useState(false);
  const navigate = useNavigate();
  const { updatePassword } = useAuth();
  useEffect(() => {
    const checkSession = async () => {
      const { session } = await authService.getSession();
      if (session) {
        setIsValidSession(true);
      } else {
        showErrorToast("Invalid or expired reset link");
        navigate("/");
      }
    };
    checkSession();
  }, [navigate]);
  const validateForm = () => {
    const newErrors = {};
    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setIsLoading(true);
    try {
      const { error } = await updatePassword(password);
      if (error) {
        showErrorToast(error.message);
      } else {
        showSuccessToast("Password updated successfully!");
        navigate("/deals");
      }
    } catch (error) {
      showErrorToast("Failed to update password");
    } finally {
      setIsLoading(false);
    }
  };
  if (!isValidSession) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" }),
      /* @__PURE__ */ jsx("p", { className: "text-foreground/70", children: "Verifying reset link..." })
    ] }) });
  }
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center py-20", children: /* @__PURE__ */ jsx("div", { className: "max-w-md w-full container-p-md", children: /* @__PURE__ */ jsxs("div", { className: "bg-content1 rounded-2xl container-p-2xl border border-border", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center mb-10", children: [
      /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-6", children: /* @__PURE__ */ jsx(Icons.lock, { className: "w-8 h-8 text-white" }) }),
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-foreground mb-3", children: "Set New Password" }),
      /* @__PURE__ */ jsx("p", { className: "text-foreground/70", children: "Enter your new password below" })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-8", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-foreground mb-3", children: "New Password" }),
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx(Icons.lock, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/70 w-5 h-5" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: showPassword ? "text" : "password",
              value: password,
              onChange: (e) => setPassword(e.target.value),
              className: `w-full pl-10 pr-12 container-py-sm bg-background border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${errors.password ? "border-red-500" : "border-border"}`,
              placeholder: "Enter your new password"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => setShowPassword(!showPassword),
              className: "absolute right-3 top-1/2 transform -translate-y-1/2 text-foreground/70 hover:text-foreground",
              children: showPassword ? /* @__PURE__ */ jsx(Icons.eyeOff, { className: "w-5 h-5" }) : /* @__PURE__ */ jsx(Icons.eye, { className: "w-5 h-5" })
            }
          )
        ] }),
        errors.password && /* @__PURE__ */ jsxs("p", { className: "text-red-500 text-sm mt-1 flex items-center", children: [
          /* @__PURE__ */ jsx(Icons.warning, { className: "w-4 h-4 mr-1" }),
          errors.password
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-foreground mb-3", children: "Confirm New Password" }),
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx(Icons.lock, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/70 w-5 h-5" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: showConfirmPassword ? "text" : "password",
              value: confirmPassword,
              onChange: (e) => setConfirmPassword(e.target.value),
              className: `w-full pl-10 pr-12 container-py-sm bg-background border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${errors.confirmPassword ? "border-red-500" : "border-border"}`,
              placeholder: "Confirm your new password"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => setShowConfirmPassword(!showConfirmPassword),
              className: "absolute right-3 top-1/2 transform -translate-y-1/2 text-foreground/70 hover:text-foreground",
              children: showConfirmPassword ? /* @__PURE__ */ jsx(Icons.eyeOff, { className: "w-5 h-5" }) : /* @__PURE__ */ jsx(Icons.eye, { className: "w-5 h-5" })
            }
          )
        ] }),
        errors.confirmPassword && /* @__PURE__ */ jsxs("p", { className: "text-red-500 text-sm mt-1 flex items-center", children: [
          /* @__PURE__ */ jsx(Icons.warning, { className: "w-4 h-4 mr-1" }),
          errors.confirmPassword
        ] })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "submit",
          disabled: isLoading,
          className: "w-full bg-gradient-to-r from-primary to-secondary text-white container-py-sm rounded-lg font-medium hover:from-primary/90 hover:to-secondary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed",
          children: isLoading ? /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center", children: [
            /* @__PURE__ */ jsx("div", { className: "w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" }),
            "Updating Password..."
          ] }) : "Update Password"
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-8 text-center", children: /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => navigate("/"),
        className: "text-foreground/70 hover:text-primary transition-colors text-sm",
        children: "Back to Home"
      }
    ) })
  ] }) }) });
};
export {
  ResetPassword as default
};
