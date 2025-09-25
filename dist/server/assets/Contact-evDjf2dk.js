var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { I as Icons, b as showSuccessToast, a as showErrorToast } from "../entry-server.js";
import { B as Button } from "./Button-BM-TaXry.js";
import { Input as Input$1 } from "@heroui/react";
import { S as SEO, s as seoData } from "./seoData-LGOe0Do4.js";
import "react-dom/server";
import "react-router-dom/server.mjs";
import "@tanstack/react-query";
import "./react-B6hsMDRz.js";
import "react-fast-compare";
import "invariant";
import "shallowequal";
import "react-router-dom";
import "@tanstack/react-query-devtools";
import "@supabase/supabase-js";
import "@heroicons/react/24/outline";
import "react-hot-toast";
const Input = ({ error, hint, ...props }) => {
  const validationState = error ? "invalid" : void 0;
  return /* @__PURE__ */ jsx(
    Input$1,
    {
      ...props,
      validationState,
      errorMessage: error,
      description: hint
    }
  );
};
const EMAIL_CONFIG = {
  from: "noreply@oentex.com",
  replyTo: "contact@oentex.com",
  supportEmail: "contact@oentex.com",
  domain: "oentex.com"
};
const _EmailService = class _EmailService {
  constructor() {
  }
  static getInstance() {
    if (!_EmailService.instance) {
      _EmailService.instance = new _EmailService();
    }
    return _EmailService.instance;
  }
  async sendEmail(data) {
    try {
      console.log("Email Service: Sending email", {
        from: EMAIL_CONFIG.from,
        to: data.to || EMAIL_CONFIG.supportEmail,
        replyTo: EMAIL_CONFIG.replyTo,
        subject: data.subject,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
      await new Promise((resolve) => setTimeout(resolve, 1e3));
      return true;
    } catch (error) {
      console.error("Email Service Error:", error);
      throw new Error("Failed to send email");
    }
  }
  // ✅ UPDATED: Send contact form email via Supabase edge function
  async sendContactEmail(formData) {
    try {
      const response = await fetch(`${"https://cxagskqlaibqteesaopc.supabase.co"}/functions/v1/send-contact-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4YWdza3FsYWlicXRlZXNhb3BjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3OTYzMzgsImV4cCI6MjA2NzM3MjMzOH0.p6nsXwx60OnxXIKDoxuTeXFHOR37E00G6YcWIJTvDhk"}`
        },
        body: JSON.stringify(formData)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to send message");
      }
      const result = await response.json();
      console.log("Contact email sent successfully:", result);
      return true;
    } catch (error) {
      console.error("Contact form error:", error);
      throw new Error("Failed to send message. Please try again.");
    }
  }
  // ✅ KEPT: Send newsletter subscription confirmation
  async sendNewsletterWelcome(email) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="text-align: center; padding: 40px 0;">
          <h1 style="color: #1a365d; margin-bottom: 20px;">Welcome to Oentex!</h1>
          <p style="color: #4a5568; font-size: 18px; line-height: 1.6;">
            Thank you for subscribing to our newsletter.
          </p>
        </div>
        
        <div style="background-color: #f7fafc; padding: 30px; border-radius: 8px; margin: 20px 0;">
          <h2 style="color: #1a365d; margin-bottom: 20px;">What to Expect</h2>
          <ul style="color: #4a5568; line-height: 1.8;">
            <li>Weekly market analysis and insights</li>
            <li>Exclusive trading deals and bonuses</li>
            <li>Educational content and trading tips</li>
            <li>Early access to new features</li>
          </ul>
        </div>
        
        <div style="text-align: center; padding: 30px 0;">
          <a href="https://oentex.com/deals" style="display: inline-block; background-color: #38a169; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold;">
            Explore Deals
          </a>
        </div>
        
        <p style="color: #718096; font-size: 14px; text-align: center;">
          You're receiving this email because you subscribed at oentex.com<br>
          <a href="https://oentex.com/unsubscribe" style="color: #1a365d;">Unsubscribe</a>
        </p>
      </div>
    `;
    return this.sendEmail({
      to: email,
      subject: "Welcome to Oentex Newsletter",
      html,
      text: "Welcome to Oentex! Thank you for subscribing to our newsletter."
    });
  }
  // ✅ KEPT: Send deal alert email (this was missing in the new version)
  async sendDealAlert(email, deal) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #1a365d; color: white; padding: 30px; text-align: center;">
          <h1 style="margin: 0;">New Deal Alert!</h1>
        </div>
        
        <div style="padding: 30px;">
          <h2 style="color: #1a365d; margin-bottom: 10px;">${deal.platform}</h2>
          <h3 style="color: #38a169; margin-bottom: 20px;">${deal.title}</h3>
          <p style="color: #4a5568; line-height: 1.6; margin-bottom: 30px;">
            ${deal.description}
          </p>
          
          <div style="text-align: center;">
            <a href="${deal.link}" style="display: inline-block; background-color: #38a169; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold;">
              Claim This Deal
            </a>
          </div>
        </div>
        
        <div style="background-color: #f7fafc; padding: 20px; text-align: center;">
          <p style="color: #718096; font-size: 14px; margin: 0;">
            Don't miss out on exclusive deals from Oentex<br>
            <a href="https://oentex.com" style="color: #1a365d;">Visit oentex.com</a>
          </p>
        </div>
      </div>
    `;
    return this.sendEmail({
      to: email,
      subject: `Exclusive Deal: ${deal.title}`,
      html,
      text: `New deal from ${deal.platform}: ${deal.title}

${deal.description}

Claim this deal: ${deal.link}`
    });
  }
};
__publicField(_EmailService, "instance");
let EmailService = _EmailService;
const emailService = EmailService.getInstance();
const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      showErrorToast("Please fill in all fields");
      return;
    }
    setIsSubmitting(true);
    try {
      await emailService.sendContactEmail(formData);
      setIsSubmitted(true);
      showSuccessToast("Message sent successfully!");
      setTimeout(() => {
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: ""
        });
        setIsSubmitted(false);
      }, 3e3);
    } catch (error) {
      console.error("Contact form error:", error);
      showErrorToast("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleChatBotClick = () => {
    showSuccessToast("Look for the chat icon on the bottom-right corner!");
  };
  const contactInfo = [
    {
      icon: Icons.mail,
      title: "Email Support",
      content: "support@oentex.com",
      description: "Get help with your account and investments",
      link: "mailto:support@oentex.com",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Icons.mapPin,
      title: "Headquarters",
      content: "San Francisco, CA",
      description: "Visit our main office",
      link: "#",
      color: "from-emerald-500 to-teal-500"
    },
    {
      icon: Icons.phone,
      title: "Phone Support",
      content: "+1 (555) 123-4567",
      description: "Speak with our investment specialists",
      link: "tel:+15551234567",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Icons.time,
      title: "Business Hours",
      content: "9 AM - 6 PM PST",
      description: "Monday through Friday",
      link: "#",
      color: "from-orange-500 to-red-500"
    }
  ];
  const features = [
    {
      icon: Icons.shield,
      title: "Secure Communication",
      description: "All messages are encrypted and secure"
    },
    {
      icon: Icons.time,
      title: "Quick Response",
      description: "We respond within 24 hours"
    },
    {
      icon: Icons.users,
      title: "Expert Support",
      description: "Get help from investment professionals"
    }
  ];
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(SEO, { ...seoData.contact }),
    /* @__PURE__ */ jsxs("div", { className: "min-h-screen", children: [
      /* @__PURE__ */ jsxs("section", { className: "section-py-3xl relative", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-primary/8 via-secondary/4 to-primary/8 accent-transition" }),
        /* @__PURE__ */ jsx("div", { className: "container-page relative z-10 flex flex-col items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "text-center max-w-4xl mx-auto", children: [
          /* @__PURE__ */ jsx("h1", { className: "text-4xl lg:text-5xl font-bold text-foreground my-lg text-center", children: /* @__PURE__ */ jsx("span", { className: "bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent", children: "Get in Touch" }) }),
          /* @__PURE__ */ jsx("p", { className: "text-xl text-foreground/70 max-w-3xl mx-auto text-center", children: "Have questions about our platform or need assistance? We're here to help you navigate your investment journey with expert guidance and support." })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "container-page section-py-2xl text-center", children: [
        /* @__PURE__ */ jsxs("div", { className: "my-2xl text-center", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center my-3xl", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-3xl font-bold text-foreground my-md", children: "Why Choose Our Support?" }),
            /* @__PURE__ */ jsx("p", { className: "text-foreground/70 max-w-2xl text-center", children: "Experience world-class customer service with our dedicated support team" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-3 gap-xl max-w-6xl mx-auto", children: features.map((feature, index) => /* @__PURE__ */ jsxs("div", { className: "text-center bg-content1/50 rounded-2xl p-lg border border-divider hover:bg-content1/70 transition-all duration-300 flex flex-col items-center justify-center", children: [
            /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center my-md mx-auto", children: /* @__PURE__ */ jsx(feature.icon, { className: "w-6 h-6 text-white" }) }),
            /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold text-foreground my-sm text-center", children: feature.title }),
            /* @__PURE__ */ jsx("p", { className: "text-foreground/70 my-md text-center", children: feature.description })
          ] }, index)) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "my-2xl", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center my-3xl", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-3xl font-bold text-foreground my-md", children: "Contact Information" }),
            /* @__PURE__ */ jsx("p", { className: "text-foreground/70 max-w-2xl text-center", children: "Choose your preferred way to reach us. Our team is ready to help with any questions or concerns." })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-xl my-2xl max-w-6xl mx-auto", children: contactInfo.map((item, index) => /* @__PURE__ */ jsx("div", { className: "text-center p-lg bg-content1/50 rounded-2xl border border-divider hover:bg-content1/70 transition-all duration-300 flex flex-col items-center justify-center", children: /* @__PURE__ */ jsxs("a", { href: item.link, className: "block w-full flex flex-col items-center justify-center", children: [
            /* @__PURE__ */ jsx("div", { className: `w-12 h-12 bg-gradient-to-r ${item.color} rounded-lg flex items-center justify-center my-md`, children: /* @__PURE__ */ jsx(item.icon, { className: "w-6 h-6 text-white" }) }),
            /* @__PURE__ */ jsx("h3", { className: "font-semibold text-foreground my-sm text-center", children: item.title }),
            /* @__PURE__ */ jsx("p", { className: "text-foreground/70 text-sm my-sm text-center", children: item.content }),
            /* @__PURE__ */ jsx("p", { className: "text-foreground/50 text-xs text-center", children: item.description })
          ] }) }, index)) }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col lg:flex-row gap-xl my-2xl max-w-6xl mx-auto", children: [
            /* @__PURE__ */ jsx("div", { className: "flex-1 bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-2xl p-lg", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-md", children: [
                /* @__PURE__ */ jsx(Icons.time, { className: "w-6 h-6 text-primary" }),
                /* @__PURE__ */ jsx("h3", { className: "font-semibold text-foreground", children: "Response Times" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-md text-center", children: [
                /* @__PURE__ */ jsxs("div", { className: "text-sm text-foreground/70", children: [
                  /* @__PURE__ */ jsx("span", { className: "font-medium block", children: "📧 Email Support" }),
                  /* @__PURE__ */ jsx("span", { children: "Within 24 hours" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "text-sm text-foreground/70", children: [
                  /* @__PURE__ */ jsx("span", { className: "font-medium block", children: "📞 Phone Support" }),
                  /* @__PURE__ */ jsx("span", { children: "9 AM - 6 PM PST" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "text-sm text-foreground/70", children: [
                  /* @__PURE__ */ jsx("span", { className: "font-medium block", children: "💬 Live Chat" }),
                  /* @__PURE__ */ jsx("span", { children: "24/7 Available" })
                ] })
              ] })
            ] }) }),
            /* @__PURE__ */ jsx("div", { className: "flex-1 bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/30 rounded-2xl p-lg", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-md", children: [
                /* @__PURE__ */ jsx(Icons.chatBubble, { className: "w-6 h-6 text-primary" }),
                /* @__PURE__ */ jsx("h3", { className: "font-semibold text-foreground", children: "Need Instant Help?" })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-foreground/70 text-center my-sm", children: "Our AI chatbot is available 24/7 to answer your questions instantly." }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: handleChatBotClick,
                  className: "text-primary text-sm font-medium hover:text-primary/80 transition-colors",
                  children: "Try Live Chat →"
                }
              )
            ] }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "my-2xl", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center my-3xl", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-3xl font-bold text-foreground my-md", children: "Send us a Message" }),
            /* @__PURE__ */ jsx("p", { className: "text-foreground/70 max-w-2xl text-center", children: "Fill out the form below and we'll get back to you as soon as possible." })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex justify-center", children: isSubmitted ? /* @__PURE__ */ jsxs("div", { className: "text-center container-py-3xl container-px-2xl bg-content1/40 backdrop-blur-md rounded-3xl border border-divider/50 container-p-2xl max-w-md mx-auto shadow-large", children: [
            /* @__PURE__ */ jsx("div", { className: "my-lg", children: /* @__PURE__ */ jsx(Icons.success, { className: "w-16 h-16 text-success mx-auto drop-shadow-lg" }) }),
            /* @__PURE__ */ jsx("h3", { className: "text-2xl font-semibold text-foreground my-md", children: "Message Sent Successfully!" }),
            /* @__PURE__ */ jsx("p", { className: "text-foreground/70 my-xl text-base", children: "We'll get back to you as soon as possible." }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 text-sm text-foreground/60", children: [
              /* @__PURE__ */ jsx(Icons.time, { className: "w-4 h-4" }),
              /* @__PURE__ */ jsx("span", { children: "Expected response time: 24 hours" })
            ] })
          ] }) : /* @__PURE__ */ jsx("div", { className: "w-full max-w-3xl", children: /* @__PURE__ */ jsx("form", { onSubmit: handleSubmit, className: "bg-content1/40 backdrop-blur-md rounded-3xl border border-content1/40 container-p-2xl shadow-large hover:shadow-large hover:border-primary/30 transition-all duration-500", children: /* @__PURE__ */ jsxs("div", { className: "space-y-xl", children: [
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-xl", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-md", children: [
                /* @__PURE__ */ jsxs("label", { htmlFor: "name", className: "block text-sm font-semibold text-foreground", children: [
                  "Your Name ",
                  /* @__PURE__ */ jsx("span", { className: "text-danger", children: "*" })
                ] }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    id: "name",
                    type: "text",
                    name: "name",
                    value: formData.name,
                    onChange: handleChange,
                    placeholder: "Enter your full name",
                    isRequired: true,
                    className: "w-full",
                    classNames: {
                      input: "text-center container-py-md text-base",
                      inputWrapper: "bg-background/60 border-background/60 focus-within:border-primary shadow-medium transition-all duration-300"
                    }
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-md", children: [
                /* @__PURE__ */ jsxs("label", { htmlFor: "email", className: "block text-sm font-semibold text-foreground", children: [
                  "Email Address ",
                  /* @__PURE__ */ jsx("span", { className: "text-danger", children: "*" })
                ] }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    id: "email",
                    type: "email",
                    name: "email",
                    value: formData.email,
                    onChange: handleChange,
                    placeholder: "Enter your email address",
                    isRequired: true,
                    className: "w-full",
                    classNames: {
                      input: "text-center container-py-md text-base",
                      inputWrapper: "bg-background/60 border-background/60 focus-within:border-primary shadow-medium transition-all duration-300"
                    }
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-md", children: [
              /* @__PURE__ */ jsxs("label", { htmlFor: "subject", className: "block text-sm font-semibold text-foreground", children: [
                "Subject ",
                /* @__PURE__ */ jsx("span", { className: "text-danger", children: "*" })
              ] }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  id: "subject",
                  type: "text",
                  name: "subject",
                  value: formData.subject,
                  onChange: handleChange,
                  placeholder: "What's this about?",
                  isRequired: true,
                  className: "w-full",
                  classNames: {
                    input: "text-center container-py-md text-base",
                    inputWrapper: "bg-background/60 border-border/60 focus-within:border-primary shadow-medium transition-all duration-300"
                  }
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-md", children: [
              /* @__PURE__ */ jsxs("label", { htmlFor: "message", className: "block text-sm font-semibold text-foreground", children: [
                "Message ",
                /* @__PURE__ */ jsx("span", { className: "text-danger", children: "*" })
              ] }),
              /* @__PURE__ */ jsx(
                "textarea",
                {
                  id: "message",
                  name: "message",
                  value: formData.message,
                  onChange: handleChange,
                  rows: 6,
                  className: "w-full container-px-lg container-py-md bg-background/60 border border-background/60 rounded-large text-foreground placeholder-foreground/50 focus:outline-none focus:border-primary shadow-medium transition-all duration-300 resize-none text-center text-base",
                  placeholder: "Tell us more about your inquiry...",
                  required: true
                }
              )
            ] }),
            /* @__PURE__ */ jsx("div", { className: "flex justify-center my-xl", children: /* @__PURE__ */ jsx(
              Button,
              {
                type: "submit",
                color: "primary",
                loading: isSubmitting,
                rightIcon: !isSubmitting ? /* @__PURE__ */ jsx(Icons.paperAirplane, { className: "w-5 h-5" }) : void 0,
                className: "container-px-2xl container-py-lg text-lg font-bold shadow-large hover:shadow-large transform hover:scale-105 transition-all duration-300",
                size: "lg",
                children: isSubmitting ? "Sending..." : "Send Message"
              }
            ) }),
            /* @__PURE__ */ jsxs("div", { className: "text-sm text-foreground/60 text-center my-lg flex items-center justify-center gap-2", children: [
              /* @__PURE__ */ jsx("div", { className: "w-5 h-5 bg-primary/20 rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsx(Icons.document, { className: "w-3 h-3 text-primary" }) }),
              "By submitting this form, you agree to our",
              /* @__PURE__ */ jsx("a", { href: "/terms", className: "text-primary hover:text-primary/80 underline font-medium", children: "privacy policy" }),
              "and",
              /* @__PURE__ */ jsx("a", { href: "/terms", className: "text-primary hover:text-primary/80 underline font-medium", children: "terms of service" }),
              "."
            ] })
          ] }) }) }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "my-2xl text-center", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center my-3xl", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-3xl font-bold text-foreground my-md", children: "Frequently Asked Questions" }),
            /* @__PURE__ */ jsx("p", { className: "text-foreground/70 max-w-2xl text-center", children: "Find quick answers to common questions about our platform and services" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-xl max-w-6xl mx-auto", children: [
            {
              question: "How quickly do you respond to inquiries?",
              answer: "We typically respond to all inquiries within 24 hours during business days."
            },
            {
              question: "Is my information secure?",
              answer: "Yes, all communications are encrypted and we follow strict security protocols."
            },
            {
              question: "Can I schedule a call?",
              answer: "Absolutely! Contact us to schedule a personalized consultation with our experts."
            },
            {
              question: "What support channels are available?",
              answer: "We offer email, phone, live chat, and our AI chatbot for 24/7 assistance."
            },
            {
              question: "Do you offer investment advice?",
              answer: "We provide educational resources and platform guidance, not personalized investment advice."
            },
            {
              question: "How can I get started?",
              answer: "Simply create an account and complete our onboarding process to begin investing."
            }
          ].map((faq, index) => /* @__PURE__ */ jsxs("div", { className: "text-center bg-content1/50 rounded-2xl p-lg border border-divider hover:bg-content1/70 transition-all duration-300 flex flex-col items-center justify-center", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-semibold text-foreground my-sm text-center", children: faq.question }),
            /* @__PURE__ */ jsx("p", { className: "text-foreground/70 text-sm my-md text-center", children: faq.answer })
          ] }, index)) })
        ] })
      ] })
    ] })
  ] });
};
export {
  Contact as default
};
