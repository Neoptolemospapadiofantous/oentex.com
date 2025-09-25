import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { I as Icons } from "../entry-server.js";
import { useEffect, useState, useRef } from "react";
import { B as Button } from "./Button-BM-TaXry.js";
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
const useIntersectionObserver = (elementRef, callback, options = {}) => {
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          callback(entry.isIntersecting, entry);
        });
      },
      {
        threshold: options.threshold || 0.1,
        rootMargin: options.rootMargin || "0px",
        root: options.root || null
      }
    );
    observer.observe(element);
    return () => {
      observer.unobserve(element);
    };
  }, [elementRef, callback, options.threshold, options.rootMargin, options.root]);
};
const AnimatedInnovation = ({ className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const sectionRef = useRef(null);
  useIntersectionObserver(
    sectionRef,
    (isIntersecting) => {
      if (isIntersecting && !isVisible) {
        setIsVisible(true);
      }
    },
    { threshold: 0.3, rootMargin: "-50px" }
  );
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);
  return /* @__PURE__ */ jsx(
    "section",
    {
      ref: sectionRef,
      className: `relative section-py-2xl container-px-sm sm:container-px-md lg:container-px-lg rounded-3xl mx-4 my-12 overflow-hidden min-h-[400px] flex items-center justify-center transition-all duration-700 transform ${isVisible ? "visible translate-y-0 opacity-100" : "translate-y-8 opacity-0"} ${isLoaded ? "loaded" : ""} ${className}`,
      children: /* @__PURE__ */ jsxs("div", { className: "relative z-10 max-w-4xl mx-auto text-center", children: [
        /* @__PURE__ */ jsx("div", { className: "my-xl", children: /* @__PURE__ */ jsx("div", { className: "relative inline-block group", children: /* @__PURE__ */ jsx("div", { className: "relative transform transition-all duration-700 hover:scale-110 hover:rotate-12", children: /* @__PURE__ */ jsxs("div", { className: `w-80 h-80 flex items-center justify-center transition-all duration-700 ${isVisible ? "scale-100 opacity-100" : "scale-75 opacity-0"}`, style: { transitionDelay: "200ms" }, children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "absolute inset-0 transform translate-x-6 translate-y-6 opacity-15",
              style: {
                filter: "blur(8px)",
                zIndex: 1
              },
              children: /* @__PURE__ */ jsxs(
                "svg",
                {
                  className: "w-40 h-40",
                  viewBox: "0 0 200 200",
                  xmlns: "http://www.w3.org/2000/svg",
                  children: [
                    /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs("linearGradient", { id: "shadowGradient", x1: "0%", y1: "0%", x2: "100%", y2: "100%", children: [
                      /* @__PURE__ */ jsx("stop", { offset: "0%", stopColor: "#1a1a1a" }),
                      /* @__PURE__ */ jsx("stop", { offset: "100%", stopColor: "#333333" })
                    ] }) }),
                    /* @__PURE__ */ jsxs("g", { transform: "translate(40, 30)", children: [
                      /* @__PURE__ */ jsx("ellipse", { cx: "40", cy: "100", rx: "35", ry: "12", fill: "url(#shadowGradient)", opacity: "0.6" }),
                      /* @__PURE__ */ jsx("path", { d: "M20 25 L60 25 L70 80 L10 80 Z", fill: "url(#shadowGradient)", opacity: "0.4" }),
                      /* @__PURE__ */ jsx("path", { d: "M40 15 L50 25 L40 25 Z", fill: "url(#shadowGradient)", opacity: "0.3" })
                    ] })
                  ]
                }
              )
            }
          ),
          /* @__PURE__ */ jsxs(
            "svg",
            {
              className: "w-40 h-40 animate-bounce relative z-10",
              style: {
                animationDuration: "2s",
                filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.4)) drop-shadow(0 10px 20px rgba(0,0,0,0.3))",
                transform: "perspective(1000px) rotateX(15deg) rotateY(-8deg) rotateZ(3deg)"
              },
              viewBox: "0 0 200 200",
              xmlns: "http://www.w3.org/2000/svg",
              children: [
                /* @__PURE__ */ jsxs("defs", { children: [
                  /* @__PURE__ */ jsxs("linearGradient", { id: "rocketBodyGradient", x1: "0%", y1: "0%", x2: "100%", y2: "100%", children: [
                    /* @__PURE__ */ jsx("stop", { offset: "0%", stopColor: "#3B82F6" }),
                    /* @__PURE__ */ jsx("stop", { offset: "30%", stopColor: "#2563EB" }),
                    /* @__PURE__ */ jsx("stop", { offset: "70%", stopColor: "#1D4ED8" }),
                    /* @__PURE__ */ jsx("stop", { offset: "100%", stopColor: "#1E40AF" })
                  ] }),
                  /* @__PURE__ */ jsxs("linearGradient", { id: "rocketSideGradient", x1: "0%", y1: "0%", x2: "100%", y2: "100%", children: [
                    /* @__PURE__ */ jsx("stop", { offset: "0%", stopColor: "#1E3A8A" }),
                    /* @__PURE__ */ jsx("stop", { offset: "100%", stopColor: "#1E40AF" })
                  ] }),
                  /* @__PURE__ */ jsxs("linearGradient", { id: "rocketTopGradient", x1: "0%", y1: "0%", x2: "100%", y2: "100%", children: [
                    /* @__PURE__ */ jsx("stop", { offset: "0%", stopColor: "#60A5FA" }),
                    /* @__PURE__ */ jsx("stop", { offset: "100%", stopColor: "#3B82F6" })
                  ] }),
                  /* @__PURE__ */ jsxs("linearGradient", { id: "flameGradient", x1: "0%", y1: "0%", x2: "100%", y2: "100%", children: [
                    /* @__PURE__ */ jsx("stop", { offset: "0%", stopColor: "#FEF3C7" }),
                    /* @__PURE__ */ jsx("stop", { offset: "30%", stopColor: "#F59E0B" }),
                    /* @__PURE__ */ jsx("stop", { offset: "60%", stopColor: "#EF4444" }),
                    /* @__PURE__ */ jsx("stop", { offset: "100%", stopColor: "#DC2626" })
                  ] }),
                  /* @__PURE__ */ jsxs("linearGradient", { id: "windowGradient", x1: "0%", y1: "0%", x2: "100%", y2: "100%", children: [
                    /* @__PURE__ */ jsx("stop", { offset: "0%", stopColor: "#E0F2FE" }),
                    /* @__PURE__ */ jsx("stop", { offset: "100%", stopColor: "#BAE6FD" })
                  ] }),
                  /* @__PURE__ */ jsxs("linearGradient", { id: "finGradient", x1: "0%", y1: "0%", x2: "100%", y2: "100%", children: [
                    /* @__PURE__ */ jsx("stop", { offset: "0%", stopColor: "#1E40AF" }),
                    /* @__PURE__ */ jsx("stop", { offset: "100%", stopColor: "#1E3A8A" })
                  ] }),
                  /* @__PURE__ */ jsxs("filter", { id: "glow", children: [
                    /* @__PURE__ */ jsx("feGaussianBlur", { stdDeviation: "5", result: "coloredBlur" }),
                    /* @__PURE__ */ jsxs("feMerge", { children: [
                      /* @__PURE__ */ jsx("feMergeNode", { in: "coloredBlur" }),
                      /* @__PURE__ */ jsx("feMergeNode", { in: "SourceGraphic" })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("filter", { id: "flameGlow", children: [
                    /* @__PURE__ */ jsx("feGaussianBlur", { stdDeviation: "3", result: "coloredBlur" }),
                    /* @__PURE__ */ jsxs("feMerge", { children: [
                      /* @__PURE__ */ jsx("feMergeNode", { in: "coloredBlur" }),
                      /* @__PURE__ */ jsx("feMergeNode", { in: "SourceGraphic" })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("filter", { id: "trailGlow", children: [
                    /* @__PURE__ */ jsx("feGaussianBlur", { stdDeviation: "2", result: "coloredBlur" }),
                    /* @__PURE__ */ jsxs("feMerge", { children: [
                      /* @__PURE__ */ jsx("feMergeNode", { in: "coloredBlur" }),
                      /* @__PURE__ */ jsx("feMergeNode", { in: "SourceGraphic" })
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("g", { transform: "translate(40, 30)", children: [
                  /* @__PURE__ */ jsx("path", { d: "M20 25 L60 25 L70 80 L10 80 Z", fill: "url(#rocketBodyGradient)", filter: "url(#glow)" }),
                  /* @__PURE__ */ jsx("path", { d: "M60 25 L75 35 L75 90 L70 80 Z", fill: "url(#rocketSideGradient)" }),
                  /* @__PURE__ */ jsx("path", { d: "M20 25 L30 15 L75 35 L60 25 Z", fill: "url(#rocketTopGradient)" }),
                  /* @__PURE__ */ jsx("path", { d: "M40 15 L50 25 L40 25 Z", fill: "url(#rocketTopGradient)", filter: "url(#glow)" }),
                  /* @__PURE__ */ jsx("path", { d: "M40 15 L50 25 L55 20 Z", fill: "url(#rocketSideGradient)" }),
                  /* @__PURE__ */ jsx("ellipse", { cx: "40", cy: "45", rx: "12", ry: "8", fill: "url(#windowGradient)", opacity: "0.9" }),
                  /* @__PURE__ */ jsx("ellipse", { cx: "40", cy: "45", rx: "8", ry: "5", fill: "#0EA5E9", opacity: "0.7" }),
                  /* @__PURE__ */ jsx("ellipse", { cx: "40", cy: "45", rx: "4", ry: "2", fill: "#FFFFFF", opacity: "0.8" }),
                  /* @__PURE__ */ jsx("path", { d: "M10 80 L5 95 L10 95 Z", fill: "url(#finGradient)" }),
                  /* @__PURE__ */ jsx("path", { d: "M70 80 L75 95 L70 95 Z", fill: "url(#finGradient)" }),
                  /* @__PURE__ */ jsx("path", { d: "M20 25 L60 25 L70 80 L10 80 Z", fill: "none", stroke: "rgba(255,255,255,0.3)", strokeWidth: "1" }),
                  /* @__PURE__ */ jsx("path", { d: "M60 25 L75 35 L75 90 L70 80 Z", fill: "none", stroke: "rgba(0,0,0,0.2)", strokeWidth: "1" }),
                  /* @__PURE__ */ jsx("path", { d: "M20 25 L30 15 L75 35 L60 25 Z", fill: "none", stroke: "rgba(255,255,255,0.4)", strokeWidth: "1" }),
                  /* @__PURE__ */ jsx("path", { d: "M25 35 L55 35 L55 40 L25 40 Z", fill: "rgba(255,255,255,0.2)" }),
                  /* @__PURE__ */ jsx("path", { d: "M25 55 L55 55 L55 60 L25 60 Z", fill: "rgba(255,255,255,0.2)" })
                ] }),
                /* @__PURE__ */ jsxs("g", { transform: "translate(40, 110)", children: [
                  /* @__PURE__ */ jsx("path", { d: "M30 0 L40 20 L50 0 Z", fill: "url(#flameGradient)", filter: "url(#flameGlow)" }),
                  /* @__PURE__ */ jsx("path", { d: "M32 0 L40 15 L48 0 Z", fill: "#FEF3C7", opacity: "0.8" }),
                  /* @__PURE__ */ jsx("path", { d: "M34 0 L40 10 L46 0 Z", fill: "#FDE68A", opacity: "0.6" }),
                  /* @__PURE__ */ jsx("path", { d: "M36 0 L40 5 L44 0 Z", fill: "#FCD34D", opacity: "0.4" })
                ] }),
                /* @__PURE__ */ jsxs("g", { transform: "translate(40, 130)", children: [
                  /* @__PURE__ */ jsx("path", { d: "M25 0 L30 15 L35 0 Z", fill: "#06B6D4", opacity: "0.6", filter: "url(#trailGlow)", children: /* @__PURE__ */ jsx("animate", { attributeName: "opacity", values: "0.3;0.8;0.3", dur: "1.5s", repeatCount: "indefinite" }) }),
                  /* @__PURE__ */ jsx("path", { d: "M45 0 L50 15 L55 0 Z", fill: "#06B6D4", opacity: "0.6", filter: "url(#trailGlow)", children: /* @__PURE__ */ jsx("animate", { attributeName: "opacity", values: "0.8;0.3;0.8", dur: "1.5s", repeatCount: "indefinite" }) }),
                  /* @__PURE__ */ jsx("path", { d: "M35 0 L40 10 L45 0 Z", fill: "#0891B2", opacity: "0.4", filter: "url(#trailGlow)", children: /* @__PURE__ */ jsx("animate", { attributeName: "opacity", values: "0.2;0.6;0.2", dur: "1.2s", repeatCount: "indefinite" }) })
                ] }),
                /* @__PURE__ */ jsxs("g", { stroke: "#60A5FA", strokeWidth: "2", fill: "none", opacity: "0.6", children: [
                  /* @__PURE__ */ jsx("path", { d: "M10 50 L25 50", children: /* @__PURE__ */ jsx("animate", { attributeName: "opacity", values: "0.2;0.8;0.2", dur: "2s", repeatCount: "indefinite" }) }),
                  /* @__PURE__ */ jsx("path", { d: "M10 60 L20 60", children: /* @__PURE__ */ jsx("animate", { attributeName: "opacity", values: "0.8;0.2;0.8", dur: "2.2s", repeatCount: "indefinite" }) }),
                  /* @__PURE__ */ jsx("path", { d: "M10 70 L25 70", children: /* @__PURE__ */ jsx("animate", { attributeName: "opacity", values: "0.2;0.8;0.2", dur: "1.8s", repeatCount: "indefinite" }) }),
                  /* @__PURE__ */ jsx("path", { d: "M165 50 L150 50", children: /* @__PURE__ */ jsx("animate", { attributeName: "opacity", values: "0.8;0.2;0.8", dur: "2.1s", repeatCount: "indefinite" }) }),
                  /* @__PURE__ */ jsx("path", { d: "M170 60 L155 60", children: /* @__PURE__ */ jsx("animate", { attributeName: "opacity", values: "0.2;0.8;0.2", dur: "1.9s", repeatCount: "indefinite" }) }),
                  /* @__PURE__ */ jsx("path", { d: "M165 70 L150 70", children: /* @__PURE__ */ jsx("animate", { attributeName: "opacity", values: "0.8;0.2;0.8", dur: "2.3s", repeatCount: "indefinite" }) })
                ] }),
                /* @__PURE__ */ jsxs("g", { fill: "#FCD34D", filter: "url(#glow)", children: [
                  /* @__PURE__ */ jsx("path", { d: "M25 25 L27 25 L26 27 Z", opacity: "0.8", children: /* @__PURE__ */ jsx("animate", { attributeName: "opacity", values: "0.3;1;0.3", dur: "3s", repeatCount: "indefinite" }) }),
                  /* @__PURE__ */ jsx("path", { d: "M170 30 L172 30 L171 32 Z", opacity: "0.6", children: /* @__PURE__ */ jsx("animate", { attributeName: "opacity", values: "0.6;0.2;0.6", dur: "2.5s", repeatCount: "indefinite" }) }),
                  /* @__PURE__ */ jsx("path", { d: "M180 20 L182 20 L181 22 Z", opacity: "0.7", children: /* @__PURE__ */ jsx("animate", { attributeName: "opacity", values: "0.2;0.8;0.2", dur: "2.8s", repeatCount: "indefinite" }) }),
                  /* @__PURE__ */ jsx("path", { d: "M30 170 L32 170 L31 172 Z", opacity: "0.5", children: /* @__PURE__ */ jsx("animate", { attributeName: "opacity", values: "0.5;0.9;0.5", dur: "3.2s", repeatCount: "indefinite" }) }),
                  /* @__PURE__ */ jsx("path", { d: "M160 160 L162 160 L161 162 Z", opacity: "0.9", children: /* @__PURE__ */ jsx("animate", { attributeName: "opacity", values: "0.9;0.3;0.9", dur: "2.7s", repeatCount: "indefinite" }) }),
                  /* @__PURE__ */ jsx("path", { d: "M15 100 L17 100 L16 102 Z", opacity: "0.6", children: /* @__PURE__ */ jsx("animate", { attributeName: "opacity", values: "0.3;0.7;0.3", dur: "2.9s", repeatCount: "indefinite" }) }),
                  /* @__PURE__ */ jsx("path", { d: "M175 100 L177 100 L176 102 Z", opacity: "0.8", children: /* @__PURE__ */ jsx("animate", { attributeName: "opacity", values: "0.7;0.2;0.7", dur: "2.4s", repeatCount: "indefinite" }) })
                ] }),
                /* @__PURE__ */ jsxs("g", { stroke: "#8B5CF6", strokeWidth: "1", fill: "none", opacity: "0.4", filter: "url(#glow)", children: [
                  /* @__PURE__ */ jsxs("circle", { cx: "40", cy: "40", r: "25", opacity: "0.3", children: [
                    /* @__PURE__ */ jsx("animate", { attributeName: "r", values: "20;30;20", dur: "4s", repeatCount: "indefinite" }),
                    /* @__PURE__ */ jsx("animate", { attributeName: "opacity", values: "0.1;0.4;0.1", dur: "4s", repeatCount: "indefinite" })
                  ] }),
                  /* @__PURE__ */ jsxs("circle", { cx: "40", cy: "40", r: "35", opacity: "0.2", children: [
                    /* @__PURE__ */ jsx("animate", { attributeName: "r", values: "30;40;30", dur: "5s", repeatCount: "indefinite" }),
                    /* @__PURE__ */ jsx("animate", { attributeName: "opacity", values: "0.05;0.3;0.05", dur: "5s", repeatCount: "indefinite" })
                  ] })
                ] })
              ]
            }
          )
        ] }) }) }) }),
        /* @__PURE__ */ jsxs("div", { className: "my-xl", children: [
          /* @__PURE__ */ jsxs("h2", { className: "text-5xl sm:text-6xl lg:text-7xl font-bold my-lg", children: [
            /* @__PURE__ */ jsx("span", { className: `block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-gradient-x transition-all duration-1000 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`, style: { transitionDelay: "400ms" }, children: "Innovation" }),
            /* @__PURE__ */ jsx("span", { className: `block bg-gradient-to-r from-secondary via-primary to-accent bg-clip-text text-transparent animate-gradient-x transition-all duration-1000 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`, style: { animationDelay: "0.5s", transitionDelay: "600ms" }, children: "Driven" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: `text-xl text-foreground/70 max-w-2xl mx-auto leading-relaxed transition-all duration-1000 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`, style: { transitionDelay: "800ms" }, children: "Experience the future of trading with cutting-edge technology and innovative solutions." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-lg max-w-2xl mx-auto", children: [
          /* @__PURE__ */ jsxs("div", { className: `bg-background/50 backdrop-blur-sm border border-border rounded-2xl p-lg hover:border-primary/30 transition-all duration-500 hover:scale-105 hover:shadow-lg group ${isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`, style: { transitionDelay: "1000ms" }, children: [
            /* @__PURE__ */ jsx("div", { className: "text-3xl font-bold text-primary my-sm group-hover:scale-110 transition-transform duration-300", children: "500+" }),
            /* @__PURE__ */ jsx("div", { className: "text-sm text-foreground/70", children: "Active Traders" }),
            /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: `bg-background/50 backdrop-blur-sm border border-border rounded-2xl p-lg hover:border-secondary/30 transition-all duration-500 hover:scale-105 hover:shadow-lg group ${isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`, style: { transitionDelay: "1200ms" }, children: [
            /* @__PURE__ */ jsx("div", { className: "text-3xl font-bold text-secondary my-sm group-hover:scale-110 transition-transform duration-300", children: "99.9%" }),
            /* @__PURE__ */ jsx("div", { className: "text-sm text-foreground/70", children: "Uptime" }),
            /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-secondary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: `bg-background/50 backdrop-blur-sm border border-border rounded-2xl p-lg hover:border-accent/30 transition-all duration-500 hover:scale-105 hover:shadow-lg group ${isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`, style: { transitionDelay: "1400ms" }, children: [
            /* @__PURE__ */ jsx("div", { className: "text-3xl font-bold text-accent my-sm group-hover:scale-110 transition-transform duration-300", children: "24/7" }),
            /* @__PURE__ */ jsx("div", { className: "text-sm text-foreground/70", children: "Support" }),
            /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-accent/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" })
          ] })
        ] })
      ] })
    }
  );
};
const About = () => {
  const stats = [
    { icon: Icons.users, value: "Growing", label: "User Community" },
    { icon: Icons.star, value: "Curated", label: "Quality Reviews" },
    { icon: Icons.arrowTrendingUp, value: "High", label: "User Satisfaction" },
    { icon: Icons.trophy, value: "Trusted", label: "Recommendations" }
  ];
  const services = [
    {
      icon: Icons.star,
      title: "Product Reviews & Ratings",
      description: "We provide comprehensive reviews and ratings for trading platforms, software tools, courses, and services to help you make informed decisions.",
      features: ["Detailed Reviews", "User Ratings", "Pros & Cons Analysis", "Expert Insights"]
    },
    {
      icon: Icons.search,
      title: "Deal Discovery",
      description: "Find the best deals, discounts, and exclusive offers across multiple categories including tech, finance, education, and wellness.",
      features: ["Curated Deals", "Price Comparisons", "Exclusive Discounts", "Deal Alerts"]
    },
    {
      icon: Icons.arrowTrendingUp,
      title: "Platform Comparisons",
      description: "Compare features, pricing, and user experiences across different platforms to find the perfect solution for your needs.",
      features: ["Side-by-Side Comparisons", "Feature Analysis", "Pricing Breakdown", "User Feedback"]
    },
    {
      icon: Icons.success,
      title: "Verified Information",
      description: "All our reviews and recommendations are based on thorough research, user feedback, and real-world testing.",
      features: ["Fact-Checked Content", "Regular Updates", "User Verification", "Quality Assurance"]
    }
  ];
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(SEO, { ...seoData.about }),
    /* @__PURE__ */ jsxs("div", { className: "min-h-screen flex flex-col items-center", children: [
      /* @__PURE__ */ jsxs("section", { className: "section-py-3xl relative w-full", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-primary/8 via-secondary/4 to-primary/8 accent-transition" }),
        /* @__PURE__ */ jsx("div", { className: "container-page relative z-10 flex flex-col items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "text-center max-w-4xl mx-auto", children: [
          /* @__PURE__ */ jsx("h1", { className: "text-4xl lg:text-5xl font-bold text-foreground my-lg text-center", children: /* @__PURE__ */ jsx("span", { className: "bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent", children: "About Oentex" }) }),
          /* @__PURE__ */ jsx("p", { className: "text-xl text-foreground/70 max-w-3xl mx-auto text-center", children: "Your trusted source for honest reviews, ratings, and the best deals across tech gadgets, software tools, online courses, financial services" })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "container-page section-py-lg w-full flex flex-col items-center", children: [
        /* @__PURE__ */ jsxs("section", { className: "mb-2xl w-full flex flex-col items-center", children: [
          /* @__PURE__ */ jsxs("div", { className: "text-center mb-2xl", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-3xl lg:text-4xl font-bold text-foreground mb-lg", children: /* @__PURE__ */ jsx("span", { className: "bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent", children: "Our Impact" }) }),
            /* @__PURE__ */ jsx("p", { className: "text-lg text-foreground/70 max-w-3xl mx-auto text-center", children: "Numbers that reflect our commitment to excellence and user satisfaction" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-lg max-w-6xl mx-auto w-full", children: stats.map((stat, index) => /* @__PURE__ */ jsxs("div", { className: "group text-center container-p-lg bg-content1/80 backdrop-blur-xl rounded-2xl border border-divider/40 hover:border-primary/30 transition-all duration-500 hover:shadow-xl hover:shadow-primary/10 transform hover:scale-[1.02] flex flex-col items-center justify-center", children: [
            /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center mb-md mx-auto shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300", children: /* @__PURE__ */ jsx(stat.icon, { className: "w-6 h-6 text-white" }) }),
            /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-primary mb-xs text-center group-hover:text-primary transition-colors duration-300", children: stat.value }),
            /* @__PURE__ */ jsx("div", { className: "text-sm font-semibold text-foreground text-center", children: stat.label })
          ] }, index)) })
        ] }),
        /* @__PURE__ */ jsx("section", { className: "mb-2xl w-full flex flex-col items-center", children: /* @__PURE__ */ jsx("div", { className: "bg-content1/90 backdrop-blur-2xl rounded-2xl container-p-2xl border border-divider/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 group overflow-hidden relative w-full max-w-6xl", children: /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-2 gap-2xl items-center", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col text-center", children: [
            /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-sm container-px-md container-py-xs bg-primary/10 rounded-full border border-primary/20 mb-lg w-fit mx-auto", children: [
              /* @__PURE__ */ jsx(Icons.trophy, { className: "w-4 h-4 text-primary" }),
              /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold text-primary", children: "Our Mission" })
            ] }),
            /* @__PURE__ */ jsx("h2", { className: "text-2xl lg:text-3xl font-bold text-foreground mb-lg group-hover:text-primary transition-colors duration-300", children: "Empowering Smart Decisions" }),
            /* @__PURE__ */ jsx("p", { className: "text-base text-foreground/70 mb-lg leading-relaxed", children: "At Oentex, we're dedicated to helping you make informed decisions by providing honest, comprehensive reviews and uncovering the best deals across a wide range of products and services." }),
            /* @__PURE__ */ jsx("p", { className: "text-foreground/70 mb-xl leading-relaxed", children: "We believe that everyone deserves access to reliable information and great deals. Our team researches, tests, and reviews products to save you time and money while ensuring you get the best value for your investment." }),
            /* @__PURE__ */ jsx("div", { className: "bg-gradient-to-r from-primary/15 to-secondary/15 rounded-2xl container-p-xl border border-primary/30 max-w-2xl mx-auto", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center text-center gap-md", children: [
              /* @__PURE__ */ jsx(Icons.chatBubble, { className: "w-6 h-6 text-primary/60 flex-shrink-0" }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-foreground font-medium italic text-lg leading-relaxed", children: '"Empowering smart decisions through honest reviews and unbeatable deals."' }),
                /* @__PURE__ */ jsx("p", { className: "text-foreground/70 text-sm mt-sm font-medium", children: "— Our Core Philosophy" })
              ] })
            ] }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl" }),
            /* @__PURE__ */ jsx(AnimatedInnovation, {})
          ] })
        ] }) }) }),
        /* @__PURE__ */ jsxs("section", { className: "mb-2xl w-full flex flex-col items-center", children: [
          /* @__PURE__ */ jsxs("div", { className: "text-center mb-2xl", children: [
            /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-sm container-px-md container-py-xs bg-primary/10 rounded-full border border-primary/20 mb-lg", children: [
              /* @__PURE__ */ jsx(Icons.star, { className: "w-4 h-4 text-primary" }),
              /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold text-primary", children: "Our Services" })
            ] }),
            /* @__PURE__ */ jsx("h2", { className: "text-2xl lg:text-3xl font-bold text-foreground mb-lg", children: "What We Do" }),
            /* @__PURE__ */ jsx("p", { className: "text-base text-foreground/70 max-w-3xl mx-auto", children: "We help you navigate the complex world of products and services by providing clear, honest information and the best deals available." })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-2 gap-lg max-w-6xl mx-auto w-full", children: services.map((service, index) => /* @__PURE__ */ jsxs("div", { className: "group bg-content1/80 backdrop-blur-xl rounded-2xl container-p-lg border border-divider/40 hover:border-primary/30 transition-all duration-500 hover:shadow-xl hover:shadow-primary/10 transform hover:scale-[1.02] flex flex-col", children: [
            /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center mb-lg mx-auto shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300", children: /* @__PURE__ */ jsx(service.icon, { className: "w-6 h-6 text-white" }) }),
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-foreground mb-sm text-center group-hover:text-primary transition-colors duration-300", children: service.title }),
            /* @__PURE__ */ jsx("p", { className: "text-foreground/70 mb-lg text-center leading-relaxed", children: service.description }),
            /* @__PURE__ */ jsx("div", { className: "space-y-sm mt-auto text-center", children: service.features.map((feature, idx) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-xs text-sm text-foreground/70 group-hover:text-foreground transition-colors duration-200", children: [
              /* @__PURE__ */ jsx(Icons.success, { className: "w-3 h-3 text-success flex-shrink-0" }),
              /* @__PURE__ */ jsx("span", { children: feature })
            ] }, idx)) })
          ] }, index)) })
        ] }),
        /* @__PURE__ */ jsx("section", { className: "mb-2xl w-full flex flex-col items-center", children: /* @__PURE__ */ jsx("div", { className: "flex justify-center w-full", children: /* @__PURE__ */ jsx("div", { className: "bg-gradient-to-r from-warning/15 to-primary/15 border border-warning/40 rounded-2xl container-p-2xl max-w-4xl backdrop-blur-sm w-full", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center text-center", children: [
          /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-gradient-to-br from-warning/20 to-warning/10 rounded-xl flex items-center justify-center mb-lg", children: /* @__PURE__ */ jsx(Icons.warning, { className: "w-6 h-6 text-warning" }) }),
          /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-foreground mb-lg", children: "Transparency Disclosure" }),
          /* @__PURE__ */ jsxs("p", { className: "text-foreground/70 leading-relaxed mb-lg text-base", children: [
            /* @__PURE__ */ jsx("strong", { className: "text-foreground", children: "We believe in complete transparency." }),
            " Some of the links on our website are affiliate links, which means we may earn a commission if you make a purchase through them. This comes at no additional cost to you and helps us maintain our free service."
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-foreground/70 text-sm leading-relaxed", children: "Our reviews and recommendations are always honest and based on thorough research, regardless of affiliate partnerships. We only recommend products and services we believe provide genuine value to our users." })
        ] }) }) }) }),
        /* @__PURE__ */ jsx("section", { className: "w-full flex flex-col items-center", children: /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-r from-primary/15 to-secondary/15 rounded-2xl container-p-2xl border border-primary/30 hover:shadow-xl hover:shadow-primary/10 transition-all duration-500 group overflow-hidden relative w-full max-w-4xl", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" }),
          /* @__PURE__ */ jsxs("div", { className: "relative z-10 flex flex-col items-center text-center", children: [
            /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-sm container-px-md container-py-xs bg-primary/20 rounded-full border border-primary/30 mb-lg", children: [
              /* @__PURE__ */ jsx(Icons.arrowTrendingUp, { className: "w-4 h-4 text-primary" }),
              /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold text-primary", children: "Get Started Today" })
            ] }),
            /* @__PURE__ */ jsx("h2", { className: "text-2xl lg:text-3xl font-bold text-foreground mb-lg group-hover:text-primary transition-colors duration-300", children: "Ready to Discover Great Deals?" }),
            /* @__PURE__ */ jsx("p", { className: "text-base text-foreground/70 mb-xl max-w-3xl leading-relaxed", children: "Join smart shoppers who trust our reviews and discover amazing deals across all categories." }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-lg justify-center items-center", children: [
              /* @__PURE__ */ jsx(
                Button,
                {
                  color: "primary",
                  size: "md",
                  rightIcon: /* @__PURE__ */ jsx(Icons.externalLink, { className: "w-4 h-4" }),
                  onClick: () => window.location.href = "/deals",
                  className: "container-px-xl container-py-md",
                  children: "Browse Deals"
                }
              ),
              /* @__PURE__ */ jsx(
                Button,
                {
                  variant: "bordered",
                  size: "md",
                  rightIcon: /* @__PURE__ */ jsx(Icons.mail, { className: "w-4 h-4" }),
                  onClick: () => window.location.href = "/contact",
                  className: "container-px-xl container-py-md",
                  children: "Contact Us"
                }
              )
            ] })
          ] })
        ] }) })
      ] })
    ] })
  ] });
};
export {
  About as default
};
