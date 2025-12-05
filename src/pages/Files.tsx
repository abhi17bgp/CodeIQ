import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Plus,
  Calendar,
  Code,
  Trash2,
  Edit3,
  FileCode,
  ArrowRight,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

interface CodeFile {
  _id: string;
  title: string;
  description: string;
  language: string;
  code: string;
  createdAt: string;
  updatedAt: string;
  author: {
    username: string;
    profile: {
      firstName?: string;
      lastName?: string;
    };
  };
}

const Files: React.FC = () => {
  const [files, setFiles] = useState<CodeFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({});
  const headerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const filesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchFiles();
  }, [currentPage, searchTerm]);

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

    const refs = [headerRef, searchRef, filesRef];
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
  }, [files]);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/files", {
        params: {
          page: currentPage,
          limit: 10,
          search: searchTerm,
        },
      });

      setFiles(response.data.files);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      toast.error("Failed to fetch files");
    } finally {
      setLoading(false);
    }
  };

  const deleteFile = async (fileId: string) => {
    if (!confirm("Are you sure you want to delete this file?")) return;

    try {
      await axios.delete(`/files/${fileId}`);
      toast.success("File deleted successfully");
      fetchFiles();
      // Trigger stats update event
      window.dispatchEvent(new Event("statsUpdate"));
    } catch (error) {
      toast.error("Failed to delete file");
    }
  };

  const getLanguageColor = (language: string) => {
    const colors: { [key: string]: string } = {
      javascript:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      python: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      java: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      cpp: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      c: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
      go: "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200",
      rust: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      csharp:
        "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
      php: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
      ruby: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    };
    return (
      colors[language] ||
      "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchFiles();
  };

  if (loading && files.length === 0) {
    return (
      <div className="min-h-screen bg-animated-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading files...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-animated-gradient relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary rounded-full animate-float opacity-20"></div>
        <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-primary rounded-full animate-float-delayed opacity-15"></div>
        <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-primary rounded-full animate-float opacity-20"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Header */}
        <div
          ref={headerRef}
          id="header"
          className={`flex items-center justify-between mb-8 ${
            isVisible["header"] ? "animate-fade-in-down" : "opacity-0"
          }`}
        >
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-4 bg-primary/10 border border-primary/20 rounded-full">
              <FileCode className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                Code Files
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              My Files
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage and organize your code files
            </p>
          </div>
          <Link
            to="/editor"
            className="group flex items-center space-x-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transform hover:scale-105 transition-all duration-300 shadow-lg shadow-primary/50 hover:shadow-xl hover:shadow-primary/60"
          >
            <Plus className="h-5 w-5" />
            <span>New File</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Search */}
        <div
          ref={searchRef}
          id="search"
          className={`mb-6 ${
            isVisible["search"] ? "animate-fade-in-up" : "opacity-0"
          }`}
          style={{ animationDelay: "0.2s" }}
        >
          <form
            onSubmit={handleSearch}
            className="flex space-x-4 bg-card/80 backdrop-blur-sm p-4 rounded-xl border border-border/50 shadow-lg"
          >
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search files by name or description..."
                className="w-full pl-10 pr-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground transition-all"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transform hover:scale-105 transition-all duration-300 shadow-lg shadow-primary/50"
            >
              Search
            </button>
          </form>
        </div>

        {/* Files Grid */}
        <div
          ref={filesRef}
          id="files"
          className={isVisible["files"] ? "animate-fade-in-up" : "opacity-0"}
          style={{ animationDelay: "0.3s" }}
        >
          {files.length === 0 ? (
            <div className="text-center py-16 bg-card/50 backdrop-blur-sm rounded-2xl border border-border">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-6">
                <Code className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No files found
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm
                  ? "Try a different search term"
                  : "Get started by creating your first code file"}
              </p>
              <Link
                to="/editor"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transform hover:scale-105 transition-all duration-300 shadow-lg shadow-primary/50"
              >
                <Plus className="h-5 w-5" />
                <span>Create New File</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {files.map((file, index) => {
                const delay = index * 0.1;
                return (
                  <div
                    key={file._id}
                    className={`group bg-card rounded-xl shadow-lg border border-border hover:shadow-2xl hover:border-primary/50 transition-all duration-500 transform hover:-translate-y-2 ${
                      isVisible["files"]
                        ? "animate-fade-in-up"
                        : "opacity-0"
                    }`}
                    style={{ animationDelay: `${delay}s` }}
                  >
                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-500"></div>

                    <div className="p-6 relative z-10">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-foreground mb-2 truncate group-hover:text-primary transition-colors">
                            {file.title}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {file.description || "No description"}
                          </p>
                        </div>
                        <span
                          className={`ml-2 px-3 py-1 text-xs font-medium rounded-full flex-shrink-0 ${getLanguageColor(
                            file.language
                          )}`}
                        >
                          {file.language}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4 pb-4 border-b border-border">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(file.updatedAt)}</span>
                        </div>
                        <div className="text-xs font-medium">
                          {file.code.split("\n").length} lines
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Link
                          to={`/editor/${file._id}`}
                          className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-all duration-300 group-hover:scale-105"
                        >
                          <Edit3 className="h-4 w-4" />
                          <span className="font-medium">Edit</span>
                        </Link>
                        <button
                          onClick={() => deleteFile(file._id)}
                          className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-all duration-300 hover:scale-110"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div
            className={`flex items-center justify-center mt-8 space-x-2 ${
              isVisible["files"] ? "animate-fade-in-up" : "opacity-0"
            }`}
            style={{ animationDelay: "0.5s" }}
          >
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm font-medium text-foreground bg-card border border-border rounded-lg hover:bg-accent hover:border-primary/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
            >
              Previous
            </button>

            <div className="flex space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300 transform hover:scale-110 ${
                      currentPage === page
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/50"
                        : "text-foreground bg-card border border-border hover:bg-accent hover:border-primary/50"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
            </div>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-sm font-medium text-foreground bg-card border border-border rounded-lg hover:bg-accent hover:border-primary/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Files;
