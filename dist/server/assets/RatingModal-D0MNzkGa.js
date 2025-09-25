import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { u as useAuth, I as Icons, a as showErrorToast } from "../entry-server.js";
import { d as useSubmitRatingMutation, R as RATING_CATEGORIES } from "./useDealsQuery-CZaqgNr5.js";
const RatingModal = ({
  isOpen,
  onClose,
  companyId,
  companyName,
  existingRating,
  onRatingSubmitted,
  companyRating
}) => {
  const { user } = useAuth();
  const submitRatingMutation = useSubmitRatingMutation();
  const [ratings, setRatings] = useState({
    mode: "overall",
    overall_rating: 0,
    platform_usability: 0,
    customer_support: 0,
    fees_commissions: 0,
    security_trust: 0,
    educational_resources: 0,
    mobile_app: 0
  });
  useEffect(() => {
    if (existingRating) {
      const mode = existingRating.overall_rating ? "overall" : "categories";
      setRatings({
        mode,
        overall_rating: existingRating.overall_rating || 0,
        platform_usability: existingRating.platform_usability || 0,
        customer_support: existingRating.customer_support || 0,
        fees_commissions: existingRating.fees_commissions || 0,
        security_trust: existingRating.security_trust || 0,
        educational_resources: existingRating.educational_resources || 0,
        mobile_app: existingRating.mobile_app || 0
      });
    }
  }, [existingRating]);
  const handleSubmit = async () => {
    if (!user) {
      showErrorToast("Please sign in to submit a rating");
      return;
    }
    try {
      const ratingData = {};
      if (ratings.mode === "overall") {
        if (ratings.overall_rating === 0) {
          showErrorToast("Please select an overall rating");
          return;
        }
        ratingData.overall_rating = ratings.overall_rating;
      } else {
        if (ratings.platform_usability > 0) ratingData.platform_usability = ratings.platform_usability;
        if (ratings.customer_support > 0) ratingData.customer_support = ratings.customer_support;
        if (ratings.fees_commissions > 0) ratingData.fees_commissions = ratings.fees_commissions;
        if (ratings.security_trust > 0) ratingData.security_trust = ratings.security_trust;
        if (ratings.educational_resources > 0) ratingData.educational_resources = ratings.educational_resources;
        if (ratings.mobile_app > 0) ratingData.mobile_app = ratings.mobile_app;
        const hasAnyRating = Object.values(ratingData).some((rating) => rating && rating > 0);
        if (!hasAnyRating) {
          showErrorToast("Please rate at least one category");
          return;
        }
      }
      console.log("📊 Modern rating submission via mutation hook...");
      await submitRatingMutation.mutateAsync({
        userId: user.id,
        companyId,
        ratings: ratingData,
        existingRating
      });
      onClose();
      onRatingSubmitted == null ? void 0 : onRatingSubmitted();
      console.log("✅ Modern rating submission completed successfully");
    } catch (error) {
      console.error("❌ Modern rating submission failed:", error);
    }
  };
  const StarRating = ({ rating, onRatingChange, label }) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between container-py-md", children: [
    /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-foreground", children: label }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-xs", children: [
      [1, 2, 3, 4, 5].map((star) => /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => onRatingChange(star),
          className: "container-p-xs hover:scale-110 transition-transform rounded-sm focus:outline-none focus:ring-2 focus:ring-primary/40",
          disabled: submitRatingMutation.isPending,
          children: /* @__PURE__ */ jsx(
            Icons.star,
            {
              className: `w-6 h-6 transition-colors ${star <= rating ? "fill-warning text-warning" : "text-content3 hover:text-warning"}`
            }
          )
        },
        star
      )),
      /* @__PURE__ */ jsx("span", { className: "ml-sm text-sm text-foreground/60 min-w-[3ch]", children: rating > 0 ? rating.toFixed(1) : "" })
    ] })
  ] });
  if (!isOpen) return null;
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 container-p-lg", children: /* @__PURE__ */ jsxs("div", { className: "bg-content1/90 backdrop-blur-xl rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto border border-divider/30 shadow-2xl", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between container-p-2xl border-b border-divider/30", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("h2", { className: "text-xl font-bold text-foreground", children: [
          "Rate ",
          companyName
        ] }),
        companyRating && /* @__PURE__ */ jsxs("p", { className: "text-sm text-foreground/60 mt-xs", children: [
          "Current: ",
          companyRating.averageRating.toFixed(1),
          "⭐ (",
          companyRating.totalRatings,
          " reviews)"
        ] })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: onClose,
          className: "container-p-sm hover:bg-content2 rounded-lg transition-colors",
          disabled: submitRatingMutation.isPending,
          children: /* @__PURE__ */ jsx(Icons.close, { className: "w-5 h-5" })
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "container-p-2xl border-b border-divider/30", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-sm", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => setRatings((prev) => ({ ...prev, mode: "overall" })),
          className: `container-px-lg container-py-sm rounded-xl text-sm font-medium transition-colors ${ratings.mode === "overall" ? "bg-primary text-white" : "bg-content2 text-foreground/70 hover:bg-primary/10"}`,
          disabled: submitRatingMutation.isPending,
          children: "Overall Rating"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => setRatings((prev) => ({ ...prev, mode: "categories" })),
          className: `container-px-lg container-py-sm rounded-xl text-sm font-medium transition-colors ${ratings.mode === "categories" ? "bg-primary text-white" : "bg-content2 text-foreground/70 hover:bg-primary/10"}`,
          disabled: submitRatingMutation.isPending,
          children: "Detailed Rating"
        }
      )
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "container-p-2xl", children: ratings.mode === "overall" ? /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs("p", { className: "text-sm text-foreground/60 mb-lg", children: [
        "Rate your overall experience with ",
        companyName
      ] }),
      /* @__PURE__ */ jsx(
        StarRating,
        {
          rating: ratings.overall_rating,
          onRatingChange: (rating) => setRatings((prev) => ({ ...prev, overall_rating: rating })),
          label: "Overall Experience"
        }
      )
    ] }) : /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs("p", { className: "text-sm text-foreground/60 mb-lg", children: [
        "Rate different aspects of ",
        companyName,
        " (optional categories)"
      ] }),
      /* @__PURE__ */ jsx("div", { className: "space-y-xs", children: RATING_CATEGORIES.map((category) => /* @__PURE__ */ jsx(
        StarRating,
        {
          rating: ratings[category.key],
          onRatingChange: (rating) => setRatings((prev) => ({ ...prev, [category.key]: rating })),
          label: category.label
        },
        category.key
      )) })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-md container-p-2xl border-t border-divider/30", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: onClose,
          className: "flex-1 container-px-lg container-py-md border border-divider rounded-xl text-foreground/70 hover:bg-content2 transition-colors",
          disabled: submitRatingMutation.isPending,
          children: "Cancel"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: handleSubmit,
          disabled: submitRatingMutation.isPending,
          className: "flex-1 container-px-lg container-py-md bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-sm",
          children: submitRatingMutation.isPending ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(Icons.refresh, { className: "w-4 h-4 animate-spin" }),
            "Submitting..."
          ] }) : "Submit Rating"
        }
      )
    ] })
  ] }) });
};
export {
  RatingModal as R
};
