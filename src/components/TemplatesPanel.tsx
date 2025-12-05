import React, { useState, useEffect } from "react";
import {
  X,
  Search,
  Code,
  ChevronRight,
  ChevronDown,
  FileCode,
  Save,
  Trash2,
} from "lucide-react";
import { Template, builtInTemplates, templateCategories } from "../data/templates";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";

interface TemplatesPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertTemplate: (code: string) => void;
  currentLanguage: string;
  currentCode?: string;
}

const TemplatesPanel: React.FC<TemplatesPanelProps> = ({
  isOpen,
  onClose,
  onInsertTemplate,
  currentLanguage,
  currentCode = "",
}) => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(templateCategories) // Expand all categories by default
  );
  const [customTemplates, setCustomTemplates] = useState<Template[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState("");
  const [newTemplateCategory, setNewTemplateCategory] = useState("Arrays");
  const [newTemplateDescription, setNewTemplateDescription] = useState("");

  // Load custom templates from localStorage
  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem(`customTemplates_${user._id}`);
      if (saved) {
        try {
          setCustomTemplates(JSON.parse(saved));
        } catch (error) {
          console.error("Failed to load custom templates:", error);
        }
      }
    }
  }, [user]);

  // Save custom templates to localStorage
  const saveCustomTemplates = (templates: Template[]) => {
    if (user) {
      localStorage.setItem(
        `customTemplates_${user._id}`,
        JSON.stringify(templates)
      );
    }
  };

  // Filter templates
  const getFilteredTemplates = (): Template[] => {
    let templates = [...builtInTemplates, ...customTemplates];

    // Filter by current language first
    templates = templates.filter(
      (t) => t.language === currentLanguage || !currentLanguage
    );

    // Then apply search or category filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      templates = templates.filter(
        (t) =>
          t.name.toLowerCase().includes(term) ||
          t.description.toLowerCase().includes(term) ||
          t.tags.some((tag) => tag.toLowerCase().includes(term)) ||
          t.category.toLowerCase().includes(term)
      );
    } else if (selectedCategory) {
      templates = templates.filter((t) => t.category === selectedCategory);
    }

    return templates;
  };

  const handleInsert = (template: Template) => {
    onInsertTemplate(template.code);
    toast.success(`Inserted ${template.name} template`);
  };

  const handleSaveCurrentCode = () => {
    if (!newTemplateName.trim()) {
      toast.error("Please enter a template name");
      return;
    }

    if (!currentCode.trim()) {
      toast.error("No code to save. Please write some code first.");
      return;
    }

    const newTemplate: Template = {
      id: `custom-${Date.now()}`,
      name: newTemplateName,
      description: newTemplateDescription || "Custom template",
      category: newTemplateCategory,
      language: currentLanguage,
      code: currentCode,
      tags: ["custom"],
      isCustom: true,
      authorId: user?._id,
    };

    setCustomTemplates([...customTemplates, newTemplate]);
    saveCustomTemplates([...customTemplates, newTemplate]);
    setShowSaveDialog(false);
    setNewTemplateName("");
    setNewTemplateDescription("");
    toast.success("Template saved!");
  };

  const handleDeleteCustom = (templateId: string) => {
    const updated = customTemplates.filter((t) => t.id !== templateId);
    setCustomTemplates(updated);
    saveCustomTemplates(updated);
    toast.success("Template deleted");
  };

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const filteredTemplates = getFilteredTemplates();
  const groupedByCategory = filteredTemplates.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = [];
    }
    acc[template.category].push(template);
    return acc;
  }, {} as Record<string, Template[]>);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-scale-in">
        {/* Header */}
        <div className="p-6 border-b border-border flex items-center justify-between flex-shrink-0 bg-primary/5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FileCode className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                Code Templates & Snippets
              </h2>
              <p className="text-sm text-muted-foreground">
                Browse and insert DSA templates
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search and Filters */}
        <div className="p-4 border-b border-border flex-shrink-0 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search templates..."
              className="w-full pl-10 pr-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => {
                setSelectedCategory(null);
                setSearchTerm("");
              }}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                !selectedCategory
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-foreground hover:bg-accent"
              }`}
            >
              All
            </button>
            {templateCategories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setSearchTerm("");
                }}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-foreground hover:bg-accent"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Templates List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {Object.keys(groupedByCategory).length === 0 ? (
            <div className="text-center py-12">
              <Code className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">No templates found</p>
            </div>
          ) : (
            Object.entries(groupedByCategory).map(([category, templates]) => (
              <div key={category} className="space-y-2">
                <button
                  onClick={() => toggleCategory(category)}
                  className="w-full flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {expandedCategories.has(category) ? (
                      <ChevronDown className="h-4 w-4 text-primary" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-primary" />
                    )}
                    <span className="font-semibold text-foreground">
                      {category}
                    </span>
                    <span className="text-xs text-muted-foreground bg-primary/10 px-2 py-0.5 rounded">
                      {templates.length}
                    </span>
                  </div>
                </button>

                {expandedCategories.has(category) && (
                  <div className="ml-4 space-y-2">
                    {templates.map((template) => (
                      <div
                        key={template.id}
                        className="p-4 bg-card border border-border rounded-lg hover:border-primary/50 hover:shadow-lg transition-all duration-300 group"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-foreground">
                                {template.name}
                              </h3>
                              {template.isCustom && (
                                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                                  Custom
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {template.description}
                            </p>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs bg-secondary px-2 py-1 rounded">
                                {template.language}
                              </span>
                              {template.tags.slice(0, 3).map((tag) => (
                                <span
                                  key={tag}
                                  className="text-xs bg-muted px-2 py-1 rounded text-muted-foreground"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                          {template.isCustom && (
                            <button
                              onClick={() => handleDeleteCustom(template.id)}
                              className="p-1.5 text-destructive hover:bg-destructive/10 rounded transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                        <button
                          onClick={() => handleInsert(template)}
                          className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105"
                        >
                          <Code className="h-4 w-4" />
                          Insert Template
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border flex items-center justify-between flex-shrink-0 bg-muted/30">
          <button
            onClick={() => setShowSaveDialog(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
          >
            <Save className="h-4 w-4" />
            Save Current Code as Template
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors"
          >
            Close
          </button>
        </div>
      </div>

      {/* Save Template Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl shadow-2xl p-6 w-full max-w-md animate-scale-in">
            <h3 className="text-xl font-bold text-foreground mb-4">
              Save as Template
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Template Name
                </label>
                <input
                  type="text"
                  value={newTemplateName}
                  onChange={(e) => setNewTemplateName(e.target.value)}
                  placeholder="e.g., My Binary Search"
                  className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Category
                </label>
                <select
                  value={newTemplateCategory}
                  onChange={(e) => setNewTemplateCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
                >
                  {templateCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Description (Optional)
                </label>
                <input
                  type="text"
                  value={newTemplateDescription}
                  onChange={(e) => setNewTemplateDescription(e.target.value)}
                  placeholder="Brief description..."
                  className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
                />
              </div>
            </div>
            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={handleSaveCurrentCode}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
              >
                Save Template
              </button>
              <button
                onClick={() => setShowSaveDialog(false)}
                className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplatesPanel;

