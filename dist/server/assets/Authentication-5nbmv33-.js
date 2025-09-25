import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, CardBody, Input, Spinner } from "@heroui/react";
import { u as useAuth, a as showErrorToast, I as Icons, l as logo, b as showSuccessToast } from "../entry-server.js";
import { S as SEO, s as seoData } from "./seoData-LGOe0Do4.js";
import "react-dom/server";
import "react-router-dom/server.mjs";
import "@tanstack/react-query";
import "./react-B6hsMDRz.js";
import "react-fast-compare";
import "invariant";
import "shallowequal";
import "@tanstack/react-query-devtools";
import "@supabase/supabase-js";
import "@heroicons/react/24/outline";
import "react-hot-toast";
const Authentication = () => {
  const [state, setState] = useState({
    isLoading: false,
    loadingProvider: null,
    success: false,
    error: null,
    // Registration form state
    registrationStep: "email",
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    isEmailValid: false,
    isPasswordValid: false,
    isConfirmPasswordValid: false
  });
  const { signInWithGoogle, signInWithMicrosoft, signUpWithEmail } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    setState({
      isLoading: false,
      loadingProvider: null,
      success: false,
      error: null,
      registrationStep: "email",
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
      isEmailValid: false,
      isPasswordValid: false,
      isConfirmPasswordValid: false
    });
  }, []);
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const validatePassword = (password) => {
    return password.length >= 12;
  };
  const handleEmailChange = (value) => {
    let formattedValue = value;
    if (value.length > 0 && !value.startsWith(" ")) {
      formattedValue = ` ${value}`;
    }
    const trimmedValue = formattedValue.trim();
    const isValid = validateEmail(trimmedValue);
    setState((prev) => ({
      ...prev,
      email: formattedValue,
      isEmailValid: isValid
    }));
    if (state.error && (state.error.includes("email") || state.error.includes("Email")) && state.registrationStep === "email") {
      setState((prev) => ({ ...prev, error: null }));
    }
  };
  const handlePasswordChange = (value) => {
    let formattedValue = value;
    if (value.length > 0 && !value.startsWith(" ")) {
      formattedValue = ` ${value}`;
    }
    const trimmedValue = formattedValue.trim();
    const isValid = validatePassword(trimmedValue);
    setState((prev) => ({
      ...prev,
      password: formattedValue,
      isPasswordValid: isValid
    }));
    if (state.error && (state.error.includes("password") || state.error.includes("Password")) && state.registrationStep === "password") {
      setState((prev) => ({ ...prev, error: null }));
    }
  };
  const handleConfirmPasswordChange = (value) => {
    let formattedValue = value;
    if (value.length > 0 && !value.startsWith(" ")) {
      formattedValue = ` ${value}`;
    }
    const trimmedValue = formattedValue.trim();
    const trimmedPassword = state.password.trim();
    const isValid = trimmedValue === trimmedPassword && trimmedValue.length >= 12;
    setState((prev) => ({
      ...prev,
      confirmPassword: formattedValue,
      isConfirmPasswordValid: isValid
    }));
    if (state.error && (state.error.includes("password") || state.error.includes("Password")) && state.registrationStep === "password") {
      setState((prev) => ({ ...prev, error: null }));
    }
  };
  const handleFullNameChange = (value) => {
    let formattedValue = value;
    if (value.length > 0 && !value.startsWith(" ")) {
      formattedValue = ` ${value}`;
    }
    setState((prev) => ({
      ...prev,
      fullName: formattedValue
    }));
    if (state.error && (state.error.includes("name") || state.error.includes("Name")) && state.registrationStep === "password") {
      setState((prev) => ({ ...prev, error: null }));
    }
  };
  const handleEmailSubmit = () => {
    if (state.isEmailValid) {
      setState((prev) => ({
        ...prev,
        registrationStep: "password",
        error: null
      }));
    } else {
      showErrorToast("Please enter a valid email address", "Invalid Email");
    }
  };
  const handleManualRegister = async () => {
    setState((prev) => ({ ...prev, error: null }));
    if (!state.isEmailValid || !state.isPasswordValid || !state.isConfirmPasswordValid) {
      const errorMessage = "Please fill in all fields correctly";
      setState((prev) => ({
        ...prev,
        error: errorMessage
      }));
      showErrorToast(errorMessage, "Validation Error");
      return;
    }
    const trimmedPassword = state.password.trim();
    const trimmedConfirmPassword = state.confirmPassword.trim();
    if (trimmedPassword !== trimmedConfirmPassword) {
      const errorMessage = "Passwords do not match";
      setState((prev) => ({
        ...prev,
        error: errorMessage
      }));
      showErrorToast(errorMessage, "Password Error");
      return;
    }
    if (!state.email.trim() || !trimmedPassword || !state.fullName.trim()) {
      const errorMessage = "All fields are required";
      setState((prev) => ({
        ...prev,
        error: errorMessage
      }));
      showErrorToast(errorMessage, "Required Fields");
      return;
    }
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    const timeoutId = setTimeout(() => {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Request timed out. Please check your connection and try again."
      }));
    }, 3e4);
    try {
      const result = await signUpWithEmail(
        state.email.trim(),
        trimmedPassword,
        {
          full_name: state.fullName.trim()
        }
      );
      clearTimeout(timeoutId);
      if (result.error) {
        const errorMessage = result.error.message || "Failed to create account. Please try again.";
        console.log("🔍 Registration error in component:", {
          error: result.error,
          errorMessage,
          errorType: result.error.type,
          fullError: JSON.stringify(result.error, null, 2)
        });
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMessage
        }));
        showErrorToast(errorMessage, "Registration Failed");
      } else {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          success: true
        }));
        showSuccessToast("Account created successfully! Redirecting to dashboard...", "Welcome to Oentex!", 3e3);
        setTimeout(() => navigate("/dashboard"), 2e3);
      }
    } catch (error) {
      clearTimeout(timeoutId);
      console.error("Registration error:", error);
      let errorMessage = "Failed to create account. Please try again.";
      if (error instanceof Error) {
        if (error.message.includes("network")) {
          errorMessage = "Network error. Please check your connection and try again.";
        } else if (error.message.includes("timeout")) {
          errorMessage = "Request timed out. Please try again.";
        } else if (error.message.includes("rate limit")) {
          errorMessage = "Too many attempts. Please wait a moment and try again.";
        } else if (error.message.includes("abort")) {
          errorMessage = "Request was cancelled. Please try again.";
        } else {
          errorMessage = error.message;
        }
      }
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));
      showErrorToast(errorMessage, "Registration Failed");
    }
  };
  const handleBackToEmail = () => {
    setState((prev) => ({
      ...prev,
      registrationStep: "email",
      error: null
    }));
  };
  const handleRetry = () => {
    setState((prev) => ({ ...prev, error: null }));
    if (state.registrationStep === "password") {
      handleManualRegister();
    } else {
      handleEmailSubmit();
    }
  };
  const handleOAuthSignIn = useCallback(async (provider) => {
    if (state.isLoading) return;
    setState((prev) => ({
      ...prev,
      isLoading: true,
      loadingProvider: provider,
      error: null
    }));
    try {
      const result = provider === "google" ? await signInWithGoogle() : await signInWithMicrosoft();
      if (result.error) {
        let errorMessage = result.error.message || `Failed to sign in with ${provider}. Please try again.`;
        if (result.error.message.includes("popup")) {
          errorMessage = "Popup blocked. Please allow popups and try again.";
        } else if (result.error.message.includes("cancelled")) {
          errorMessage = "Sign-in was cancelled. Please try again.";
        } else if (result.error.message.includes("network")) {
          errorMessage = "Network error. Please check your connection and try again.";
        } else if (result.error.message.includes("rate limit")) {
          errorMessage = "Too many attempts. Please wait a moment and try again.";
        }
        setState((prev) => ({
          ...prev,
          isLoading: false,
          loadingProvider: null,
          error: errorMessage
        }));
        showErrorToast(errorMessage, `${provider.charAt(0).toUpperCase() + provider.slice(1)} Sign-in Failed`);
      } else {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          loadingProvider: null,
          success: true
        }));
        setTimeout(() => navigate("/dashboard"), 2e3);
      }
    } catch (error) {
      console.error("OAuth sign-in error:", error);
      let errorMessage = `Failed to sign in with ${provider}. Please try again.`;
      if (error instanceof Error) {
        if (error.message.includes("popup")) {
          errorMessage = "Popup blocked. Please allow popups and try again.";
        } else if (error.message.includes("cancelled")) {
          errorMessage = "Sign-in was cancelled. Please try again.";
        } else if (error.message.includes("network")) {
          errorMessage = "Network error. Please check your connection and try again.";
        } else if (error.message.includes("timeout")) {
          errorMessage = "Request timed out. Please try again.";
        } else if (error.message.includes("rate limit")) {
          errorMessage = "Too many attempts. Please wait a moment and try again.";
        } else {
          errorMessage = error.message;
        }
      }
      setState((prev) => ({
        ...prev,
        isLoading: false,
        loadingProvider: null,
        error: errorMessage
      }));
      showErrorToast(errorMessage, `${provider.charAt(0).toUpperCase() + provider.slice(1)} Sign-in Failed`);
    }
  }, [state.isLoading, signInWithGoogle, signInWithMicrosoft, navigate]);
  const MicrosoftIcon = () => /* @__PURE__ */ jsxs("svg", { className: "w-5 h-5", viewBox: "0 0 21 21", fill: "none", "aria-hidden": "true", children: [
    /* @__PURE__ */ jsx("path", { d: "M10 1H1v9h9V1z", fill: "#f25022" }),
    /* @__PURE__ */ jsx("path", { d: "M20 1h-9v9h9V1z", fill: "#7fba00" }),
    /* @__PURE__ */ jsx("path", { d: "M10 11H1v9h9v-9z", fill: "#00a4ef" }),
    /* @__PURE__ */ jsx("path", { d: "M20 11h-9v9h9v-9z", fill: "#ffb900" })
  ] });
  const GoogleIcon = () => /* @__PURE__ */ jsxs("svg", { className: "w-5 h-5", viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true", children: [
    /* @__PURE__ */ jsx("path", { d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z", fill: "#4285F4" }),
    /* @__PURE__ */ jsx("path", { d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z", fill: "#34A853" }),
    /* @__PURE__ */ jsx("path", { d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z", fill: "#FBBC05" }),
    /* @__PURE__ */ jsx("path", { d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z", fill: "#EA4335" })
  ] });
  const ProviderButton = ({ provider, icon, label }) => {
    const isProviderLoading = state.loadingProvider === provider;
    const isDisabled = state.isLoading;
    return /* @__PURE__ */ jsx(
      Button,
      {
        onPress: () => handleOAuthSignIn(provider),
        isDisabled,
        variant: "solid",
        color: "default",
        size: "md",
        className: "w-full font-medium py-md text-sm rounded-lg bg-default-100 hover:bg-default-200 text-foreground border-0 shadow-none transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]",
        startContent: isProviderLoading ? /* @__PURE__ */ jsx(Spinner, { size: "sm", className: "text-current" }) : /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center", children: icon }),
        isLoading: isProviderLoading,
        children: /* @__PURE__ */ jsx("span", { className: "ml-md", children: isProviderLoading ? "Connecting..." : label })
      }
    );
  };
  if (state.success) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center bg-background section-px-lg", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-md text-center border border-divider rounded-large bg-content1 shadow-medium p-lg", children: [
      /* @__PURE__ */ jsx("div", { className: "w-20 h-20 bg-gradient-to-br from-success-200 to-success-300 rounded-full flex items-center justify-center mx-auto mb-2xl shadow-lg", children: /* @__PURE__ */ jsx(Icons.success, { className: "w-10 h-10 text-success" }) }),
      /* @__PURE__ */ jsx("h2", { className: "text-3xl font-bold text-foreground mb-lg", children: "Welcome to Oentex!" }),
      /* @__PURE__ */ jsx("p", { className: "text-foreground-500 text-lg mb-2xl", children: "Your account has been created. Redirecting to dashboard..." }),
      /* @__PURE__ */ jsx("div", { className: "w-64 h-2 bg-success-200 rounded-full mx-auto overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "w-full h-full bg-gradient-to-r from-success to-success-400 animate-pulse rounded-full" }) })
    ] }) });
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(SEO, { ...seoData.authentication }),
    /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center bg-background section-px-md py-md", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-sm border border-divider rounded-large bg-content1 shadow-medium p-lg", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-lg", children: [
        /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center gap-md mb-md", children: /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-lg", children: /* @__PURE__ */ jsx(
          "img",
          {
            src: logo,
            alt: "Oentex Logo",
            className: "w-8 h-8 object-contain"
          }
        ) }) }),
        /* @__PURE__ */ jsx("p", { className: "text-foreground-500 text-base", children: "Sign up or Login with" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-md mb-lg", children: [
        /* @__PURE__ */ jsx(
          ProviderButton,
          {
            provider: "google",
            icon: /* @__PURE__ */ jsx(GoogleIcon, {}),
            label: "Google"
          }
        ),
        /* @__PURE__ */ jsx(
          ProviderButton,
          {
            provider: "microsoft",
            icon: /* @__PURE__ */ jsx(MicrosoftIcon, {}),
            label: "Microsoft"
          }
        )
      ] }),
      state.error && /* @__PURE__ */ jsx("div", { className: "bg-danger-50 border border-danger-300 rounded-large container-p-md mb-md shadow-small", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-sm", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-sm", children: [
          /* @__PURE__ */ jsx(Icons.warning, { className: "w-4 h-4 text-danger flex-shrink-0" }),
          /* @__PURE__ */ jsx("p", { className: "text-danger text-sm font-medium", children: state.error })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-xs", children: [
          state.error.includes("already exists") && /* @__PURE__ */ jsx(
            Button,
            {
              size: "sm",
              variant: "solid",
              color: "primary",
              onPress: () => {
                setState((prev) => ({ ...prev, error: null, registrationStep: "email" }));
              },
              className: "text-white",
              children: "Sign In Instead"
            }
          ),
          /* @__PURE__ */ jsx(
            Button,
            {
              size: "sm",
              variant: "light",
              color: "danger",
              onPress: handleRetry,
              className: "text-danger hover:bg-danger-100",
              children: "Retry"
            }
          )
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "relative mb-md", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center", children: /* @__PURE__ */ jsx("div", { className: "w-full border-t border-divider" }) }),
        /* @__PURE__ */ jsx("div", { className: "relative flex justify-center text-sm", children: /* @__PURE__ */ jsx("span", { className: "px-md bg-content1 text-foreground-500 border border-divider rounded-full", children: "OR" }) })
      ] }),
      /* @__PURE__ */ jsx(Card, { className: "mb-md border border-divider shadow-small bg-content2", children: /* @__PURE__ */ jsx(CardBody, { className: "container-p-md", children: state.registrationStep === "email" ? (
        // Email Step
        /* @__PURE__ */ jsxs("div", { className: "space-y-md", children: [
          /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-foreground mb-sm", children: "Enter your email" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-foreground-500", children: "We'll send you a verification link" })
          ] }),
          /* @__PURE__ */ jsx(
            Input,
            {
              type: "email",
              placeholder: "name@example.com",
              value: state.email,
              onValueChange: handleEmailChange,
              isInvalid: state.email.length > 0 && !state.isEmailValid,
              className: "w-full",
              size: "md",
              startContent: /* @__PURE__ */ jsx(Icons.mail, { className: "w-4 h-4 text-foreground-400 mr-2" }),
              endContent: state.email.length > 0 && state.isEmailValid ? /* @__PURE__ */ jsx(Icons.check, { className: "w-4 h-4 text-success" }) : state.email.length > 0 && !state.isEmailValid ? /* @__PURE__ */ jsx(Icons.warning, { className: "w-4 h-4 text-danger" }) : null,
              classNames: {
                input: "pl-4 text-white placeholder:text-foreground-400 ml-2",
                inputWrapper: `focus-within:border-primary focus-within:shadow-none bg-content2 ${state.email.length > 0 && !state.isEmailValid ? "border-danger" : state.email.length > 0 && state.isEmailValid ? "border-success" : ""}`,
                innerWrapper: "gap-3"
              }
            }
          ),
          /* @__PURE__ */ jsx(
            Button,
            {
              onPress: handleEmailSubmit,
              isDisabled: !state.isEmailValid,
              color: "primary",
              size: "md",
              className: "w-full font-medium",
              children: "Continue"
            }
          )
        ] })
      ) : (
        // Password Step
        /* @__PURE__ */ jsxs("div", { className: "space-y-md", children: [
          /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-foreground mb-sm", children: "Create your password" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-foreground-500", children: "Choose a strong password for your account" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-sm", children: [
            /* @__PURE__ */ jsx(
              Input,
              {
                type: "text",
                placeholder: " Full Name",
                value: state.fullName,
                onValueChange: handleFullNameChange,
                isInvalid: state.fullName.length > 0 && state.fullName.trim().length === 0,
                className: "w-full",
                size: "md",
                startContent: /* @__PURE__ */ jsx(Icons.user, { className: "w-4 h-4 text-foreground-400" }),
                endContent: state.fullName.length > 0 && state.fullName.trim().length > 0 ? /* @__PURE__ */ jsx(Icons.check, { className: "w-4 h-4 text-success" }) : state.fullName.length > 0 && state.fullName.trim().length === 0 ? /* @__PURE__ */ jsx(Icons.warning, { className: "w-4 h-4 text-danger" }) : null,
                classNames: {
                  input: "pl-md text-white placeholder:text-foreground-400",
                  inputWrapper: `focus-within:border-primary focus-within:shadow-none bg-content2 ${state.fullName.length > 0 && state.fullName.trim().length === 0 ? "border-danger" : state.fullName.length > 0 && state.fullName.trim().length > 0 ? "border-success" : ""}`
                }
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "space-y-sm", children: [
              /* @__PURE__ */ jsx(
                Input,
                {
                  type: "password",
                  placeholder: " Password (min. 12 characters)",
                  value: state.password,
                  onValueChange: handlePasswordChange,
                  isInvalid: state.password.length > 0 && !state.isPasswordValid,
                  className: "w-full",
                  size: "md",
                  startContent: /* @__PURE__ */ jsx(Icons.lock, { className: "w-4 h-4 text-foreground-400" }),
                  endContent: state.password.length > 0 && state.isPasswordValid ? /* @__PURE__ */ jsx(Icons.check, { className: "w-4 h-4 text-success" }) : state.password.length > 0 && !state.isPasswordValid ? /* @__PURE__ */ jsx(Icons.warning, { className: "w-4 h-4 text-danger" }) : null,
                  classNames: {
                    input: "pl-md text-white placeholder:text-foreground-400",
                    inputWrapper: `focus-within:border-primary focus-within:shadow-none bg-content2 ${state.password.length > 0 && !state.isPasswordValid ? "border-danger" : state.password.length > 0 && state.isPasswordValid ? "border-success" : ""}`
                  }
                }
              ),
              state.password.length > 0 && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-sm", children: [
                /* @__PURE__ */ jsx("div", { className: "flex-1 bg-content3 rounded-full h-1", children: /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: `h-1 rounded-full transition-all duration-300 ${state.password.length < 6 ? "bg-danger w-1/4" : state.password.length < 9 ? "bg-warning w-1/2" : state.password.length < 12 ? "bg-warning w-3/4" : "bg-success w-full"}`
                  }
                ) }),
                /* @__PURE__ */ jsx("span", { className: `text-xs font-medium ${state.password.length < 6 ? "text-danger" : state.password.length < 9 ? "text-warning" : state.password.length < 12 ? "text-warning" : "text-success"}`, children: state.password.length < 6 ? "Weak" : state.password.length < 9 ? "Fair" : state.password.length < 12 ? "Good" : "Strong" })
              ] })
            ] }),
            /* @__PURE__ */ jsx(
              Input,
              {
                type: "password",
                placeholder: " Confirm Password",
                value: state.confirmPassword,
                onValueChange: handleConfirmPasswordChange,
                isInvalid: state.confirmPassword.length > 0 && !state.isConfirmPasswordValid,
                className: "w-full",
                size: "md",
                startContent: /* @__PURE__ */ jsx(Icons.lock, { className: "w-4 h-4 text-foreground-400" }),
                endContent: state.confirmPassword.length > 0 && state.isConfirmPasswordValid ? /* @__PURE__ */ jsx(Icons.check, { className: "w-4 h-4 text-success" }) : state.confirmPassword.length > 0 && !state.isConfirmPasswordValid ? /* @__PURE__ */ jsx(Icons.warning, { className: "w-4 h-4 text-danger" }) : null,
                classNames: {
                  input: "pl-md text-white placeholder:text-foreground-400",
                  inputWrapper: `focus-within:border-primary focus-within:shadow-none bg-content2 ${state.confirmPassword.length > 0 && !state.isConfirmPasswordValid ? "border-danger" : state.confirmPassword.length > 0 && state.isConfirmPasswordValid ? "border-success" : ""}`
                }
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-md pt-sm", children: [
            /* @__PURE__ */ jsx(
              Button,
              {
                onPress: handleBackToEmail,
                variant: "bordered",
                size: "md",
                className: "flex-1 font-medium",
                children: "Back"
              }
            ),
            /* @__PURE__ */ jsx(
              Button,
              {
                onPress: handleManualRegister,
                isDisabled: !state.isEmailValid || !state.isPasswordValid || !state.isConfirmPasswordValid || state.isLoading,
                color: "primary",
                size: "md",
                className: "flex-1 font-medium",
                isLoading: state.isLoading,
                children: state.isLoading ? "Creating Account..." : "Create Account"
              }
            )
          ] })
        ] })
      ) }) }),
      /* @__PURE__ */ jsx("div", { className: "text-center mt-md", children: /* @__PURE__ */ jsxs("p", { className: "text-xs text-foreground-400", children: [
        "By continuing, you agree to our",
        " ",
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => navigate("/terms"),
            className: "text-primary hover:text-primary-600 underline font-medium cursor-pointer transition-colors duration-200",
            children: "Terms"
          }
        ),
        " ",
        "and",
        " ",
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => navigate("/privacy"),
            className: "text-primary hover:text-primary-600 underline font-medium cursor-pointer transition-colors duration-200",
            children: "Privacy Policy"
          }
        )
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "text-center mt-sm", children: /* @__PURE__ */ jsx("button", { className: "text-xs bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent hover:opacity-80 transition-opacity duration-200", children: "Need help?" }) })
    ] }) })
  ] });
};
export {
  Authentication,
  Authentication as default
};
