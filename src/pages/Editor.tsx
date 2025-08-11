// import React, { useState, useRef, useEffect, useCallback } from "react";
// import { useParams } from "react-router-dom";
// import Editor from "@monaco-editor/react";
// import {
//   Play,
//   Save,
//   Copy,
//   MessageSquare,
//   Send,
//   Loader2,
//   Settings,
//   FileText,
//   X,
//   ChevronDown,
//   ChevronUp,
//   Maximize2,
//   Minimize2,
// } from "lucide-react";
// import { useTheme } from "../contexts/ThemeContext";
// import MessageRenderer from "./MessageRenderer";
// import axios from "axios";
// import toast from "react-hot-toast";

// // Define types for our local storage data
// type LocalStorageData = {
//   code: string;
//   language: string;
//   input: string;
//   output: string;
//   chatMessages: Array<{
//     id: string;
//     sender: "user" | "ai";
//     message: string;
//     timestamp: Date;
//   }>;
// };

// // Helper function to check localStorage availability
// const isLocalStorageAvailable = () => {
//   try {
//     const testKey = "__test__";
//     if (typeof window === "undefined") return false;
//     localStorage.setItem(testKey, testKey);
//     localStorage.removeItem(testKey);
//     return true;
//   } catch (e) {
//     return false;
//   }
// };

// // Load initial state from localStorage (runs once when module loads)
// const loadInitialEditorState = (): Partial<LocalStorageData> => {
//   if (!isLocalStorageAvailable()) return {};

//   const savedData = localStorage.getItem("codeEditorData");
//   if (!savedData) return {};

//   try {
//     const parsed = JSON.parse(savedData);
//     // Convert string timestamps back to Date objects for messages
//     if (parsed.chatMessages) {
//       parsed.chatMessages = parsed.chatMessages.map((msg: any) => ({
//         ...msg,
//         timestamp: new Date(msg.timestamp),
//       }));
//     }
//     return parsed;
//   } catch (error) {
//     console.error("Failed to parse localStorage data", error);
//     return {};
//   }
// };

// const defaultCode = {
//   javascript:
//     '// Welcome to CodeForge!\n// Start typing your code here...\n\nconsole.log("Hello, World!");',
//   python:
//     '# Welcome to CodeForge!\n# Start typing your code here...\n\nprint("Hello, World!")',
//   java: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}',
//   cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}',
//   c: '#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}',
//   csharp:
//     'using System;\n\nclass Program {\n    static void Main() {\n        Console.WriteLine("Hello, World!");\n    }\n}',
//   go: 'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, World!")\n}',
//   rust: 'fn main() {\n    println!("Hello, World!");\n}',
//   php: '<?php\necho "Hello, World!";\n?>',
//   ruby: 'puts "Hello, World!"',
// };

// const languages = [
//   { id: "javascript", name: "JavaScript", extension: ".js" },
//   { id: "python", name: "Python", extension: ".py" },
//   { id: "java", name: "Java", extension: ".java" },
//   { id: "cpp", name: "C++", extension: ".cpp" },
//   { id: "c", name: "C", extension: ".c" },
//   { id: "csharp", name: "C#", extension: ".cs" },
//   { id: "go", name: "Go", extension: ".go" },
//   { id: "rust", name: "Rust", extension: ".rs" },
//   { id: "php", name: "PHP", extension: ".php" },
//   { id: "ruby", name: "Ruby", extension: ".rb" },
// ];

// const CodeEditor: React.FC = () => {
//   const { id } = useParams();
//   const { theme } = useTheme();

//   // Load initial state from localStorage or use defaults
//   const initialState = loadInitialEditorState();

//   // State declarations with proper initialization
//   const [language, setLanguage] = useState<string>(
//     initialState.language || "javascript"
//   );
//   const [code, setCode] = useState<string>(
//     initialState.code || defaultCode.javascript
//   );
//   const [input, setInput] = useState<string>(initialState.input || "");
//   const [output, setOutput] = useState<string>(initialState.output || "");
//   const [isRunning, setIsRunning] = useState<boolean>(false);
//   const [chatMessages, setChatMessages] = useState<
//     Array<{
//       id: string;
//       sender: "user" | "ai";
//       message: string;
//       timestamp: Date;
//     }>
//   >(initialState.chatMessages || []);
//   const [chatInput, setChatInput] = useState<string>("");
//   const [isChatLoading, setIsChatLoading] = useState<boolean>(false);
//   const [showChat, setShowChat] = useState<boolean>(false);
//   const [showSettings, setShowSettings] = useState<boolean>(false);
//   const [fileName, setFileName] = useState<string>("untitled");
//   const [fileDescription, setFileDescription] = useState<string>("");
//   const [isSaving, setIsSaving] = useState<boolean>(false);
//   const [isOutputExpanded, setIsOutputExpanded] = useState<boolean>(false);
//   const [isChatMinimized, setIsChatMinimized] = useState<boolean>(false);

//   const editorRef = useRef<any>(null);
//   const chatEndRef = useRef<HTMLDivElement>(null);
//   const chatContainerRef = useRef<HTMLDivElement>(null);

//   // Enhanced save function with error handling
//   const saveToLocalStorage = useCallback(() => {
//     if (!isLocalStorageAvailable()) return;

//     const dataToSave: LocalStorageData = {
//       code,
//       language,
//       input,
//       output,
//       chatMessages,
//     };

//     try {
//       localStorage.setItem("codeEditorData", JSON.stringify(dataToSave));
//     } catch (error) {
//       console.error("LocalStorage write error:", error);
//       if (error instanceof Error && error.name === "QuotaExceededError") {
//         toast.error("Storage limit reached. Some data may not be saved.");
//       }
//     }
//   }, [code, language, input, output, chatMessages]);

//   // Save on unmount and beforeunload
//   useEffect(() => {
//     const handleBeforeUnload = (e: BeforeUnloadEvent) => {
//       saveToLocalStorage();
//       // Some browsers require returnValue to be set
//       e.preventDefault();
//       e.returnValue = "";
//     };

//     window.addEventListener("beforeunload", handleBeforeUnload);

//     return () => {
//       saveToLocalStorage();
//       window.removeEventListener("beforeunload", handleBeforeUnload);
//     };
//   }, [saveToLocalStorage]);

//   // Debounced save on changes (1000ms delay)
//   useEffect(() => {
//     const timer = setTimeout(saveToLocalStorage, 1000);
//     return () => clearTimeout(timer);
//   }, [code, language, input, output, chatMessages, saveToLocalStorage]);

//   // Load file if ID changes
//   useEffect(() => {
//     if (id) {
//       loadFile(id);
//     }
//   }, [id]);

//   // Scroll to bottom of chat when messages change
//   useEffect(() => {
//     if (chatEndRef.current && showChat && !isChatMinimized) {
//       chatEndRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [chatMessages, showChat, isChatMinimized]);

//   // Add welcome message if no messages exist
//   useEffect(() => {
//     if (chatMessages.length === 0) {
//       setChatMessages([
//         {
//           id: "welcome",
//           sender: "ai",
//           message: `# Welcome to DSA Assistant! 🚀

// I'm here to help you with Data Structures and Algorithms. Ask me anything!`,
//           timestamp: new Date(),
//         },
//       ]);
//     }
//   }, []);
//   useEffect(() => {
//     const params = new URLSearchParams(location.search);
//     if (params.get("ai") === "true") setShowChat(true);
//   }, [location.search]);

//   const loadFile = async (fileId: string) => {
//     try {
//       const response = await axios.get(`/files/${fileId}`);
//       const file = response.data;
//       setFileName(file.title);
//       setFileDescription(file.description);
//       setLanguage(file.language);
//       setCode(file.code);
//       setInput(file.input || "");

//       // Save the loaded file to localStorage
//       const newState = {
//         code: file.code,
//         language: file.language,
//         input: file.input || "",
//         output: "",
//         chatMessages: chatMessages,
//       };
//       localStorage.setItem("codeEditorData", JSON.stringify(newState));
//     } catch (error) {
//       toast.error("Failed to load file");
//     }
//   };

//   const handleLanguageChange = (newLanguage: string) => {
//     setLanguage(newLanguage);
//     setCode(defaultCode[newLanguage as keyof typeof defaultCode] || "");
//   };

//   const runCode = async () => {
//     if (!code.trim()) {
//       toast.error("Please enter some code to run");
//       return;
//     }

//     setIsRunning(true);
//     setOutput("Running...");

//     try {
//       const response = await axios.post("/code/execute", {
//         code,
//         language,
//         input,
//       });

//       if (response.data.success) {
//         setOutput(
//           response.data.output || "Code executed successfully (no output)"
//         );
//       } else {
//         setOutput(`Error: ${response.data.error}`);
//       }
//     } catch (error: any) {
//       setOutput(
//         `Execution failed: ${error.response?.data?.error || error.message}`
//       );
//       toast.error("Failed to execute code");
//     } finally {
//       setIsRunning(false);
//       saveToLocalStorage(); // Save after code execution
//     }
//   };

//   const saveFile = async () => {
//     if (!fileName.trim()) {
//       toast.error("Please enter a file name");
//       return;
//     }

//     setIsSaving(true);
//     try {
//       const fileData = {
//         title: fileName,
//         description: fileDescription,
//         language,
//         code,
//         input,
//       };

//       if (id) {
//         await axios.put(`/files/${id}`, fileData);
//         toast.success("File updated successfully");
//       } else {
//         const response = await axios.post("/files", fileData);
//         toast.success("File saved successfully");
//         window.history.replaceState(null, "", `/editor/${response.data._id}`);
//       }

//       saveToLocalStorage(); // Save after file save
//     } catch (error) {
//       toast.error("Failed to save file");
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const copyCode = () => {
//     navigator.clipboard.writeText(code);
//     toast.success("Code copied to clipboard");
//   };

//   const sendChatMessage = async () => {
//     if (!chatInput.trim()) return;

//     const userMessage = {
//       id: Date.now().toString(),
//       sender: "user" as const,
//       message: chatInput,
//       timestamp: new Date(),
//     };

//     setChatMessages((prev) => [...prev, userMessage]);
//     const currentInput = chatInput;
//     setChatInput("");
//     setIsChatLoading(true);

//     try {
//       const response = await axios.post("/ai/chat", {
//         message: currentInput,
//       });

//       const aiMessage = {
//         id: (Date.now() + 1).toString(),
//         sender: "ai" as const,
//         message: response.data.response,
//         timestamp: new Date(),
//       };

//       setChatMessages((prev) => [...prev, aiMessage]);
//     } catch (error) {
//       toast.error("Failed to get AI response");
//     } finally {
//       setIsChatLoading(false);
//       saveToLocalStorage(); // Save after chat message
//     }
//   };

//   return (
//     <div className="h-screen bg-gray-50 dark:bg-gray-900 flex flex-col relative overflow-hidden">
//       {/* Header */}
//       <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-2 sm:px-4 py-2 sm:py-3 relative z-20 flex-shrink-0">
//         <div className="flex items-center justify-between gap-2">
//           <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
//             <div className="flex items-center space-x-2 min-w-0">
//               <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 dark:text-gray-400 flex-shrink-0" />
//               <input
//                 type="text"
//                 value={fileName}
//                 onChange={(e) => setFileName(e.target.value)}
//                 className="bg-transparent text-sm sm:text-lg font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1 sm:px-2 py-1 min-w-0 flex-1"
//                 placeholder="File name"
//               />
//             </div>
//             <select
//               value={language}
//               onChange={(e) => handleLanguageChange(e.target.value)}
//               className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 flex-shrink-0"
//             >
//               {languages.map((lang) => (
//                 <option key={lang.id} value={lang.id}>
//                   {lang.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
//             <button
//               onClick={() => setShowSettings(!showSettings)}
//               className="p-1.5 sm:p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
//             >
//               <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
//             </button>
//             <button
//               onClick={copyCode}
//               className="hidden sm:flex items-center space-x-2 px-2 sm:px-3 py-1.5 sm:py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
//             >
//               <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
//               <span className="text-xs sm:text-sm hidden md:inline">Copy</span>
//             </button>
//             <button
//               onClick={saveFile}
//               disabled={isSaving}
//               className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
//             >
//               {isSaving ? (
//                 <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
//               ) : (
//                 <Save className="h-3 w-3 sm:h-4 sm:w-4" />
//               )}
//               <span className="text-xs sm:text-sm hidden sm:inline">
//                 {isSaving ? "Saving..." : "Save"}
//               </span>
//             </button>
//             <button
//               onClick={runCode}
//               disabled={isRunning}
//               className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-1.5 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
//             >
//               {isRunning ? (
//                 <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
//               ) : (
//                 <Play className="h-3 w-3 sm:h-4 sm:w-4" />
//               )}
//               <span className="text-xs sm:text-sm hidden sm:inline">
//                 {isRunning ? "Running..." : "Run"}
//               </span>
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Settings Panel */}
//       {showSettings && (
//         <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 animate-in slide-in-from-top duration-200 flex-shrink-0">
//           <div className="max-w-sm">
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//               Description
//             </label>
//             <textarea
//               value={fileDescription}
//               onChange={(e) => setFileDescription(e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
//               rows={2}
//               placeholder="Enter file description..."
//             />
//           </div>
//         </div>
//       )}

//       {/* Main Content */}
//       <div className="flex-1 flex flex-col relative min-h-0">
//         {/* Code Editor */}
//         <div className="flex-1 flex flex-col min-h-0">
//           <div className="flex-1 min-h-0">
//             <Editor
//               height="100%"
//               language={language === "cpp" ? "cpp" : language}
//               value={code}
//               onChange={(value) => setCode(value || "")}
//               theme={theme === "dark" ? "vs-dark" : "vs-light"}
//               options={{
//                 minimap: { enabled: window.innerWidth > 768 },
//                 fontSize: window.innerWidth < 640 ? 12 : 14,
//                 lineNumbers: "on",
//                 wordWrap: "on",
//                 automaticLayout: true,
//                 scrollBeyondLastLine: false,
//                 smoothScrolling: true,
//                 cursorBlinking: "smooth",
//                 renderWhitespace: "boundary",
//                 bracketPairColorization: { enabled: true },
//                 folding: true,
//                 lineDecorationsWidth: window.innerWidth < 640 ? 5 : 10,
//                 lineNumbersMinChars: window.innerWidth < 640 ? 3 : 5,
//               }}
//               onMount={(editor) => {
//                 editorRef.current = editor;
//               }}
//             />
//           </div>

//           {/* Input/Output Section */}
//           <div
//             className={`${
//               isOutputExpanded ? "h-96" : "h-60 sm:h-60 md:h-80"
//             } border-t border-gray-200 dark:border-gray-700 flex flex-col lg:flex-row transition-all duration-300 flex-shrink-0`}
//           >
//             {/* Expand/Collapse Button */}
//             <button
//               onClick={() => setIsOutputExpanded(!isOutputExpanded)}
//               className="absolute right-2 -top-8 z-10 p-1 bg-gray-100 dark:bg-gray-700 rounded-t-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors lg:hidden"
//             >
//               {isOutputExpanded ? (
//                 <Minimize2 className="h-4 w-4" />
//               ) : (
//                 <Maximize2 className="h-4 w-4" />
//               )}
//             </button>

//             <div className="flex-1 flex flex-col border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-700">
//               <div className="bg-gray-100 dark:bg-gray-800 px-3 sm:px-4 py-2 border-b border-gray-200 dark:border-gray-700">
//                 <h3 className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
//                   Input
//                 </h3>
//               </div>
//               <textarea
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//                 className="flex-1 p-2 sm:p-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-white resize-none focus:outline-none text-xs sm:text-sm"
//                 placeholder="Enter input for your program..."
//               />
//             </div>
//             <div className="flex-1 flex flex-col">
//               <div className="bg-gray-100 dark:bg-gray-800 px-3 sm:px-4 py-2 border-b border-gray-200 dark:border-gray-700">
//                 <h3 className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
//                   Output
//                 </h3>
//               </div>
//               <div className="flex-1 p-2 sm:p-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-mono text-xs sm:text-sm overflow-auto">
//                 <pre className="whitespace-pre-wrap break-words">{output}</pre>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* AI Assistant Button */}
//       <button
//         onClick={() => {
//           setShowChat(!showChat);
//           if (!showChat) setIsChatMinimized(false);
//         }}
//         className={`fixed bottom-4 right-4 z-30 w-12 h-12 sm:w-14 sm:h-14
//           bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full shadow-lg
//           hover:shadow-xl transition-all duration-300 flex items-center justify-center group hover:scale-110
//           ${showChat ? "mb-10" : "mb-4"} `}
//       >
//         {showChat ? (
//           <X className="h-5 w-5 sm:h-6 sm:w-6  " />
//         ) : (
//           <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6" />
//         )}
//         <div className="absolute -top-10 sm:-top-12 right-0 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
//           {showChat ? "Close AI Assistant" : "Open AI Assistant"}
//         </div>
//       </button>

//       {/* AI Chat Panel */}
//       {showChat && (
//         <div
//           className={`fixed bottom-0 right-0 w-full sm:w-80 md:w-96 ${
//             isChatMinimized ? "h-16" : "h-[70vh] sm:h-[80vh]"
//           } bg-white dark:bg-gray-800 border-l border-t border-gray-200 dark:border-gray-700 flex flex-col z-20 transition-all duration-300 shadow-2xl`}
//         >
//           <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between flex-shrink-0">
//             <div className="min-w-0 flex-1">
//               <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white truncate">
//                 DSA Assistant
//               </h3>
//               {!isChatMinimized && (
//                 <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
//                   Ask me anything about Data Structures & Algorithms
//                 </p>
//               )}
//             </div>
//             <div className="flex items-center space-x-1 flex-shrink-0">
//               <button
//                 onClick={() => setIsChatMinimized(!isChatMinimized)}
//                 className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
//               >
//                 {isChatMinimized ? (
//                   <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5" />
//                 ) : (
//                   <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5" />
//                 )}
//               </button>
//               <button
//                 onClick={() => setShowChat(false)}
//                 className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors "
//               >
//                 <X className="h-4 w-4 sm:h-5 sm:w-5  " />
//               </button>
//             </div>
//           </div>

//           {!isChatMinimized && (
//             <>
//               <div
//                 ref={chatContainerRef}
//                 className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 scroll-smooth min-h-0"
//               >
//                 {chatMessages.map((message) => (
//                   <div
//                     key={message.id}
//                     className={`flex ${
//                       message.sender === "user"
//                         ? "justify-end"
//                         : "justify-start"
//                     } animate-in fade-in slide-in-from-bottom-2 duration-300`}
//                   >
//                     <div
//                       className={`max-w-[90%] px-3 sm:px-4 py-2 rounded-lg ${
//                         message.sender === "user"
//                           ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
//                           : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
//                       }`}
//                     >
//                       <MessageRenderer
//                         content={message.message}
//                         isUser={message.sender === "user"}
//                       />
//                       <p className="text-xs opacity-70 mt-2">
//                         {message.timestamp.toLocaleTimeString()}
//                       </p>
//                     </div>
//                   </div>
//                 ))}

//                 {isChatLoading && (
//                   <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
//                     <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-3 sm:px-4 py-2">
//                       <div className="flex items-center space-x-2">
//                         <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
//                         <span className="text-xs sm:text-sm">
//                           AI is thinking...
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//                 <div ref={chatEndRef} />
//               </div>

//               <div className="p-3 sm:p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
//                 <div className="flex space-x-2">
//                   <input
//                     type="text"
//                     value={chatInput}
//                     onChange={(e) => setChatInput(e.target.value)}
//                     onKeyDown={(e) => {
//                       if (e.key === "Enter" && !e.shiftKey) {
//                         e.preventDefault();
//                         sendChatMessage();
//                       }
//                     }}
//                     className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-xs sm:text-sm"
//                     placeholder="Ask about DSA..."
//                   />
//                   <button
//                     onClick={sendChatMessage}
//                     disabled={isChatLoading || !chatInput.trim()}
//                     className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-100 disabled:cursor-not-allowed flex-shrink-0"
//                   >
//                     <Send className="h-3 w-3 sm:h-4 sm:w-4" />
//                   </button>
//                 </div>
//               </div>
//             </>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import {
  Play,
  Save,
  Copy,
  MessageSquare,
  Send,
  Loader2,
  Settings,
  FileText,
  X,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import MessageRenderer from "./MessageRenderer";
import axios from "axios";
import toast from "react-hot-toast";

// Define types for our local storage data
type LocalStorageData = {
  code: string;
  language: string;
  input: string;
  output: string;
  chatMessages: Array<{
    id: string;
    sender: "user" | "ai";
    message: string;
    timestamp: Date;
  }>;
};

// Helper function to check localStorage availability
const isLocalStorageAvailable = () => {
  try {
    const testKey = "__test__";
    if (typeof window === "undefined") return false;
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
};

// Generate user-specific localStorage key
const getUserStorageKey = (userId: string | null): string => {
  if (!userId) {
    return "codeEditorData_guest";
  }
  return `codeEditorData_${userId}`;
};

// Load initial state from localStorage with user-specific key
const loadInitialEditorState = (
  userId: string | null
): Partial<LocalStorageData> => {
  if (!isLocalStorageAvailable()) return {};

  const storageKey = getUserStorageKey(userId);
  const savedData = localStorage.getItem(storageKey);
  if (!savedData) return {};

  try {
    const parsed = JSON.parse(savedData);
    // Convert string timestamps back to Date objects for messages
    if (parsed.chatMessages) {
      parsed.chatMessages = parsed.chatMessages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      }));
    }
    return parsed;
  } catch (error) {
    console.error("Failed to parse localStorage data", error);
    return {};
  }
};

// Transfer data between guest and user accounts
const transferDataBetweenStates = (
  fromUserId: string | null,
  toUserId: string | null
): LocalStorageData | null => {
  if (!isLocalStorageAvailable()) return null;

  const fromKey = getUserStorageKey(fromUserId);
  const toKey = getUserStorageKey(toUserId);

  // Don't transfer if keys are the same
  if (fromKey === toKey) return null;

  const fromData = localStorage.getItem(fromKey);
  if (!fromData) return null;

  try {
    const parsedData = JSON.parse(fromData);

    // Convert string timestamps back to Date objects for messages
    if (parsedData.chatMessages) {
      parsedData.chatMessages = parsedData.chatMessages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      }));
    }

    // Save to new user's storage
    localStorage.setItem(toKey, JSON.stringify(parsedData));

    // Optionally clear the old data (uncomment if you want to move rather than copy)
    // localStorage.removeItem(fromKey);

    return parsedData;
  } catch (error) {
    console.error("Failed to transfer data between states", error);
    return null;
  }
};

// Check if user has existing data
const hasExistingData = (userId: string | null): boolean => {
  if (!isLocalStorageAvailable()) return false;

  const storageKey = getUserStorageKey(userId);
  const data = localStorage.getItem(storageKey);

  if (!data) return false;

  try {
    const parsed = JSON.parse(data);
    // Consider data existing if there's non-default code or chat messages
    return (
      (parsed.code && parsed.code !== defaultCode.javascript) ||
      (parsed.chatMessages && parsed.chatMessages.length > 1) // More than just welcome message
    );
  } catch {
    return false;
  }
};

const defaultCode = {
  javascript:
    '// Welcome to CodeForge!\n// Start typing your code here...\n\nconsole.log("Hello, World!");',
  python:
    '# Welcome to CodeForge!\n# Start typing your code here...\n\nprint("Hello, World!")',
  java: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}',
  cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}',
  c: '#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}',
  csharp:
    'using System;\n\nclass Program {\n    static void Main() {\n        Console.WriteLine("Hello, World!");\n    }\n}',
  go: 'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, World!")\n}',
  rust: 'fn main() {\n    println!("Hello, World!");\n}',
  php: '<?php\necho "Hello, World!";\n?>',
  ruby: 'puts "Hello, World!"',
};

const languages = [
  { id: "javascript", name: "JavaScript", extension: ".js" },
  { id: "python", name: "Python", extension: ".py" },
  { id: "java", name: "Java", extension: ".java" },
  { id: "cpp", name: "C++", extension: ".cpp" },
  { id: "c", name: "C", extension: ".c" },
  { id: "csharp", name: "C#", extension: ".cs" },
  { id: "go", name: "Go", extension: ".go" },
  { id: "rust", name: "Rust", extension: ".rs" },
  { id: "php", name: "PHP", extension: ".php" },
  { id: "ruby", name: "Ruby", extension: ".rb" },
];

const CodeEditor: React.FC = () => {
  const { id } = useParams();
  const { theme } = useTheme();
  const { user, loading } = useAuth();

  // State declarations with proper initialization
  const [language, setLanguage] = useState<string>("javascript");
  const [code, setCode] = useState<string>(defaultCode.javascript);
  const [input, setInput] = useState<string>("");
  const [output, setOutput] = useState<string>("");
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<
    Array<{
      id: string;
      sender: "user" | "ai";
      message: string;
      timestamp: Date;
    }>
  >([]);
  const [chatInput, setChatInput] = useState<string>("");
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);
  const [showChat, setShowChat] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>("untitled");
  const [fileDescription, setFileDescription] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isOutputExpanded, setIsOutputExpanded] = useState<boolean>(false);
  const [isChatMinimized, setIsChatMinimized] = useState<boolean>(false);
  const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);

  // Track previous user state for data transfer
  const [previousUserId, setPreviousUserId] = useState<string | null>(null);

  const editorRef = useRef<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Enhanced save function with user-specific key
  const saveToLocalStorage = useCallback(() => {
    if (!isLocalStorageAvailable() || !isDataLoaded) return;

    const storageKey = getUserStorageKey(user?._id || null);
    const dataToSave: LocalStorageData = {
      code,
      language,
      input,
      output,
      chatMessages,
    };

    try {
      localStorage.setItem(storageKey, JSON.stringify(dataToSave));
    } catch (error) {
      console.error("LocalStorage write error:", error);
      if (error instanceof Error && error.name === "QuotaExceededError") {
        toast.error("Storage limit reached. Some data may not be saved.");
      }
    }
  }, [code, language, input, output, chatMessages, user?._id, isDataLoaded]);

  // Load user-specific data with smart data transfer
  const loadUserData = useCallback(
    (userId: string | null, fromUserId: string | null = null) => {
      let userSpecificData: Partial<LocalStorageData> = {};

      // Check if user has existing data
      const hasData = hasExistingData(userId);

      if (!hasData && fromUserId !== null) {
        // User doesn't have data, try to transfer from previous state
        const transferredData = transferDataBetweenStates(fromUserId, userId);
        if (transferredData) {
          userSpecificData = transferredData;
          toast.success(
            userId
              ? "Your guest session data has been transferred to your account!"
              : "Your account data is now available in guest mode!"
          );
        } else {
          // No data to transfer, load existing data or defaults
          userSpecificData = loadInitialEditorState(userId);
        }
      } else {
        // User has existing data or no transfer needed
        userSpecificData = loadInitialEditorState(userId);
      }

      // Update state with user-specific data or defaults
      setLanguage(userSpecificData.language || "javascript");
      setCode(userSpecificData.code || defaultCode.javascript);
      setInput(userSpecificData.input || "");
      setOutput(userSpecificData.output || "");
      setChatMessages(userSpecificData.chatMessages || []);
      setIsDataLoaded(true);
    },
    []
  );

  // Effect to handle initial data loading and user changes
  useEffect(() => {
    // Don't load data until auth loading is complete
    if (loading) return;

    const currentUserId = user?._id || null;

    // Check if user state actually changed
    if (previousUserId !== currentUserId) {
      if (currentUserId) {
        // User logged in - transfer guest data if user has no existing data
        loadUserData(currentUserId, previousUserId);
      } else {
        // User logged out - transfer user data to guest if guest has no existing data
        loadUserData(null, previousUserId);
      }

      // Update previous user ID
      setPreviousUserId(currentUserId);
    } else if (!isDataLoaded) {
      // Initial load - no transfer needed
      loadUserData(currentUserId);
    }
  }, [user?._id, loading, loadUserData, previousUserId, isDataLoaded]);

  // Save on unmount and beforeunload
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      saveToLocalStorage();
      // Some browsers require returnValue to be set
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      saveToLocalStorage();
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [saveToLocalStorage]);

  // Debounced save on changes (1000ms delay)
  useEffect(() => {
    if (!isDataLoaded) return; // Don't save until data is loaded

    const timer = setTimeout(saveToLocalStorage, 1000);
    return () => clearTimeout(timer);
  }, [
    code,
    language,
    input,
    output,
    chatMessages,
    saveToLocalStorage,
    isDataLoaded,
  ]);

  // Load file if ID changes
  useEffect(() => {
    if (id && isDataLoaded) {
      loadFile(id);
    }
  }, [id, isDataLoaded]);

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    if (chatEndRef.current && showChat && !isChatMinimized) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, showChat, isChatMinimized]);

  // Add welcome message if no messages exist
  useEffect(() => {
    if (isDataLoaded && chatMessages.length === 0) {
      setChatMessages([
        {
          id: "welcome",
          sender: "ai",
          message: `# Welcome to DSA Assistant! 🚀
          
I'm here to help you with Data Structures and Algorithms. Ask me anything!`,
          timestamp: new Date(),
        },
      ]);
    }
  }, [isDataLoaded, chatMessages.length]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("ai") === "true") setShowChat(true);
  }, [location.search]);

  const loadFile = async (fileId: string) => {
    try {
      const response = await axios.get(`/files/${fileId}`);
      const file = response.data;
      setFileName(file.title);
      setFileDescription(file.description);
      setLanguage(file.language);
      setCode(file.code);
      setInput(file.input || "");

      // Save the loaded file to user-specific localStorage
      const storageKey = getUserStorageKey(user?._id || null);
      const newState = {
        code: file.code,
        language: file.language,
        input: file.input || "",
        output: "",
        chatMessages: chatMessages,
      };
      localStorage.setItem(storageKey, JSON.stringify(newState));
    } catch (error) {
      toast.error("Failed to load file");
    }
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    setCode(defaultCode[newLanguage as keyof typeof defaultCode] || "");
  };

  const runCode = async () => {
    if (!code.trim()) {
      toast.error("Please enter some code to run");
      return;
    }

    setIsRunning(true);
    setOutput("Running...");

    try {
      const response = await axios.post("/code/execute", {
        code,
        language,
        input,
      });

      if (response.data.success) {
        setOutput(
          response.data.output || "Code executed successfully (no output)"
        );
      } else {
        setOutput(`Error: ${response.data.error}`);
      }
    } catch (error: any) {
      setOutput(
        `Execution failed: ${error.response?.data?.error || error.message}`
      );
      toast.error("Failed to execute code");
    } finally {
      setIsRunning(false);
      saveToLocalStorage(); // Save after code execution
    }
  };

  const saveFile = async () => {
    if (!fileName.trim()) {
      toast.error("Please enter a file name");
      return;
    }

    setIsSaving(true);
    try {
      const fileData = {
        title: fileName,
        description: fileDescription,
        language,
        code,
        input,
      };

      if (id) {
        await axios.put(`/files/${id}`, fileData);
        toast.success("File updated successfully");
      } else {
        const response = await axios.post("/files", fileData);
        toast.success("File saved successfully");
        window.history.replaceState(null, "", `/editor/${response.data._id}`);
      }

      saveToLocalStorage(); // Save after file save
    } catch (error) {
      toast.error("Failed to save file");
    } finally {
      setIsSaving(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied to clipboard");
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      sender: "user" as const,
      message: chatInput,
      timestamp: new Date(),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    const currentInput = chatInput;
    setChatInput("");
    setIsChatLoading(true);

    try {
      const response = await axios.post("/ai/chat", {
        message: currentInput,
      });

      const aiMessage = {
        id: (Date.now() + 1).toString(),
        sender: "ai" as const,
        message: response.data.response,
        timestamp: new Date(),
      };

      setChatMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      toast.error("Failed to get AI response");
    } finally {
      setIsChatLoading(false);
      saveToLocalStorage(); // Save after chat message
    }
  };

  // Show loading state while auth is loading
  if (loading) {
    return (
      <div className="h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <span className="text-gray-600 dark:text-gray-400">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 flex flex-col relative overflow-hidden">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-2 sm:px-4 py-2 sm:py-3 relative z-20 flex-shrink-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
            <div className="flex items-center space-x-2 min-w-0">
              <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 dark:text-gray-400 flex-shrink-0" />
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="bg-transparent text-sm sm:text-lg font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1 sm:px-2 py-1 min-w-0 flex-1"
                placeholder="File name"
              />
            </div>
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 flex-shrink-0"
            >
              {languages.map((lang) => (
                <option key={lang.id} value={lang.id}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-1.5 sm:p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
            <button
              onClick={copyCode}
              className="hidden sm:flex items-center space-x-2 px-2 sm:px-3 py-1.5 sm:py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm hidden md:inline">Copy</span>
            </button>
            <button
              onClick={saveFile}
              disabled={isSaving}
              className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {isSaving ? (
                <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
              ) : (
                <Save className="h-3 w-3 sm:h-4 sm:w-4" />
              )}
              <span className="text-xs sm:text-sm hidden sm:inline">
                {isSaving ? "Saving..." : "Save"}
              </span>
            </button>
            <button
              onClick={runCode}
              disabled={isRunning}
              className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-1.5 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isRunning ? (
                <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
              ) : (
                <Play className="h-3 w-3 sm:h-4 sm:w-4" />
              )}
              <span className="text-xs sm:text-sm hidden sm:inline">
                {isRunning ? "Running..." : "Run"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 animate-in slide-in-from-top duration-200 flex-shrink-0">
          <div className="max-w-sm">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={fileDescription}
              onChange={(e) => setFileDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              rows={2}
              placeholder="Enter file description..."
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative min-h-0">
        {/* Code Editor */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 min-h-0">
            <Editor
              height="100%"
              language={language === "cpp" ? "cpp" : language}
              value={code}
              onChange={(value) => setCode(value || "")}
              theme={theme === "dark" ? "vs-dark" : "vs-light"}
              options={{
                minimap: { enabled: window.innerWidth > 768 },
                fontSize: window.innerWidth < 640 ? 12 : 14,
                lineNumbers: "on",
                wordWrap: "on",
                automaticLayout: true,
                scrollBeyondLastLine: false,
                smoothScrolling: true,
                cursorBlinking: "smooth",
                renderWhitespace: "boundary",
                bracketPairColorization: { enabled: true },
                folding: true,
                lineDecorationsWidth: window.innerWidth < 640 ? 5 : 10,
                lineNumbersMinChars: window.innerWidth < 640 ? 3 : 5,
              }}
              onMount={(editor) => {
                editorRef.current = editor;
              }}
            />
          </div>

          {/* Input/Output Section */}
          <div
            className={`${
              isOutputExpanded ? "h-96" : "h-60 sm:h-50 md:h-50"
            } border-t border-gray-200 dark:border-gray-700 flex flex-col lg:flex-row transition-all duration-300 flex-shrink-0`}
          >
            {/* Expand/Collapse Button */}
            <button
              onClick={() => setIsOutputExpanded(!isOutputExpanded)}
              className="absolute right-2 -top-8 z-10 p-1 bg-gray-100 dark:bg-gray-700 rounded-t-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors lg:hidden"
            >
              {isOutputExpanded ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </button>

            <div className="flex-1 flex flex-col border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-700">
              <div className="bg-gray-100 dark:bg-gray-800 px-3 sm:px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                  Input
                </h3>
              </div>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 p-2 sm:p-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-white resize-none focus:outline-none text-xs sm:text-sm"
                placeholder="Enter input for your program..."
              />
            </div>
            <div className="flex-1 flex flex-col">
              <div className="bg-gray-100 dark:bg-gray-800 px-3 sm:px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                  Output
                </h3>
              </div>
              <div className="flex-1 p-2 sm:p-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-mono text-xs sm:text-sm overflow-auto">
                <pre className="whitespace-pre-wrap break-words">{output}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Assistant Button */}
      <button
        onClick={() => {
          setShowChat(!showChat);
          if (!showChat) setIsChatMinimized(false);
        }}
        className={`fixed bottom-4 right-4 z-30 w-12 h-12 sm:w-14 sm:h-14
          bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full shadow-lg
          hover:shadow-xl transition-all duration-300 flex items-center justify-center group hover:scale-110
          ${showChat ? "mb-10" : "mb-4"} `}
      >
        {showChat ? (
          <X className="h-5 w-5 sm:h-6 sm:w-6  " />
        ) : (
          <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6" />
        )}
        <div className="absolute -top-10 sm:-top-12 right-0 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          {showChat ? "Close AI Assistant" : "Open AI Assistant"}
        </div>
      </button>

      {/* AI Chat Panel */}
      {showChat && (
        <div
          className={`fixed bottom-0 right-0 w-full sm:w-80 md:w-96 ${
            isChatMinimized ? "h-16" : "h-[70vh] sm:h-[80vh]"
          } bg-white dark:bg-gray-800 border-l border-t border-gray-200 dark:border-gray-700 flex flex-col z-20 transition-all duration-300 shadow-2xl`}
        >
          <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between flex-shrink-0">
            <div className="min-w-0 flex-1">
              <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white truncate">
                DSA Assistant
              </h3>
              {!isChatMinimized && (
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                  Ask me anything about Data Structures & Algorithms
                </p>
              )}
            </div>
            <div className="flex items-center space-x-1 flex-shrink-0">
              <button
                onClick={() => setIsChatMinimized(!isChatMinimized)}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                {isChatMinimized ? (
                  <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5" />
                ) : (
                  <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5" />
                )}
              </button>
              <button
                onClick={() => setShowChat(false)}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors "
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5  " />
              </button>
            </div>
          </div>

          {!isChatMinimized && (
            <>
              <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 scroll-smooth min-h-0"
              >
                {chatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender === "user"
                        ? "justify-end"
                        : "justify-start"
                    } animate-in fade-in slide-in-from-bottom-2 duration-300`}
                  >
                    <div
                      className={`max-w-[90%] px-3 sm:px-4 py-2 rounded-lg ${
                        message.sender === "user"
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                      }`}
                    >
                      <MessageRenderer
                        content={message.message}
                        isUser={message.sender === "user"}
                      />
                      <p className="text-xs opacity-70 mt-2">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}

                {isChatLoading && (
                  <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-3 sm:px-4 py-2">
                      <div className="flex items-center space-x-2">
                        <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                        <span className="text-xs sm:text-sm">
                          AI is thinking...
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              <div className="p-3 sm:p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendChatMessage();
                      }
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-xs sm:text-sm"
                    placeholder="Ask about DSA..."
                  />
                  <button
                    onClick={sendChatMessage}
                    disabled={isChatLoading || !chatInput.trim()}
                    className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-100 disabled:cursor-not-allowed flex-shrink-0"
                  >
                    <Send className="h-3 w-3 sm:h-4 sm:w-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CodeEditor;
