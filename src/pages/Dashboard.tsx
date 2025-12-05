import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Files, Brain, Plus, Sparkles, ArrowRight, Star, Zap, Code } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import WelcomeBanner from "../components/WelcomeBanner";

const Dashboard: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({});
  const headerRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (localStorage.getItem("showWelcome") === "true") {
      setShowBanner(true);
      localStorage.removeItem("showWelcome");
    }
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
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

    const refs = [headerRef, actionsRef, statsRef];
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

  const { user } = useAuth();

  const quickActions = [
    {
      title: "New Code File",
      description: "Start a new coding project",
      icon: Plus,
      link: "/editor",
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Browse Files",
      description: "View and manage your code files",
      icon: Files,
      link: "/files",
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "AI Assistant",
      description: "Get help with DSA concepts",
      icon: Brain,
      link: "/editor?ai=true",
      color: "from-purple-500 to-pink-500",
    },
  ];

  return (
    <div className="min-h-screen bg-animated-gradient relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary rounded-full animate-float opacity-20"></div>
        <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-primary rounded-full animate-float-delayed opacity-15"></div>
        <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-primary rounded-full animate-float opacity-20"></div>
      </div>

      {showBanner && (
        <WelcomeBanner username={user?.profile?.firstName || user?.username || "User"} />
      )}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16 relative z-10">
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
          {/* Header */}
          <div
            ref={headerRef}
            id="header"
            className={`text-center mb-12 lg:mb-16 max-w-4xl ${
              isVisible["header"] ? "animate-fade-in-down" : "opacity-0"
            }`}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-primary/10 border border-primary/20 rounded-full">
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-sm font-medium text-primary">
                Welcome Back
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight">
              <span className="block text-foreground animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                Welcome back,
              </span>
              <span
                className="block text-gradient-animated animate-fade-in-up"
                style={{ animationDelay: "0.4s" }}
              >
                {user?.profile?.firstName || user?.username}!
              </span>
            </h1>
            <p
              className="text-lg sm:text-xl lg:text-2xl text-muted-foreground leading-relaxed animate-fade-in-up"
              style={{ animationDelay: "0.6s" }}
            >
              Ready to continue your coding journey?
            </p>
          </div>

          {/* Quick Actions */}
          <div
            ref={actionsRef}
            id="actions"
            className={`w-full max-w-6xl ${
              isVisible["actions"] ? "animate-fade-in-up" : "opacity-0"
            }`}
            style={{ animationDelay: "0.2s" }}
          >
            <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 lg:p-8 shadow-xl border border-border/50">
              <div className="flex items-center justify-center gap-2 mb-8">
                <Zap className="w-5 h-5 text-primary" />
                <h2 className="text-xl lg:text-2xl font-semibold text-foreground">
                  Quick Actions
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  const delay = index * 0.15;
                  return (
                    <Link
                      key={index}
                      to={action.link}
                      className={`group relative p-6 lg:p-8 rounded-xl border-2 border-border hover:border-primary/50 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-card ${
                        isVisible["actions"]
                          ? "animate-fade-in-up"
                          : "opacity-0"
                      }`}
                      style={{ animationDelay: `${delay}s` }}
                    >
                      {/* Gradient overlay on hover */}
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-500`}
                      />

                      {/* Glowing border effect */}
                      <div className="absolute inset-0 rounded-xl border-2 border-primary opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>

                      <div className="relative z-10">
                        <div
                          className={`w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}
                        >
                          <Icon className="h-7 w-7 lg:h-8 lg:w-8 text-white" />
                        </div>

                        <h3 className="font-semibold text-lg lg:text-xl text-foreground mb-3 group-hover:text-primary transition-colors">
                          {action.title}
                        </h3>

                        <p className="text-sm lg:text-base text-muted-foreground leading-relaxed mb-4">
                          {action.description}
                        </p>

                        <div className="flex items-center text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <span className="text-sm font-medium">Get Started</span>
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>

                      {/* Decorative Corner */}
                      <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Additional Stats or Info */}
          <div
            ref={statsRef}
            id="stats"
            className={`mt-12 lg:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl ${
              isVisible["stats"] ? "animate-fade-in-up" : "opacity-0"
            }`}
            style={{ animationDelay: "0.4s" }}
          >
            {[
              { value: "10+", label: "Languages Supported", icon: Code },
              { value: "AI", label: "Powered Assistant", icon: Brain },
              { value: "24/7", label: "Available", icon: Zap },
            ].map((stat, index) => {
              const Icon = stat.icon;
              const delay = index * 0.1;
              return (
                <div
                  key={index}
                  className={`text-center p-6 bg-card/60 backdrop-blur-sm rounded-xl border border-border/50 hover:border-primary/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${
                    isVisible["stats"]
                      ? "animate-fade-in-up"
                      : "opacity-0"
                  }`}
                  style={{ animationDelay: `${delay}s` }}
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-3">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-2xl lg:text-3xl font-bold text-primary mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm lg:text-base text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
