import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { I as Icons } from "../entry-server.js";
import { S as SEO, s as seoData } from "./seoData-LGOe0Do4.js";
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
const Terms = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const sections = [
    {
      id: "overview",
      title: "Terms of Service Overview",
      icon: /* @__PURE__ */ jsx(Icons.document, { className: "w-6 h-6" }),
      content: /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsx("p", { className: "text-foreground/70 leading-relaxed text-lg", children: 'Welcome to Oentex, operated by RateWise LLC ("we," "us," or "our"). These Terms of Service ("Terms") govern your use of our affiliate rating platform and services. By accessing or using our platform, you agree to be bound by these Terms.' }),
        /* @__PURE__ */ jsx("p", { className: "text-foreground/70 leading-relaxed text-lg", children: "These Terms apply to all users of our platform, including visitors, registered users, and anyone who submits reviews, ratings, or other content." }),
        /* @__PURE__ */ jsx("div", { className: "bg-primary/10 border border-primary/20 rounded-2xl p-6", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start space-x-4", children: [
          /* @__PURE__ */ jsx(Icons.shield, { className: "w-6 h-6 text-primary mt-1 flex-shrink-0" }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "font-semibold text-foreground mb-3 text-lg", children: "Important Notice" }),
            /* @__PURE__ */ jsx("p", { className: "text-foreground/70 text-base", children: "Please read these Terms carefully. If you do not agree to these Terms, please do not use our platform. We may update these Terms from time to time, and your continued use constitutes acceptance of any changes." })
          ] })
        ] }) })
      ] })
    },
    {
      id: "definitions",
      title: "Definitions and Interpretation",
      icon: /* @__PURE__ */ jsx(Icons.book, { className: "w-6 h-6" }),
      content: /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsx("p", { className: "text-foreground/70 leading-relaxed text-lg", children: "For the purposes of these Terms, the following definitions apply:" }),
        /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-content1/50 border border-divider/30 rounded-2xl p-6", children: [
            /* @__PURE__ */ jsx("h4", { className: "font-semibold text-foreground mb-4 text-lg", children: "Key Terms" }),
            /* @__PURE__ */ jsxs("dl", { className: "space-y-3 text-foreground/70 text-base", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("dt", { className: "font-medium text-foreground", children: '"Platform"' }),
                /* @__PURE__ */ jsx("dd", { children: "Our website, mobile applications, and all related services" })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("dt", { className: "font-medium text-foreground", children: '"User"' }),
                /* @__PURE__ */ jsx("dd", { children: "Any person who accesses or uses our platform" })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("dt", { className: "font-medium text-foreground", children: '"Content"' }),
                /* @__PURE__ */ jsx("dd", { children: "All information, data, text, reviews, and materials on our platform" })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("dt", { className: "font-medium text-foreground", children: '"Services"' }),
                /* @__PURE__ */ jsx("dd", { children: "All features, functionality, and services provided through our platform" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-content1/50 border border-divider/30 rounded-2xl p-6", children: [
            /* @__PURE__ */ jsx("h4", { className: "font-semibold text-foreground mb-4 text-lg", children: "Legal Terms" }),
            /* @__PURE__ */ jsxs("dl", { className: "space-y-3 text-foreground/70 text-base", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("dt", { className: "font-medium text-foreground", children: '"Affiliate"' }),
                /* @__PURE__ */ jsx("dd", { children: "Third-party trading platforms and financial service providers" })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("dt", { className: "font-medium text-foreground", children: '"Commission"' }),
                /* @__PURE__ */ jsx("dd", { children: "Fees we may receive from affiliate partners" })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("dt", { className: "font-medium text-foreground", children: '"Intellectual Property"' }),
                /* @__PURE__ */ jsx("dd", { children: "All trademarks, copyrights, and proprietary rights" })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("dt", { className: "font-medium text-foreground", children: '"Personal Data"' }),
                /* @__PURE__ */ jsx("dd", { children: "Information that identifies or relates to an individual" })
              ] })
            ] })
          ] })
        ] })
      ] })
    },
    {
      id: "governing-law",
      title: "Governing Law and Jurisdiction",
      icon: /* @__PURE__ */ jsx(Icons.scale, { className: "w-6 h-6" }),
      content: /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsx("div", { className: "bg-warning/10 border border-warning/20 rounded-2xl p-6", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start space-x-4", children: [
          /* @__PURE__ */ jsx(Icons.warning, { className: "w-6 h-6 text-warning mt-1 flex-shrink-0" }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "font-semibold text-foreground mb-3 text-lg", children: "Legal Jurisdiction" }),
            /* @__PURE__ */ jsx("p", { className: "text-foreground/70 text-base", children: "These Terms are governed by and construed in accordance with the laws of the State of California, United States, without regard to conflict of law principles." })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-content1/50 border border-divider/30 rounded-2xl p-6", children: [
            /* @__PURE__ */ jsx("h4", { className: "font-semibold text-foreground mb-4 text-lg", children: "Dispute Resolution" }),
            /* @__PURE__ */ jsxs("ul", { className: "text-foreground/70 space-y-2 text-base", children: [
              /* @__PURE__ */ jsx("li", { children: "• Disputes subject to binding arbitration" }),
              /* @__PURE__ */ jsx("li", { children: "• Arbitration conducted in San Francisco, CA" }),
              /* @__PURE__ */ jsx("li", { children: "• Individual claims only (no class actions)" }),
              /* @__PURE__ */ jsx("li", { children: "• 30-day notice period before arbitration" }),
              /* @__PURE__ */ jsx("li", { children: "• Right to opt-out within 30 days of agreement" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-content1/50 border border-divider/30 rounded-2xl p-6", children: [
            /* @__PURE__ */ jsx("h4", { className: "font-semibold text-foreground mb-4 text-lg", children: "Legal Rights" }),
            /* @__PURE__ */ jsxs("ul", { className: "text-foreground/70 space-y-2 text-base", children: [
              /* @__PURE__ */ jsx("li", { children: "• Right to legal representation" }),
              /* @__PURE__ */ jsx("li", { children: "• Right to discovery process" }),
              /* @__PURE__ */ jsx("li", { children: "• Right to appeal arbitration decisions" }),
              /* @__PURE__ */ jsx("li", { children: "• Right to small claims court (under $10,000)" }),
              /* @__PURE__ */ jsx("li", { children: "• Right to injunctive relief" })
            ] })
          ] })
        ] })
      ] })
    },
    {
      id: "acceptance",
      title: "Acceptance of Terms",
      icon: /* @__PURE__ */ jsx(Icons.check, { className: "w-6 h-6" }),
      content: /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsx("p", { className: "text-foreground/70 leading-relaxed text-lg", children: "By accessing, browsing, or using our platform, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy." }),
        /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-success/10 border border-success/20 rounded-2xl p-6", children: [
            /* @__PURE__ */ jsxs("h4", { className: "font-semibold text-foreground mb-3 flex items-center", children: [
              /* @__PURE__ */ jsx(Icons.check, { className: "w-5 h-5 text-success mr-2" }),
              "What You Agree To"
            ] }),
            /* @__PURE__ */ jsxs("ul", { className: "text-foreground/70 space-y-2 text-base", children: [
              /* @__PURE__ */ jsx("li", { children: "• Comply with all applicable laws and regulations" }),
              /* @__PURE__ */ jsx("li", { children: "• Provide accurate and truthful information" }),
              /* @__PURE__ */ jsx("li", { children: "• Respect other users and their content" }),
              /* @__PURE__ */ jsx("li", { children: "• Use the platform for lawful purposes only" }),
              /* @__PURE__ */ jsx("li", { children: "• Maintain the security of your account" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-warning/10 border border-warning/20 rounded-2xl p-6", children: [
            /* @__PURE__ */ jsxs("h4", { className: "font-semibold text-foreground mb-3 flex items-center", children: [
              /* @__PURE__ */ jsx(Icons.warning, { className: "w-5 h-5 text-warning mr-2" }),
              "What You Cannot Do"
            ] }),
            /* @__PURE__ */ jsxs("ul", { className: "text-foreground/70 space-y-2 text-base", children: [
              /* @__PURE__ */ jsx("li", { children: "• Violate any laws or regulations" }),
              /* @__PURE__ */ jsx("li", { children: "• Post false, misleading, or harmful content" }),
              /* @__PURE__ */ jsx("li", { children: "• Infringe on intellectual property rights" }),
              /* @__PURE__ */ jsx("li", { children: "• Attempt to gain unauthorized access" }),
              /* @__PURE__ */ jsx("li", { children: "• Interfere with platform operations" })
            ] })
          ] })
        ] })
      ] })
    },
    {
      id: "account-security",
      title: "Account Security",
      icon: /* @__PURE__ */ jsx(Icons.lock, { className: "w-6 h-6" }),
      content: /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsx("p", { className: "text-foreground/70 leading-relaxed text-lg", children: "You are responsible for maintaining the security of your account and all activities that occur under your account. We strongly recommend implementing additional security measures." }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-primary/10 border border-primary/20 rounded-2xl p-6", children: [
            /* @__PURE__ */ jsx("h4", { className: "font-semibold text-foreground mb-4 text-lg", children: "Security Requirements" }),
            /* @__PURE__ */ jsxs("ul", { className: "text-foreground/70 space-y-3 text-base", children: [
              /* @__PURE__ */ jsxs("li", { className: "flex items-start space-x-3", children: [
                /* @__PURE__ */ jsx(Icons.check, { className: "w-5 h-5 text-primary mt-1 flex-shrink-0" }),
                /* @__PURE__ */ jsx("span", { children: "Two-factor authentication strongly recommended for all accounts" })
              ] }),
              /* @__PURE__ */ jsxs("li", { className: "flex items-start space-x-3", children: [
                /* @__PURE__ */ jsx(Icons.check, { className: "w-5 h-5 text-primary mt-1 flex-shrink-0" }),
                /* @__PURE__ */ jsx("span", { children: "Users are responsible for maintaining account security and password strength" })
              ] }),
              /* @__PURE__ */ jsxs("li", { className: "flex items-start space-x-3", children: [
                /* @__PURE__ */ jsx(Icons.check, { className: "w-5 h-5 text-primary mt-1 flex-shrink-0" }),
                /* @__PURE__ */ jsx("span", { children: "Regular security updates and notifications will be provided" })
              ] }),
              /* @__PURE__ */ jsxs("li", { className: "flex items-start space-x-3", children: [
                /* @__PURE__ */ jsx(Icons.check, { className: "w-5 h-5 text-primary mt-1 flex-shrink-0" }),
                /* @__PURE__ */ jsx("span", { children: "Suspicious activity monitoring is in place to protect users" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "bg-warning/10 border border-warning/20 rounded-2xl p-6", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start space-x-4", children: [
            /* @__PURE__ */ jsx(Icons.warning, { className: "w-6 h-6 text-warning mt-1 flex-shrink-0" }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h4", { className: "font-semibold text-foreground mb-2 text-lg", children: "Important Security Notice" }),
              /* @__PURE__ */ jsx("p", { className: "text-foreground/70 text-base", children: "If you suspect unauthorized access to your account, immediately change your password and contact our support team. We are not responsible for losses due to compromised accounts." })
            ] })
          ] }) })
        ] })
      ] })
    },
    {
      id: "technical-requirements",
      title: "Technical Requirements",
      icon: /* @__PURE__ */ jsx(Icons.settings, { className: "w-6 h-6" }),
      content: /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsx("p", { className: "text-foreground/70 leading-relaxed text-lg", children: "To use our platform effectively, you need to meet certain technical requirements and use compatible devices and software." }),
        /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-surface/30 border border-border rounded-2xl p-6", children: [
            /* @__PURE__ */ jsxs("h4", { className: "font-semibold text-foreground mb-4 text-lg flex items-center", children: [
              /* @__PURE__ */ jsx(Icons.desktop, { className: "w-5 h-5 text-primary mr-2" }),
              "System Requirements"
            ] }),
            /* @__PURE__ */ jsxs("ul", { className: "text-foreground/70 space-y-2 text-base", children: [
              /* @__PURE__ */ jsx("li", { children: "• Modern web browser (Chrome, Firefox, Safari, Edge)" }),
              /* @__PURE__ */ jsx("li", { children: "• Mobile app available for iOS and Android" }),
              /* @__PURE__ */ jsx("li", { children: "• Stable internet connection required" }),
              /* @__PURE__ */ jsx("li", { children: "• JavaScript enabled in browser" }),
              /* @__PURE__ */ jsx("li", { children: "• Cookies enabled for functionality" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-surface/30 border border-border rounded-2xl p-6", children: [
            /* @__PURE__ */ jsxs("h4", { className: "font-semibold text-foreground mb-4 text-lg flex items-center", children: [
              /* @__PURE__ */ jsx(Icons.wifi, { className: "w-5 h-5 text-secondary mr-2" }),
              "Performance"
            ] }),
            /* @__PURE__ */ jsxs("ul", { className: "text-foreground/70 space-y-2 text-base", children: [
              /* @__PURE__ */ jsx("li", { children: "• Minimum 2GB RAM recommended" }),
              /* @__PURE__ */ jsx("li", { children: "• 4G/WiFi connection for optimal experience" }),
              /* @__PURE__ */ jsx("li", { children: "• Regular browser updates recommended" }),
              /* @__PURE__ */ jsx("li", { children: "• Ad blockers may affect functionality" }),
              /* @__PURE__ */ jsx("li", { children: "• VPN usage may impact performance" })
            ] })
          ] })
        ] })
      ] })
    },
    {
      id: "trading-guidelines",
      title: "Trading Guidelines and Risk Warnings",
      icon: /* @__PURE__ */ jsx(Icons.chart, { className: "w-6 h-6" }),
      content: /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsx("div", { className: "bg-danger/10 border border-danger/20 rounded-2xl p-6", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start space-x-4", children: [
          /* @__PURE__ */ jsx(Icons.warning, { className: "w-6 h-6 text-danger mt-1 flex-shrink-0" }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "font-semibold text-foreground mb-3 text-lg", children: "Important Risk Warning" }),
            /* @__PURE__ */ jsx("p", { className: "text-foreground/70 text-base mb-4", children: "Trading and investing involve significant risk. You should only trade with funds you can afford to lose. Past performance does not guarantee future results." }),
            /* @__PURE__ */ jsxs("ul", { className: "text-foreground/70 space-y-2 text-base", children: [
              /* @__PURE__ */ jsx("li", { children: "• Educational resources are strongly recommended for beginners" }),
              /* @__PURE__ */ jsx("li", { children: "• Start with small amounts and gradually increase as you gain experience" }),
              /* @__PURE__ */ jsx("li", { children: "• Never invest more than you can afford to lose" }),
              /* @__PURE__ */ jsx("li", { children: "• Consider seeking professional financial advice" })
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-primary/10 border border-primary/20 rounded-2xl p-6", children: [
            /* @__PURE__ */ jsx("h4", { className: "font-semibold text-foreground mb-4 text-lg", children: "Best Practices" }),
            /* @__PURE__ */ jsxs("ul", { className: "text-foreground/70 space-y-2 text-base", children: [
              /* @__PURE__ */ jsx("li", { children: "• Research thoroughly before making decisions" }),
              /* @__PURE__ */ jsx("li", { children: "• Diversify your investments" }),
              /* @__PURE__ */ jsx("li", { children: "• Keep detailed records of your trades" }),
              /* @__PURE__ */ jsx("li", { children: "• Stay informed about market conditions" }),
              /* @__PURE__ */ jsx("li", { children: "• Use stop-loss orders when appropriate" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-secondary/10 border border-secondary/20 rounded-2xl p-6", children: [
            /* @__PURE__ */ jsx("h4", { className: "font-semibold text-foreground mb-4 text-lg", children: "Platform Guidelines" }),
            /* @__PURE__ */ jsxs("ul", { className: "text-foreground/70 space-y-2 text-base", children: [
              /* @__PURE__ */ jsx("li", { children: "• Reviews must be based on personal experience" }),
              /* @__PURE__ */ jsx("li", { children: "• Provide constructive and helpful feedback" }),
              /* @__PURE__ */ jsx("li", { children: "• Respect other users' opinions" }),
              /* @__PURE__ */ jsx("li", { children: "• Report suspicious or inappropriate content" }),
              /* @__PURE__ */ jsx("li", { children: "• Follow community guidelines at all times" })
            ] })
          ] })
        ] })
      ] })
    },
    {
      id: "content-policy",
      title: "Content Policy and User-Generated Content",
      icon: /* @__PURE__ */ jsx(Icons.document, { className: "w-6 h-6" }),
      content: /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsx("p", { className: "text-foreground/70 leading-relaxed text-lg", children: "Our platform allows users to submit reviews, ratings, comments, and other content. By submitting content, you grant us certain rights and agree to follow our content policies." }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-success/10 border border-success/20 rounded-2xl p-6", children: [
            /* @__PURE__ */ jsx("h4", { className: "font-semibold text-foreground mb-4 text-lg", children: "Content Guidelines" }),
            /* @__PURE__ */ jsxs("ul", { className: "text-foreground/70 space-y-3 text-base", children: [
              /* @__PURE__ */ jsxs("li", { className: "flex items-start space-x-3", children: [
                /* @__PURE__ */ jsx(Icons.check, { className: "w-5 h-5 text-success mt-1 flex-shrink-0" }),
                /* @__PURE__ */ jsx("span", { children: "Content must be accurate, truthful, and based on personal experience" })
              ] }),
              /* @__PURE__ */ jsxs("li", { className: "flex items-start space-x-3", children: [
                /* @__PURE__ */ jsx(Icons.check, { className: "w-5 h-5 text-success mt-1 flex-shrink-0" }),
                /* @__PURE__ */ jsx("span", { children: "Reviews should be constructive and helpful to other users" })
              ] }),
              /* @__PURE__ */ jsxs("li", { className: "flex items-start space-x-3", children: [
                /* @__PURE__ */ jsx(Icons.check, { className: "w-5 h-5 text-success mt-1 flex-shrink-0" }),
                /* @__PURE__ */ jsx("span", { children: "Respect intellectual property rights of others" })
              ] }),
              /* @__PURE__ */ jsxs("li", { className: "flex items-start space-x-3", children: [
                /* @__PURE__ */ jsx(Icons.check, { className: "w-5 h-5 text-success mt-1 flex-shrink-0" }),
                /* @__PURE__ */ jsx("span", { children: "Follow community standards and be respectful" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-warning/10 border border-warning/20 rounded-2xl p-6", children: [
            /* @__PURE__ */ jsx("h4", { className: "font-semibold text-foreground mb-4 text-lg", children: "Prohibited Content" }),
            /* @__PURE__ */ jsxs("ul", { className: "text-foreground/70 space-y-2 text-base", children: [
              /* @__PURE__ */ jsx("li", { children: "• False, misleading, or fraudulent information" }),
              /* @__PURE__ */ jsx("li", { children: "• Spam, promotional content, or affiliate links" }),
              /* @__PURE__ */ jsx("li", { children: "• Harassment, abuse, or threatening language" }),
              /* @__PURE__ */ jsx("li", { children: "• Copyrighted material without permission" }),
              /* @__PURE__ */ jsx("li", { children: "• Content that violates laws or regulations" })
            ] })
          ] })
        ] })
      ] })
    },
    {
      id: "affiliate-disclosure",
      title: "Affiliate Disclosure and Commissions",
      icon: /* @__PURE__ */ jsx(Icons.dollar, { className: "w-6 h-6" }),
      content: /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsx("p", { className: "text-foreground/70 leading-relaxed text-lg", children: "Oentex operates as an affiliate platform. We may receive commissions when users make purchases through our affiliate links. This section explains our affiliate relationships and policies." }),
        /* @__PURE__ */ jsxs("div", { className: "bg-primary/10 border border-primary/20 rounded-2xl p-6", children: [
          /* @__PURE__ */ jsx("h4", { className: "font-semibold text-foreground mb-4 text-lg", children: "Transparency Commitment" }),
          /* @__PURE__ */ jsx("p", { className: "text-foreground/70 text-base mb-4", children: "We are committed to transparency in our affiliate relationships. All affiliate links are clearly marked, and we only recommend products and services we believe provide value to our users." }),
          /* @__PURE__ */ jsxs("ul", { className: "text-foreground/70 space-y-2 text-base", children: [
            /* @__PURE__ */ jsx("li", { children: "• Affiliate links are clearly identified and marked" }),
            /* @__PURE__ */ jsx("li", { children: "• Commissions do not influence our editorial content" }),
            /* @__PURE__ */ jsx("li", { children: "• We maintain editorial independence in our reviews" }),
            /* @__PURE__ */ jsx("li", { children: "• Users are not obligated to use our affiliate links" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-surface/30 border border-border rounded-2xl p-6", children: [
            /* @__PURE__ */ jsx("h4", { className: "font-semibold text-foreground mb-4 text-lg", children: "How It Works" }),
            /* @__PURE__ */ jsxs("ul", { className: "text-foreground/70 space-y-2 text-base", children: [
              /* @__PURE__ */ jsx("li", { children: "• We partner with reputable trading platforms" }),
              /* @__PURE__ */ jsx("li", { children: "• Users can access exclusive offers and bonuses" }),
              /* @__PURE__ */ jsx("li", { children: "• We track referrals through secure systems" }),
              /* @__PURE__ */ jsx("li", { children: "• Commissions help support our platform" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-surface/30 border border-border rounded-2xl p-6", children: [
            /* @__PURE__ */ jsx("h4", { className: "font-semibold text-foreground mb-4 text-lg", children: "User Benefits" }),
            /* @__PURE__ */ jsxs("ul", { className: "text-foreground/70 space-y-2 text-base", children: [
              /* @__PURE__ */ jsx("li", { children: "• Access to exclusive promotions" }),
              /* @__PURE__ */ jsx("li", { children: "• Free account upgrades and bonuses" }),
              /* @__PURE__ */ jsx("li", { children: "• Lower fees and better rates" }),
              /* @__PURE__ */ jsx("li", { children: "• Priority customer support" })
            ] })
          ] })
        ] })
      ] })
    },
    {
      id: "limitation-liability",
      title: "Limitation of Liability and Disclaimers",
      icon: /* @__PURE__ */ jsx(Icons.shield, { className: "w-6 h-6" }),
      content: /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsx("div", { className: "bg-warning/10 border border-warning/20 rounded-2xl p-6", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start space-x-4", children: [
          /* @__PURE__ */ jsx(Icons.warning, { className: "w-6 h-6 text-warning mt-1 flex-shrink-0" }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "font-semibold text-foreground mb-3 text-lg", children: "Important Legal Notice" }),
            /* @__PURE__ */ jsx("p", { className: "text-foreground/70 text-base", children: 'Our platform is provided "as is" without warranties of any kind. We are not responsible for any losses, damages, or consequences resulting from your use of our platform or any third-party services.' })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h4", { className: "font-semibold text-foreground mb-4 text-lg", children: "Limitations" }),
            /* @__PURE__ */ jsxs("ul", { className: "text-foreground/70 space-y-3 text-base", children: [
              /* @__PURE__ */ jsx("li", { children: "• We do not guarantee the accuracy of user-generated content" }),
              /* @__PURE__ */ jsx("li", { children: "• We are not responsible for third-party platform performance" }),
              /* @__PURE__ */ jsx("li", { children: "• Trading decisions and their consequences are your responsibility" }),
              /* @__PURE__ */ jsx("li", { children: "• We do not provide financial or investment advice" }),
              /* @__PURE__ */ jsx("li", { children: "• Platform availability is not guaranteed 100% of the time" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h4", { className: "font-semibold text-foreground mb-4 text-lg", children: "Disclaimers" }),
            /* @__PURE__ */ jsxs("ul", { className: "text-foreground/70 space-y-3 text-base", children: [
              /* @__PURE__ */ jsx("li", { children: "• Information is for educational purposes only" }),
              /* @__PURE__ */ jsx("li", { children: "• Past performance does not guarantee future results" }),
              /* @__PURE__ */ jsx("li", { children: "• Market conditions can change rapidly" }),
              /* @__PURE__ */ jsx("li", { children: "• Always conduct your own research" }),
              /* @__PURE__ */ jsx("li", { children: "• Consider consulting with financial professionals" })
            ] })
          ] })
        ] })
      ] })
    },
    {
      id: "contact-support",
      title: "Contact Information and Support",
      icon: /* @__PURE__ */ jsx(Icons.mail, { className: "w-6 h-6" }),
      content: /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsx("p", { className: "text-foreground/70 leading-relaxed text-lg", children: "If you have questions about these Terms or need support, we're here to help. Contact us through any of the channels below." }),
        /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-primary/10 border border-primary/20 rounded-2xl p-6", children: [
            /* @__PURE__ */ jsx("h4", { className: "font-semibold text-foreground mb-4 text-lg", children: "General Support" }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-3 text-foreground/70 text-base", children: [
              /* @__PURE__ */ jsxs("p", { children: [
                /* @__PURE__ */ jsx("strong", { children: "Email:" }),
                " support@oentex.com"
              ] }),
              /* @__PURE__ */ jsxs("p", { children: [
                /* @__PURE__ */ jsx("strong", { children: "Response Time:" }),
                " Within 24 hours"
              ] }),
              /* @__PURE__ */ jsxs("p", { children: [
                /* @__PURE__ */ jsx("strong", { children: "Phone:" }),
                " (555) 123-4567"
              ] }),
              /* @__PURE__ */ jsxs("p", { children: [
                /* @__PURE__ */ jsx("strong", { children: "Hours:" }),
                " Monday-Friday, 9 AM - 6 PM EST"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-secondary/10 border border-secondary/20 rounded-2xl p-6", children: [
            /* @__PURE__ */ jsx("h4", { className: "font-semibold text-foreground mb-4 text-lg", children: "Legal Inquiries" }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-3 text-foreground/70 text-base", children: [
              /* @__PURE__ */ jsxs("p", { children: [
                /* @__PURE__ */ jsx("strong", { children: "Email:" }),
                " legal@oentex.com"
              ] }),
              /* @__PURE__ */ jsxs("p", { children: [
                /* @__PURE__ */ jsx("strong", { children: "Response Time:" }),
                " Within 48 hours"
              ] }),
              /* @__PURE__ */ jsxs("p", { children: [
                /* @__PURE__ */ jsx("strong", { children: "Address:" }),
                " RateWise LLC"
              ] }),
              /* @__PURE__ */ jsx("p", { children: "123 Review Street, San Francisco, CA 94105" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-surface/30 border border-border rounded-2xl p-6", children: [
          /* @__PURE__ */ jsx("h4", { className: "font-semibold text-foreground mb-3 text-lg", children: "Mailing Address" }),
          /* @__PURE__ */ jsxs("div", { className: "text-foreground/70 text-base space-y-1", children: [
            /* @__PURE__ */ jsx("p", { children: "RateWise LLC" }),
            /* @__PURE__ */ jsx("p", { children: "Attention: Legal Department" }),
            /* @__PURE__ */ jsx("p", { children: "123 Review Street" }),
            /* @__PURE__ */ jsx("p", { children: "San Francisco, CA 94105" }),
            /* @__PURE__ */ jsx("p", { children: "United States" })
          ] })
        ] })
      ] })
    }
  ];
  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(SEO, { ...seoData.terms }),
    /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background", children: [
      /* @__PURE__ */ jsxs("section", { className: "relative py-20 lg:py-32 overflow-hidden", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" }),
        /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl" }),
        /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-secondary/10 to-transparent rounded-full blur-3xl" }),
        /* @__PURE__ */ jsx("div", { className: "container-page relative z-10", children: /* @__PURE__ */ jsxs("div", { className: "max-w-5xl mx-auto text-center", children: [
          /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6", children: [
            /* @__PURE__ */ jsx(Icons.shield, { className: "w-4 h-4" }),
            "Legal Document"
          ] }),
          /* @__PURE__ */ jsx("h1", { className: "text-5xl lg:text-6xl font-bold text-foreground mb-6", children: /* @__PURE__ */ jsx("span", { className: "bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent", children: "Terms & Conditions" }) }),
          /* @__PURE__ */ jsx("p", { className: "text-xl lg:text-2xl text-foreground/70 max-w-4xl mx-auto mb-8 leading-relaxed", children: "Comprehensive terms governing your use of our trading platform rating and affiliate services" }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-foreground/60", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Icons.calendar, { className: "w-4 h-4" }),
              /* @__PURE__ */ jsx("span", { children: "Last updated: January 30, 2025" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "hidden sm:block w-1 h-1 bg-foreground/30 rounded-full" }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Icons.clock, { className: "w-4 h-4" }),
              /* @__PURE__ */ jsx("span", { children: "Effective immediately" })
            ] })
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsx("section", { className: "py-12 bg-content1/30", children: /* @__PURE__ */ jsx("div", { className: "container-page", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-foreground mb-8 text-center", children: "Table of Contents" }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: sections.map((section, index) => /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => scrollToSection(section.id),
            className: `p-4 rounded-xl border text-left transition-all duration-300 hover:scale-105 ${activeSection === section.id ? "bg-primary/10 border-primary/30 text-primary shadow-lg" : "bg-content1 border-divider/50 hover:border-primary/30 hover:bg-content2/50"}`,
            children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsx("div", { className: "w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center text-white text-sm font-bold", children: index + 1 }),
              /* @__PURE__ */ jsx("span", { className: "font-medium text-sm", children: section.title })
            ] })
          },
          section.id
        )) })
      ] }) }) }),
      /* @__PURE__ */ jsx("section", { className: "py-20", children: /* @__PURE__ */ jsx("div", { className: "container-page", children: /* @__PURE__ */ jsxs("div", { className: "max-w-5xl mx-auto", children: [
        /* @__PURE__ */ jsx("div", { className: "space-y-16", children: sections.map((section, index) => /* @__PURE__ */ jsx(
          "div",
          {
            id: section.id,
            className: "scroll-mt-24 bg-content1/60 backdrop-blur-xl rounded-3xl border border-divider/30 overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500",
            children: /* @__PURE__ */ jsxs("div", { className: "p-8 lg:p-12", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-6 mb-10", children: [
                /* @__PURE__ */ jsx("div", { className: "flex-shrink-0 w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center text-white shadow-lg", children: section.icon }),
                /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-2", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-3xl font-bold text-primary", children: index + 1 }),
                    /* @__PURE__ */ jsx("h2", { className: "text-3xl lg:text-4xl font-bold text-foreground", children: section.title })
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "w-20 h-1 bg-gradient-to-r from-primary to-secondary rounded-full" })
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "prose prose-lg max-w-none", children: section.content })
            ] })
          },
          section.id
        )) }),
        /* @__PURE__ */ jsx("div", { className: "mt-20 bg-gradient-to-r from-primary/10 via-secondary/5 to-primary/10 border border-primary/20 rounded-3xl p-8 lg:p-12 shadow-2xl", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-6", children: [
          /* @__PURE__ */ jsx("div", { className: "flex-shrink-0 w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center text-white shadow-lg", children: /* @__PURE__ */ jsx(Icons.shield, { className: "w-8 h-8" }) }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold text-foreground mb-4", children: "Legal Acknowledgment" }),
            /* @__PURE__ */ jsx("p", { className: "text-foreground/80 text-lg leading-relaxed mb-6", children: "By accessing or using our platform, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and our Privacy Policy. This agreement constitutes a legally binding contract between you and RateWise LLC." }),
            /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-6", children: [
              /* @__PURE__ */ jsxs("div", { className: "bg-content1/50 rounded-2xl p-6 border border-divider/30", children: [
                /* @__PURE__ */ jsxs("h4", { className: "font-semibold text-foreground mb-3 flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx(Icons.check, { className: "w-5 h-5 text-success" }),
                  "Your Rights"
                ] }),
                /* @__PURE__ */ jsxs("ul", { className: "text-foreground/70 space-y-2 text-sm", children: [
                  /* @__PURE__ */ jsx("li", { children: "• Right to terminate your account at any time" }),
                  /* @__PURE__ */ jsx("li", { children: "• Right to request data deletion" }),
                  /* @__PURE__ */ jsx("li", { children: "• Right to dispute charges or fees" }),
                  /* @__PURE__ */ jsx("li", { children: "• Right to access your personal data" })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "bg-content1/50 rounded-2xl p-6 border border-divider/30", children: [
                /* @__PURE__ */ jsxs("h4", { className: "font-semibold text-foreground mb-3 flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx(Icons.warning, { className: "w-5 h-5 text-warning" }),
                  "Important Notes"
                ] }),
                /* @__PURE__ */ jsxs("ul", { className: "text-foreground/70 space-y-2 text-sm", children: [
                  /* @__PURE__ */ jsx("li", { children: "• Terms may be updated with 30 days notice" }),
                  /* @__PURE__ */ jsx("li", { children: "• Continued use constitutes acceptance" }),
                  /* @__PURE__ */ jsx("li", { children: "• Disputes subject to binding arbitration" }),
                  /* @__PURE__ */ jsx("li", { children: "• Governing law: California, USA" })
                ] })
              ] })
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "mt-12 bg-content1/30 rounded-3xl p-8 lg:p-12 border border-divider/30", children: [
          /* @__PURE__ */ jsxs("div", { className: "text-center mb-8", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold text-foreground mb-4", children: "Questions About These Terms?" }),
            /* @__PURE__ */ jsx("p", { className: "text-foreground/70 text-lg", children: "Our legal team is here to help clarify any questions you may have." })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-3 gap-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "text-center p-6 bg-content1/50 rounded-2xl border border-divider/30", children: [
              /* @__PURE__ */ jsx(Icons.mail, { className: "w-8 h-8 text-primary mx-auto mb-4" }),
              /* @__PURE__ */ jsx("h4", { className: "font-semibold text-foreground mb-2", children: "General Support" }),
              /* @__PURE__ */ jsx("p", { className: "text-foreground/70 text-sm mb-2", children: "support@oentex.com" }),
              /* @__PURE__ */ jsx("p", { className: "text-foreground/60 text-xs", children: "24-48 hour response" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "text-center p-6 bg-content1/50 rounded-2xl border border-divider/30", children: [
              /* @__PURE__ */ jsx(Icons.shield, { className: "w-8 h-8 text-secondary mx-auto mb-4" }),
              /* @__PURE__ */ jsx("h4", { className: "font-semibold text-foreground mb-2", children: "Legal Inquiries" }),
              /* @__PURE__ */ jsx("p", { className: "text-foreground/70 text-sm mb-2", children: "legal@oentex.com" }),
              /* @__PURE__ */ jsx("p", { className: "text-foreground/60 text-xs", children: "48-72 hour response" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "text-center p-6 bg-content1/50 rounded-2xl border border-divider/30", children: [
              /* @__PURE__ */ jsx(Icons.phone, { className: "w-8 h-8 text-success mx-auto mb-4" }),
              /* @__PURE__ */ jsx("h4", { className: "font-semibold text-foreground mb-2", children: "Phone Support" }),
              /* @__PURE__ */ jsx("p", { className: "text-foreground/70 text-sm mb-2", children: "+1 (555) 123-4567" }),
              /* @__PURE__ */ jsx("p", { className: "text-foreground/60 text-xs", children: "Mon-Fri, 9AM-6PM EST" })
            ] })
          ] })
        ] })
      ] }) }) })
    ] })
  ] });
};
export {
  Terms as default
};
