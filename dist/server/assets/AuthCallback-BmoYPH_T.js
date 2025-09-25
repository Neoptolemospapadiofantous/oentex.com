import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { L as LoadingSpinner, d as config, e as authService } from "../entry-server.js";
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
const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState(null);
  useEffect(() => {
    const handleAuth = async () => {
      var _a;
      try {
        const urlError = searchParams.get("error");
        const errorCode = searchParams.get("error_code");
        const errorDescription = searchParams.get("error_description");
        if (urlError) {
          if (errorCode === "unexpected_failure" && (errorDescription == null ? void 0 : errorDescription.includes("email"))) {
            setError("Microsoft email access required. Please verify your email at account.microsoft.com or try Google sign-in.");
            return;
          }
          setError("Authentication failed. Please try again.");
          return;
        }
        const redirectTo = searchParams.get("redirect_to") || ((_a = config.auth) == null ? void 0 : _a.redirectPath) || "/dashboard";
        const code = searchParams.get("code");
        if (code) {
          const { error: exchangeError } = await authService.exchangeCodeForSession(code);
          if (exchangeError) {
            const msg = (exchangeError == null ? void 0 : exchangeError.message) || "";
            if (msg.includes("email") && msg.includes("external provider")) {
              setError("Microsoft email access required. Please verify your email at account.microsoft.com or try Google sign-in.");
              return;
            }
            setError("Authentication failed. Please try again.");
            return;
          }
          const stored = localStorage.getItem("returnTo");
          if (stored) localStorage.removeItem("returnTo");
          navigate(stored || redirectTo, { replace: true });
          return;
        }
        if (window.location.hash.includes("access_token")) {
          if (window.history.replaceState) {
            window.history.replaceState(null, "", window.location.pathname);
          }
          navigate(redirectTo, { replace: true });
          return;
        }
        const { session } = await authService.getSession();
        if (session) {
          const stored = localStorage.getItem("returnTo");
          if (stored) localStorage.removeItem("returnTo");
          navigate(stored || redirectTo, { replace: true });
          return;
        }
        setError("Please try signing in again.");
      } catch (err) {
        setError("Something went wrong. Please try again.");
      }
    };
    handleAuth();
  }, [navigate, searchParams]);
  if (error) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-background flex items-center justify-center px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md w-full bg-content1 rounded-lg shadow-lg p-8 text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsx("svg", { className: "w-8 h-8 text-red-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) }),
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold text-foreground mb-2", children: "Sign-in Failed" }),
      /* @__PURE__ */ jsx("p", { className: "text-foreground/70 mb-6", children: error }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => navigate("/", { replace: true }),
          className: "w-full bg-blue-600 text-content1 px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors",
          children: "Try Again"
        }
      )
    ] }) });
  }
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-background flex items-center justify-center px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md w-full bg-content1 rounded-lg shadow-lg p-8 text-center", children: [
    /* @__PURE__ */ jsx(LoadingSpinner, { className: "mx-auto mb-4" }),
    /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold text-foreground mb-2", children: "Signing you in..." })
  ] }) });
};
export {
  AuthCallback as default
};
