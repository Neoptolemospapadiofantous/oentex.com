import { useEffect, useMemo, useRef, useState } from "react";
import { Icons } from "./icons";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  // Gentle parallax with rAF (no janky state spam)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const frame = useRef<number | null>(null);
  const lastPos = useRef({ x: 0, y: 0 });
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduceMotion(mq.matches);
    onChange();
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      lastPos.current = { x: e.clientX, y: e.clientY };
      if (!frame.current) {
        frame.current = requestAnimationFrame(() => {
          setMousePosition(lastPos.current);
          frame.current = null;
        });
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const handleGetStarted = () => navigate("/deals");
  const handleLearnMore = () => navigate("/about");

  const features = [
    { icon: Icons.shield, text: "Regulated Partners" },
    { icon: Icons.chart, text: "Market Analysis" },
    { icon: Icons.bolt, text: "Exclusive Bonuses" },
  ];

  const cryptoSymbols = [
    { symbol: "BTC", color: "from-orange-400/20 to-orange-600/20", border: "border-orange-400/30", text: "text-orange-500" },
    { symbol: "ETH", color: "from-blue-400/20 to-blue-600/20", border: "border-blue-400/30", text: "text-blue-500" },
    { symbol: "STOCKS", color: "from-green-400/20 to-green-600/20", border: "border-green-400/30", text: "text-green-500" },
    { symbol: "BONDS", color: "from-purple-400/20 to-purple-600/20", border: "border-purple-400/30", text: "text-purple-500" },
    { symbol: "FOREX", color: "from-cyan-400/20 to-cyan-600/20", border: "border-cyan-400/30", text: "text-cyan-500" },
    { symbol: "BANK", color: "from-indigo-400/20 to-indigo-600/20", border: "border-indigo-400/30", text: "text-indigo-500" },
    { symbol: "GOLD", color: "from-yellow-400/20 to-yellow-600/20", border: "border-yellow-400/30", text: "text-yellow-600" },
    { symbol: "USD", color: "from-gray-400/20 to-gray-600/20", border: "border-gray-400/30", text: "text-gray-500" },
  ];

  const bubblePositions = [
    { left: "5%", top: "14%", size: "w-10 h-10 sm:w-14 sm:h-14", delay: "0s", duration: "4.8s" },
    { right: "6%", top: "12%", size: "w-10 h-10 sm:w-14 sm:h-14", delay: "0.4s", duration: "5.2s" },
    { left: "3%", top: "42%", size: "w-12 h-12 sm:w-16 sm:h-16", delay: "0.8s", duration: "6s" },
    { right: "4%", top: "46%", size: "w-10 h-10 sm:w-14 sm:h-14", delay: "1.2s", duration: "5s" },
    { left: "8%", bottom: "22%", size: "w-12 h-12 sm:w-16 sm:h-16", delay: "1.6s", duration: "5.6s" },
    { right: "9%", bottom: "26%", size: "w-10 h-10 sm:w-14 sm:h-14", delay: "2s", duration: "4.6s" },
    { left: "12%", top: "30%", size: "w-8 h-8 sm:w-12 sm:h-12", delay: "2.4s", duration: "6.2s" },
    { right: "12%", bottom: "38%", size: "w-10 h-10 sm:w-14 sm:h-14", delay: "2.8s", duration: "5.4s" },
  ];

  const particles = useMemo(
    () =>
      Array.from({ length: 12 }).map(() => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        delay: `${Math.random() * 10}s`,
        duration: `${8 + Math.random() * 4}s`,
      })),
    []
  );

  return (
    <section
      aria-labelledby="hero-title"
      className="page-hero relative min-h-screen flex-center section-transition component-fade-in"
    >

      {/* Enhanced interactive parallax elements aligned with content (desktop only) */}
      <div className="absolute inset-0 hidden md:block pointer-events-none" aria-hidden="true">
        {/* Content-aligned container for Hero effects */}
        <div className="relative w-full h-full max-w-7xl mx-auto container-px-sm sm:container-px-md lg:container-px-lg">
          {/* Enhanced purple cloud effects */}
          <div
            className={`absolute w-80 h-80 sm:w-[28rem] sm:h-[28rem] rounded-full blur-3xl bg-gradient-to-br from-primary/15 via-secondary/12 to-accent/10 ${
              reduceMotion ? "" : "animate-float-enhanced"
            }`}
            style={{
              left: `${-40 + mousePosition.x * 0.008}px`,
              top: `${-8 + mousePosition.y * 0.008}%`,
            }}
          />
          <div
            className={`absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full blur-3xl bg-gradient-to-tl from-accent/12 via-primary/10 to-secondary/8 ${
              reduceMotion ? "" : "animate-float-enhanced"
            }`}
            style={{
              right: `${-32 + mousePosition.x * 0.006}px`,
              bottom: `${-8 + mousePosition.y * 0.006}%`,
              animationDelay: "2s",
            }}
          />
          <div
            className={`absolute w-64 h-64 sm:w-80 sm:h-80 rounded-full blur-3xl bg-gradient-to-r from-secondary/10 via-accent/8 to-primary/6 ${
              reduceMotion ? "" : "animate-float"
            }`}
            style={{
              left: `${45 + mousePosition.x * 0.004}%`,
              top: `${25 + mousePosition.y * 0.004}%`,
              animationDelay: "4s",
            }}
          />
          {/* Additional subtle cloud layer */}
          <div
            className={`absolute w-56 h-56 sm:w-72 sm:h-72 rounded-full blur-2xl bg-gradient-to-br from-primary/8 to-accent/6 ${
              reduceMotion ? "" : "animate-float-light"
            }`}
            style={{
              left: `${60 + mousePosition.x * 0.003}%`,
              top: `${60 + mousePosition.y * 0.003}%`,
              animationDelay: "1.5s",
            }}
          />
        </div>
          {cryptoSymbols.map((c, i) => {
            const p = bubblePositions[i];
            if (!p) return null;
            return (
              <div
                key={c.symbol}
                className={`${reduceMotion ? "" : "animate-float-enhanced"} absolute group cursor-pointer`}
                style={{
                  left: p.left,
                  right: p.right,
                  top: p.top,
                  bottom: p.bottom,
                  animationDelay: p.delay,
                  animationDuration: p.duration,
                }}
              >
                {/* Enhanced bubble with multiple layers */}
                <div className="relative">
                  {/* Outer glow ring */}
                  <div 
                    className={`absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 ${c.color.replace('from-', 'from-').replace('to-', 'to-').replace('/20', '/40').replace('/30', '/60')} blur-sm scale-150`}
                  />
                  
                  {/* Main bubble */}
                  <div
                    className={`${p.size} bg-gradient-to-br ${c.color} rounded-full border-2 ${c.border} flex items-center justify-center backdrop-blur-sm shadow-lg transition-all duration-500 hover:scale-125 hover:shadow-2xl hover:shadow-primary/30 group-hover:rotate-12 group-hover:brightness-110 relative overflow-hidden`}
                  >
                    {/* Inner shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Animated border */}
                    <div className="absolute inset-0 rounded-full border-2 border-transparent bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-spin" style={{ animationDuration: '3s' }} />
                    
                    <span className={`${c.text} font-bold text-[10px] sm:text-xs select-none transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-sm relative z-10`}>{c.symbol}</span>
                  </div>
                  
                  {/* Floating particles around bubble */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className={`absolute w-1 h-1 ${c.text.replace('text-', 'bg-')} rounded-full opacity-0 group-hover:opacity-60 transition-all duration-1000 animate-float-light`} 
                         style={{ 
                           left: '20%', 
                           top: '10%', 
                           animationDelay: '0.2s',
                           animationDuration: '2s'
                         }} />
                    <div className={`absolute w-0.5 h-0.5 ${c.text.replace('text-', 'bg-')} rounded-full opacity-0 group-hover:opacity-40 transition-all duration-1200 animate-float-light`} 
                         style={{ 
                           right: '15%', 
                           bottom: '20%', 
                           animationDelay: '0.8s',
                           animationDuration: '2.5s'
                         }} />
                  </div>
                </div>
              </div>
            );
          })}

          {particles.map((pt, i) => (
            <div
              key={i}
              className={`absolute w-1 h-1 bg-primary/40 rounded-full ${reduceMotion ? "" : "animate-float-light"} transition-all duration-300 hover:scale-200 hover:bg-primary/80 hover:shadow-lg hover:shadow-primary/50 cursor-pointer group`}
              style={{ left: pt.left, top: pt.top, animationDelay: pt.delay, animationDuration: pt.duration }}
            >
              {/* Particle glow effect */}
              <div className="absolute inset-0 rounded-full bg-primary/20 scale-0 group-hover:scale-150 transition-transform duration-500 opacity-0 group-hover:opacity-100" />
            </div>
          ))}

          {/* Subtle connection lines that flow from hero to features */}
          <svg className="absolute inset-0 w-full h-full opacity-15 animate-pulse-glow" role="presentation">
            <defs>
              <linearGradient id="heroConnectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--heroui-primary))" stopOpacity="0.4" />
                <stop offset="50%" stopColor="hsl(var(--heroui-secondary))" stopOpacity="0.3" />
                <stop offset="100%" stopColor="hsl(var(--heroui-primary))" stopOpacity="0.4" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            {/* Very subtle connection lines that flow from hero to features */}
            <line x1="5%" y1="88%" x2="95%" y2="98%" stroke="url(#heroConnectionGradient)" strokeWidth="1" opacity="0.5" filter="url(#glow)" />
            <line x1="10%" y1="85%" x2="90%" y2="95%" stroke="url(#heroConnectionGradient)" strokeWidth="0.8" opacity="0.4" />
            <line x1="15%" y1="82%" x2="85%" y2="92%" stroke="url(#heroConnectionGradient)" strokeWidth="0.6" opacity="0.3" />
            {/* Very subtle diagonal connection lines */}
            <line x1="20%" y1="80%" x2="80%" y2="90%" stroke="url(#heroConnectionGradient)" strokeWidth="0.8" opacity="0.4" />
            <line x1="25%" y1="78%" x2="75%" y2="88%" stroke="url(#heroConnectionGradient)" strokeWidth="0.6" opacity="0.3" />
            {/* Very subtle vertical flow lines */}
            <line x1="50%" y1="75%" x2="50%" y2="100%" stroke="url(#heroConnectionGradient)" strokeWidth="0.6" opacity="0.2" />
            <line x1="30%" y1="80%" x2="30%" y2="100%" stroke="url(#heroConnectionGradient)" strokeWidth="0.4" opacity="0.15" />
            <line x1="70%" y1="80%" x2="70%" y2="100%" stroke="url(#heroConnectionGradient)" strokeWidth="0.4" opacity="0.15" />
          </svg>
        </div>

      {/* Content */}
      <div className="container-page relative z-10">
        <div className="content-full">
          <div className="flex-col-center text-center">

              {/* Headline with enhanced animations */}
              <h1 id="hero-title" className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold mb-4 sm:mb-6 leading-tight tracking-tight">
                <span className="block text-text animate-fade-in-up" style={{ animationDelay: "0.2s" }}>Your Gateway to</span>
                <span className="block gradient-text animate-gradient-shift animate-fade-in-up" style={{ animationDelay: "0.4s" }}>Financial Freedom</span>
              </h1>

              {/* Subtitle with animation */}
              <div className="content-wide">
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-textSecondary max-w-3xl mx-auto mb-8 sm:mb-12 leading-relaxed container-px-xs animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
                  Discover exclusive bonuses and deals from top crypto exchanges, stock brokers, banks, and investment platforms.
                  Compare offers and maximize your financial potential.
                </p>
              </div>

              {/* CTAs with enhanced animations */}
              <div className="flex-col-center gap-4 sm:gap-6 mb-10 sm:mb-14 container-px-md animate-fade-in-up" style={{ animationDelay: "0.8s" }}>
                <div className="flex-col-center sm:flex-row gap-3 sm:gap-4">
                  <button
                    type="button"
                    onClick={handleGetStarted}
                    aria-label="Explore investment deals"
                    className="btn-primary w-full sm:w-auto container-px-lg container-py-md text-base sm:text-lg group relative overflow-hidden transform hover:scale-105 transition-all duration-300"
                  >
                    <span className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-white/0 via-white/20 to-white/0 group-hover:translate-x-[100%] transition-transform duration-700" />
                    <span className="relative z-10 inline-flex items-center gap-2">
                      <span>Explore Deals</span>
                      <Icons.arrowRight className="w-4 h-4 sm:w-5 sm:h-5 translate-y-[0.5px] group-hover:translate-x-1 transition-transform duration-300" aria-hidden />
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={handleLearnMore}
                    className="btn-secondary w-full sm:w-auto container-px-lg container-py-md text-base sm:text-lg transform hover:scale-105 transition-all duration-300"
                  >
                    Learn More
                  </button>
                </div>
              </div>

              {/* Enhanced feature icons with staggered animations */}
              <ul className="mx-auto max-w-2xl grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 container-px-md animate-fade-in-up" style={{ animationDelay: "1s" }}>
                {features.map((f, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-center gap-3 sm:gap-4 text-textSecondary hover:text-primary transition-all duration-300 group animate-fade-in-up"
                    style={{ animationDelay: `${1.2 + i * 0.1}s` }}
                  >
                    {/* Enhanced icon tile with hover effects */}
                    <span className="inline-flex items-center justify-center shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-primary/15 bg-gradient-to-r from-primary/10 to-secondary/10 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/20 transition-all duration-300">
                      <f.icon className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-primary group-hover:rotate-12 transition-transform duration-300" aria-hidden />
                    </span>
                    <span className="text-sm sm:text-base font-medium leading-none group-hover:scale-105 transition-transform duration-300">{f.text}</span>
                  </li>
                ))}
              </ul>
              {/* ===================================== */}
            </div>
          </div>
        </div>

     </section>
  );
};

export default Hero;
