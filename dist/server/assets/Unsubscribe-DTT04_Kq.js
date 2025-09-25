import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { s as supabase, I as Icons, b as showSuccessToast, a as showErrorToast } from "../entry-server.js";
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
const Unsubscribe = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [subscriber, setSubscriber] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [reason, setReason] = useState("1");
  useEffect(() => {
    if (!token) {
      setError("Invalid unsubscribe link - missing token");
      setLoading(false);
      return;
    }
    fetchSubscriber();
  }, [token]);
  const fetchSubscriber = async () => {
    try {
      console.log("🔍 Fetching subscriber for token:", token);
      const { data, error: error2 } = await supabase.from("email_subscribers").select("email, status, unsubscribe_token").eq("unsubscribe_token", token).single();
      console.log("📋 Database query result:", { data, error: error2, token });
      if (error2) {
        console.warn("⚠️ Error fetching subscriber (non-blocking):", error2);
        return;
      }
      if (!data) {
        console.warn("⚠️ No subscriber found for token (non-blocking):", token);
        return;
      }
      console.log("✅ Found subscriber:", data);
      setSubscriber(data);
      if (data.status === "unsubscribed") {
        console.log("ℹ️ Subscriber already unsubscribed");
        setSuccess(true);
      }
    } catch (err) {
      console.error("❌ Fetch error:", err);
      console.warn("⚠️ Non-fatal fetch error; proceeding without subscriber context");
    } finally {
      setLoading(false);
    }
  };
  const handleUnsubscribe = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      console.log("📧 Processing unsubscribe for token:", token, "reason:", reason);
      if ((subscriber == null ? void 0 : subscriber.status) === "unsubscribed") {
        setSuccess(true);
        showSuccessToast("Already unsubscribed");
        return;
      }
      console.log("🔄 Attempting edge function call...");
      try {
        const { data, error: error2 } = await supabase.functions.invoke("newsletter-unsubscribe", {
          body: {
            token,
            reason
          }
        });
        console.log("📨 Edge function response:", { data, error: error2 });
        if (error2) {
          console.error("Edge function error:", error2);
          throw new Error("Edge function failed");
        }
        if (data == null ? void 0 : data.success) {
          console.log("✅ Edge function unsubscribe successful");
          setSuccess(true);
          showSuccessToast("Successfully unsubscribed from newsletter");
          return;
        } else {
          throw new Error((data == null ? void 0 : data.error) || "Edge function returned unsuccessful");
        }
      } catch (edgeFunctionError) {
        console.warn("⚠️ Edge function failed, trying direct database update:", edgeFunctionError);
        console.log("🔄 Attempting direct database update...");
        const { data: tokenCheck, error: tokenError } = await supabase.from("email_subscribers").select("id, email, status, unsubscribe_token").eq("unsubscribe_token", token);
        console.log("🔍 Token verification:", { token, tokenCheck, tokenError });
        if (!tokenCheck || tokenCheck.length === 0) {
          throw new Error(`No subscriber found with unsubscribe_token: ${token}`);
        }
        const subscriberRecord = tokenCheck[0];
        console.log("📋 Record to update:", subscriberRecord);
        const { data: updateByIdResult, error: updateByIdError } = await supabase.from("email_subscribers").update({
          status: "unsubscribed",
          unsubscribed_at: (/* @__PURE__ */ new Date()).toISOString(),
          unsubscribe_reason: reason,
          updated_at: (/* @__PURE__ */ new Date()).toISOString()
        }).eq("id", subscriberRecord.id).select();
        console.log("📝 Update by ID result:", { updateByIdResult, updateByIdError });
        if (updateByIdError) {
          console.error("❌ Database update by ID error:", updateByIdError);
          throw updateByIdError;
        }
        if (!updateByIdResult || updateByIdResult.length === 0) {
          console.error("❌ No records were updated by ID. This suggests RLS/permissions issue");
          throw new Error("Update blocked - likely Row Level Security or permissions issue");
        }
        console.log("✅ Direct database update successful - Updated records:", updateByIdResult.length);
        setSuccess(true);
        showSuccessToast("Successfully unsubscribed from newsletter");
      }
    } catch (err) {
      console.error("❌ Complete unsubscribe failure:", err);
      setError("Failed to unsubscribe. Please try again.");
      showErrorToast("Failed to unsubscribe. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "bg-content1 rounded-2xl container-p-2xl shadow-lg max-w-md w-full container-p-md", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" }),
      /* @__PURE__ */ jsx("p", { className: "mt-6 text-foreground/70", children: "Loading unsubscribe page..." })
    ] }) }) });
  }
  if (error) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "bg-content1 rounded-2xl container-p-2xl shadow-lg max-w-md w-full container-p-md", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx(Icons.warning, { className: "w-16 h-16 text-red-500 mx-auto mb-6" }),
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-foreground mb-6", children: "Error" }),
      /* @__PURE__ */ jsx("div", { className: "bg-red-50 border border-red-200 rounded-lg container-p-md mb-8", children: /* @__PURE__ */ jsx("p", { className: "text-red-700 font-medium", children: error }) }),
      /* @__PURE__ */ jsx("p", { className: "text-foreground/70 mb-8", children: "Please contact our support team if you continue to experience issues." }),
      /* @__PURE__ */ jsxs(
        Link,
        {
          to: "/",
          className: "inline-flex items-center gap-2 bg-primary text-white container-px-lg container-py-sm rounded-lg font-medium hover:bg-primary/90 transition-colors",
          children: [
            /* @__PURE__ */ jsx(Icons.arrowLeft, { className: "w-4 h-4" }),
            "Return to Oentex"
          ]
        }
      )
    ] }) }) });
  }
  if (success) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "bg-content1 rounded-2xl container-p-2xl shadow-lg max-w-md w-full container-p-md", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx(Icons.success, { className: "w-16 h-16 text-green-500 mx-auto mb-6" }),
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-foreground mb-6", children: "Successfully Unsubscribed" }),
      /* @__PURE__ */ jsx("div", { className: "bg-green-50 border border-green-200 rounded-lg container-p-md mb-8", children: /* @__PURE__ */ jsx("p", { className: "text-green-700 font-medium", children: "You have been removed from our newsletter list" }) }),
      /* @__PURE__ */ jsx("p", { className: "text-foreground/70 mb-6", children: "We're sorry to see you go! If you change your mind, you can always resubscribe on our website." }),
      /* @__PURE__ */ jsxs("p", { className: "text-sm text-foreground/70 mb-8", children: [
        /* @__PURE__ */ jsx("strong", { children: "Email:" }),
        " ",
        subscriber == null ? void 0 : subscriber.email
      ] }),
      /* @__PURE__ */ jsxs(
        Link,
        {
          to: "/",
          className: "inline-flex items-center gap-2 bg-primary text-white container-px-lg container-py-sm rounded-lg font-medium hover:bg-primary/90 transition-colors",
          children: [
            /* @__PURE__ */ jsx(Icons.arrowLeft, { className: "w-4 h-4" }),
            "Return to Oentex"
          ]
        }
      )
    ] }) }) });
  }
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 flex items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "bg-content1 rounded-2xl container-p-2xl shadow-lg max-w-md w-full container-p-md", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center mb-8", children: [
      /* @__PURE__ */ jsx(Icons.mail, { className: "w-16 h-16 text-primary mx-auto mb-6" }),
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-foreground mb-3", children: "Unsubscribe from Newsletter" }),
      /* @__PURE__ */ jsx("p", { className: "text-foreground/70", children: "We're sorry to see you go!" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "bg-content2 rounded-lg container-p-md mb-8", children: /* @__PURE__ */ jsxs("p", { className: "text-sm text-foreground/70", children: [
      /* @__PURE__ */ jsx("strong", { children: "Email:" }),
      " ",
      subscriber == null ? void 0 : subscriber.email
    ] }) }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleUnsubscribe, className: "space-y-8", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "reason", className: "block text-sm font-medium text-foreground mb-3", children: "Why are you unsubscribing? (Optional)" }),
        /* @__PURE__ */ jsxs(
          "select",
          {
            id: "reason",
            value: reason,
            onChange: (e) => setReason(e.target.value),
            className: "w-full container-px-md container-py-sm border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all",
            children: [
              /* @__PURE__ */ jsx("option", { value: "1", children: "Too many emails" }),
              /* @__PURE__ */ jsx("option", { value: "2", children: "Content not relevant" }),
              /* @__PURE__ */ jsx("option", { value: "3", children: "Never signed up" }),
              /* @__PURE__ */ jsx("option", { value: "4", children: "Received spam" }),
              /* @__PURE__ */ jsx("option", { value: "5", children: "Other reason" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "submit",
          disabled: submitting,
          className: "w-full bg-red-500 text-white container-py-sm container-px-lg rounded-lg font-medium hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2",
          children: submitting ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-4 w-4 border-b-2 border-white" }),
            "Processing..."
          ] }) : /* @__PURE__ */ jsx(Fragment, { children: "🗑️ Unsubscribe Me" })
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "text-center mt-8", children: /* @__PURE__ */ jsxs(
      Link,
      {
        to: "/",
        className: "text-primary hover:text-primary/80 font-medium transition-colors inline-flex items-center gap-1",
        children: [
          /* @__PURE__ */ jsx(Icons.arrowLeft, { className: "w-4 h-4" }),
          "Return to Oentex"
        ]
      }
    ) })
  ] }) });
};
export {
  Unsubscribe as default
};
