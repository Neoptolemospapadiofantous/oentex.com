var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import * as React from "react";
import React__default, { createContext, useContext, useReducer, useRef, useMemo, useCallback, useEffect, useState, Component, Suspense } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server.mjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Spinner, Dropdown, DropdownTrigger, Avatar, DropdownMenu, DropdownItem, HeroUIProvider } from "@heroui/react";
import { H as HelmetProvider } from "./assets/react-B6hsMDRz.js";
import { useLocation, useNavigate, Link, Routes, Route, Navigate } from "react-router-dom";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createClient } from "@supabase/supabase-js";
import { UsersIcon, StarIcon, ArrowTrendingUpIcon, TrophyIcon, ChatBubbleLeftRightIcon, MagnifyingGlassIcon, CheckCircleIcon, ExclamationTriangleIcon, ArrowTopRightOnSquareIcon, EnvelopeIcon, CircleStackIcon, ChevronUpIcon, ChevronDownIcon, ShieldCheckIcon, ClockIcon, MapPinIcon, PhoneIcon, PaperAirplaneIcon, DocumentTextIcon, CalendarIcon, CheckIcon, UserIcon, LockClosedIcon, EyeSlashIcon, EyeIcon, ArrowLeftIcon, GiftIcon, ArrowPathIcon, ArrowRightIcon, ChartBarIcon, PlusIcon, FunnelIcon, PencilIcon, KeyIcon, BoltIcon, DevicePhoneMobileIcon, BuildingOfficeIcon, SparklesIcon, ChevronLeftIcon, ChevronRightIcon, XMarkIcon, GlobeAltIcon, ComputerDesktopIcon, WifiIcon, Cog6ToothIcon, CurrencyDollarIcon, TrashIcon, ArrowDownTrayIcon, BackwardIcon, ForwardIcon, StopIcon, PauseIcon, PlayIcon, CameraIcon, MicrophoneIcon, MegaphoneIcon, BellSlashIcon, BellIcon, FlagIcon, BookmarkIcon, TagIcon, CloudArrowDownIcon, CloudArrowUpIcon, CloudIcon, MoonIcon, SunIcon, FireIcon, BuildingStorefrontIcon, HomeIcon, LinkIcon, ShareIcon, UserGroupIcon, HeartIcon, ExclamationCircleIcon, InformationCircleIcon, MinusIcon, WrenchScrewdriverIcon, SpeakerXMarkIcon, SpeakerWaveIcon, VideoCameraIcon, PhotoIcon, DocumentIcon, CpuChipIcon, ServerIcon, DeviceTabletIcon, XCircleIcon, ShieldExclamationIcon, ArrowTrendingDownIcon, CreditCardIcon, BanknotesIcon, ArrowLeftOnRectangleIcon, ArrowRightOnRectangleIcon, UserCircleIcon, ArrowDownIcon, ArrowUpIcon, Bars3Icon } from "@heroicons/react/24/outline";
import toast, { Toaster } from "react-hot-toast";
import "react-fast-compare";
import "invariant";
import "shallowequal";
const supabaseUrl = "https://cxagskqlaibqteesaopc.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4YWdza3FsYWlicXRlZXNhb3BjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3OTYzMzgsImV4cCI6MjA2NzM3MjMzOH0.p6nsXwx60OnxXIKDoxuTeXFHOR37E00G6YcWIJTvDhk";
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
const requiredEnvVars = {
  VITE_SUPABASE_URL: "https://cxagskqlaibqteesaopc.supabase.co",
  VITE_SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4YWdza3FsYWlicXRlZXNhb3BjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3OTYzMzgsImV4cCI6MjA2NzM3MjMzOH0.p6nsXwx60OnxXIKDoxuTeXFHOR37E00G6YcWIJTvDhk"
};
const optionalEnvVars = {
  VITE_BASE_URL: "http://localhost:5173",
  VITE_ENVIRONMENT: "development"
};
for (const [key, value] of Object.entries(requiredEnvVars)) {
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}
const environments = {
  development: {
    baseUrl: "http://localhost:5173",
    // ✅ FIXED: Use correct dev port
    redirectPath: "/dashboard"
  },
  staging: {
    baseUrl: "https://staging-oentex.vercel.app",
    redirectPath: "/dashboard"
  },
  production: {
    baseUrl: "https://oentex.com",
    // ✅ Canonical URL without www
    redirectPath: "/dashboard"
  }
};
const getCurrentEnvironment = () => {
  {
    return optionalEnvVars.VITE_ENVIRONMENT;
  }
};
const getEnvironmentConfig = () => {
  const currentEnv = getCurrentEnvironment();
  const envConfig = environments[currentEnv];
  if (!envConfig) {
    console.warn(`Unknown environment: ${currentEnv}, falling back to development`);
    return environments.development;
  }
  return envConfig;
};
const getBaseUrl = () => {
  {
    return optionalEnvVars.VITE_BASE_URL;
  }
};
const currentEnvironment = getCurrentEnvironment();
const environmentConfig = getEnvironmentConfig();
const config = {
  baseUrl: getBaseUrl(),
  supabase: {
    url: requiredEnvVars.VITE_SUPABASE_URL,
    anonKey: requiredEnvVars.VITE_SUPABASE_ANON_KEY
  },
  auth: {
    redirectPath: environmentConfig.redirectPath,
    maxRetries: 3,
    retryDelay: 1e3
  },
  environment: currentEnvironment
};
console.log("🔧 OAuth Config Debug:", {
  environment: config.environment,
  baseUrl: config.baseUrl,
  redirectUrl: `${config.baseUrl}/auth/callback`,
  redirectPath: config.auth.redirectPath,
  hostname: typeof window !== "undefined" ? window.location.hostname : "server",
  origin: typeof window !== "undefined" ? window.location.origin : "server",
  hasBaseUrlEnv: true,
  hasEnvironmentEnv: true
});
if (typeof window !== "undefined") {
  const redirectUrl = `${config.baseUrl}/auth/callback`;
  console.log("🔧 Expected OAuth redirect URL:", redirectUrl);
  console.log("🔧 Make sure BOTH of these URLs are in Supabase Additional Redirect URLs:");
  console.log("   - https://oentex.com/auth/callback");
  console.log("   - https://www.oentex.com/auth/callback");
  if (window.location.hostname === "www.oentex.com") {
    console.warn("🔧 ⚠️  You are on www.oentex.com - make sure this URL is in Supabase!");
  }
}
var AuthErrorType = /* @__PURE__ */ ((AuthErrorType2) => {
  AuthErrorType2["INVALID_EMAIL"] = "INVALID_EMAIL";
  AuthErrorType2["WEAK_PASSWORD"] = "WEAK_PASSWORD";
  AuthErrorType2["USER_ALREADY_EXISTS"] = "USER_ALREADY_EXISTS";
  AuthErrorType2["INVALID_CREDENTIALS"] = "INVALID_CREDENTIALS";
  AuthErrorType2["EMAIL_NOT_CONFIRMED"] = "EMAIL_NOT_CONFIRMED";
  AuthErrorType2["RATE_LIMIT_EXCEEDED"] = "RATE_LIMIT_EXCEEDED";
  AuthErrorType2["SESSION_EXPIRED"] = "SESSION_EXPIRED";
  AuthErrorType2["PROVIDER_DISABLED"] = "PROVIDER_DISABLED";
  AuthErrorType2["NETWORK_ERROR"] = "NETWORK_ERROR";
  AuthErrorType2["UNKNOWN_ERROR"] = "UNKNOWN_ERROR";
  return AuthErrorType2;
})(AuthErrorType || {});
class AuthService {
  constructor() {
    __publicField(this, "MAX_RETRIES", 3);
    __publicField(this, "RETRY_DELAY", 1e3);
    __publicField(this, "profileCreationCache", /* @__PURE__ */ new Map());
  }
  // ✅ UNCHANGED: Google OAuth (already working)
  async signInWithGoogle() {
    try {
      const redirectUrl = `${config.baseUrl}/auth/callback`;
      console.log("🔧 Google OAuth Configuration (Official Supabase):", {
        environment: config.environment,
        baseUrl: config.baseUrl,
        redirectUrl,
        supabaseProjectUrl: config.supabase.url,
        currentOrigin: typeof window !== "undefined" ? window.location.origin : "server"
      });
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: "offline",
            prompt: "consent"
          }
        }
      });
      if (error) {
        console.error("🔧 Google OAuth error:", error);
        return {
          error: this.handleAuthError(error),
          redirectUrl
        };
      }
      console.log("🔧 Google OAuth Flow Started:");
      console.log("  1. User → Google Auth ✅");
      console.log("  2. Google → Supabase:", `${config.supabase.url}/auth/v1/callback`);
      console.log("  3. Supabase → Your App:", redirectUrl);
      console.log("  ⚠️  Make sure step 3 URL is in Supabase Additional Redirect URLs!");
      return {
        error: null,
        redirectUrl
      };
    } catch (error) {
      console.error("🔧 Google OAuth exception:", error);
      return {
        error: this.handleAuthError(error)
      };
    }
  }
  // 🎯 SIMPLE FIX: Just add email scope to Microsoft OAuth
  async signInWithMicrosoft() {
    try {
      const redirectUrl = `${config.baseUrl}/auth/callback`;
      console.log("🔧 Microsoft OAuth Configuration (WITH EMAIL SCOPE):", {
        environment: config.environment,
        baseUrl: config.baseUrl,
        redirectUrl,
        supabaseProjectUrl: config.supabase.url
      });
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "azure",
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            prompt: "select_account",
            // 🎯 ONLY CHANGE: Add email scope to fix the issue
            scope: "openid email profile User.Read"
          }
        }
      });
      if (error) {
        console.error("🔧 Microsoft OAuth error:", error);
        return {
          error: this.handleAuthError(error),
          redirectUrl
        };
      }
      console.log("🔧 Microsoft OAuth initiated successfully");
      return {
        error: null,
        redirectUrl
      };
    } catch (error) {
      console.error("🔧 Microsoft OAuth exception:", error);
      return {
        error: this.handleAuthError(error)
      };
    }
  }
  // ✅ UNCHANGED: All other methods remain exactly the same
  async signOut() {
    try {
      this.profileCreationCache.clear();
      const { error } = await supabase.auth.signOut();
      if (error) {
        return { error: this.handleAuthError(error) };
      }
      return { error: null };
    } catch (error) {
      return { error: this.handleAuthError(error) };
    }
  }
  async getSession() {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Session error:", error);
        return { session: null, error };
      }
      return { session: data.session, error: null };
    } catch (error) {
      console.error("Session exception:", error);
      return { session: null, error };
    }
  }
  async updatePassword(newPassword) {
    try {
      const { data, error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        return { error };
      }
      return { error: null, data };
    } catch (error) {
      return { error };
    }
  }
  async exchangeCodeForSession(code) {
    var _a, _b, _c;
    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        console.error("Code exchange error:", error);
        return { data: null, error };
      }
      console.log("🔧 Code exchange successful:", {
        userId: (_a = data.user) == null ? void 0 : _a.id,
        email: (_b = data.user) == null ? void 0 : _b.email,
        expiresAt: (_c = data.session) == null ? void 0 : _c.expires_at
      });
      return { data, error: null };
    } catch (error) {
      console.error("Code exchange exception:", error);
      return { data: null, error };
    }
  }
  async validateOAuthConfig() {
    const issues = [];
    const recommendations = [];
    try {
      const redirectUrl = `${config.baseUrl}/auth/callback`;
      if (typeof window !== "undefined") {
        const currentOrigin = window.location.origin;
        const expectedBaseUrl = config.baseUrl;
        if (currentOrigin !== expectedBaseUrl) {
          issues.push(`Origin mismatch: current=${currentOrigin}, config=${expectedBaseUrl}`);
          recommendations.push("Check environment detection in config");
        }
      }
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        issues.push(`Supabase auth connection issue: ${error.message}`);
        recommendations.push("Check Supabase URL and anon key");
      }
      console.log("🔧 OAuth Validation:", {
        environment: config.environment,
        baseUrl: config.baseUrl,
        redirectUrl,
        supabaseUrl: config.supabase.url,
        hasSession: !!(data == null ? void 0 : data.session)
      });
      return {
        isValid: issues.length === 0,
        issues,
        recommendations: [
          ...recommendations,
          `Add "${redirectUrl}" to Supabase Additional Redirect URLs`,
          "Use wildcard patterns: https://oentex.com/** and https://www.oentex.com/**",
          "Verify Google OAuth redirect points to Supabase: " + config.supabase.url + "/auth/v1/callback",
          "Check console logs for detailed OAuth flow"
        ]
      };
    } catch (error) {
      return {
        isValid: false,
        issues: [`Validation failed: ${error}`],
        recommendations: ["Check console for errors"]
      };
    }
  }
  async createUserProfile(user) {
    if (this.profileCreationCache.has(user.id)) {
      return this.profileCreationCache.get(user.id);
    }
    const profileCreationPromise = this.performProfileCreation(user);
    this.profileCreationCache.set(user.id, profileCreationPromise);
    try {
      const result = await profileCreationPromise;
      setTimeout(() => {
        this.profileCreationCache.delete(user.id);
      }, 5 * 60 * 1e3);
      return result;
    } catch (error) {
      this.profileCreationCache.delete(user.id);
      throw error;
    }
  }
  async performProfileCreation(user, retries = 0) {
    var _a, _b;
    try {
      const { data: existingProfile, error: checkError } = await supabase.from("user_profiles").select("id").eq("id", user.id).maybeSingle();
      if (checkError) {
        if (retries < this.MAX_RETRIES) {
          await this.delay(this.RETRY_DELAY * (retries + 1));
          return this.performProfileCreation(user, retries + 1);
        }
        return { success: false, error: "Failed to check existing profile" };
      }
      if (existingProfile) {
        return { success: true };
      }
      const profileData = {
        id: user.id,
        email: user.email || "",
        full_name: this.extractFullName(user),
        avatar_url: ((_a = user.user_metadata) == null ? void 0 : _a.avatar_url) || null,
        provider: ((_b = user.app_metadata) == null ? void 0 : _b.provider) || "unknown",
        created_at: (/* @__PURE__ */ new Date()).toISOString(),
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      };
      const { error } = await supabase.from("user_profiles").insert([profileData]);
      if (error) {
        if (error.code === "23505") {
          return { success: true };
        } else {
          if (retries < this.MAX_RETRIES) {
            await this.delay(this.RETRY_DELAY * (retries + 1));
            return this.performProfileCreation(user, retries + 1);
          }
          return { success: false, error: "Failed to create user profile" };
        }
      }
      return { success: true };
    } catch (error) {
      if (retries < this.MAX_RETRIES) {
        await this.delay(this.RETRY_DELAY * (retries + 1));
        return this.performProfileCreation(user, retries + 1);
      }
      return { success: false, error: "Unexpected error creating user profile" };
    }
  }
  extractFullName(user) {
    var _a, _b, _c;
    return ((_a = user.user_metadata) == null ? void 0 : _a.full_name) || ((_b = user.user_metadata) == null ? void 0 : _b.name) || ((_c = user.email) == null ? void 0 : _c.split("@")[0]) || "User";
  }
  // ✅ NEW: Email signup function
  async signUpWithEmail(email, password, metadata) {
    var _a, _b;
    try {
      console.log("🔧 Starting email signup:", {
        email,
        hasPassword: !!password,
        passwordLength: password == null ? void 0 : password.length,
        metadata
      });
      if (!email || !password) {
        return {
          error: this.createError(AuthErrorType.INVALID_CREDENTIALS, "Email and password are required")
        };
      }
      if (password.length < 12) {
        return {
          error: this.createError(AuthErrorType.INVALID_CREDENTIALS, "Password must be at least 12 characters long")
        };
      }
      if (!supabase) {
        console.error("🔧 Supabase client not initialized");
        return {
          error: this.createError(AuthErrorType.UNKNOWN_ERROR, "Authentication service not available. Please try again later.")
        };
      }
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata || {}
        }
      });
      console.log("🔧 Supabase signup response:", { data, error });
      if (error) {
        console.error("🔧 Email signup error:", {
          code: error.code,
          message: error.message,
          status: error.status,
          fullError: error
        });
        const customError = this.handleAuthError(error);
        console.log("🔧 Custom error created:", customError);
        return {
          error: customError
        };
      }
      console.log("🔧 Email signup success:", {
        email,
        userId: (_a = data.user) == null ? void 0 : _a.id,
        userConfirmed: (_b = data.user) == null ? void 0 : _b.email_confirmed_at,
        session: !!data.session
      });
      return { error: null };
    } catch (error) {
      console.error("🔧 Email signup exception:", error);
      return {
        error: this.handleAuthError(error)
      };
    }
  }
  handleAuthError(error) {
    if (error && typeof error === "object" && "code" in error) {
      const authError = error;
      switch (authError.code) {
        case "email_address_invalid":
          return this.createError(AuthErrorType.INVALID_EMAIL, "Please enter a valid email address");
        case "invalid_credentials":
          return this.createError(AuthErrorType.INVALID_CREDENTIALS, "Invalid credentials. Please try again");
        case "email_not_confirmed":
          return this.createError(AuthErrorType.EMAIL_NOT_CONFIRMED, "Please check your email and click the confirmation link");
        case "too_many_requests":
          return this.createError(AuthErrorType.RATE_LIMIT_EXCEEDED, "Too many attempts. Please wait a moment and try again");
        case "user_already_exists":
          return this.createError(AuthErrorType.USER_ALREADY_EXISTS, "An account with this email already exists");
        case "session_not_found":
          return this.createError(AuthErrorType.SESSION_EXPIRED, "Your session has expired. Please sign in again");
        case "provider_disabled":
          return this.createError(AuthErrorType.PROVIDER_DISABLED, "This sign-in method is not available");
        case "user_not_found":
          return this.createError(AuthErrorType.INVALID_CREDENTIALS, "User not found. Please try again");
        case "signup_disabled":
          return this.createError(AuthErrorType.PROVIDER_DISABLED, "Account creation is temporarily disabled");
        case "email_address_not_authorized":
          return this.createError(AuthErrorType.INVALID_CREDENTIALS, "This email address is not authorized");
        case "weak_password":
          return this.createError(AuthErrorType.INVALID_CREDENTIALS, "Password must be at least 12 characters long");
        case "password_too_short":
          return this.createError(AuthErrorType.INVALID_CREDENTIALS, "Password must be at least 12 characters long");
        case "invalid_email":
          return this.createError(AuthErrorType.INVALID_EMAIL, "Please enter a valid email address");
        case "signup_not_allowed":
          return this.createError(AuthErrorType.PROVIDER_DISABLED, "Email signup is not enabled. Please contact support");
        case "email_rate_limit_exceeded":
          return this.createError(AuthErrorType.RATE_LIMIT_EXCEEDED, "Too many signup attempts. Please wait before trying again");
        case "email_provider_disabled":
          return this.createError(AuthErrorType.PROVIDER_DISABLED, "Email signups are currently disabled. Please contact support or use social login.");
        default:
          console.warn("🔧 Unhandled auth error code:", authError.code, authError.message);
          return this.createError(AuthErrorType.UNKNOWN_ERROR, authError.message || "An unexpected error occurred. Please try again");
      }
    }
    if (error instanceof Error) {
      const message = error.message.toLowerCase();
      if (message.includes("user already registered")) {
        return this.createError(AuthErrorType.USER_ALREADY_EXISTS, "An account with this provider already exists. Please sign in instead");
      }
      if (message.includes("invalid login credentials")) {
        return this.createError(AuthErrorType.INVALID_CREDENTIALS, "Invalid credentials. Please try again");
      }
      if (message.includes("too many requests")) {
        return this.createError(AuthErrorType.RATE_LIMIT_EXCEEDED, "Too many attempts. Please wait a moment and try again");
      }
      if (message.includes("session") || message.includes("jwt")) {
        return this.createError(AuthErrorType.SESSION_EXPIRED, "Your session has expired. Please sign in again");
      }
      if (message.includes("network") || message.includes("fetch")) {
        return this.createError(AuthErrorType.NETWORK_ERROR, "Network error. Please check your connection and try again");
      }
      return this.createError(AuthErrorType.UNKNOWN_ERROR, error.message);
    }
    return this.createError(AuthErrorType.UNKNOWN_ERROR, "An unexpected error occurred. Please try again");
  }
  createError(type, message) {
    return {
      type,
      message,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      details: null
    };
  }
  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
const authService = new AuthService();
class ProdLogger {
  info() {
  }
  warn() {
  }
  error(message, ...args) {
    console.error(message, ...args);
  }
  debug() {
  }
}
const logger = new ProdLogger();
const initialState = {
  user: null,
  session: null,
  loading: true,
  error: null,
  initialized: false
};
const authReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_USER":
      return { ...state, user: action.payload };
    case "SET_SESSION":
      return { ...state, session: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_INITIALIZED":
      return { ...state, initialized: action.payload };
    case "RESET_STATE":
      return {
        ...initialState,
        loading: false,
        initialized: true
      };
    case "FORCE_READY":
      return {
        ...state,
        loading: false,
        initialized: true,
        error: null
      };
    default:
      return state;
  }
};
const AuthContext = createContext(void 0);
const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === void 0) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
const AuthProvider = ({ children }) => {
  var _a;
  const [state, dispatch] = useReducer(authReducer, initialState);
  const initializationRef = useRef(null);
  const authTimeoutRef = useRef();
  const isMountedRef = useRef(true);
  const initAttempts = useRef(0);
  const forceReadyTimeoutRef = useRef();
  const MAX_INIT_ATTEMPTS = 3;
  const INIT_TIMEOUT = 1e4;
  const FORCE_READY_TIMEOUT = 15e3;
  const isFullyReady = useMemo(() => {
    return state.initialized && !state.loading;
  }, [state.initialized, state.loading]);
  const handleAuthError = useCallback((error) => {
    const authError = authService.handleAuthError(error);
    if (isMountedRef.current) {
      dispatch({ type: "SET_ERROR", payload: authError });
    }
    return authError;
  }, []);
  const clearError = useCallback(() => {
    if (isMountedRef.current) {
      dispatch({ type: "SET_ERROR", payload: null });
    }
  }, []);
  const forceReady = useCallback(() => {
    logger.warn("Forcing auth ready state to prevent infinite loop");
    if (isMountedRef.current) {
      dispatch({ type: "FORCE_READY" });
    }
  }, []);
  const validateSession = useCallback(async (session) => {
    if (!session) {
      return true;
    }
    try {
      const now = Date.now();
      const expiresAt = (session.expires_at || 0) * 1e3;
      if (now >= expiresAt - 6e4) {
        logger.info("Session expiring soon, attempting refresh...");
        const refreshPromise = supabase.auth.refreshSession();
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error("Session refresh timeout")), 5e3);
        });
        const { data: { session: newSession }, error } = await Promise.race([
          refreshPromise,
          timeoutPromise
        ]);
        if (error) {
          logger.error("Session refresh failed:", error);
          return false;
        }
        if (newSession && isMountedRef.current) {
          dispatch({ type: "SET_SESSION", payload: newSession });
          dispatch({ type: "SET_USER", payload: newSession.user });
        }
      }
      return true;
    } catch (error) {
      logger.error("Session validation failed:", error);
      return false;
    }
  }, []);
  const initializeAuth = useCallback(async () => {
    if (initializationRef.current) {
      return initializationRef.current;
    }
    if (initAttempts.current >= MAX_INIT_ATTEMPTS) {
      logger.error("Max auth initialization attempts reached, forcing ready state");
      forceReady();
      return;
    }
    initializationRef.current = (async () => {
      try {
        if (!isMountedRef.current) return;
        initAttempts.current++;
        logger.info(`Initializing auth state (attempt ${initAttempts.current}/${MAX_INIT_ATTEMPTS})...`);
        dispatch({ type: "SET_LOADING", payload: true });
        dispatch({ type: "SET_ERROR", payload: null });
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error("Auth initialization timeout")), INIT_TIMEOUT);
        });
        const sessionPromise = supabase.auth.getSession();
        const { data: { session }, error } = await Promise.race([
          sessionPromise,
          timeoutPromise
        ]);
        if (!isMountedRef.current) return;
        if (error) {
          logger.error("Failed to get session:", error);
          handleAuthError(error);
        } else {
          const isValid = await validateSession(session);
          if (isValid) {
            dispatch({ type: "SET_SESSION", payload: session });
            dispatch({ type: "SET_USER", payload: (session == null ? void 0 : session.user) ?? null });
            if (session == null ? void 0 : session.user) {
              authService.createUserProfile(session.user).catch((error2) => {
                logger.error("Failed to create user profile:", error2);
              });
            }
          } else {
            dispatch({ type: "SET_SESSION", payload: null });
            dispatch({ type: "SET_USER", payload: null });
          }
        }
        initAttempts.current = 0;
      } catch (error) {
        logger.error("Auth initialization failed:", error);
        if (isMountedRef.current) {
          handleAuthError(error);
          dispatch({ type: "SET_SESSION", payload: null });
          dispatch({ type: "SET_USER", payload: null });
        }
      } finally {
        if (isMountedRef.current) {
          dispatch({ type: "SET_LOADING", payload: false });
          dispatch({ type: "SET_INITIALIZED", payload: true });
        }
        initializationRef.current = null;
      }
    })();
    return initializationRef.current;
  }, [handleAuthError, validateSession, forceReady]);
  const retryAuth = useCallback(async () => {
    logger.info("Retrying auth initialization...");
    clearError();
    initAttempts.current = 0;
    initializationRef.current = null;
    dispatch({ type: "SET_INITIALIZED", payload: false });
    dispatch({ type: "SET_LOADING", payload: true });
    await initializeAuth();
  }, [clearError, initializeAuth]);
  const refreshSession = useCallback(async () => {
    try {
      const { data: { session }, error } = await supabase.auth.refreshSession();
      if (error) {
        handleAuthError(error);
      } else if (isMountedRef.current) {
        dispatch({ type: "SET_SESSION", payload: session });
        dispatch({ type: "SET_USER", payload: (session == null ? void 0 : session.user) ?? null });
      }
    } catch (error) {
      handleAuthError(error);
    }
  }, [handleAuthError]);
  const updatePassword = useCallback(async (newPassword) => {
    try {
      const result = await authService.updatePassword(newPassword);
      if (result.error) {
        return { error: handleAuthError(result.error) };
      }
      await refreshSession();
      return { error: null };
    } catch (error) {
      return { error: handleAuthError(error) };
    }
  }, [handleAuthError, refreshSession]);
  useEffect(() => {
    isMountedRef.current = true;
    forceReadyTimeoutRef.current = setTimeout(forceReady, FORCE_READY_TIMEOUT);
    const setupAuth = async () => {
      if (!isMountedRef.current) return;
      await initializeAuth();
    };
    setupAuth();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMountedRef.current) return;
        logger.info("Auth event:", event);
        if (forceReadyTimeoutRef.current) {
          clearTimeout(forceReadyTimeoutRef.current);
        }
        dispatch({ type: "SET_ERROR", payload: null });
        dispatch({ type: "SET_SESSION", payload: session });
        dispatch({ type: "SET_USER", payload: (session == null ? void 0 : session.user) ?? null });
        if (event === "SIGNED_IN" && (session == null ? void 0 : session.user)) {
          authService.createUserProfile(session.user).catch((error) => {
            logger.error("Failed to create user profile on sign in:", error);
          });
        }
        dispatch({ type: "SET_LOADING", payload: false });
        dispatch({ type: "SET_INITIALIZED", payload: true });
      }
    );
    return () => {
      isMountedRef.current = false;
      subscription.unsubscribe();
      if (authTimeoutRef.current) {
        clearTimeout(authTimeoutRef.current);
      }
      if (forceReadyTimeoutRef.current) {
        clearTimeout(forceReadyTimeoutRef.current);
      }
      initializationRef.current = null;
    };
  }, [initializeAuth, forceReady]);
  useEffect(() => {
    var _a2;
    if (!((_a2 = state.session) == null ? void 0 : _a2.expires_at)) return;
    const expiresAt = new Date(state.session.expires_at * 1e3);
    const now = /* @__PURE__ */ new Date();
    const timeUntilExpiry = expiresAt.getTime() - now.getTime();
    const refreshTime = Math.max(timeUntilExpiry - 5 * 60 * 1e3, 0);
    if (refreshTime > 0 && refreshTime < 24 * 60 * 60 * 1e3) {
      authTimeoutRef.current = setTimeout(refreshSession, refreshTime);
    }
    return () => {
      if (authTimeoutRef.current) {
        clearTimeout(authTimeoutRef.current);
      }
    };
  }, [(_a = state.session) == null ? void 0 : _a.expires_at, refreshSession]);
  const signInWithGoogle = useCallback(async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    clearError();
    try {
      console.log("🔍 AuthContext: Starting Google OAuth...");
      const result = await authService.signInWithGoogle();
      if (result.error) {
        console.error("🔍 AuthContext: Google OAuth error:", result.error);
      } else {
        console.log("🔍 AuthContext: Google OAuth initiated successfully");
      }
      return result;
    } catch (error) {
      console.error("🔍 AuthContext: Google OAuth exception:", error);
      return { error: handleAuthError(error) };
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [clearError, handleAuthError]);
  const signInWithMicrosoft = useCallback(async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    clearError();
    try {
      console.log("🔍 AuthContext: Starting Microsoft OAuth...");
      const result = await authService.signInWithMicrosoft();
      if (result.error) {
        console.error("🔍 AuthContext: Microsoft OAuth error:", result.error);
      } else {
        console.log("🔍 AuthContext: Microsoft OAuth initiated successfully");
      }
      return result;
    } catch (error) {
      console.error("🔍 AuthContext: Microsoft OAuth exception:", error);
      return { error: handleAuthError(error) };
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [clearError, handleAuthError]);
  const signUpWithEmail = useCallback(async (email, password, metadata) => {
    dispatch({ type: "SET_LOADING", payload: true });
    clearError();
    try {
      console.log("🔍 AuthContext: Starting email signup...");
      const result = await authService.signUpWithEmail(email, password, metadata);
      if (result.error) {
        console.error("🔍 AuthContext: Email signup error:", result.error);
      } else {
        console.log("🔍 AuthContext: Email signup initiated successfully");
      }
      return result;
    } catch (error) {
      console.error("🔍 AuthContext: Email signup exception:", error);
      return { error: handleAuthError(error) };
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [clearError, handleAuthError]);
  const signOut = useCallback(async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    clearError();
    try {
      console.log("🔍 AuthContext: Signing out...");
      sessionStorage.clear();
      const result = await authService.signOut();
      if (!result.error) {
        dispatch({ type: "RESET_STATE" });
        console.log("🔍 AuthContext: Sign out successful");
      } else {
        console.error("🔍 AuthContext: Sign out error:", result.error);
      }
      return result;
    } catch (error) {
      console.error("🔍 AuthContext: Sign out exception:", error);
      return { error: handleAuthError(error) };
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [clearError, handleAuthError]);
  const value = useMemo(() => ({
    ...state,
    isFullyReady,
    signInWithGoogle,
    signInWithMicrosoft,
    signUpWithEmail,
    signOut,
    clearError,
    retryAuth,
    refreshSession,
    updatePassword
  }), [
    state,
    isFullyReady,
    signInWithGoogle,
    signInWithMicrosoft,
    signUpWithEmail,
    signOut,
    clearError,
    retryAuth,
    refreshSession,
    updatePassword
  ]);
  return /* @__PURE__ */ jsx(AuthContext.Provider, { value, children });
};
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth"
    });
  }, [pathname]);
  return null;
};
const LoadingSpinner = ({
  size = "md",
  variant = "default",
  className = "",
  text,
  showIcon = true
}) => {
  const sizeClasses = {
    sm: "w-4 h-4 text-sm",
    md: "w-6 h-6 text-base",
    lg: "w-8 h-8 text-lg",
    xl: "w-12 h-12 text-2xl"
  };
  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
    xl: "text-lg"
  };
  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return "text-blue-600";
      case "secondary":
        return "text-emerald-600";
      case "auth":
        return "text-blue-600";
      case "deals":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };
  const getSpinner = () => {
    const baseClasses = `${sizeClasses[size]} flex items-center justify-center`;
    switch (variant) {
      case "auth":
        return /* @__PURE__ */ jsx("div", { className: `${baseClasses} animate-pulse`, children: "🔐" });
      case "deals":
        return /* @__PURE__ */ jsx("div", { className: `${baseClasses} animate-pulse`, children: "💰" });
      case "primary":
        return /* @__PURE__ */ jsx("div", { className: `${baseClasses} animate-pulse`, children: "⚡" });
      default:
        return /* @__PURE__ */ jsx("div", { className: `${sizeClasses[size]} animate-spin rounded-full border-2 border-current border-t-transparent` });
    }
  };
  return /* @__PURE__ */ jsx("div", { className: `flex items-center justify-center ${className}`, children: /* @__PURE__ */ jsxs("div", { className: `flex items-center gap-2 ${getVariantStyles()}`, children: [
    showIcon && getSpinner(),
    text && /* @__PURE__ */ jsx("span", { className: `${textSizeClasses[size]} font-medium`, children: text })
  ] }) });
};
const PageLoader = ({
  message = "Loading...",
  variant = "default"
}) => {
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" }) });
};
const DealsSkeleton = () => {
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-background", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: [
    /* @__PURE__ */ jsx("div", { className: "text-center mb-12", children: /* @__PURE__ */ jsxs("div", { className: "animate-pulse", children: [
      /* @__PURE__ */ jsx("div", { className: "h-12 bg-content2/50 rounded-2xl w-96 mx-auto mb-6" }),
      /* @__PURE__ */ jsx("div", { className: "h-6 bg-content2/30 rounded-xl w-128 mx-auto mb-3" }),
      /* @__PURE__ */ jsx("div", { className: "h-4 bg-content2/20 rounded-lg w-64 mx-auto" })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "bg-content1/90 backdrop-blur-xl rounded-2xl border border-divider/40 mb-8 shadow-2xl", children: /* @__PURE__ */ jsxs("div", { className: "p-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 mb-8", children: [
        /* @__PURE__ */ jsx("div", { className: "relative", children: /* @__PURE__ */ jsx("div", { className: "h-12 bg-content2/50 rounded-xl w-full" }) }),
        /* @__PURE__ */ jsx("div", { className: "h-12 bg-content2/50 rounded-xl w-full" }),
        /* @__PURE__ */ jsx("div", { className: "h-12 bg-content2/50 rounded-xl w-full" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-4 py-4", children: [1, 2, 3, 4, 5, 6, 7].map((i) => /* @__PURE__ */ jsx("div", { className: "animate-pulse", children: /* @__PURE__ */ jsx("div", { className: "h-12 bg-content2/50 rounded-lg w-32" }) }, i)) })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-8", children: [
      /* @__PURE__ */ jsx("div", { className: "animate-pulse", children: /* @__PURE__ */ jsx("div", { className: "h-5 bg-content2/50 rounded-lg w-40" }) }),
      /* @__PURE__ */ jsx("div", { className: "animate-pulse", children: /* @__PURE__ */ jsx("div", { className: "h-5 bg-content2/50 rounded-lg w-32" }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12", children: [1, 2, 3, 4, 5, 6].map((i) => /* @__PURE__ */ jsx("div", { className: "bg-content1/80 backdrop-blur-xl rounded-2xl border border-divider/40 p-6 shadow-lg", children: /* @__PURE__ */ jsxs("div", { className: "animate-pulse", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between mb-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-content2/50 rounded-xl" }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx("div", { className: "h-4 bg-content2/50 rounded w-24" }),
            /* @__PURE__ */ jsx("div", { className: "h-3 bg-content2/30 rounded w-16" })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "w-20 h-6 bg-content2/50 rounded-full" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "my-4 p-3 bg-content2/50 rounded-xl", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsx("div", { className: "h-4 bg-content2/30 rounded w-24" }),
        /* @__PURE__ */ jsx("div", { className: "h-3 bg-content2/30 rounded w-12" })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "my-4", children: [
        /* @__PURE__ */ jsx("div", { className: "h-5 bg-content2/50 rounded w-3/4 mb-2" }),
        /* @__PURE__ */ jsx("div", { className: "h-4 bg-content2/30 rounded w-1/2" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "my-4 space-y-2", children: [
        /* @__PURE__ */ jsx("div", { className: "h-3 bg-content2/30 rounded w-full" }),
        /* @__PURE__ */ jsx("div", { className: "h-3 bg-content2/30 rounded w-5/6" }),
        /* @__PURE__ */ jsx("div", { className: "h-3 bg-content2/30 rounded w-4/6" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "my-4", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2", children: [
        /* @__PURE__ */ jsx("div", { className: "h-6 bg-content2/30 rounded-full w-16" }),
        /* @__PURE__ */ jsx("div", { className: "h-6 bg-content2/30 rounded-full w-20" }),
        /* @__PURE__ */ jsx("div", { className: "h-6 bg-content2/30 rounded-full w-14" })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-3 mt-6", children: [
        /* @__PURE__ */ jsx("div", { className: "h-10 bg-content2/50 rounded-lg flex-1" }),
        /* @__PURE__ */ jsx("div", { className: "h-10 bg-content2/50 rounded-lg w-20" })
      ] })
    ] }) }, i)) }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-4 mb-12", children: [
      /* @__PURE__ */ jsx("div", { className: "animate-pulse", children: /* @__PURE__ */ jsx("div", { className: "h-10 bg-content2/50 rounded-lg w-24" }) }),
      /* @__PURE__ */ jsx("div", { className: "flex gap-2", children: [1, 2, 3, 4, 5].map((i) => /* @__PURE__ */ jsx("div", { className: "animate-pulse", children: /* @__PURE__ */ jsx("div", { className: "h-10 bg-content2/50 rounded-lg w-10" }) }, i)) }),
      /* @__PURE__ */ jsx("div", { className: "animate-pulse", children: /* @__PURE__ */ jsx("div", { className: "h-10 bg-content2/50 rounded-lg w-24" }) })
    ] })
  ] }) });
};
const AuthLoader = ({ stage = "initializing" }) => {
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" }) });
};
const Icon = ({
  name,
  className = "",
  size = "md",
  color = "default"
}) => {
  const IconComponent = Icons[name];
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }
  const sizeClasses = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-8 h-8"
  };
  const colorClasses = {
    default: "text-gray-600 dark:text-gray-400",
    primary: "text-blue-600 dark:text-blue-400",
    secondary: "text-emerald-600 dark:text-emerald-400",
    success: "text-green-600 dark:text-green-400",
    warning: "text-amber-600 dark:text-amber-400",
    danger: "text-red-600 dark:text-red-400"
  };
  return /* @__PURE__ */ jsx(
    IconComponent,
    {
      className: `${sizeClasses[size]} ${colorClasses[color]} ${className}`
    }
  );
};
const Icons = {
  // Navigation & UI
  menu: Bars3Icon,
  close: XMarkIcon,
  chevronDown: ChevronDownIcon,
  chevronUp: ChevronUpIcon,
  chevronLeft: ChevronLeftIcon,
  chevronRight: ChevronRightIcon,
  arrowRight: ArrowRightIcon,
  arrowLeft: ArrowLeftIcon,
  arrowUp: ArrowUpIcon,
  arrowDown: ArrowDownIcon,
  externalLink: ArrowTopRightOnSquareIcon,
  download: ArrowDownTrayIcon,
  refresh: ArrowPathIcon,
  // User & Auth
  user: UserIcon,
  userCircle: UserCircleIcon,
  userCheck: UserIcon,
  logout: ArrowRightOnRectangleIcon,
  login: ArrowLeftOnRectangleIcon,
  lock: LockClosedIcon,
  key: KeyIcon,
  eye: EyeIcon,
  eyeOff: EyeSlashIcon,
  eyeSlash: EyeSlashIcon,
  // Communication
  mail: EnvelopeIcon,
  chat: ChatBubbleLeftRightIcon,
  chatBubble: ChatBubbleLeftRightIcon,
  phone: PhoneIcon,
  send: PaperAirplaneIcon,
  paperAirplane: PaperAirplaneIcon,
  // Business & Finance
  chart: ChartBarIcon,
  dollar: CurrencyDollarIcon,
  money: BanknotesIcon,
  card: CreditCardIcon,
  arrowTrendingUp: ArrowTrendingUpIcon,
  arrowTrendingDown: ArrowTrendingDownIcon,
  // Security & Trust
  shield: ShieldCheckIcon,
  shieldWarning: ShieldExclamationIcon,
  warning: ExclamationTriangleIcon,
  success: CheckCircleIcon,
  error: XCircleIcon,
  // Technology & Devices
  mobile: DevicePhoneMobileIcon,
  desktop: ComputerDesktopIcon,
  tablet: DeviceTabletIcon,
  wifi: WifiIcon,
  server: ServerIcon,
  chip: CpuChipIcon,
  // Content & Media
  document: DocumentTextIcon,
  file: DocumentIcon,
  image: PhotoIcon,
  video: VideoCameraIcon,
  volume: SpeakerWaveIcon,
  mute: SpeakerXMarkIcon,
  // Actions & Tools
  search: MagnifyingGlassIcon,
  filter: FunnelIcon,
  settings: Cog6ToothIcon,
  tools: WrenchScrewdriverIcon,
  edit: PencilIcon,
  delete: TrashIcon,
  trash: TrashIcon,
  add: PlusIcon,
  remove: MinusIcon,
  // Status & Feedback
  info: InformationCircleIcon,
  alert: ExclamationCircleIcon,
  check: CheckIcon,
  time: ClockIcon,
  calendar: CalendarIcon,
  star: StarIcon,
  heart: HeartIcon,
  gift: GiftIcon,
  // Social & Community
  users: UsersIcon,
  team: UserGroupIcon,
  share: ShareIcon,
  link: LinkIcon,
  globe: GlobeAltIcon,
  // Miscellaneous
  home: HomeIcon,
  location: MapPinIcon,
  mapPin: MapPinIcon,
  building: BuildingOfficeIcon,
  store: BuildingStorefrontIcon,
  sparkles: SparklesIcon,
  trophy: TrophyIcon,
  bolt: BoltIcon,
  fire: FireIcon,
  sun: SunIcon,
  moon: MoonIcon,
  cloud: CloudIcon,
  cloudUpload: CloudArrowUpIcon,
  cloudDownload: CloudArrowDownIcon,
  database: CircleStackIcon,
  tag: TagIcon,
  bookmark: BookmarkIcon,
  flag: FlagIcon,
  bell: BellIcon,
  bellOff: BellSlashIcon,
  megaphone: MegaphoneIcon,
  mic: MicrophoneIcon,
  camera: CameraIcon,
  play: PlayIcon,
  pause: PauseIcon,
  stop: StopIcon,
  forward: ForwardIcon,
  backward: BackwardIcon,
  cookie: CircleStackIcon
};
const AuthModal = ({
  isOpen,
  onClose,
  mode,
  onModeChange
}) => {
  const [state, setState] = useState({
    isLoading: false,
    loadingProvider: null,
    success: false,
    error: null
  });
  const { signInWithGoogle, signInWithMicrosoft } = useAuth();
  const modalRef = useRef(null);
  const focusTrapRef = useRef(null);
  const updateState = useCallback((updates) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);
  const clearError = useCallback(() => {
    updateState({ error: null });
  }, [updateState]);
  const resetState = useCallback(() => {
    setState({
      isLoading: false,
      loadingProvider: null,
      success: false,
      error: null
    });
  }, []);
  useEffect(() => {
    if (isOpen) {
      resetState();
      setTimeout(() => {
        var _a;
        (_a = focusTrapRef.current) == null ? void 0 : _a.focus();
      }, 100);
    }
  }, [isOpen, resetState]);
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen && !state.isLoading) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen, onClose, state.isLoading]);
  useEffect(() => {
    if (!isOpen) return;
    const modal = modalRef.current;
    if (!modal) return;
    const focusableElements = modal.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    const handleTabKey = (e) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement == null ? void 0 : lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement == null ? void 0 : firstElement.focus();
        }
      }
    };
    modal.addEventListener("keydown", handleTabKey);
    return () => modal.removeEventListener("keydown", handleTabKey);
  }, [isOpen, state.success, state.error]);
  const handleOAuthSignIn = useCallback(async (provider) => {
    if (state.isLoading) return;
    clearError();
    updateState({
      isLoading: true,
      loadingProvider: provider
    });
    try {
      const result = provider === "google" ? await signInWithGoogle() : await signInWithMicrosoft();
      if (result.error) {
        updateState({
          isLoading: false,
          loadingProvider: null,
          error: result.error.message || `Failed to sign in with ${provider}. Please try again.`
        });
      } else {
        updateState({
          isLoading: false,
          loadingProvider: null,
          success: true
        });
        setTimeout(onClose, 1500);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : `Failed to sign in with ${provider}. Please try again.`;
      updateState({
        isLoading: false,
        loadingProvider: null,
        error: errorMessage
      });
    }
  }, [state.isLoading, clearError, updateState, signInWithGoogle, signInWithMicrosoft, onClose]);
  const MicrosoftIcon = () => /* @__PURE__ */ jsxs("svg", { className: "w-5 h-5", viewBox: "0 0 21 21", fill: "none", "aria-hidden": "true", children: [
    /* @__PURE__ */ jsx("path", { d: "M10 1H1v9h9V1z", fill: "#f25022" }),
    /* @__PURE__ */ jsx("path", { d: "M20 1h-9v9h9V1z", fill: "#7fba00" }),
    /* @__PURE__ */ jsx("path", { d: "M10 11H1v9h9v-9z", fill: "#00a4ef" }),
    /* @__PURE__ */ jsx("path", { d: "M20 11h-9v9h9v-9z", fill: "#ffb900" })
  ] });
  const ProviderButton = ({ provider, icon, label, variant, color }) => {
    const isProviderLoading = state.loadingProvider === provider;
    const isDisabled = state.isLoading;
    return /* @__PURE__ */ jsx(
      Button,
      {
        onPress: () => handleOAuthSignIn(provider),
        isDisabled,
        variant,
        color,
        size: "lg",
        className: "w-full font-medium",
        startContent: isProviderLoading ? /* @__PURE__ */ jsx(Spinner, { size: "sm" }) : icon,
        isLoading: isProviderLoading,
        classNames: {
          base: "h-12",
          startContent: "flex items-center justify-center w-5 h-5"
        },
        children: isProviderLoading ? "Connecting..." : label
      }
    );
  };
  return /* @__PURE__ */ jsx(
    Modal,
    {
      isOpen,
      onClose,
      size: "md",
      isDismissable: !state.isLoading,
      hideCloseButton: state.isLoading,
      classNames: {
        base: "bg-background text-foreground shadow-2xl border border-divider",
        header: "border-b border-divider px-6 py-4 bg-gradient-to-r from-background to-default-50",
        body: "px-6 py-6 bg-background",
        footer: "border-t border-divider px-6 py-4 bg-gradient-to-r from-default-50 to-background"
      },
      children: /* @__PURE__ */ jsx(ModalContent, { children: () => /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs(ModalHeader, { className: "flex flex-col gap-1", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-foreground", children: mode === "login" ? "Welcome Back" : "Join Oentex" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-foreground-500", children: mode === "login" ? "Sign in to access your trading dashboard" : "Start discovering the best trading platforms" })
        ] }),
        /* @__PURE__ */ jsx(ModalBody, { children: state.success ? (
          /* ✅ IMPROVED: Success State */
          /* @__PURE__ */ jsxs("div", { className: "text-center py-16 px-8 bg-gradient-to-br from-success-50 to-success-100 rounded-2xl border border-success-200", role: "alert", "aria-live": "polite", children: [
            /* @__PURE__ */ jsx("div", { className: "w-24 h-24 bg-success-200 rounded-full flex items-center justify-center mx-auto mb-10 shadow-lg", children: /* @__PURE__ */ jsx(Icons.success, { className: "w-12 h-12 text-success" }) }),
            /* @__PURE__ */ jsx("h3", { className: "text-3xl font-bold text-foreground mb-6", children: "Success!" }),
            /* @__PURE__ */ jsx("p", { className: "text-foreground-600 text-xl mb-8", children: "Redirecting you to your dashboard..." }),
            /* @__PURE__ */ jsx("div", { className: "mt-10", children: /* @__PURE__ */ jsx("div", { className: "w-48 h-2 bg-success-200 rounded-full mx-auto overflow-hidden shadow-inner", children: /* @__PURE__ */ jsx("div", { className: "w-full h-full bg-success animate-pulse rounded-full" }) }) })
          ] })
        ) : /* @__PURE__ */ jsxs("div", { className: "space-y-10 py-4", children: [
          state.error && /* @__PURE__ */ jsx("div", { className: "bg-gradient-to-r from-danger-50 to-danger-100 border-2 border-danger-200 rounded-2xl p-8 shadow-lg", role: "alert", "aria-live": "assertive", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-danger-200 rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsx(Icons.warning, { className: "w-6 h-6 text-danger flex-shrink-0" }) }),
            /* @__PURE__ */ jsx("p", { className: "text-danger text-base font-medium", children: state.error })
          ] }) }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4 py-2", children: [
            /* @__PURE__ */ jsx(
              ProviderButton,
              {
                provider: "google",
                icon: /* @__PURE__ */ jsx(Icons.globe, { className: "w-5 h-5 flex-shrink-0" }),
                label: "Continue with Google",
                variant: "bordered",
                color: "default"
              }
            ),
            /* @__PURE__ */ jsx(
              ProviderButton,
              {
                provider: "microsoft",
                icon: /* @__PURE__ */ jsx("div", { className: "w-5 h-5 flex-shrink-0", children: /* @__PURE__ */ jsx(MicrosoftIcon, {}) }),
                label: "Continue with Microsoft",
                variant: "solid",
                color: "primary"
              }
            )
          ] })
        ] }) }),
        !state.success && /* @__PURE__ */ jsxs(ModalFooter, { className: "flex flex-col gap-10 py-4", children: [
          /* @__PURE__ */ jsx("div", { className: "text-center text-base text-foreground-500 border-t-2 border-divider pt-10 w-full bg-gradient-to-r from-default-50 to-transparent rounded-t-2xl -mx-8 px-8", children: mode === "login" ? /* @__PURE__ */ jsxs(Fragment, { children: [
            "New to trading affiliate deals?",
            " ",
            /* @__PURE__ */ jsx(
              Button,
              {
                variant: "light",
                color: "primary",
                size: "sm",
                onPress: () => onModeChange("register"),
                isDisabled: state.isLoading,
                className: "text-primary font-medium p-0 h-auto min-w-0",
                children: "Create account"
              }
            )
          ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
            "Already have an account?",
            " ",
            /* @__PURE__ */ jsx(
              Button,
              {
                variant: "light",
                color: "primary",
                size: "sm",
                onPress: () => onModeChange("login"),
                isDisabled: state.isLoading,
                className: "text-primary font-medium p-0 h-auto min-w-0",
                children: "Sign in"
              }
            )
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "text-center w-full space-y-4 bg-gradient-to-r from-default-100 to-default-50 rounded-2xl p-6 border border-default-200", children: /* @__PURE__ */ jsxs("p", { className: "text-sm text-foreground-400", children: [
            "By continuing, you agree to our",
            " ",
            /* @__PURE__ */ jsx("a", { href: "/terms", className: "underline hover:text-foreground-600 focus:outline-none focus:text-foreground-600 font-medium", children: "Terms" }),
            " ",
            "and",
            " ",
            /* @__PURE__ */ jsx("a", { href: "/privacy", className: "underline hover:text-foreground-600 focus:outline-none focus:text-foreground-600 font-medium", children: "Privacy Policy" })
          ] }) })
        ] })
      ] }) })
    }
  );
};
const AppToast = ({
  message,
  type = "success",
  duration = 4e3,
  icon,
  title,
  details,
  action
}) => {
  const getIcon = () => {
    if (icon) return icon;
    switch (type) {
      case "success":
        return /* @__PURE__ */ jsx(Icons.success, { className: "w-5 h-5" });
      case "error":
        return /* @__PURE__ */ jsx(Icons.error, { className: "w-5 h-5" });
      case "warning":
        return /* @__PURE__ */ jsx(Icons.warning, { className: "w-5 h-5" });
      case "info":
        return /* @__PURE__ */ jsx(Icons.info, { className: "w-5 h-5" });
      default:
        return /* @__PURE__ */ jsx(Icons.success, { className: "w-5 h-5" });
    }
  };
  const toastContent = /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
    /* @__PURE__ */ jsx("div", { className: "flex-shrink-0 mt-0.5", children: getIcon() }),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
      title && /* @__PURE__ */ jsx("div", { className: "font-semibold text-sm mb-1", children: title }),
      /* @__PURE__ */ jsx("div", { className: `${title ? "text-sm" : "text-sm font-medium"}`, children: message }),
      details && /* @__PURE__ */ jsx("div", { className: "text-xs opacity-75 mt-1 text-foreground/60", children: details }),
      action && /* @__PURE__ */ jsx(
        "button",
        {
          onClick: action.onClick,
          className: "mt-2 text-xs font-medium underline hover:no-underline transition-all duration-200",
          children: action.label
        }
      )
    ] })
  ] });
  const getToastOptions = () => {
    const baseStyle = {
      borderRadius: "0.75rem",
      padding: "1rem",
      fontWeight: "500",
      backdropFilter: "blur(16px)"
    };
    switch (type) {
      case "success":
        return {
          duration,
          position: "top-right",
          style: {
            ...baseStyle,
            background: "hsl(var(--heroui-success) / 0.1)",
            color: "hsl(var(--heroui-success))",
            border: "1px solid hsl(var(--heroui-success) / 0.2)",
            boxShadow: "0 10px 40px hsl(var(--heroui-success) / 0.15), 0 4px 16px hsl(var(--heroui-success) / 0.08)"
          },
          icon: null
        };
      case "error":
        return {
          duration: duration || 6e3,
          // Longer duration for errors
          position: "top-right",
          style: {
            ...baseStyle,
            background: "hsl(var(--heroui-danger) / 0.1)",
            color: "hsl(var(--heroui-danger))",
            border: "1px solid hsl(var(--heroui-danger) / 0.2)",
            boxShadow: "0 10px 40px hsl(var(--heroui-danger) / 0.15), 0 4px 16px hsl(var(--heroui-danger) / 0.08)",
            maxWidth: "400px",
            minWidth: "300px"
          },
          icon: null
        };
      case "warning":
        return {
          duration,
          position: "top-right",
          style: {
            ...baseStyle,
            background: "hsl(var(--heroui-warning) / 0.1)",
            color: "hsl(var(--heroui-warning))",
            border: "1px solid hsl(var(--heroui-warning) / 0.2)",
            boxShadow: "0 10px 40px hsl(var(--heroui-warning) / 0.15), 0 4px 16px hsl(var(--heroui-warning) / 0.08)"
          },
          icon: null
        };
      case "info":
        return {
          duration,
          position: "top-right",
          style: {
            ...baseStyle,
            background: "hsl(var(--heroui-primary) / 0.1)",
            color: "hsl(var(--heroui-primary))",
            border: "1px solid hsl(var(--heroui-primary) / 0.2)",
            boxShadow: "0 10px 40px hsl(var(--heroui-primary) / 0.15), 0 4px 16px hsl(var(--heroui-primary) / 0.08)"
          },
          icon: null
        };
      default:
        return {
          duration,
          position: "top-right",
          style: {
            ...baseStyle,
            background: "hsl(var(--heroui-success) / 0.1)",
            color: "hsl(var(--heroui-success))",
            border: "1px solid hsl(var(--heroui-success) / 0.2)",
            boxShadow: "0 10px 40px hsl(var(--heroui-success) / 0.15), 0 4px 16px hsl(var(--heroui-success) / 0.08)"
          },
          icon: null
        };
    }
  };
  const toastOptions = getToastOptions();
  console.log("🔍 AppToast rendering:", { type, message, title, duration });
  switch (type) {
    case "success":
      return toast.success(toastContent, toastOptions);
    case "error":
      console.log("🔍 Calling toast.error with:", { toastContent, toastOptions });
      return toast.error(toastContent, toastOptions);
    case "warning":
      return toast(toastContent, { ...toastOptions, icon: "⚠️" });
    case "info":
      return toast(toastContent, { ...toastOptions, icon: "ℹ️" });
    default:
      return toast.success(toastContent, toastOptions);
  }
};
const showSuccessToast = (message, title, duration) => {
  return AppToast({ message, type: "success", title, duration });
};
const showErrorToast = (message, title, duration, details, action) => {
  console.log("🔍 showErrorToast called with:", { message, title, duration, details, action });
  return AppToast({ message, type: "error", title, duration, details, action });
};
const AuthErrorBoundary = ({
  error,
  onRetry,
  showReturnHome = true
}) => {
  const { retryAuth, clearError, user } = useAuth();
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;
  const getErrorInfo = useCallback(() => {
    switch (error.type) {
      case "SESSION_EXPIRED":
        return {
          title: "Session Expired",
          message: "Your session has expired. Please sign in again to continue.",
          icon: /* @__PURE__ */ jsx(Icons.shield, { className: "w-12 h-12 text-amber-600" }),
          showAuthButton: true,
          showRetryButton: false,
          bgColor: "bg-amber-50",
          borderColor: "border-amber-200",
          textColor: "text-amber-800"
        };
      case "INVALID_CREDENTIALS":
        return {
          title: "Authentication Failed",
          message: "Invalid credentials provided. Please check your email and password.",
          icon: /* @__PURE__ */ jsx(Icons.warning, { className: "w-12 h-12 text-red-600" }),
          showAuthButton: true,
          showRetryButton: false,
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          textColor: "text-red-800"
        };
      case "NETWORK_ERROR":
        return {
          title: "Connection Error",
          message: "Unable to connect to the server. Please check your internet connection.",
          icon: /* @__PURE__ */ jsx(Icons.wifi, { className: "w-12 h-12 text-orange-600" }),
          showAuthButton: false,
          showRetryButton: true,
          bgColor: "bg-orange-50",
          borderColor: "border-orange-200",
          textColor: "text-orange-800"
        };
      default:
        return {
          title: "Authentication Error",
          message: error.message || "An unexpected error occurred. Please try again.",
          icon: /* @__PURE__ */ jsx(Icons.warning, { className: "w-12 h-12 text-red-600" }),
          showAuthButton: true,
          showRetryButton: true,
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          textColor: "text-red-800"
        };
    }
  }, [error]);
  const handleRetry = useCallback(async () => {
    if (retryCount >= MAX_RETRIES) {
      showErrorToast("Maximum retry attempts reached. Please refresh the page.");
      return;
    }
    setIsRetrying(true);
    setRetryCount((prev) => prev + 1);
    try {
      clearError();
      await retryAuth();
      if (onRetry) {
        await onRetry();
      }
      showSuccessToast("Authentication retry successful!");
    } catch (error2) {
      console.error("Auth retry failed:", error2);
      showErrorToast("Retry failed. Please try again.");
    } finally {
      setIsRetrying(false);
    }
  }, [retryCount, clearError, retryAuth, onRetry]);
  const handleSignIn = useCallback(() => {
    setAuthMode("login");
    setShowAuthModal(true);
  }, []);
  const handleGoHome = useCallback(() => {
    clearError();
    navigate("/");
  }, [clearError, navigate]);
  const handleRefreshPage = useCallback(() => {
    window.location.reload();
  }, []);
  const errorInfo = getErrorInfo();
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background pt-20", children: [
    /* @__PURE__ */ jsx("div", { className: "max-w-2xl mx-auto px-4 py-8", children: /* @__PURE__ */ jsxs("div", { className: `${errorInfo.bgColor} border ${errorInfo.borderColor} rounded-xl p-8 text-center`, children: [
      /* @__PURE__ */ jsx("div", { className: "flex justify-center mb-6", children: errorInfo.icon }),
      /* @__PURE__ */ jsx("h2", { className: `text-2xl font-bold ${errorInfo.textColor} mb-4`, children: errorInfo.title }),
      /* @__PURE__ */ jsx("p", { className: `${errorInfo.textColor} mb-6 leading-relaxed`, children: errorInfo.message }),
      error.details && /* @__PURE__ */ jsxs("details", { className: "mb-6 text-left", children: [
        /* @__PURE__ */ jsx("summary", { className: `${errorInfo.textColor} cursor-pointer text-sm font-medium`, children: "Technical Details" }),
        /* @__PURE__ */ jsx("pre", { className: `${errorInfo.textColor} text-xs mt-2 p-3 bg-white rounded border overflow-x-auto`, children: JSON.stringify(error.details, null, 2) })
      ] }),
      user && /* @__PURE__ */ jsxs("div", { className: `${errorInfo.textColor} text-sm mb-6 p-3 bg-white rounded border`, children: [
        /* @__PURE__ */ jsxs("p", { children: [
          "Currently signed in as: ",
          /* @__PURE__ */ jsx("strong", { children: user.email })
        ] }),
        /* @__PURE__ */ jsxs("p", { children: [
          "User ID: ",
          /* @__PURE__ */ jsx("code", { className: "text-xs", children: user.id })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-4 justify-center", children: [
        errorInfo.showRetryButton && /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: handleRetry,
            disabled: isRetrying || retryCount >= MAX_RETRIES,
            className: `flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${isRetrying || retryCount >= MAX_RETRIES ? "bg-gray-400 text-white cursor-not-allowed" : "bg-primary text-white hover:bg-primary/90"}`,
            children: [
              /* @__PURE__ */ jsx(Icons.refresh, { className: `w-4 h-4 ${isRetrying ? "animate-spin" : ""}` }),
              isRetrying ? "Retrying..." : `Retry${retryCount > 0 ? ` (${retryCount}/${MAX_RETRIES})` : ""}`
            ]
          }
        ),
        errorInfo.showAuthButton && /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: handleSignIn,
            className: "flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors",
            children: [
              /* @__PURE__ */ jsx(Icons.login, { className: "w-4 h-4" }),
              "Sign In"
            ]
          }
        ),
        showReturnHome && /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: handleGoHome,
            className: "flex items-center justify-center gap-2 bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors",
            children: [
              /* @__PURE__ */ jsx(Icons.home, { className: "w-4 h-4" }),
              "Go Home"
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: handleRefreshPage,
            className: "flex items-center justify-center gap-2 bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors",
            children: [
              /* @__PURE__ */ jsx(Icons.refresh, { className: "w-4 h-4" }),
              "Refresh Page"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: `${errorInfo.textColor} text-sm mt-6 p-3 bg-white rounded border`, children: [
        /* @__PURE__ */ jsx("p", { className: "font-medium mb-2", children: "Need help?" }),
        /* @__PURE__ */ jsxs("ul", { className: "text-left space-y-1", children: [
          /* @__PURE__ */ jsx("li", { children: "• Check your internet connection" }),
          /* @__PURE__ */ jsx("li", { children: "• Clear your browser cache and cookies" }),
          /* @__PURE__ */ jsx("li", { children: "• Try signing out and signing in again" }),
          /* @__PURE__ */ jsx("li", { children: "• Contact support if the problem persists" })
        ] })
      ] })
    ] }) }),
    showAuthModal && /* @__PURE__ */ jsx(
      AuthModal,
      {
        isOpen: showAuthModal,
        onClose: () => setShowAuthModal(false),
        mode: authMode,
        onModeChange: setAuthMode
      }
    )
  ] });
};
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback || /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center p-4 bg-red-50 border border-red-200 rounded-lg", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsx(ExclamationTriangleIcon, { className: "w-8 h-8 text-red-500 mx-auto mb-2" }),
        /* @__PURE__ */ jsx("p", { className: "text-red-700 mb-2", children: "Something went wrong" }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => this.setState({ hasError: false }),
            className: "flex items-center justify-center space-x-1 text-red-600 hover:text-red-800 text-sm transition-colors",
            children: [
              /* @__PURE__ */ jsx(ArrowPathIcon, { className: "w-4 h-4" }),
              /* @__PURE__ */ jsx("span", { children: "Try again" })
            ]
          }
        )
      ] }) });
    }
    return this.props.children;
  }
}
class AdSenseManager {
  constructor() {
    __publicField(this, "isInitialized", false);
    __publicField(this, "consentPreferences", null);
    this.loadConsentFromStorage();
    this.initializeAdSense();
  }
  loadConsentFromStorage() {
    try {
      const savedConsent = localStorage.getItem("oentex-consent");
      if (savedConsent) {
        const consentData = JSON.parse(savedConsent);
        this.consentPreferences = consentData.preferences;
      }
    } catch (error) {
      console.warn("Failed to load consent preferences:", error);
    }
  }
  initializeAdSense() {
    if (typeof window === "undefined") return;
    if (!window.adsbygoogle) {
      window.adsbygoogle = [];
    }
    this.isInitialized = true;
  }
  updateConsent(preferences) {
    this.consentPreferences = preferences;
    if (preferences.marketing && !this.isInitialized) {
      this.initializeAdSense();
    } else if (!preferences.marketing && this.isInitialized) {
      this.disableAdSense();
    }
  }
  disableAdSense() {
    const scripts = document.querySelectorAll('script[src*="googlesyndication.com"]');
    scripts.forEach((script) => script.remove());
    const ads = document.querySelectorAll(".adsbygoogle");
    ads.forEach((ad) => {
      ad.innerHTML = "";
      ad.style.display = "none";
    });
    this.isInitialized = false;
  }
  pushAd(adElement) {
    var _a;
    if (((_a = this.consentPreferences) == null ? void 0 : _a.marketing) && window.adsbygoogle) {
      try {
        const insElement = adElement.querySelector(".adsbygoogle");
        if (insElement && !insElement.hasAttribute("data-adsbygoogle-status")) {
          window.adsbygoogle.push({});
          console.log("AdSense: Manager push successful");
        } else {
          console.log("AdSense: Manager - Ad already loaded");
        }
      } catch (error) {
        console.warn("AdSense error:", error);
      }
    }
  }
  canShowAds() {
    var _a;
    return ((_a = this.consentPreferences) == null ? void 0 : _a.marketing) === true;
  }
}
const adSenseManager = new AdSenseManager();
const updateAdSenseConsent = (preferences) => {
  adSenseManager.updateConsent(preferences);
};
const ConsentManager = ({ onConsentChange }) => {
  const [showBanner, setShowBanner] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    // Always true - required for site functionality
    analytics: false,
    marketing: false,
    personalization: false
  });
  useEffect(() => {
    const savedConsent = localStorage.getItem("oentex-consent");
    if (!savedConsent) {
      setShowBanner(true);
    } else {
      const consentData = JSON.parse(savedConsent);
      setPreferences(consentData.preferences);
    }
  }, []);
  const handleAcceptAll = () => {
    const newPreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      personalization: true
    };
    saveConsent(newPreferences);
    setShowBanner(false);
  };
  const handleRejectAll = () => {
    const newPreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      personalization: false
    };
    saveConsent(newPreferences);
    setShowBanner(false);
  };
  const handleManageOptions = () => {
    setShowModal(true);
  };
  const saveConsent = (newPreferences) => {
    const consentData = {
      preferences: newPreferences,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      version: "1.0"
    };
    localStorage.setItem("oentex-consent", JSON.stringify(consentData));
    setPreferences(newPreferences);
    onConsentChange == null ? void 0 : onConsentChange(newPreferences);
    updateAdSenseConsent(newPreferences);
  };
  const handleSavePreferences = () => {
    saveConsent(preferences);
    setShowModal(false);
    setShowBanner(false);
  };
  const handlePreferenceChange = (key, value) => {
    if (key === "necessary") return;
    setPreferences((prev) => ({ ...prev, [key]: value }));
  };
  if (!showBanner && !showModal) return null;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    showBanner && /* @__PURE__ */ jsx("div", { className: "fixed bottom-0 left-0 right-0 z-50 bg-content1 border-t border-divider/30 shadow-enhanced-lg backdrop-blur-strong", children: /* @__PURE__ */ jsx("div", { className: "container-p-lg", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col lg:flex-row items-start lg:items-center justify-between gap-lg", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-foreground mb-sm", children: "We value your privacy" }),
        /* @__PURE__ */ jsx("p", { className: "text-foreground/70 text-sm leading-relaxed", children: "We use cookies and similar technologies to enhance your experience, analyze site traffic, and personalize content. By continuing to use our site, you consent to our use of cookies. You can manage your preferences at any time." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-sm", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: handleRejectAll,
            className: "btn-secondary px-lg py-sm text-sm font-medium",
            children: "Reject All"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: handleManageOptions,
            className: "btn-outline px-lg py-sm text-sm font-medium",
            children: "Manage Options"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: handleAcceptAll,
            className: "btn-primary px-lg py-sm text-sm font-medium",
            children: "Accept All"
          }
        )
      ] })
    ] }) }) }),
    showModal && /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-lg", children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          className: "absolute inset-0 bg-black/50 backdrop-blur-sm",
          onClick: () => setShowModal(false)
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "relative bg-content1 rounded-2xl border border-divider/30 shadow-enhanced-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto", children: /* @__PURE__ */ jsxs("div", { className: "container-p-2xl", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-xl", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-foreground", children: "Cookie Preferences" }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setShowModal(false),
              className: "text-foreground/60 hover:text-foreground transition-colors",
              children: /* @__PURE__ */ jsx(Icons.close, { className: "w-6 h-6" })
            }
          )
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-foreground/70 mb-2xl leading-relaxed", children: "We use cookies to provide and improve our services. You can choose which types of cookies to allow. Some cookies are necessary for the site to function and cannot be disabled." }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-xl", children: [
          /* @__PURE__ */ jsxs("div", { className: "border border-divider/30 rounded-xl container-p-lg", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-md", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-foreground", children: "Necessary Cookies" }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-foreground/70", children: "Required for basic site functionality" })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "bg-success/20 text-success px-sm py-xs rounded-full text-xs font-medium", children: "Always Active" })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-foreground/60", children: "These cookies are essential for the website to function properly. They enable basic functions like page navigation, access to secure areas, and remember your login status." })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "border border-divider/30 rounded-xl container-p-lg", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-md", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-foreground", children: "Analytics Cookies" }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-foreground/70", children: "Help us understand how visitors interact with our site" })
              ] }),
              /* @__PURE__ */ jsxs("label", { className: "relative inline-flex items-center cursor-pointer", children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: preferences.analytics,
                    onChange: (e) => handlePreferenceChange("analytics", e.target.checked),
                    className: "sr-only"
                  }
                ),
                /* @__PURE__ */ jsx("div", { className: `w-11 h-6 rounded-full transition-colors ${preferences.analytics ? "bg-primary" : "bg-content2"}`, children: /* @__PURE__ */ jsx("div", { className: `w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform ${preferences.analytics ? "translate-x-5" : "translate-x-0.5"} mt-0.5` }) })
              ] })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-foreground/60", children: "These cookies collect information about how you use our website, such as which pages you visit most often. This helps us improve our website's performance and user experience." })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "border border-divider/30 rounded-xl container-p-lg", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-md", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-foreground", children: "Marketing Cookies" }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-foreground/70", children: "Used to deliver relevant advertisements" })
              ] }),
              /* @__PURE__ */ jsxs("label", { className: "relative inline-flex items-center cursor-pointer", children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: preferences.marketing,
                    onChange: (e) => handlePreferenceChange("marketing", e.target.checked),
                    className: "sr-only"
                  }
                ),
                /* @__PURE__ */ jsx("div", { className: `w-11 h-6 rounded-full transition-colors ${preferences.marketing ? "bg-primary" : "bg-content2"}`, children: /* @__PURE__ */ jsx("div", { className: `w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform ${preferences.marketing ? "translate-x-5" : "translate-x-0.5"} mt-0.5` }) })
              ] })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-foreground/60", children: "These cookies are used to deliver advertisements more relevant to you and your interests. They may also be used to limit the number of times you see an advertisement." })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "border border-divider/30 rounded-xl container-p-lg", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-md", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-foreground", children: "Personalization Cookies" }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-foreground/70", children: "Remember your preferences and settings" })
              ] }),
              /* @__PURE__ */ jsxs("label", { className: "relative inline-flex items-center cursor-pointer", children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: preferences.personalization,
                    onChange: (e) => handlePreferenceChange("personalization", e.target.checked),
                    className: "sr-only"
                  }
                ),
                /* @__PURE__ */ jsx("div", { className: `w-11 h-6 rounded-full transition-colors ${preferences.personalization ? "bg-primary" : "bg-content2"}`, children: /* @__PURE__ */ jsx("div", { className: `w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform ${preferences.personalization ? "translate-x-5" : "translate-x-0.5"} mt-0.5` }) })
              ] })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-foreground/60", children: "These cookies remember your preferences and settings to provide a more personalized experience, such as your preferred language or region." })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-sm mt-2xl pt-xl border-t border-divider/30", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: handleRejectAll,
              className: "btn-secondary px-xl py-md font-medium",
              children: "Reject All"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: handleSavePreferences,
              className: "btn-primary px-xl py-md font-medium",
              children: "Save Preferences"
            }
          )
        ] })
      ] }) })
    ] })
  ] });
};
const ToastContainer = ({ position = "top-right", topAnchorSelector, topMargin = 8 }) => {
  const [computedTop, setComputedTop] = useState(void 0);
  useEffect(() => {
    if (!topAnchorSelector || typeof window === "undefined") {
      setComputedTop(void 0);
      return;
    }
    const compute = () => {
      const el = document.querySelector(topAnchorSelector);
      if (!el) {
        setComputedTop(void 0);
        return;
      }
      const rect = el.getBoundingClientRect();
      setComputedTop(`${Math.max(0, rect.bottom + topMargin)}px`);
    };
    compute();
    const onResize = () => compute();
    const onScroll = () => compute();
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, true);
    const id = window.setTimeout(compute, 0);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll, true);
      window.clearTimeout(id);
    };
  }, [topAnchorSelector, topMargin]);
  const containerStyle = { zIndex: 9999 };
  if (position.startsWith("top")) {
    containerStyle.top = computedTop || "5rem";
  }
  if (position.startsWith("bottom")) {
    containerStyle.bottom = "1rem";
  }
  if (position.endsWith("right")) {
    containerStyle.right = "1rem";
  }
  if (position.endsWith("left")) {
    containerStyle.left = "1rem";
  }
  if (position.endsWith("center")) ;
  return /* @__PURE__ */ jsx(
    Toaster,
    {
      position,
      toastOptions: {
        duration: 4e3,
        style: {
          background: "hsl(var(--heroui-content1))",
          color: "hsl(var(--heroui-foreground))",
          border: "1px solid hsl(var(--heroui-divider))",
          borderRadius: "0.75rem",
          padding: "1rem",
          fontWeight: "500",
          boxShadow: "0 10px 40px hsl(var(--heroui-foreground) / 0.15), 0 4px 16px hsl(var(--heroui-foreground) / 0.1)",
          backdropFilter: "blur(16px)"
        },
        success: {
          duration: 3e3,
          style: {
            background: "hsl(var(--heroui-success) / 0.1)",
            color: "hsl(var(--heroui-success))",
            border: "1px solid hsl(var(--heroui-success) / 0.2)",
            borderRadius: "0.75rem",
            padding: "1rem",
            fontWeight: "500",
            boxShadow: "0 10px 40px hsl(var(--heroui-success) / 0.15), 0 4px 16px hsl(var(--heroui-success) / 0.08)",
            backdropFilter: "blur(16px)"
          }
        },
        error: {
          duration: 5e3,
          style: {
            background: "hsl(var(--heroui-danger) / 0.1)",
            color: "hsl(var(--heroui-danger))",
            border: "1px solid hsl(var(--heroui-danger) / 0.2)",
            borderRadius: "0.75rem",
            padding: "1rem",
            fontWeight: "500",
            boxShadow: "0 10px 40px hsl(var(--heroui-danger) / 0.15), 0 4px 16px hsl(var(--heroui-danger) / 0.08)",
            backdropFilter: "blur(16px)"
          }
        },
        loading: {
          style: {
            background: "hsl(var(--heroui-primary) / 0.1)",
            color: "hsl(var(--heroui-primary))",
            border: "1px solid hsl(var(--heroui-primary) / 0.2)",
            borderRadius: "0.75rem",
            padding: "1rem",
            fontWeight: "500",
            boxShadow: "0 10px 40px hsl(var(--heroui-primary) / 0.15), 0 4px 16px hsl(var(--heroui-primary) / 0.08)",
            backdropFilter: "blur(16px)"
          }
        },
        warning: {
          duration: 4e3,
          style: {
            background: "hsl(var(--heroui-warning) / 0.1)",
            color: "hsl(var(--heroui-warning))",
            border: "1px solid hsl(var(--heroui-warning) / 0.2)",
            borderRadius: "0.75rem",
            padding: "1rem",
            fontWeight: "500",
            boxShadow: "0 10px 40px hsl(var(--heroui-warning) / 0.15), 0 4px 16px hsl(var(--heroui-warning) / 0.08)",
            backdropFilter: "blur(16px)"
          }
        }
      },
      containerStyle,
      gutter: 8,
      reverseOrder: false
    }
  );
};
const logo = "/assets/logo-6VVD5FfA.png";
const Sidebar = ({ isMobileOpen, setIsMobileOpen, isCollapsed, onToggleCollapse }) => {
  var _a, _b, _c, _d, _e, _f;
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const navItems = [
    { id: "dashboard", name: "Dashboard", icon: Icons.home, path: "/dashboard" },
    { id: "deals", name: "Browse Platforms", icon: Icons.search, path: "/dashboard/deals" },
    { id: "my-deals", name: "My Ratings", icon: Icons.star, path: "/my-deals" }
  ];
  const handleSignOut = async () => {
    try {
      await signOut();
      setIsMobileOpen(false);
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
      navigate("/");
    }
  };
  const handleProfileClick = () => {
    navigate("/profile");
    setIsMobileOpen(false);
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { className: `hidden lg:block h-screen lg:flex-shrink-0 transition-all duration-300 relative ${isCollapsed ? "w-16" : "w-64"}`, children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: onToggleCollapse,
          className: "absolute top-1/2 -right-4 z-50 w-8 h-8 bg-content1 border-2 border-border rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:bg-content2 hover:border-primary/30 group hover:scale-105 active:scale-95",
          style: { transform: "translateY(-50%)" },
          "aria-label": isCollapsed ? "Expand sidebar" : "Collapse sidebar",
          children: isCollapsed ? /* @__PURE__ */ jsx(Icons.chevronRight, { className: "w-4 h-4 text-foreground/70 group-hover:text-primary transition-colors duration-200" }) : /* @__PURE__ */ jsx(Icons.chevronLeft, { className: "w-4 h-4 text-foreground/70 group-hover:text-primary transition-colors duration-200" })
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "flex flex-col h-full w-full bg-content1 border-r border-border overflow-x-hidden", children: /* @__PURE__ */ jsxs("div", { className: `flex flex-col h-full ${isCollapsed ? "container-p-sm pb-0" : "container-p-xs"}`, children: [
        /* @__PURE__ */ jsxs("div", { className: `flex items-center ${isCollapsed ? "justify-center" : "justify-between"} container-p-sm border-b border-border flex-shrink-0 mb-md`, children: [
          !isCollapsed && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-xs container-p-xs", children: [
            /* @__PURE__ */ jsx("img", { src: logo, alt: "Oentex", className: "h-8 w-auto" }),
            /* @__PURE__ */ jsx("span", { className: "text-lg font-bold text-foreground", children: "Oentex" })
          ] }),
          isCollapsed && /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden", children: /* @__PURE__ */ jsx("img", { src: logo, alt: "Oentex", className: "h-6 w-auto" }) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: `${isCollapsed ? "flex justify-center" : ""} container-p-sm border-b border-border flex-shrink-0 mb-md`, children: /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: handleProfileClick,
            className: `w-full flex items-center ${isCollapsed ? "justify-center group" : "gap-xs"} container-p-sm rounded-lg transition-colors duration-200 hover:bg-content2`,
            "aria-label": "View profile",
            title: isCollapsed ? ((_a = user == null ? void 0 : user.user_metadata) == null ? void 0 : _a.full_name) || ((_b = user == null ? void 0 : user.email) == null ? void 0 : _b.split("@")[0]) || "User" : void 0,
            children: [
              /* @__PURE__ */ jsx("div", { className: `${isCollapsed ? "w-12 h-12" : "w-8 h-8"} flex items-center justify-center flex-shrink-0 ${isCollapsed ? "rounded-lg" : "rounded-full bg-content2"}`, children: /* @__PURE__ */ jsx(Icons.user, { className: `${isCollapsed ? "w-6 h-6 group-hover:text-primary group-focus:text-primary" : "w-4 h-4"} text-foreground/70` }) }),
              !isCollapsed && /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0 text-left container-p-xs", children: [
                /* @__PURE__ */ jsx("p", { className: "text-xs font-medium truncate text-foreground", children: ((_c = user == null ? void 0 : user.user_metadata) == null ? void 0 : _c.full_name) || ((_d = user == null ? void 0 : user.email) == null ? void 0 : _d.split("@")[0]) || "User" }),
                /* @__PURE__ */ jsx("p", { className: "text-xs truncate text-foreground/60", children: (user == null ? void 0 : user.email) || "user@example.com" })
              ] })
            ]
          }
        ) }),
        /* @__PURE__ */ jsx("nav", { className: `flex-1 ${isCollapsed ? "flex flex-col items-center" : "container-p-sm"} space-y-1 overflow-y-auto overflow-x-hidden mb-md`, children: navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return /* @__PURE__ */ jsxs(
            "a",
            {
              href: item.path,
              onClick: (e) => {
                e.preventDefault();
                navigate(item.path);
                setIsMobileOpen(false);
              },
              className: `${isCollapsed ? "w-12 h-12" : "w-full"} flex items-center ${isCollapsed ? "justify-center" : "gap-xs"} ${isCollapsed ? "container-p-sm" : "container-px-sm container-py-xs"} rounded-lg text-left transition-colors duration-200 ${isActive ? isCollapsed ? "text-primary" : "text-primary" : isCollapsed ? "hover:text-primary hover:bg-content2 text-foreground/60" : "hover:text-primary hover:bg-content2 text-foreground/60"}`,
              "aria-label": `Navigate to ${item.name}`,
              title: isCollapsed ? item.name : void 0,
              children: [
                /* @__PURE__ */ jsx(item.icon, { className: "w-6 h-6" }),
                !isCollapsed && /* @__PURE__ */ jsx("span", { className: "font-medium text-xs container-p-xs", children: item.name })
              ]
            },
            item.id
          );
        }) }),
        /* @__PURE__ */ jsx("div", { className: `${isCollapsed ? "flex justify-center" : ""} container-p-sm border-t border-border flex-shrink-0 mt-md mb-0`, children: /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: handleSignOut,
            className: `${isCollapsed ? "w-12 h-12" : "w-full"} flex items-center ${isCollapsed ? "justify-center" : "justify-center sm:justify-start gap-xs"} ${isCollapsed ? "container-p-sm" : "container-px-sm container-py-sm"} rounded-lg transition-colors duration-200 bg-content2 hover:bg-content3 text-foreground/70 hover:text-foreground`,
            "aria-label": "Sign out of account",
            title: isCollapsed ? "Sign Out" : void 0,
            children: [
              /* @__PURE__ */ jsx(Icons.logout, { className: "w-6 h-6" }),
              !isCollapsed && /* @__PURE__ */ jsx("span", { className: "text-xs font-medium container-p-xs", children: "Sign Out" })
            ]
          }
        ) })
      ] }) })
    ] }),
    isMobileOpen && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          className: "fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden",
          onClick: () => setIsMobileOpen(false),
          "aria-label": "Close sidebar"
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "fixed top-0 left-0 z-50 w-72 sm:w-80 h-screen bg-content1 border-r border-border lg:hidden", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col h-full container-p-xs", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between container-p-sm border-b border-border flex-shrink-0 mb-md", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-xs container-p-xs", children: [
            /* @__PURE__ */ jsx("img", { src: logo, alt: "Oentex", className: "h-8 w-auto" }),
            /* @__PURE__ */ jsx("span", { className: "text-lg font-bold text-foreground", children: "Oentex" })
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setIsMobileOpen(false),
              className: "lg:hidden container-p-xs rounded-lg transition-colors hover:bg-content2 text-foreground/60",
              "aria-label": "Close sidebar",
              children: /* @__PURE__ */ jsx(Icons.close, { className: "w-5 h-5" })
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "container-p-sm border-b border-border flex-shrink-0 mb-md", children: /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: handleProfileClick,
            className: "w-full flex items-center gap-xs container-p-sm rounded-lg transition-colors duration-200 hover:bg-content2",
            "aria-label": "View profile",
            children: [
              /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-primary", children: /* @__PURE__ */ jsx(Icons.user, { className: "w-4 h-4 text-white" }) }),
              /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0 text-left container-p-xs", children: [
                /* @__PURE__ */ jsx("p", { className: "text-xs font-medium truncate text-foreground", children: ((_e = user == null ? void 0 : user.user_metadata) == null ? void 0 : _e.full_name) || ((_f = user == null ? void 0 : user.email) == null ? void 0 : _f.split("@")[0]) || "User" }),
                /* @__PURE__ */ jsx("p", { className: "text-xs truncate text-foreground/60", children: (user == null ? void 0 : user.email) || "user@example.com" })
              ] })
            ]
          }
        ) }),
        /* @__PURE__ */ jsx("nav", { className: "flex-1 container-p-sm space-y-1 overflow-y-auto mb-md", children: navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return /* @__PURE__ */ jsxs(
            "a",
            {
              href: item.path,
              onClick: (e) => {
                e.preventDefault();
                navigate(item.path);
                setIsMobileOpen(false);
              },
              className: `w-full flex items-center gap-xs container-px-sm container-py-xs rounded-lg text-left transition-colors duration-200 ${isActive ? "text-white bg-primary" : "hover:bg-content2 text-foreground/60"}`,
              "aria-label": `Navigate to ${item.name}`,
              children: [
                /* @__PURE__ */ jsx(item.icon, { className: "w-4 h-4" }),
                /* @__PURE__ */ jsx("span", { className: "font-medium text-xs container-p-xs", children: item.name })
              ]
            },
            item.id
          );
        }) }),
        /* @__PURE__ */ jsx("div", { className: "container-p-sm border-t border-border flex-shrink-0 mt-md", children: /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: handleSignOut,
            className: "w-full flex items-center justify-center sm:justify-start gap-xs container-px-sm container-py-sm rounded-lg transition-colors duration-200 bg-content2 hover:bg-content3 text-foreground/70 hover:text-foreground",
            "aria-label": "Sign out of account",
            children: [
              /* @__PURE__ */ jsx(Icons.logout, { className: "w-4 h-4" }),
              /* @__PURE__ */ jsx("span", { className: "text-xs font-medium container-p-xs", children: "Sign Out" })
            ]
          }
        ) })
      ] }) })
    ] })
  ] });
};
const DashboardLayout = ({ children }) => {
  var _a, _b;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { user, session } = useAuth();
  useEffect(() => {
    var _a2, _b2;
    if (!user || !((_b2 = (_a2 = session == null ? void 0 : session.user) == null ? void 0 : _a2.app_metadata) == null ? void 0 : _b2.provider)) return;
    const provider = session.user.app_metadata.provider;
    const userId = session.user.id;
    const toastKey = `welcome_toast_${userId}`;
    if (sessionStorage.getItem(toastKey)) return;
    sessionStorage.setItem(toastKey, "true");
    const providerName = provider === "google" ? "Google" : provider === "azure" ? "Microsoft" : "OAuth";
    setTimeout(() => {
      showSuccessToast(
        `Successfully signed in with ${providerName}`,
        "Welcome to Oentex!",
        5e3
      );
    }, 500);
  }, [user == null ? void 0 : user.id, (_b = (_a = session == null ? void 0 : session.user) == null ? void 0 : _a.app_metadata) == null ? void 0 : _b.provider]);
  useEffect(() => {
    if (!user) {
      Object.keys(sessionStorage).forEach((key) => {
        if (key.startsWith("welcome_toast_")) {
          sessionStorage.removeItem(key);
        }
      });
    }
  }, [user]);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return /* @__PURE__ */ jsxs("div", { className: "h-screen bg-background flex", children: [
    /* @__PURE__ */ jsx(ToastContainer, { position: "top-right", topAnchorSelector: "#auth-topbar", topMargin: 8 }),
    /* @__PURE__ */ jsx(
      Sidebar,
      {
        isMobileOpen: isMobileMenuOpen,
        setIsMobileOpen: setIsMobileMenuOpen,
        isCollapsed: isSidebarCollapsed,
        onToggleCollapse: () => setIsSidebarCollapsed(!isSidebarCollapsed)
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 h-screen overflow-y-auto", children: [
      /* @__PURE__ */ jsx("header", { id: "auth-topbar", className: "bg-content1 border-b border-border container-px-sm md:container-px-md container-py-sm md:container-py-md flex-shrink-0", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setIsMobileMenuOpen(true),
            className: "lg:hidden container-p-sm rounded-lg transition-colors duration-200 -ml-2 hover:bg-content2 text-foreground/60",
            "aria-label": "Open sidebar menu",
            children: /* @__PURE__ */ jsx(Icons.menu, { className: "w-6 h-6" })
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "lg:hidden flex items-center gap-xs container-p-xs", children: /* @__PURE__ */ jsx("span", { className: "text-lg font-bold text-foreground", children: "Oentex" }) }),
        /* @__PURE__ */ jsx("div", { className: "hidden lg:block" })
      ] }) }),
      /* @__PURE__ */ jsx("main", { className: "flex-1 overflow-y-auto", children: /* @__PURE__ */ jsx("div", { className: "container-p-sm md:container-p-md lg:container-p-lg", children }) })
    ] })
  ] });
};
const AuthButton = () => {
  var _a, _b, _c;
  const [isSigningOut, setIsSigningOut] = useState(false);
  const { user, signOut, loading, error, retryAuth } = useAuth();
  const navigate = useNavigate();
  const handleSignOut = useCallback(async () => {
    if (isSigningOut) return;
    setIsSigningOut(true);
    try {
      await signOut();
    } finally {
      setIsSigningOut(false);
    }
  }, [signOut, isSigningOut]);
  const handleShowAuthentication = useCallback(() => {
    navigate("/authentication");
  }, [navigate]);
  if (loading) {
    return /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-4 px-6 py-3 bg-gradient-to-r from-default-100 to-default-50 rounded-2xl border border-default-200 shadow-sm", children: [
      /* @__PURE__ */ jsx(Spinner, { size: "sm", color: "primary" }),
      /* @__PURE__ */ jsx("span", { className: "text-sm text-foreground-500 hidden sm:block font-medium", children: "Loading..." })
    ] });
  }
  if (error) {
    return /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-4 px-6 py-3 bg-gradient-to-r from-danger-100 to-danger-50 rounded-2xl border border-danger-200 shadow-sm", children: [
      /* @__PURE__ */ jsx("div", { className: "w-8 h-8 bg-danger-200 rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsx(Icon, { name: "warning", size: "sm", color: "danger" }) }),
      /* @__PURE__ */ jsx(
        Button,
        {
          size: "sm",
          variant: "light",
          color: "danger",
          onPress: retryAuth,
          className: "text-sm underline font-medium",
          children: "Retry"
        }
      )
    ] });
  }
  if (user) {
    const userName = ((_a = user.user_metadata) == null ? void 0 : _a.full_name) || ((_b = user.email) == null ? void 0 : _b.split("@")[0]) || "User";
    const userInitials = userName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
    return /* @__PURE__ */ jsx("div", { className: "flex items-center space-x-4 px-4 py-2", children: /* @__PURE__ */ jsxs(Dropdown, { placement: "bottom-end", children: [
      /* @__PURE__ */ jsx(DropdownTrigger, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-4 cursor-pointer hover:opacity-80 transition-all duration-300 p-4 rounded-2xl hover:bg-gradient-to-r hover:from-default-100 hover:to-default-50 border border-transparent hover:border-default-200 shadow-sm hover:shadow-md", children: [
        /* @__PURE__ */ jsx(
          Avatar,
          {
            name: userInitials,
            src: (_c = user.user_metadata) == null ? void 0 : _c.avatar_url,
            size: "sm",
            className: "bg-gradient-to-r from-primary to-secondary text-white shadow-lg"
          }
        ),
        /* @__PURE__ */ jsx("span", { className: "text-sm font-medium hidden sm:block text-foreground", children: userName })
      ] }) }),
      /* @__PURE__ */ jsxs(DropdownMenu, { "aria-label": "User menu", children: [
        /* @__PURE__ */ jsx(
          DropdownItem,
          {
            className: "h-14 gap-2",
            textValue: `Signed in as ${userName}`,
            children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
              /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold", children: "Signed in as" }),
              /* @__PURE__ */ jsx("span", { className: "text-sm text-foreground-500", children: user.email })
            ] })
          },
          "profile"
        ),
        /* @__PURE__ */ jsx(
          DropdownItem,
          {
            href: "/dashboard",
            className: "text-foreground",
            children: "Dashboard"
          },
          "dashboard"
        ),
        /* @__PURE__ */ jsx(
          DropdownItem,
          {
            href: "/profile",
            className: "text-foreground",
            children: "Profile Settings"
          },
          "profile-page"
        ),
        /* @__PURE__ */ jsx(
          DropdownItem,
          {
            href: "/my-deals",
            className: "text-foreground",
            children: "My Deals"
          },
          "my-deals"
        ),
        /* @__PURE__ */ jsx(
          DropdownItem,
          {
            color: "danger",
            className: "text-danger",
            onPress: handleSignOut,
            startContent: isSigningOut ? /* @__PURE__ */ jsx(Spinner, { size: "sm", color: "danger" }) : /* @__PURE__ */ jsx(Icon, { name: "logout", size: "sm" }),
            children: isSigningOut ? "Signing out..." : "Sign Out"
          },
          "logout"
        )
      ] })
    ] }) });
  }
  return /* @__PURE__ */ jsx(ErrorBoundary, { children: /* @__PURE__ */ jsx(
    Button,
    {
      color: "primary",
      variant: "solid",
      onPress: handleShowAuthentication,
      className: "bg-gradient-to-r from-primary to-secondary text-white font-medium hover:opacity-90 transition-all rounded-2xl container-px-lg container-py-md",
      children: "Launch App"
    }
  ) });
};
const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigation = [
    { name: "About", to: "/about" },
    { name: "Deals", to: "/deals" },
    { name: "FAQ", to: "/faq" },
    { name: "Contact", to: "/contact" }
  ];
  return /* @__PURE__ */ jsx("header", { id: "site-header", className: "fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border", children: /* @__PURE__ */ jsxs("div", { className: "container-page", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center h-16", children: [
      /* @__PURE__ */ jsxs(Link, { to: "/", className: "flex items-center space-x-2 group", children: [
        /* @__PURE__ */ jsx(
          "img",
          {
            src: logo,
            alt: "Oentex Logo",
            className: "w-12 h-12 object-contain group-hover:scale-110 transition-transform duration-300"
          }
        ),
        /* @__PURE__ */ jsx("span", { className: "font-bold text-xl text-text group-hover:text-primary transition-colors", children: "Oentex" })
      ] }),
      /* @__PURE__ */ jsx("nav", { className: "hidden md:flex items-center space-x-10", children: navigation.map((item) => /* @__PURE__ */ jsx(
        Link,
        {
          to: item.to,
          className: "text-textSecondary hover:text-text transition-colors font-medium hover:scale-105 transform duration-200 px-sm py-xs",
          children: item.name
        },
        item.name
      )) }),
      /* @__PURE__ */ jsx("div", { className: "hidden md:flex items-center", children: /* @__PURE__ */ jsx(AuthButton, {}) }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setIsMobileMenuOpen(!isMobileMenuOpen),
          className: "md:hidden p-sm rounded-lg text-textSecondary hover:text-text hover:bg-surface transition-colors",
          children: isMobileMenuOpen ? /* @__PURE__ */ jsx(Icons.close, { className: "w-6 h-6" }) : /* @__PURE__ */ jsx(Icons.menu, { className: "w-6 h-6" })
        }
      )
    ] }),
    isMobileMenuOpen && /* @__PURE__ */ jsx("div", { className: "md:hidden", children: /* @__PURE__ */ jsxs("div", { className: "container-px-xs container-py-sm space-y-2 border-t border-border bg-background", children: [
      navigation.map((item) => /* @__PURE__ */ jsx(
        Link,
        {
          to: item.to,
          className: "block container-px-md container-py-md text-textSecondary hover:text-text hover:bg-surface rounded-lg transition-colors",
          onClick: () => setIsMobileMenuOpen(false),
          children: item.name
        },
        item.name
      )),
      /* @__PURE__ */ jsx("div", { className: "container-px-sm container-py-sm border-t border-border mt-2 pt-4", children: /* @__PURE__ */ jsx(AuthButton, {}) })
    ] }) })
  ] }) });
};
const XIcon = () => /* @__PURE__ */ jsx(
  "svg",
  {
    viewBox: "0 0 24 24",
    className: "w-5 h-5",
    fill: "currentColor",
    "aria-hidden": "true",
    children: /* @__PURE__ */ jsx("path", { d: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" })
  }
);
const Footer = () => {
  const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
  const footerSections = {
    product: {
      title: "Product",
      links: [
        { name: "Deals", to: "/deals" },
        { name: "FAQ", to: "/faq" },
        { name: "Platforms", to: "/platforms" }
      ]
    },
    company: {
      title: "Company",
      links: [
        { name: "About", to: "/about" },
        { name: "Contact", to: "/contact" },
        { name: "Careers", to: "/careers" }
      ]
    }
  };
  const socialLinks = [
    { name: "X (Twitter)", icon: XIcon, to: "https://x.com/oentex_official" },
    { name: "Email", icon: Icons.mail, to: "mailto:support@oentex.com" }
  ];
  const getColumnSpan = (key) => {
    const spans = {
      product: "lg:col-span-3",
      company: "lg:col-span-3"
    };
    return spans[key] || "lg:col-span-3";
  };
  return /* @__PURE__ */ jsx("footer", { className: "bg-content2 border-t border-divider mt-auto", children: /* @__PURE__ */ jsxs("div", { className: "container-page", children: [
    /* @__PURE__ */ jsx("div", { className: "section-py-xl", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-12 gap-2xl", children: [
      /* @__PURE__ */ jsxs("div", { className: "col-span-12 md:col-span-6 lg:col-span-6 flex flex-col pr-lg py-md", children: [
        /* @__PURE__ */ jsx("div", { className: "mb-lg pr-sm py-sm", children: /* @__PURE__ */ jsxs(Link, { to: "/", className: "flex items-center space-x-3 group", children: [
          /* @__PURE__ */ jsx(
            "img",
            {
              src: logo,
              alt: "Oentex Logo",
              className: "w-12 h-12 object-contain group-hover:scale-110 transition-transform duration-300"
            }
          ),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "font-bold text-2xl text-foreground group-hover:text-primary transition-colors duration-300", children: "Oentex" }),
            /* @__PURE__ */ jsx("p", { className: "text-foreground/60 text-sm font-medium", children: "Trading Platform Reviews" })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx("p", { className: "text-foreground/80 text-sm mb-2xl leading-relaxed max-w-lg pr-sm py-sm", children: "Discover and rate the best trading platforms, exchanges, and financial services. Make informed decisions with real user reviews and comprehensive ratings." }),
        /* @__PURE__ */ jsxs("div", { className: "mt-auto pt-2xl pr-sm py-sm", children: [
          /* @__PURE__ */ jsx("h5", { className: "text-sm font-semibold text-foreground mb-md", children: "Follow Us" }),
          /* @__PURE__ */ jsx("div", { className: "flex items-center space-x-3", children: socialLinks.map((item) => /* @__PURE__ */ jsx(
            Link,
            {
              to: item.to,
              className: "text-foreground/70 hover:text-primary transition-all duration-200 p-sm rounded-lg hover:bg-primary/10 group relative",
              target: item.to.startsWith("http") ? "_blank" : void 0,
              rel: item.to.startsWith("http") ? "noopener noreferrer" : void 0,
              "aria-label": item.name,
              children: /* @__PURE__ */ jsx(item.icon, { className: "w-5 h-5 group-hover:scale-110 transition-transform duration-200" })
            },
            item.name
          )) })
        ] })
      ] }),
      Object.entries(footerSections).map(([key, section]) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: `col-span-12 md:col-span-6 ${getColumnSpan(key)} space-y-4 px-lg py-md`,
          children: [
            /* @__PURE__ */ jsx("h3", { className: "font-semibold text-foreground text-base mb-md px-sm py-sm", children: section.title }),
            /* @__PURE__ */ jsx("nav", { className: "space-y-4 px-sm py-sm", children: section.links.map((link) => /* @__PURE__ */ jsx(
              Link,
              {
                to: link.to,
                className: "block text-foreground/70 hover:text-primary transition-all duration-200 text-sm hover:translate-x-1 transform group px-sm py-sm",
                children: /* @__PURE__ */ jsx("span", { className: "group-hover:underline decoration-primary/50 underline-offset-4", children: link.name })
              },
              link.name
            )) })
          ]
        },
        key
      ))
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "border-t border-divider/50 section-py-lg", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-12 gap-md items-center", children: [
      /* @__PURE__ */ jsx("div", { className: "col-span-12 lg:col-span-6", children: /* @__PURE__ */ jsxs("p", { className: "text-foreground/70 text-sm text-center lg:text-left", children: [
        "© ",
        currentYear,
        " Oentex. All rights reserved."
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "col-span-12 lg:col-span-6", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center lg:justify-end space-x-8 px-lg py-sm", children: [
        /* @__PURE__ */ jsx(
          Link,
          {
            to: "/privacy",
            className: "text-foreground/70 hover:text-primary transition-colors text-sm hover:underline underline-offset-4 decoration-primary/50 px-md py-sm",
            children: "Privacy"
          }
        ),
        /* @__PURE__ */ jsx(
          Link,
          {
            to: "/terms",
            className: "text-foreground/70 hover:text-primary transition-colors text-sm hover:underline underline-offset-4 decoration-primary/50 px-md py-sm",
            children: "Terms"
          }
        ),
        /* @__PURE__ */ jsx(
          Link,
          {
            to: "/cookies",
            className: "text-foreground/70 hover:text-primary transition-colors text-sm hover:underline underline-offset-4 decoration-primary/50 px-md py-sm",
            children: "Cookies"
          }
        )
      ] }) })
    ] }) })
  ] }) });
};
const GuestLayout = ({ children, className = "", hideHeader = false, hideFooter = false }) => {
  return /* @__PURE__ */ jsxs("div", { className: `min-h-screen bg-background text-foreground background-enhanced ${className}`, children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-primary/2 via-transparent to-secondary/2 pointer-events-none" }),
    /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-3xl animate-float pointer-events-none" }),
    /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-secondary/5 to-transparent rounded-full blur-3xl animate-float pointer-events-none", style: { animationDelay: "-3s" } }),
    !hideHeader && /* @__PURE__ */ jsx(Header, {}),
    /* @__PURE__ */ jsx("main", { className: `relative z-10 flex-1 layout-transition ${hideHeader ? "pt-0" : "pt-16"}`, children: /* @__PURE__ */ jsx("div", { className: "component-transition", children }) }),
    !hideFooter && /* @__PURE__ */ jsx(Footer, {}),
    /* @__PURE__ */ jsx(
      ToastContainer,
      {
        position: hideHeader ? "bottom-center" : "top-right",
        topAnchorSelector: hideHeader ? void 0 : "#site-header",
        topMargin: hideHeader ? 0 : 8
      }
    )
  ] });
};
const Home = React.lazy(() => import("./assets/Home-CuKckG0L.js"));
const About = React.lazy(() => import("./assets/About-DXXLUBQV.js"));
const PublicDeals = React.lazy(() => import("./assets/Deals-V3zBQIza.js"));
const FAQ = React.lazy(() => import("./assets/FAQ-Dat3Nr_K.js"));
const Contact = React.lazy(() => import("./assets/Contact-evDjf2dk.js"));
const Terms = React.lazy(() => import("./assets/Terms-Bz3O1VRy.js"));
const Privacy = React.lazy(() => import("./assets/Privacy-CMdWM0PB.js"));
const Authentication = React.lazy(() => import("./assets/Authentication-5nbmv33-.js"));
const AuthCallback = React.lazy(() => import("./assets/AuthCallback-BmoYPH_T.js"));
const ResetPassword = React.lazy(() => import("./assets/ResetPassword-Dv7s_Znf.js"));
const Unsubscribe = React.lazy(() => import("./assets/Unsubscribe-DTT04_Kq.js"));
const Dashboard = React.lazy(() => import("./assets/Dashboard-BKx8y0t8.js"));
const AuthDeals = React.lazy(() => import("./assets/Deals-Donkm59f.js"));
const MyDeals = React.lazy(() => import("./assets/MyDeals-CO0UVhKt.js"));
const Profile = React.lazy(() => import("./assets/Profile-BJTpWe10.js"));
const OAuthCallbackHandler = () => {
  return /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx(PageLoader, { message: "Processing OAuth tokens..." }), children: /* @__PURE__ */ jsx(AuthCallback, {}) });
};
const AuthPageWrapper = ({ children }) => {
  return /* @__PURE__ */ jsx(GuestLayout, { hideHeader: true, hideFooter: true, children });
};
const AuthenticatedApp = () => {
  return /* @__PURE__ */ jsx(DashboardLayout, { children: /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx(PageLoader, { message: "Loading dashboard..." }), children: /* @__PURE__ */ jsxs(Routes, { children: [
    /* @__PURE__ */ jsx(Route, { path: "/", element: /* @__PURE__ */ jsx(Navigate, { to: "/dashboard", replace: true }) }),
    /* @__PURE__ */ jsx(Route, { path: "/dashboard", element: /* @__PURE__ */ jsx(Dashboard, {}) }),
    /* @__PURE__ */ jsx(Route, { path: "/dashboard/deals", element: /* @__PURE__ */ jsx(AuthDeals, {}) }),
    /* @__PURE__ */ jsx(Route, { path: "/my-deals", element: /* @__PURE__ */ jsx(MyDeals, {}) }),
    /* @__PURE__ */ jsx(Route, { path: "/profile", element: /* @__PURE__ */ jsx(Profile, {}) }),
    /* @__PURE__ */ jsx(Route, { path: "/unsubscribe", element: /* @__PURE__ */ jsx(Unsubscribe, {}) }),
    /* @__PURE__ */ jsx(Route, { path: "*", element: /* @__PURE__ */ jsx(Navigate, { to: "/dashboard", replace: true }) })
  ] }) }) });
};
const PublicApp = () => {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(ScrollToTop, {}),
    /* @__PURE__ */ jsx(ErrorBoundary, { children: /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx(PageLoader, { message: "Loading page..." }), children: /* @__PURE__ */ jsxs(Routes, { children: [
      /* @__PURE__ */ jsx(Route, { path: "/", element: /* @__PURE__ */ jsx(GuestLayout, { children: /* @__PURE__ */ jsx(Home, {}) }) }),
      /* @__PURE__ */ jsx(Route, { path: "/about", element: /* @__PURE__ */ jsx(GuestLayout, { children: /* @__PURE__ */ jsx(About, {}) }) }),
      /* @__PURE__ */ jsx(Route, { path: "/deals", element: /* @__PURE__ */ jsx(GuestLayout, { children: /* @__PURE__ */ jsx(PublicDeals, {}) }) }),
      /* @__PURE__ */ jsx(Route, { path: "/faq", element: /* @__PURE__ */ jsx(GuestLayout, { children: /* @__PURE__ */ jsx(FAQ, {}) }) }),
      /* @__PURE__ */ jsx(Route, { path: "/contact", element: /* @__PURE__ */ jsx(GuestLayout, { children: /* @__PURE__ */ jsx(Contact, {}) }) }),
      /* @__PURE__ */ jsx(Route, { path: "/terms", element: /* @__PURE__ */ jsx(GuestLayout, { children: /* @__PURE__ */ jsx(Terms, {}) }) }),
      /* @__PURE__ */ jsx(Route, { path: "/privacy", element: /* @__PURE__ */ jsx(GuestLayout, { children: /* @__PURE__ */ jsx(Privacy, {}) }) }),
      /* @__PURE__ */ jsx(Route, { path: "/unsubscribe", element: /* @__PURE__ */ jsx(GuestLayout, { children: /* @__PURE__ */ jsx(Unsubscribe, {}) }) }),
      /* @__PURE__ */ jsx(Route, { path: "/authentication", element: /* @__PURE__ */ jsx(AuthPageWrapper, { children: /* @__PURE__ */ jsx(Authentication, {}) }) }),
      /* @__PURE__ */ jsx(Route, { path: "/auth/callback", element: /* @__PURE__ */ jsx(GuestLayout, { children: /* @__PURE__ */ jsx(OAuthCallbackHandler, {}) }) }),
      /* @__PURE__ */ jsx(Route, { path: "/auth/reset-password", element: /* @__PURE__ */ jsx(GuestLayout, { children: /* @__PURE__ */ jsx(ResetPassword, {}) }) }),
      /* @__PURE__ */ jsx(Route, { path: "*", element: /* @__PURE__ */ jsx(GuestLayout, { children: /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center pt-20", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-4xl font-bold text-text mb-4", children: "404" }),
        /* @__PURE__ */ jsx("p", { className: "text-textSecondary mb-6", children: "Page not found" }),
        /* @__PURE__ */ jsx(
          "a",
          {
            href: "/",
            className: "btn-primary",
            children: "Go Home"
          }
        )
      ] }) }) }) })
    ] }) }) })
  ] });
};
const AppContent = () => {
  const {
    user,
    loading: authLoading,
    initialized,
    isFullyReady,
    error: authError
  } = useAuth();
  if (authLoading || !initialized) {
    return /* @__PURE__ */ jsx(AuthLoader, { stage: "initializing" });
  }
  if (authError && !isFullyReady) {
    return /* @__PURE__ */ jsx(AuthErrorBoundary, { error: authError, showReturnHome: false });
  }
  if (!isFullyReady) {
    return /* @__PURE__ */ jsx(AuthLoader, { stage: "validating" });
  }
  if (user) {
    return /* @__PURE__ */ jsx(AuthenticatedApp, {});
  } else {
    return /* @__PURE__ */ jsx(PublicApp, {});
  }
};
function App() {
  return /* @__PURE__ */ jsxs(ErrorBoundary, { children: [
    /* @__PURE__ */ jsxs(Routes, { children: [
      /* @__PURE__ */ jsx(
        Route,
        {
          path: "/unsubscribe",
          element: /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx(PageLoader, { message: "Loading unsubscribe..." }), children: /* @__PURE__ */ jsx(Unsubscribe, {}) })
        }
      ),
      /* @__PURE__ */ jsx(Route, { path: "/*", element: /* @__PURE__ */ jsx(AppContent, {}) })
    ] }),
    /* @__PURE__ */ jsx(ConsentManager, {}),
    process.env.NODE_ENV === "development" && /* @__PURE__ */ jsx(
      ReactQueryDevtools,
      {
        initialIsOpen: false,
        position: "bottom"
      }
    )
  ] });
}
function render(url, helmetContext) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1e3,
        // 1 minute
        retry: false
      }
    }
  });
  const html = renderToString(
    /* @__PURE__ */ jsx(React__default.StrictMode, { children: /* @__PURE__ */ jsx(HelmetProvider, { context: helmetContext, children: /* @__PURE__ */ jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsx(
      HeroUIProvider,
      {
        navigate: (path) => {
          console.log("Navigate to:", path);
        },
        locale: "en-US",
        disableAnimation: true,
        disableRipple: false,
        validationBehavior: "native",
        reducedMotion: "user",
        children: /* @__PURE__ */ jsx(AuthProvider, { children: /* @__PURE__ */ jsx(StaticRouter, { location: url, children: /* @__PURE__ */ jsx(App, {}) }) })
      }
    ) }) }) })
  );
  return { html, queryClient };
}
export {
  AuthModal as A,
  DealsSkeleton as D,
  GuestLayout as G,
  Icons as I,
  LoadingSpinner as L,
  showErrorToast as a,
  showSuccessToast as b,
  adSenseManager as c,
  config as d,
  authService as e,
  logo as l,
  render,
  supabase as s,
  useAuth as u
};
