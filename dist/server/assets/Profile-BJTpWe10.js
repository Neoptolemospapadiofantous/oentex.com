import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { u as useAuth, I as Icons, a as showErrorToast, b as showSuccessToast } from "../entry-server.js";
import "react-dom/server";
import "react-router-dom/server.mjs";
import "@tanstack/react-query";
import "@heroui/react";
import "./react-B6hsMDRz.js";
import "react-fast-compare";
import "invariant";
import "shallowequal";
import "react-router-dom";
import "@tanstack/react-query-devtools";
import "@supabase/supabase-js";
import "@heroicons/react/24/outline";
import "react-hot-toast";
const Profile = () => {
  var _a, _b, _c;
  const { user, updatePassword } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: ((_a = user == null ? void 0 : user.user_metadata) == null ? void 0 : _a.full_name) || "",
    email: (user == null ? void 0 : user.email) || ""
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  const handlePasswordChange = (field, value) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }));
  };
  const handleSaveProfile = async () => {
    if (!formData.fullName.trim()) {
      showErrorToast("Full name is required");
      return;
    }
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1e3));
      showSuccessToast("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      showErrorToast("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  const handleChangePassword = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      showErrorToast("All password fields are required");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showErrorToast("New passwords do not match");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      showErrorToast("New password must be at least 6 characters long");
      return;
    }
    setIsLoading(true);
    try {
      await updatePassword(passwordData.newPassword);
      showSuccessToast("Password changed successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      setIsChangingPassword(false);
    } catch (error) {
      console.error("Error changing password:", error);
      showErrorToast("Failed to change password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  const cancelEdit = () => {
    var _a2;
    setFormData({
      fullName: ((_a2 = user == null ? void 0 : user.user_metadata) == null ? void 0 : _a2.full_name) || "",
      email: (user == null ? void 0 : user.email) || ""
    });
    setIsEditing(false);
  };
  const cancelPasswordChange = () => {
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
    setIsChangingPassword(false);
  };
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen", children: /* @__PURE__ */ jsxs("div", { className: "container-page section-py-xl", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center mb-4xl", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-4xl md:text-5xl font-bold gradient-text mb-lg", children: "Profile Settings" }),
      /* @__PURE__ */ jsx("p", { className: "text-xl text-foreground/70 mb-sm", children: "Manage your account information and security settings" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-content1/90 backdrop-blur-2xl rounded-3xl border border-divider/50 container-px-2xl container-py-lg hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 group mb-2xl", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-lg", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-foreground mb-sm group-hover:text-primary transition-colors duration-300", children: "Profile Information" }),
          /* @__PURE__ */ jsx("p", { className: "text-foreground/60", children: "Manage your personal details" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200", children: /* @__PURE__ */ jsx(Icons.user, { className: "w-6 h-6 text-primary" }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-lg", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-semibold text-foreground mb-sm", children: "Full Name" }),
          isEditing ? /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: formData.fullName,
              onChange: (e) => handleInputChange("fullName", e.target.value),
              className: "w-full container-px-lg container-py-lg border border-divider/50 rounded-2xl focus:ring-2 focus:ring-primary focus:border-primary text-base bg-content2/80 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10",
              placeholder: "Enter your full name"
            }
          ) : /* @__PURE__ */ jsx("p", { className: "text-lg text-foreground container-p-lg bg-content2/50 rounded-2xl border border-divider/20", children: ((_b = user == null ? void 0 : user.user_metadata) == null ? void 0 : _b.full_name) || "Not set" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-semibold text-foreground mb-sm", children: "Email Address" }),
          /* @__PURE__ */ jsxs("div", { className: "container-p-lg bg-content2/50 rounded-2xl border border-divider/20", children: [
            /* @__PURE__ */ jsxs("p", { className: "text-lg text-foreground flex items-center gap-md", children: [
              /* @__PURE__ */ jsx(Icons.mail, { className: "w-5 h-5 text-primary" }),
              user == null ? void 0 : user.email
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-foreground/60 mt-sm", children: "Email address cannot be changed" })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex gap-lg pt-xl border-t border-divider/30", children: !isEditing ? /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setIsEditing(true),
            className: "bg-primary text-primary-foreground container-px-lg container-py-md rounded-xl font-semibold text-sm transition-all duration-300 hover:bg-primary/90 hover:shadow-md hover:shadow-primary/20",
            children: [
              /* @__PURE__ */ jsx(Icons.edit, { className: "w-4 h-4 mr-sm" }),
              "Edit Profile"
            ]
          }
        ) : /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: handleSaveProfile,
              disabled: isLoading,
              className: "bg-primary text-primary-foreground container-px-lg container-py-md rounded-xl font-semibold text-sm transition-all duration-300 hover:bg-primary/90 hover:shadow-md hover:shadow-primary/20 disabled:opacity-50",
              children: [
                /* @__PURE__ */ jsx(Icons.check, { className: "w-4 h-4 mr-sm" }),
                isLoading ? "Saving..." : "Save Changes"
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: cancelEdit,
              className: "bg-content2 hover:bg-content3 text-foreground container-px-lg container-py-md rounded-xl font-semibold text-sm transition-all duration-300",
              children: "Cancel"
            }
          )
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-content1/90 backdrop-blur-2xl rounded-3xl border border-divider/50 container-px-2xl container-py-lg hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 group mb-2xl", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-lg", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-foreground mb-sm group-hover:text-primary transition-colors duration-300", children: "Security Settings" }),
          /* @__PURE__ */ jsx("p", { className: "text-foreground/60", children: "Manage your account security" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200", children: /* @__PURE__ */ jsx(Icons.shield, { className: "w-6 h-6 text-primary" }) })
      ] }),
      !isChangingPassword ? /* @__PURE__ */ jsxs("div", { className: "space-y-lg", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between container-p-lg bg-content2/50 rounded-2xl hover:bg-content2/70 transition-all duration-300 border border-divider/20 hover:border-primary/20", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-foreground", children: "Password" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-foreground/60", children: "Last changed: Never" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "text-lg text-foreground/50 font-mono", children: "•••••••••••" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between container-p-lg bg-content2/50 rounded-2xl hover:bg-content2/70 transition-all duration-300 border border-divider/20 hover:border-primary/20", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-foreground", children: "Two-Factor Authentication" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-foreground/60", children: "Add an extra layer of security" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "text-sm text-foreground/60 bg-content1/80 container-px-lg container-py-sm rounded-xl border border-divider/20", children: "Not enabled" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "pt-xl border-t border-divider/30", children: /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setIsChangingPassword(true),
            className: "bg-primary text-primary-foreground container-px-lg container-py-md rounded-xl font-semibold text-sm transition-all duration-300 hover:bg-primary/90 hover:shadow-md hover:shadow-primary/20",
            children: [
              /* @__PURE__ */ jsx(Icons.key, { className: "w-4 h-4 mr-sm" }),
              "Change Password"
            ]
          }
        ) })
      ] }) : /* @__PURE__ */ jsxs("div", { className: "space-y-lg", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-semibold text-foreground mb-sm", children: "Current Password" }),
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: showPassword ? "text" : "password",
                value: passwordData.currentPassword,
                onChange: (e) => handlePasswordChange("currentPassword", e.target.value),
                className: "w-full container-px-lg container-py-lg pr-12 border border-divider/50 rounded-2xl focus:ring-2 focus:ring-success focus:border-success text-base bg-content2/80 backdrop-blur-sm transition-all duration-300 hover:border-success/30 hover:shadow-lg hover:shadow-success/10",
                placeholder: "Enter current password"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => setShowPassword(!showPassword),
                className: "absolute right-4 top-1/2 transform -translate-y-1/2 text-foreground/60 hover:text-foreground transition-colors duration-200",
                children: showPassword ? /* @__PURE__ */ jsx(Icons.eyeOff, { className: "w-5 h-5" }) : /* @__PURE__ */ jsx(Icons.eye, { className: "w-5 h-5" })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-semibold text-foreground mb-sm", children: "New Password" }),
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: showNewPassword ? "text" : "password",
                value: passwordData.newPassword,
                onChange: (e) => handlePasswordChange("newPassword", e.target.value),
                className: "w-full container-px-lg container-py-lg pr-12 border border-divider/50 rounded-2xl focus:ring-2 focus:ring-success focus:border-success text-base bg-content2/80 backdrop-blur-sm transition-all duration-300 hover:border-success/30 hover:shadow-lg hover:shadow-success/10",
                placeholder: "Enter new password"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => setShowNewPassword(!showNewPassword),
                className: "absolute right-4 top-1/2 transform -translate-y-1/2 text-foreground/60 hover:text-foreground transition-colors duration-200",
                children: showNewPassword ? /* @__PURE__ */ jsx(Icons.eyeOff, { className: "w-5 h-5" }) : /* @__PURE__ */ jsx(Icons.eye, { className: "w-5 h-5" })
              }
            )
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-foreground/60 mt-sm", children: "Password must be at least 6 characters long" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-semibold text-foreground mb-sm", children: "Confirm New Password" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "password",
              value: passwordData.confirmPassword,
              onChange: (e) => handlePasswordChange("confirmPassword", e.target.value),
              className: "w-full container-px-lg container-py-lg border border-divider/50 rounded-2xl focus:ring-2 focus:ring-success focus:border-success text-base bg-content2/80 backdrop-blur-sm transition-all duration-300 hover:border-success/30 hover:shadow-lg hover:shadow-success/10",
              placeholder: "Confirm new password"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-lg pt-xl border-t border-divider/30", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: handleChangePassword,
              disabled: isLoading,
              className: "bg-primary text-primary-foreground container-px-lg container-py-md rounded-xl font-semibold text-sm transition-all duration-300 hover:bg-primary/90 hover:shadow-md hover:shadow-primary/20 disabled:opacity-50",
              children: [
                /* @__PURE__ */ jsx(Icons.key, { className: "w-4 h-4 mr-sm" }),
                isLoading ? "Changing..." : "Change Password"
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: cancelPasswordChange,
              className: "bg-content2 hover:bg-content3 text-foreground container-px-lg container-py-md rounded-xl font-semibold text-sm transition-all duration-300",
              children: "Cancel"
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-content1/90 backdrop-blur-2xl rounded-3xl border border-divider/50 container-px-2xl container-py-lg hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 group", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-lg", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-foreground mb-sm group-hover:text-primary transition-colors duration-300", children: "Account Information" }),
          /* @__PURE__ */ jsx("p", { className: "text-foreground/60", children: "View your account details" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200", children: /* @__PURE__ */ jsx(Icons.user, { className: "w-6 h-6 text-primary" }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-lg", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between container-p-lg bg-content2/50 rounded-2xl hover:bg-content2/70 transition-all duration-300 border border-divider/20 hover:border-primary/20", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-foreground", children: "User ID" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-foreground/60", children: "Unique identifier for your account" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-lg text-foreground/80 font-mono bg-content1/80 container-px-lg container-py-sm rounded-xl border border-divider/20", children: [
            (_c = user == null ? void 0 : user.id) == null ? void 0 : _c.slice(0, 8),
            "..."
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between container-p-lg bg-content2/50 rounded-2xl hover:bg-content2/70 transition-all duration-300 border border-divider/20 hover:border-primary/20", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-foreground", children: "Account Created" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-foreground/60", children: "When you joined Oentex" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "text-lg text-foreground/80 bg-content1/80 container-px-lg container-py-sm rounded-xl border border-divider/20", children: (user == null ? void 0 : user.created_at) ? new Date(user.created_at).toLocaleDateString() : "Unknown" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between container-p-lg bg-content2/50 rounded-2xl hover:bg-content2/70 transition-all duration-300 border border-divider/20 hover:border-primary/20", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-foreground", children: "Last Sign In" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-foreground/60", children: "Most recent authentication" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "text-lg text-foreground/80 bg-content1/80 container-px-lg container-py-sm rounded-xl border border-divider/20", children: (user == null ? void 0 : user.last_sign_in_at) ? new Date(user.last_sign_in_at).toLocaleDateString() : "Unknown" })
        ] })
      ] })
    ] })
  ] }) });
};
export {
  Profile as default
};
