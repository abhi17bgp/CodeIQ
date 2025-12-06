import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Code, Zap, Brain, Shield, Sparkles, ArrowRight, Star } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

const Home: React.FC = () => {
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({
    hero: true,
    features: true,
    stats: true,
    cta: true,
  });
  const [stats, setStats] = useState({ totalUsers: 0, totalFiles: 0 });
  const [statsLoading, setStatsLoading] = useState(true);
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const features: Array<{
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description: string;
    color: string;
    badge?: { text: string; icon?: React.ComponentType<{ className?: string }> };
    features?: string[];
    isAI?: boolean;
  }> = [
    {
      icon: Code,
      title: "Multi-Language Support",
      description:
        "Write code in JavaScript, Python, Java, C++, and more with syntax highlighting and auto-completion.",
      color: "from-blue-500 to-cyan-500",
      badge: { text: "10+ Languages", icon: Code },
      features: [
        "JavaScript, Python, Java",
        "C++, C, C#, Go, Rust",
        "PHP, Ruby & more",
      ],
    },
    {
      icon: Zap,
      title: "Instant Execution",
      description:
        "Run your code instantly with our powerful backend integration using Judge0 API.",
      color: "from-yellow-500 to-orange-500",
      badge: { text: "Fast & Reliable", icon: Zap },
      features: [
        "Real-time code execution",
        "Input/output handling",
        "Error detection & debugging",
      ],
    },
    {
      icon: Brain,
      title: "AI DSA Instructor",
      description:
        "Get personalized help with Data Structures and Algorithms from our AI-powered instructor. Real-time code analysis, instant fixes, and intelligent suggestions.",
      color: "from-purple-500 to-pink-500",
      badge: { text: "AI Powered", icon: Sparkles },
      features: [
        "Code analysis & fixes",
        "Context-aware suggestions",
        "Chat history & context",
      ],
      isAI: true,
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description:
        "Your code and data are protected with enterprise-grade security and encryption.",
      color: "from-green-500 to-emerald-500",
      badge: { text: "Enterprise Grade", icon: Shield },
      features: [
        "End-to-end encryption",
        "Secure authentication",
        "Private code storage",
      ],
    },
  ];

  // Fetch platform stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/stats');
        if (response.data && typeof response.data.totalUsers === 'number' && typeof response.data.totalFiles === 'number') {
          setStats({
            totalUsers: response.data.totalUsers,
            totalFiles: response.data.totalFiles
          });
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Handle hash navigation on mount
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash) {
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          const offset = 80; // Navbar height
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }
      }, 100);
    }
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -100px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible((prev) => ({
            ...prev,
            [entry.target.id]: true,
          }));
        }
      });
    }, observerOptions);

    const refs = [heroRef, featuresRef, ctaRef];
    refs.forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => {
      refs.forEach((ref) => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
    };
  }, []);

  // Format count function (same as PlatformStats)
  const formatCount = (count: number): string => {
  if (count >= 1000) {
    return `${Math.floor(count / 1000)}K+`;
  } else if (count >= 100) {
    return `${Math.floor(count)}+`;
  } else if (count >= 10) {
    // For numbers 10-99, round down to nearest 10 and add +
    return `${Math.floor(count)}+`;
  } else if (count > 0) {
    // For numbers 1-9, show exact count with +
    return `${count}+`;
  }
  return '0';
};


  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Animated Background Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary rounded-full animate-float opacity-30"></div>
        <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-primary rounded-full animate-float-delayed opacity-20"></div>
        <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-primary rounded-full animate-float opacity-25"></div>
        <div className="absolute top-1/2 right-1/3 w-4 h-4 bg-primary rounded-full animate-float-delayed opacity-15"></div>
        <div className="absolute bottom-1/3 right-1/2 w-2 h-2 bg-primary rounded-full animate-float opacity-30"></div>
      </div>

      {/* Hero Section */}
      <section id="hero" className="relative overflow-hidden bg-animated-gradient min-h-[90vh] flex items-center scroll-mt-20">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
        
        {/* Floating Code Icons */}
        <div className="absolute top-20 left-10 animate-float opacity-10">
          <Code className="w-20 h-20 text-primary" />
        </div>
        <div className="absolute bottom-20 right-10 animate-float-delayed opacity-10">
          <Brain className="w-24 h-24 text-primary" />
        </div>
        <div className="absolute top-1/2 left-20 animate-float opacity-10">
          <Zap className="w-16 h-16 text-primary" />
        </div>

        <div
          ref={heroRef}
          className={`relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 z-10 ${
            isVisible["hero"] ? "animate-fade-in-up" : "opacity-100"
          }`}
        >
          <div className="text-center">
            {/* Animated Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 bg-primary/10 border border-primary/20 rounded-full animate-fade-in-down">
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-sm font-medium text-primary">
                AI-Powered Coding Platform
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="block text-foreground animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                Code, Compile, and
              </span>
              <span
                className="block text-gradient-animated animate-fade-in-up"
                style={{ animationDelay: "0.4s" }}
              >
                Conquer
              </span>
            </h1>

            <p
              className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in-up"
              style={{ animationDelay: "0.6s" }}
            >
              The ultimate coding platform with multi-language support, instant
              execution, and AI-powered assistance. Perfect for learning,
              practicing, and mastering Data Structures & Algorithms.
            </p>

            <div
              className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up"
              style={{ animationDelay: "0.8s" }}
            >
              {user ? (
                <Link
                  to="/editor"
                  className="group px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transform hover:scale-105 transition-all duration-300 shadow-lg shadow-primary/50 hover:shadow-xl hover:shadow-primary/60 flex items-center gap-2"
                >
                  Start Coding
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="group px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transform hover:scale-105 transition-all duration-300 shadow-lg shadow-primary/50 hover:shadow-xl hover:shadow-primary/60 flex items-center gap-2"
                  >
                    Get Started Free
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    to="/login"
                    className="px-8 py-4 border-2 border-border text-foreground font-semibold rounded-lg hover:bg-accent hover:border-primary/50 transition-all duration-300 transform hover:scale-105"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>

            {/* Stats Preview */}
            <div
              className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto animate-fade-in-up"
              style={{ animationDelay: "1s" }}
            >
              {[
                { label: "Languages", value: "10+", isStatic: true },
                { label: "Users", value: statsLoading ? "..." : formatCount(stats.totalUsers), isStatic: false },
                { label: "Code Files", value: statsLoading ? "..." : formatCount(stats.totalFiles), isStatic: false },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="text-center p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border hover:border-primary/50 transition-all duration-300 hover:scale-105"
                >
                  <div className="text-3xl font-bold text-primary mb-1">
                    {statsLoading && !stat.isStatic ? (
                      <span className="inline-block w-12 h-8 bg-muted rounded animate-pulse"></span>
                    ) : (
                      stat.value
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        ref={featuresRef}
        id="features"
        className="py-24 bg-background relative scroll-mt-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`text-center mb-16 ${
              isVisible["features"]
                ? "animate-fade-in-down"
                : "opacity-100"
            }`}
          >
            <div className="inline-flex items-center gap-2 mb-4">
              <Star className="w-5 h-5 text-primary animate-pulse" />
              <span className="text-sm font-semibold text-primary uppercase tracking-wide">
                Features
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Everything You Need to Code
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Code smarter with real-time AI assistance, multi-language support,
              and a powerful in-browser compiler — all in one place.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const delay = index * 0.1;
              return (
                <div
                  key={index}
                  className={`group relative p-6 bg-card border border-border rounded-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 ${
                    isVisible["features"]
                      ? "animate-fade-in-up"
                      : "opacity-100"
                  }`}
                  style={{ animationDelay: `${delay}s` }}
                >
                  {/* Gradient Background on Hover */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-500 ${
                      feature.isAI ? "group-hover:opacity-15" : ""
                    }`}
                  ></div>

                  {/* Glowing Border Effect */}
                  <div className={`absolute inset-0 rounded-xl border-2 border-primary opacity-0 group-hover:opacity-30 transition-opacity duration-500 ${
                    feature.isAI ? "group-hover:opacity-40" : ""
                  }`}></div>
                  
                  {/* Special glow effect for all features */}
                  <div className={`absolute inset-0 rounded-xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl ${
                    feature.isAI ? "" : "group-hover:opacity-50"
                  }`}></div>
                  
                  {/* Decorative corner accent */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <div className="relative z-10">
                    {/* Badge for all features */}
                    {feature.badge && (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 mb-3 bg-primary/10 border border-primary/20 rounded-full">
                        {feature.badge.icon && (
                          <feature.badge.icon className="h-3 w-3 text-primary" />
                        )}
                        <span className="text-xs font-medium text-primary">
                          {feature.badge.text}
                        </span>
                      </div>
                    )}
                    
                    <div
                      className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg ${
                        feature.isAI ? "shadow-primary/30 group-hover:shadow-primary/50" : ""
                      }`}
                    >
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      {feature.description}
                    </p>
                    
                    {/* Features list for all features */}
                    {feature.features && feature.features.length > 0 && (
                      <div className="space-y-2 mt-4 pt-4 border-t border-border/50">
                        {feature.features.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 text-sm text-muted-foreground"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0"></div>
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
{/* 
      {/* CTA Section */}
      <section
        ref={ctaRef}
        id="cta"
        className="relative py-24 overflow-hidden scroll-mt-20"
      >
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-primary bg-animated-gradient"></div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "2s" }}></div>

        <div
          className={`relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10 ${
            isVisible["cta"] ? "animate-scale-in" : "opacity-100 scale-100"
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full">
            <Sparkles className="w-4 h-4 text-white animate-pulse" />
            <span className="text-sm font-medium text-white">
              Join Thousands of Developers
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Start Your Coding Journey?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-10 max-w-2xl mx-auto">
            Powerful features designed to enhance your coding experience and
            accelerate your learning. Start coding today and unlock your
            potential.
          </p>
          {!user && (
            <Link
              to="/register"
              className="group inline-flex items-center gap-2 px-10 py-5 bg-background text-primary font-semibold rounded-lg hover:bg-background/95 transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-3xl text-lg"
            >
              Start Coding Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>
      </section> */}
      {/* CTA Section */}
<section
  ref={ctaRef}
  id="cta"
  className="relative py-24 overflow-hidden scroll-mt-20"
>
  {/* Animated Gradient Background */}
  <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-primary bg-animated-gradient"></div>

  {/* Decorative Elements */}
  <div className="absolute top-0 left-0 w-72 h-72 
      dark:bg-white/5 bg-black/10 
      rounded-full blur-3xl animate-pulse-slow">
  </div>

  <div
    className="absolute bottom-0 right-0 w-96 h-96 
      dark:bg-white/5 bg-black/10 
      rounded-full blur-3xl animate-pulse-slow"
    style={{ animationDelay: "2s" }}
  ></div>

  <div
    className={`relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10 ${
      isVisible["cta"] ? "animate-scale-in" : "opacity-100 scale-100"
    }`}
  >
    <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 
        dark:bg-white/10 bg-black/10 
        backdrop-blur-sm 
        border dark:border-white/20 border-black/20 
        rounded-full">
      <Sparkles className="w-4 h-4 dark:text-white text-black animate-pulse" />
      <span className="text-sm font-medium dark:text-white text-black">
        Join Thousands of Developers
      </span>
    </div>

    <h2 className="text-4xl md:text-5xl font-bold dark:text-white text-gray-900 mb-6">
      Ready to Start Your Coding Journey?
    </h2>

    <p className="text-xl dark:text-white/90 text-gray-700 mb-10 max-w-2xl mx-auto">
      Powerful features designed to enhance your coding experience and
      accelerate your learning. Start coding today and unlock your potential.
    </p>

    {!user && (
      <Link
        to="/register"
        className="group inline-flex items-center gap-2 px-10 py-5 
          dark:bg-background bg-white 
          dark:text-primary text-gray-900 
          font-semibold rounded-lg 
          hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-3xl text-lg"
      >
        Start Coding Now
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </Link>
    )}
  </div>
</section>

    </div>
  );
};

export default Home;
