import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Code,
  Sun,
  Moon,
  User,
  LogOut,
  Files,
  Home,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsMobileMenuOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;
  const isHomePage = location.pathname === "/";

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  // Smooth scroll to section on home page
  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== "/") {
      navigate(`/#${sectionId}`);
      setIsMobileMenuOpen(false);
      // Wait for navigation, then scroll
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          const offset = 80; // Navbar height
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }
      }, 300);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        const offset = 80; // Navbar height
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 dark:bg-background/90 backdrop-blur-md border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 group"
            onClick={closeMobileMenu}
          >
            <div className="p-2 bg-primary rounded-lg group-hover:shadow-lg group-hover:shadow-primary/50 transition-shadow">
              <Code className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-primary">
              CodeIQ
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          {user ? (
            <div className="hidden md:flex items-center space-x-1">
              <Link
                to="/dashboard"
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive("/dashboard")
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/80 hover:bg-accent"
                }`}
              >
                <Home className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
              <Link
                to="/editor"
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive("/editor")
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/80 hover:bg-accent"
                }`}
              >
                <Code className="h-4 w-4" />
                <span>Editor</span>
              </Link>
              <Link
                to="/files"
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive("/files")
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/80 hover:bg-accent"
                }`}
              >
                <Files className="h-4 w-4" />
                <span>Files</span>
              </Link>
            </div>
          ) : (
            // Navigation links for non-authenticated users (home page sections)
            isHomePage && (
              <div className="hidden md:flex items-center space-x-1">
                <button
                  onClick={() => scrollToSection("hero")}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-foreground/80 hover:bg-accent transition-colors"
                >
                  <span>Home</span>
                </button>
                
                <button
                  onClick={() => scrollToSection("features")}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-foreground/80 hover:bg-accent transition-colors"
                >
                  <span>Features</span>
                </button>
                <button
                  onClick={() => scrollToSection("cta")}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-foreground/80 hover:bg-accent transition-colors"
                >
                  <span>Get Started</span>
                </button>
                <button
                  onClick={() => scrollToSection("platform-stats")}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-foreground/80 hover:bg-accent transition-colors"
                >
                  <span>Stats</span>
                </button>
              </div>
            )
          )}

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5 text-foreground" />
              ) : (
                <Sun className="h-5 w-5 text-foreground" />
              )}
            </button>

            {/* User Menu */}
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="hidden lg:block text-right">
                  <p className="text-sm font-medium text-foreground">
                    {user.profile?.firstName || user.username}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {user.email}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                    aria-label="Logout"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-lg hover:opacity-90 transition-opacity"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Right Side */}
          <div className="flex md:hidden items-center space-x-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <Moon className="h-4 w-4 text-gray-700 dark:text-gray-300" />
              ) : (
                <Sun className="h-4 w-4 text-gray-700 dark:text-gray-300" />
              )}
            </button>

            {/* Mobile Menu Button */}
            {user && (
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                ) : (
                  <Menu className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                )}
              </button>
            )}

            {/* Mobile Auth Buttons */}
            {!user && (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-3 py-2 text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-lg hover:opacity-90 transition-opacity"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {user && isMobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background absolute left-0 right-0 top-16 shadow-lg">
            <div className="px-4 py-4 space-y-2">
              {/* User Info */}
              <div className="flex items-center space-x-3 pb-4 border-b border-border">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {user.profile?.firstName || user.username}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </div>

              {/* Navigation Links */}
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={closeMobileMenu}
                    className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium transition-colors ${
                      isActive("/dashboard")
                        ? "bg-primary/10 text-primary"
                        : "text-foreground/80 hover:bg-accent"
                    }`}
                  >
                    <Home className="h-5 w-5" />
                    <span>Dashboard</span>
                  </Link>
                  <Link
                    to="/editor"
                    onClick={closeMobileMenu}
                    className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium transition-colors ${
                      isActive("/editor")
                        ? "bg-primary/10 text-primary"
                        : "text-foreground/80 hover:bg-accent"
                    }`}
                  >
                    <Code className="h-5 w-5" />
                    <span>Editor</span>
                  </Link>
                  <Link
                    to="/files"
                    onClick={closeMobileMenu}
                    className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium transition-colors ${
                      isActive("/files")
                        ? "bg-primary/10 text-primary"
                        : "text-foreground/80 hover:bg-accent"
                    }`}
                  >
                    <Files className="h-5 w-5" />
                    <span>Files</span>
                  </Link>
                </>
              ) : (
                // Home page section links for mobile
                isHomePage && (
                  <>
                    <button
                      onClick={() => scrollToSection("hero")}
                      className="flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium text-foreground/80 hover:bg-accent transition-colors w-full text-left"
                    >
                      <Home className="h-5 w-5" />
                      <span>Home</span>
                    </button>
                    <button
                      onClick={() => scrollToSection("platform-stats")}
                      className="flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium text-foreground/80 hover:bg-accent transition-colors w-full text-left"
                    >
                      <Files className="h-5 w-5" />
                      <span>Stats</span>
                    </button>
                    <button
                      onClick={() => scrollToSection("features")}
                      className="flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium text-foreground/80 hover:bg-accent transition-colors w-full text-left"
                    >
                      <Code className="h-5 w-5" />
                      <span>Features</span>
                    </button>
                    <button
                      onClick={() => scrollToSection("cta")}
                      className="flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium text-foreground/80 hover:bg-accent transition-colors w-full text-left"
                    >
                      <span>Get Started</span>
                    </button>
                  </>
                )
              )}

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium text-destructive hover:bg-destructive/10 transition-colors w-full"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
