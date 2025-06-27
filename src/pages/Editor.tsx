// // import React, { useState, useRef, useEffect } from "react";
// // import { useParams } from "react-router-dom";
// // import Editor from "@monaco-editor/react";
// // import {
// //   Play,
// //   Save,
// //   Copy,
// //   MessageSquare,
// //   Send,
// //   Loader2,
// //   Settings,
// //   FileText,
// // } from "lucide-react";
// // import { useTheme } from "../contexts/ThemeContext";
// // import axios from "axios";
// // import toast from "react-hot-toast";

// // const CodeEditor: React.FC = () => {
// //   const { id } = useParams();
// //   const { theme } = useTheme();
// //   const [language, setLanguage] = useState("javascript");
// //   const [code, setCode] = useState(
// //     '// Welcome to CodeForge!\n// Start typing your code here...\n\nconsole.log("Hello, World!");'
// //   );
// //   const [input, setInput] = useState("");
// //   const [output, setOutput] = useState("");
// //   const [isRunning, setIsRunning] = useState(false);
// //   const [chatMessages, setChatMessages] = useState<
// //     Array<{
// //       id: string;
// //       sender: "user" | "ai";
// //       message: string;
// //       timestamp: Date;
// //     }>
// //   >([]);
// //   const [chatInput, setChatInput] = useState("");
// //   const [isChatLoading, setIsChatLoading] = useState(false);
// //   const [showChat, setShowChat] = useState(false);
// //   const [showSettings, setShowSettings] = useState(false);
// //   const [fileName, setFileName] = useState("untitled");
// //   const [fileDescription, setFileDescription] = useState("");
// //   const [isSaving, setIsSaving] = useState(false);

// //   const editorRef = useRef<any>(null);
// //   const chatEndRef = useRef<HTMLDivElement>(null);

// //   const languages = [
// //     { id: "javascript", name: "JavaScript", extension: ".js" },
// //     { id: "python", name: "Python", extension: ".py" },
// //     { id: "java", name: "Java", extension: ".java" },
// //     { id: "cpp", name: "C++", extension: ".cpp" },
// //     { id: "c", name: "C", extension: ".c" },
// //     { id: "csharp", name: "C#", extension: ".cs" },
// //     { id: "go", name: "Go", extension: ".go" },
// //     { id: "rust", name: "Rust", extension: ".rs" },
// //     { id: "php", name: "PHP", extension: ".php" },
// //     { id: "ruby", name: "Ruby", extension: ".rb" },
// //   ];

// //   const defaultCode = {
// //     javascript:
// //       '// Welcome to CodeForge!\n// Start typing your code here...\n\nconsole.log("Hello, World!");',
// //     python:
// //       '# Welcome to CodeForge!\n# Start typing your code here...\n\nprint("Hello, World!")',
// //     java: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}',
// //     cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}',
// //     c: '#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}',
// //     csharp:
// //       'using System;\n\nclass Program {\n    static void Main() {\n        Console.WriteLine("Hello, World!");\n    }\n}',
// //     go: 'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, World!")\n}',
// //     rust: 'fn main() {\n    println!("Hello, World!");\n}',
// //     php: '<?php\necho "Hello, World!";\n?>',
// //     ruby: 'puts "Hello, World!"',
// //   };

// //   useEffect(() => {
// //     if (chatEndRef.current) {
// //       chatEndRef.current.scrollIntoView({ behavior: "smooth" });
// //     }
// //   }, [chatMessages]);

// //   useEffect(() => {
// //     if (id) {
// //       loadFile(id);
// //     }
// //   }, [id]);

// //   const loadFile = async (fileId: string) => {
// //     try {
// //       const response = await axios.get(`/files/${fileId}`);
// //       const file = response.data;
// //       setFileName(file.title);
// //       setFileDescription(file.description);
// //       setLanguage(file.language);
// //       setCode(file.code);
// //       setInput(file.input || "");
// //     } catch (error) {
// //       toast.error("Failed to load file");
// //     }
// //   };

// //   const handleLanguageChange = (newLanguage: string) => {
// //     setLanguage(newLanguage);
// //     setCode(defaultCode[newLanguage as keyof typeof defaultCode] || "");
// //   };

// //   const runCode = async () => {
// //     if (!code.trim()) {
// //       toast.error("Please enter some code to run");
// //       return;
// //     }

// //     setIsRunning(true);
// //     setOutput("Running...");

// //     try {
// //       const response = await axios.post("/code/execute", {
// //         code,
// //         language,
// //         input,
// //       });

// //       if (response.data.success) {
// //         setOutput(
// //           response.data.output || "Code executed successfully (no output)"
// //         );
// //       } else {
// //         setOutput(`Error: ${response.data.error}`);
// //       }
// //     } catch (error: any) {
// //       setOutput(
// //         `Execution failed: ${error.response?.data?.error || error.message}`
// //       );
// //       toast.error("Failed to execute code");
// //     } finally {
// //       setIsRunning(false);
// //     }
// //   };

// //   const saveFile = async () => {
// //     if (!fileName.trim()) {
// //       toast.error("Please enter a file name");
// //       return;
// //     }

// //     setIsSaving(true);
// //     try {
// //       const fileData = {
// //         title: fileName,
// //         description: fileDescription,
// //         language,
// //         code,
// //         input,
// //       };

// //       if (id) {
// //         await axios.put(`/files/${id}`, fileData);
// //         toast.success("File updated successfully");
// //       } else {
// //         const response = await axios.post("/files", fileData);
// //         toast.success("File saved successfully");
// //         // Optionally update URL to include file ID
// //         window.history.replaceState(null, "", `/editor/${response.data._id}`);
// //       }
// //     } catch (error) {
// //       toast.error("Failed to save file");
// //     } finally {
// //       setIsSaving(false);
// //     }
// //   };

// //   const copyCode = () => {
// //     navigator.clipboard.writeText(code);
// //     toast.success("Code copied to clipboard");
// //   };

// //   const sendChatMessage = async () => {
// //     if (!chatInput.trim()) return;

// //     const userMessage = {
// //       id: Date.now().toString(),
// //       sender: "user" as const,
// //       message: chatInput,
// //       timestamp: new Date(),
// //     };

// //     setChatMessages((prev) => [...prev, userMessage]);
// //     setChatInput("");
// //     setIsChatLoading(true);

// //     try {
// //       const response = await axios.post("/ai/chat", {
// //         message: chatInput,
// //       });

// //       const aiMessage = {
// //         id: (Date.now() + 1).toString(),
// //         sender: "ai" as const,
// //         message: response.data.response,
// //         timestamp: new Date(),
// //       };

// //       setChatMessages((prev) => [...prev, aiMessage]);
// //     } catch (error) {
// //       toast.error("Failed to get AI response");
// //     } finally {
// //       setIsChatLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
// //       {/* Header */}
// //       <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
// //         <div className="flex items-center justify-between">
// //           <div className="flex items-center space-x-4">
// //             <div className="flex items-center space-x-2">
// //               <FileText className="h-5 w-5 text-gray-600 dark:text-gray-400" />
// //               <input
// //                 type="text"
// //                 value={fileName}
// //                 onChange={(e) => setFileName(e.target.value)}
// //                 className="bg-transparent text-lg font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
// //                 placeholder="File name"
// //               />
// //             </div>
// //             <select
// //               value={language}
// //               onChange={(e) => handleLanguageChange(e.target.value)}
// //               className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
// //             >
// //               {languages.map((lang) => (
// //                 <option key={lang.id} value={lang.id}>
// //                   {lang.name}
// //                 </option>
// //               ))}
// //             </select>
// //           </div>

// //           <div className="flex items-center space-x-2">
// //             <button
// //               onClick={() => setShowSettings(!showSettings)}
// //               className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
// //             >
// //               <Settings className="h-5 w-5" />
// //             </button>
// //             <button
// //               onClick={() => setShowChat(!showChat)}
// //               className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
// //             >
// //               <MessageSquare className="h-5 w-5" />
// //             </button>
// //             <button
// //               onClick={copyCode}
// //               className="flex items-center space-x-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
// //             >
// //               <Copy className="h-4 w-4" />
// //               <span className="text-sm">Copy</span>
// //             </button>
// //             <button
// //               onClick={saveFile}
// //               disabled={isSaving}
// //               className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
// //             >
// //               {isSaving ? (
// //                 <Loader2 className="h-4 w-4 animate-spin" />
// //               ) : (
// //                 <Save className="h-4 w-4" />
// //               )}
// //               <span className="text-sm">{isSaving ? "Saving..." : "Save"}</span>
// //             </button>
// //             <button
// //               onClick={runCode}
// //               disabled={isRunning}
// //               className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
// //             >
// //               {isRunning ? (
// //                 <Loader2 className="h-4 w-4 animate-spin" />
// //               ) : (
// //                 <Play className="h-4 w-4" />
// //               )}
// //               <span className="text-sm">
// //                 {isRunning ? "Running..." : "Run"}
// //               </span>
// //             </button>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Settings Panel */}
// //       {showSettings && (
// //         <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
// //           <div className="max-w-md">
// //             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
// //               Description
// //             </label>
// //             <textarea
// //               value={fileDescription}
// //               onChange={(e) => setFileDescription(e.target.value)}
// //               className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
// //               rows={2}
// //               placeholder="Enter file description..."
// //             />
// //           </div>
// //         </div>
// //       )}

// //       {/* Main Content */}
// //       <div className="flex-1 flex">
// //         {/* Code Editor */}
// //         <div className="flex-1 flex flex-col">
// //           <div className="flex-1 border-r border-gray-200 dark:border-gray-700">
// //             <Editor
// //               height="100%"
// //               language={language === "cpp" ? "cpp" : language}
// //               value={code}
// //               onChange={(value) => setCode(value || "")}
// //               theme={theme === "dark" ? "vs-dark" : "vs-light"}
// //               options={{
// //                 minimap: { enabled: false },
// //                 fontSize: 14,
// //                 lineNumbers: "on",
// //                 wordWrap: "on",
// //                 automaticLayout: true,
// //                 scrollBeyondLastLine: false,
// //                 smoothScrolling: true,
// //                 cursorBlinking: "smooth",
// //                 renderWhitespace: "boundary",
// //                 bracketPairColorization: { enabled: true },
// //               }}
// //               onMount={(editor) => {
// //                 editorRef.current = editor;
// //               }}
// //             />
// //           </div>

// //           {/* Input/Output Section */}
// //           <div className="h-64 border-t border-gray-200 dark:border-gray-700 flex">
// //             <div className="flex-1 flex flex-col border-r border-gray-200 dark:border-gray-700">
// //               <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 border-b border-gray-200 dark:border-gray-700">
// //                 <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
// //                   Input
// //                 </h3>
// //               </div>
// //               <textarea
// //                 value={input}
// //                 onChange={(e) => setInput(e.target.value)}
// //                 className="flex-1 p-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-white resize-none focus:outline-none"
// //                 placeholder="Enter input for your program..."
// //               />
// //             </div>
// //             <div className="flex-1 flex flex-col">
// //               <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 border-b border-gray-200 dark:border-gray-700">
// //                 <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
// //                   Output
// //                 </h3>
// //               </div>
// //               <div className="flex-1 p-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-mono text-sm overflow-auto">
// //                 <pre className="whitespace-pre-wrap">{output}</pre>
// //               </div>
// //             </div>
// //           </div>
// //         </div>

// //         {/* AI Chat Sidebar */}
// //         {showChat && (
// //           <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col">
// //             <div className="p-4 border-b border-gray-200 dark:border-gray-700">
// //               <h3 className="text-lg font-medium text-gray-900 dark:text-white">
// //                 DSA Assistant
// //               </h3>
// //               <p className="text-sm text-gray-600 dark:text-gray-400">
// //                 Ask me anything about Data Structures & Algorithms
// //               </p>
// //             </div>

// //             <div className="flex-1 overflow-y-auto p-4 space-y-4">
// //               {chatMessages.length === 0 && (
// //                 <div className="text-center text-gray-500 dark:text-gray-400 py-8">
// //                   <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
// //                   <p>Start a conversation with the AI assistant!</p>
// //                 </div>
// //               )}

// //               {chatMessages.map((message) => (
// //                 <div
// //                   key={message.id}
// //                   className={`flex ${
// //                     message.sender === "user" ? "justify-end" : "justify-start"
// //                   }`}
// //                 >
// //                   <div
// //                     className={`max-w-xs px-4 py-2 rounded-lg ${
// //                       message.sender === "user"
// //                         ? "bg-blue-600 text-white"
// //                         : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
// //                     }`}
// //                   >
// //                     <p className="text-sm whitespace-pre-wrap">
// //                       {message.message}
// //                     </p>
// //                     <p className="text-xs opacity-70 mt-1">
// //                       {message.timestamp.toLocaleTimeString()}
// //                     </p>
// //                   </div>
// //                 </div>
// //               ))}

// //               {isChatLoading && (
// //                 <div className="flex justify-start">
// //                   <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2">
// //                     <div className="flex items-center space-x-2">
// //                       <Loader2 className="h-4 w-4 animate-spin" />
// //                       <span className="text-sm">AI is thinking...</span>
// //                     </div>
// //                   </div>
// //                 </div>
// //               )}
// //               <div ref={chatEndRef} />
// //             </div>

// //             <div className="p-4 border-t border-gray-200 dark:border-gray-700">
// //               <div className="flex space-x-2">
// //                 <input
// //                   type="text"
// //                   value={chatInput}
// //                   onChange={(e) => setChatInput(e.target.value)}
// //                   onKeyDown={(e) => {
// //                     if (e.key === "Enter") {
// //                       sendChatMessage();
// //                     }
// //                   }}
// //                   className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
// //                   placeholder="Ask about DSA..."
// //                 />
// //                 <button
// //                   onClick={sendChatMessage}
// //                   disabled={isChatLoading || !chatInput.trim()}
// //                   className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
// //                 >
// //                   <Send className="h-4 w-4" />
// //                 </button>
// //               </div>
// //             </div>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // export default CodeEditor;

// import React, { useState, useRef, useEffect } from "react";
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
// } from "lucide-react";
// import { useTheme } from "../contexts/ThemeContext";
// import axios from "axios";
// import toast from "react-hot-toast";

// const CodeEditor: React.FC = () => {
//   const { id } = useParams();
//   const { theme } = useTheme();
//   const [language, setLanguage] = useState("javascript");
//   const [code, setCode] = useState(
//     '// Welcome to CodeForge!\n// Start typing your code here...\n\nconsole.log("Hello, World!");'
//   );
//   const [input, setInput] = useState("");
//   const [output, setOutput] = useState("");
//   const [isRunning, setIsRunning] = useState(false);
//   const [chatMessages, setChatMessages] = useState<
//     Array<{
//       id: string;
//       sender: "user" | "ai";
//       message: string;
//       timestamp: Date;
//     }>
//   >([]);
//   const [chatInput, setChatInput] = useState("");
//   const [isChatLoading, setIsChatLoading] = useState(false);
//   const [showChat, setShowChat] = useState(false);
//   const [showSettings, setShowSettings] = useState(false);
//   const [fileName, setFileName] = useState("untitled");
//   const [fileDescription, setFileDescription] = useState("");
//   const [isSaving, setIsSaving] = useState(false);

//   const editorRef = useRef<any>(null);
//   const chatEndRef = useRef<HTMLDivElement>(null);
//   const chatContainerRef = useRef<HTMLDivElement>(null);

//   const languages = [
//     { id: "javascript", name: "JavaScript", extension: ".js" },
//     { id: "python", name: "Python", extension: ".py" },
//     { id: "java", name: "Java", extension: ".java" },
//     { id: "cpp", name: "C++", extension: ".cpp" },
//     { id: "c", name: "C", extension: ".c" },
//     { id: "csharp", name: "C#", extension: ".cs" },
//     { id: "go", name: "Go", extension: ".go" },
//     { id: "rust", name: "Rust", extension: ".rs" },
//     { id: "php", name: "PHP", extension: ".php" },
//     { id: "ruby", name: "Ruby", extension: ".rb" },
//   ];

//   const defaultCode = {
//     javascript:
//       '// Welcome to CodeForge!\n// Start typing your code here...\n\nconsole.log("Hello, World!");',
//     python:
//       '# Welcome to CodeForge!\n# Start typing your code here...\n\nprint("Hello, World!")',
//     java: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}',
//     cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}',
//     c: '#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}',
//     csharp:
//       'using System;\n\nclass Program {\n    static void Main() {\n        Console.WriteLine("Hello, World!");\n    }\n}',
//     go: 'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, World!")\n}',
//     rust: 'fn main() {\n    println!("Hello, World!");\n}',
//     php: '<?php\necho "Hello, World!";\n?>',
//     ruby: 'puts "Hello, World!"',
//   };

//   useEffect(() => {
//     if (chatEndRef.current && showChat) {
//       chatEndRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [chatMessages, showChat]);

//   useEffect(() => {
//     if (id) {
//       loadFile(id);
//     }
//   }, [id]);

//   const loadFile = async (fileId: string) => {
//     try {
//       const response = await axios.get(`/files/${fileId}`);
//       const file = response.data;
//       setFileName(file.title);
//       setFileDescription(file.description);
//       setLanguage(file.language);
//       setCode(file.code);
//       setInput(file.input || "");
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
//     setChatInput("");
//     setIsChatLoading(true);

//     try {
//       const response = await axios.post("/ai/chat", {
//         message: chatInput,
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
//     }
//   };

//   return (
//     <div className="h-screen bg-gray-50 dark:bg-gray-900 flex flex-col relative">
//       {/* Header */}
//       <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 relative z-20">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center space-x-4">
//             <div className="flex items-center space-x-2">
//               <FileText className="h-5 w-5 text-gray-600 dark:text-gray-400" />
//               <input
//                 type="text"
//                 value={fileName}
//                 onChange={(e) => setFileName(e.target.value)}
//                 className="bg-transparent text-lg font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 min-w-0"
//                 placeholder="File name"
//               />
//             </div>
//             <select
//               value={language}
//               onChange={(e) => handleLanguageChange(e.target.value)}
//               className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               {languages.map((lang) => (
//                 <option key={lang.id} value={lang.id}>
//                   {lang.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="flex items-center space-x-2">
//             <button
//               onClick={() => setShowSettings(!showSettings)}
//               className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
//             >
//               <Settings className="h-5 w-5" />
//             </button>
//             <button
//               onClick={copyCode}
//               className="hidden sm:flex items-center space-x-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
//             >
//               <Copy className="h-4 w-4" />
//               <span className="text-sm">Copy</span>
//             </button>
//             <button
//               onClick={saveFile}
//               disabled={isSaving}
//               className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
//             >
//               {isSaving ? (
//                 <Loader2 className="h-4 w-4 animate-spin" />
//               ) : (
//                 <Save className="h-4 w-4" />
//               )}
//               <span className="text-sm hidden sm:inline">
//                 {isSaving ? "Saving..." : "Save"}
//               </span>
//             </button>
//             <button
//               onClick={runCode}
//               disabled={isRunning}
//               className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
//             >
//               {isRunning ? (
//                 <Loader2 className="h-4 w-4 animate-spin" />
//               ) : (
//                 <Play className="h-4 w-4" />
//               )}
//               <span className="text-sm hidden sm:inline">
//                 {isRunning ? "Running..." : "Run"}
//               </span>
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Settings Panel */}
//       {showSettings && (
//         <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 animate-in slide-in-from-top duration-200">
//           <div className="max-w-sm">
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 ">
//               Description
//             </label>
//             <textarea
//               value={fileDescription}
//               onChange={(e) => setFileDescription(e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
//               rows={2}
//               placeholder="Enter file description..."
//             />
//           </div>
//         </div>
//       )}

//       {/* Main Content */}
//       <div className="flex-1 flex flex-col relative">
//         {/* Code Editor */}
//         <div className="flex-1 flex flex-col ">
//           <div className="flex-1 ">
//             <Editor
//               height="100%"
//               language={language === "cpp" ? "cpp" : language}
//               value={code}
//               onChange={(value) => setCode(value || "")}
//               theme={theme === "dark" ? "vs-dark" : "vs-light"}
//               options={{
//                 minimap: { enabled: false },
//                 fontSize: 14,
//                 lineNumbers: "on",
//                 wordWrap: "on",
//                 automaticLayout: true,
//                 scrollBeyondLastLine: false,
//                 smoothScrolling: true,
//                 cursorBlinking: "smooth",
//                 renderWhitespace: "boundary",
//                 bracketPairColorization: { enabled: true },
//               }}
//               onMount={(editor) => {
//                 editorRef.current = editor;
//               }}
//             />
//           </div>

//           {/* Input/Output Section */}
//           <div className="h-48 sm:h-64 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row">
//             <div className="flex-1 flex flex-col border-b sm:border-b-0 sm:border-r border-gray-200 dark:border-gray-700">
//               <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 border-b border-gray-200 dark:border-gray-700">
//                 <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
//                   Input
//                 </h3>
//               </div>
//               <textarea
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//                 className="flex-1 p-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-white resize-none focus:outline-none text-sm"
//                 placeholder="Enter input for your program..."
//               />
//             </div>
//             <div className="flex-1 flex flex-col">
//               <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 border-b border-gray-200 dark:border-gray-700">
//                 <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
//                   Output
//                 </h3>
//               </div>
//               <div className="flex-1 p-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-mono text-sm overflow-auto">
//                 <pre className="whitespace-pre-wrap">{output}</pre>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* AI Assistant Button */}
//       <button
//         onClick={() => setShowChat(!showChat)}
//         className="fixed bottom-6 right-6 z-30 w-14 h-14 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group hover:scale-110"
//       >
//         {showChat ? (
//           <X className="h-6 w-6" />
//         ) : (
//           <MessageSquare className="h-6 w-6" />
//         )}
//         <div className="absolute -top-12 right-0 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
//           {showChat ? "Close AI Assistant" : "Open AI Assistant"}
//         </div>
//       </button>

//       {/* AI Chat Panel */}
//       {showChat && (
//         <div className="fixed bottom-0 right-0 w-full sm:w-96 h-[80%] bg-white dark:bg-gray-800 border-l border-t border-gray-200 dark:border-gray-700 flex flex-col z-20 animate-in slide-in-from-bottom duration-300 shadow-2xl">
//           <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
//             <div>
//               <h3 className="text-lg font-medium text-gray-900 dark:text-white">
//                 DSA Assistant
//               </h3>
//               <p className="text-sm text-gray-600 dark:text-gray-400">
//                 Ask me anything about Data Structures & Algorithms
//               </p>
//             </div>
//             <button
//               onClick={() => setShowChat(false)}
//               className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
//             >
//               <ChevronDown className="h-5 w-5" />
//             </button>
//           </div>

//           <div
//             ref={chatContainerRef}
//             className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
//           >
//             {chatMessages.length === 0 && (
//               <div className="text-center text-gray-500 dark:text-gray-400 py-8">
//                 <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
//                 <p className="text-sm">
//                   Start a conversation with the AI assistant!
//                 </p>
//               </div>
//             )}

//             {chatMessages.map((message) => (
//               <div
//                 key={message.id}
//                 className={`flex ${
//                   message.sender === "user" ? "justify-end" : "justify-start"
//                 } animate-in fade-in slide-in-from-bottom-2 duration-300`}
//               >
//                 <div
//                   className={`max-w-xs px-4 py-2 rounded-lg ${
//                     message.sender === "user"
//                       ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
//                       : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
//                   }`}
//                 >
//                   <p className="text-sm whitespace-pre-wrap">
//                     {message.message}
//                   </p>
//                   <p className="text-xs opacity-70 mt-1">
//                     {message.timestamp.toLocaleTimeString()}
//                   </p>
//                 </div>
//               </div>
//             ))}

//             {isChatLoading && (
//               <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
//                 <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2">
//                   <div className="flex items-center space-x-2">
//                     <Loader2 className="h-4 w-4 animate-spin" />
//                     <span className="text-sm">AI is thinking...</span>
//                   </div>
//                 </div>
//               </div>
//             )}
//             <div ref={chatEndRef} />
//           </div>

//           <div className="p-4 border-t border-gray-200 dark:border-gray-700">
//             <div className="flex space-x-2">
//               <input
//                 type="text"
//                 value={chatInput}
//                 onChange={(e) => setChatInput(e.target.value)}
//                 onKeyDown={(e) => {
//                   if (e.key === "Enter" && !e.shiftKey) {
//                     e.preventDefault();
//                     sendChatMessage();
//                   }
//                 }}
//                 className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
//                 placeholder="Ask about DSA..."
//               />
//               <button
//                 onClick={sendChatMessage}
//                 disabled={isChatLoading || !chatInput.trim()}
//                 className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 <Send className="h-4 w-4" />
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CodeEditor;
import React, { useState, useRef, useEffect } from "react";
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
import MessageRenderer from "./MessageRenderer";
import axios from "axios";
import toast from "react-hot-toast";

const CodeEditor: React.FC = () => {
  const { id } = useParams();
  const { theme } = useTheme();
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(
    '// Welcome to CodeForge!\n// Start typing your code here...\n\nconsole.log("Hello, World!");'
  );
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [chatMessages, setChatMessages] = useState<
    Array<{
      id: string;
      sender: "user" | "ai";
      message: string;
      timestamp: Date;
    }>
  >([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [fileName, setFileName] = useState("untitled");
  const [fileDescription, setFileDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isOutputExpanded, setIsOutputExpanded] = useState(false);
  const [isChatMinimized, setIsChatMinimized] = useState(false);

  const editorRef = useRef<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (chatEndRef.current && showChat && !isChatMinimized) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, showChat, isChatMinimized]);

  useEffect(() => {
    if (id) {
      loadFile(id);
    }
  }, [id]);

  // Add some sample AI responses for demonstration
  useEffect(() => {
    if (chatMessages.length === 0) {
      setChatMessages([
        {
          id: "welcome",
          sender: "ai",
          message: `# Welcome to DSA Assistant! 🚀

I'm here to help you with **Data Structures and Algorithms**. I can assist you with:

- Algorithm explanations and implementations
- Code optimization and debugging
- Data structure concepts
- Time and space complexity analysis
- Problem-solving strategies

## Example: Binary Search Implementation

\`\`\`javascript
function binarySearch(arr, target) {
    let left = 0;
    let right = arr.length - 1;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        
        if (arr[mid] === target) {
            return mid;
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return -1; // Target not found
}

// Usage example
const sortedArray = [1, 3, 5, 7, 9, 11, 13];
const result = binarySearch(sortedArray, 7);
console.log(result); // Output: 3
\`\`\`

**Time Complexity:** O(log n)  
**Space Complexity:** O(1)

Feel free to ask me anything about algorithms, data structures, or help with your code!`,
          timestamp: new Date(),
        },
      ]);
    }
  }, []);

  const loadFile = async (fileId: string) => {
    try {
      const response = await axios.get(`/files/${fileId}`);
      const file = response.data;
      setFileName(file.title);
      setFileDescription(file.description);
      setLanguage(file.language);
      setCode(file.code);
      setInput(file.input || "");
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
      // Simulate AI response for demonstration
      await new Promise((resolve) =>
        setTimeout(resolve, 1000 + Math.random() * 2000)
      );

      let aiResponse = "";

      // Generate contextual responses based on user input
      const input = currentInput.toLowerCase();

      if (input.includes("bubble sort") || input.includes("sorting")) {
        aiResponse = `# Bubble Sort Algorithm

Bubble Sort is a simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.

## Implementation in ${language.charAt(0).toUpperCase() + language.slice(1)}:

\`\`\`${language}
${
  language === "javascript"
    ? `function bubbleSort(arr) {
    const n = arr.length;
    
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                // Swap elements
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
        }
    }
    
    return arr;
}

// Example usage
const numbers = [64, 34, 25, 12, 22, 11, 90];
console.log("Original array:", numbers);
console.log("Sorted array:", bubbleSort([...numbers]));`
    : language === "python"
    ? `def bubble_sort(arr):
    n = len(arr)
    
    for i in range(n - 1):
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                # Swap elements
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    
    return arr

# Example usage
numbers = [64, 34, 25, 12, 22, 11, 90]
print("Original array:", numbers)
print("Sorted array:", bubble_sort(numbers.copy()))`
    : `// Generic bubble sort implementation
void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                // Swap elements
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
}`
}
\`\`\`

## Complexity Analysis:
- **Time Complexity:** O(n²) in worst and average case, O(n) in best case
- **Space Complexity:** O(1) - in-place sorting algorithm
- **Stability:** Stable (maintains relative order of equal elements)

## When to use Bubble Sort:
- Educational purposes (easy to understand)
- Small datasets
- When simplicity is more important than efficiency

For larger datasets, consider more efficient algorithms like **Quick Sort**, **Merge Sort**, or **Heap Sort**.`;
      } else if (input.includes("binary search") || input.includes("search")) {
        aiResponse = `# Binary Search Algorithm

Binary Search is an efficient algorithm for finding an item from a sorted list of items. It works by repeatedly dividing the search interval in half.

## Implementation:

\`\`\`${language}
${
  language === "javascript"
    ? `function binarySearch(arr, target) {
    let left = 0;
    let right = arr.length - 1;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        
        if (arr[mid] === target) {
            return mid; // Found target at index mid
        } else if (arr[mid] < target) {
            left = mid + 1; // Search right half
        } else {
            right = mid - 1; // Search left half
        }
    }
    
    return -1; // Target not found
}

// Recursive implementation
function binarySearchRecursive(arr, target, left = 0, right = arr.length - 1) {
    if (left > right) return -1;
    
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) return binarySearchRecursive(arr, target, mid + 1, right);
    return binarySearchRecursive(arr, target, left, mid - 1);
}`
    : language === "python"
    ? `def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        
        if arr[mid] == target:
            return mid  # Found target at index mid
        elif arr[mid] < target:
            left = mid + 1  # Search right half
        else:
            right = mid - 1  # Search left half
    
    return -1  # Target not found

# Recursive implementation
def binary_search_recursive(arr, target, left=0, right=None):
    if right is None:
        right = len(arr) - 1
    
    if left > right:
        return -1
    
    mid = (left + right) // 2
    
    if arr[mid] == target:
        return mid
    elif arr[mid] < target:
        return binary_search_recursive(arr, target, mid + 1, right)
    else:
        return binary_search_recursive(arr, target, left, mid - 1)`
    : `int binarySearch(int arr[], int n, int target) {
    int left = 0, right = n - 1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2;
        
        if (arr[mid] == target)
            return mid;
        else if (arr[mid] < target)
            left = mid + 1;
        else
            right = mid - 1;
    }
    
    return -1; // Target not found
}`
}
\`\`\`

## Key Points:
- **Prerequisite:** Array must be sorted
- **Time Complexity:** O(log n)
- **Space Complexity:** O(1) for iterative, O(log n) for recursive
- **Efficiency:** Much faster than linear search for large datasets

## Example Usage:
\`\`\`${language}
${
  language === "javascript"
    ? `const sortedArray = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
console.log(binarySearch(sortedArray, 7));  // Output: 3
console.log(binarySearch(sortedArray, 4));  // Output: -1`
    : language === "python"
    ? `sorted_array = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19]
print(binary_search(sorted_array, 7))   # Output: 3
print(binary_search(sorted_array, 4))   # Output: -1`
    : `int arr[] = {1, 3, 5, 7, 9, 11, 13, 15, 17, 19};
int n = sizeof(arr) / sizeof(arr[0]);
printf("%d\\n", binarySearch(arr, n, 7));  // Output: 3`
}
\`\`\``;
      } else if (input.includes("linked list") || input.includes("list")) {
        aiResponse = `# Linked List Data Structure

A Linked List is a linear data structure where elements are stored in nodes, and each node contains data and a reference (or link) to the next node.

## Basic Node Structure:

\`\`\`${language}
${
  language === "javascript"
    ? `class ListNode {
    constructor(val = 0, next = null) {
        this.val = val;
        this.next = next;
    }
}

class LinkedList {
    constructor() {
        this.head = null;
        this.size = 0;
    }
    
    // Insert at beginning
    prepend(val) {
        const newNode = new ListNode(val);
        newNode.next = this.head;
        this.head = newNode;
        this.size++;
    }
    
    // Insert at end
    append(val) {
        const newNode = new ListNode(val);
        
        if (!this.head) {
            this.head = newNode;
        } else {
            let current = this.head;
            while (current.next) {
                current = current.next;
            }
            current.next = newNode;
        }
        this.size++;
    }
    
    // Delete by value
    delete(val) {
        if (!this.head) return false;
        
        if (this.head.val === val) {
            this.head = this.head.next;
            this.size--;
            return true;
        }
        
        let current = this.head;
        while (current.next && current.next.val !== val) {
            current = current.next;
        }
        
        if (current.next) {
            current.next = current.next.next;
            this.size--;
            return true;
        }
        
        return false;
    }
    
    // Display the list
    display() {
        const values = [];
        let current = this.head;
        while (current) {
            values.push(current.val);
            current = current.next;
        }
        return values.join(' -> ');
    }
}`
    : language === "python"
    ? `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class LinkedList:
    def __init__(self):
        self.head = None
        self.size = 0
    
    def prepend(self, val):
        """Insert at beginning"""
        new_node = ListNode(val)
        new_node.next = self.head
        self.head = new_node
        self.size += 1
    
    def append(self, val):
        """Insert at end"""
        new_node = ListNode(val)
        
        if not self.head:
            self.head = new_node
        else:
            current = self.head
            while current.next:
                current = current.next
            current.next = new_node
        
        self.size += 1
    
    def delete(self, val):
        """Delete by value"""
        if not self.head:
            return False
        
        if self.head.val == val:
            self.head = self.head.next
            self.size -= 1
            return True
        
        current = self.head
        while current.next and current.next.val != val:
            current = current.next
        
        if current.next:
            current.next = current.next.next
            self.size -= 1
            return True
        
        return False
    
    def display(self):
        """Display the list"""
        values = []
        current = self.head
        while current:
            values.append(str(current.val))
            current = current.next
        return ' -> '.join(values)`
    : `struct ListNode {
    int val;
    struct ListNode* next;
};

struct ListNode* createNode(int val) {
    struct ListNode* newNode = (struct ListNode*)malloc(sizeof(struct ListNode));
    newNode->val = val;
    newNode->next = NULL;
    return newNode;
}

// Insert at beginning
struct ListNode* prepend(struct ListNode* head, int val) {
    struct ListNode* newNode = createNode(val);
    newNode->next = head;
    return newNode;
}

// Insert at end
struct ListNode* append(struct ListNode* head, int val) {
    struct ListNode* newNode = createNode(val);
    
    if (head == NULL) {
        return newNode;
    }
    
    struct ListNode* current = head;
    while (current->next != NULL) {
        current = current->next;
    }
    current->next = newNode;
    
    return head;
}`
}
\`\`\`

## Types of Linked Lists:

1. **Singly Linked List** - Each node points to the next node
2. **Doubly Linked List** - Each node has pointers to both next and previous nodes
3. **Circular Linked List** - Last node points back to the first node

## Time Complexities:
- **Access/Search:** O(n)
- **Insertion:** O(1) at beginning, O(n) at end (without tail pointer)
- **Deletion:** O(1) if node is given, O(n) to find and delete

## Advantages:
- Dynamic size
- Efficient insertion/deletion at beginning
- Memory efficient (no wasted space)

## Disadvantages:
- No random access
- Extra memory for storing pointers
- Not cache-friendly`;
      } else if (input.includes("time complexity") || input.includes("big o")) {
        aiResponse = `# Time Complexity & Big O Notation

Big O notation describes the upper bound of an algorithm's time complexity, helping us understand how the runtime grows with input size.

## Common Time Complexities (Best to Worst):

| Big O | Name | Example |
|-------|------|---------|
| O(1) | Constant | Array access, Hash table lookup |
| O(log n) | Logarithmic | Binary search, Balanced tree operations |
| O(n) | Linear | Linear search, Array traversal |
| O(n log n) | Linearithmic | Merge sort, Heap sort |
| O(n²) | Quadratic | Bubble sort, Nested loops |
| O(2ⁿ) | Exponential | Recursive Fibonacci, Subset generation |
| O(n!) | Factorial | Permutation generation |

## Examples with Code:

### O(1) - Constant Time
\`\`\`${language}
${
  language === "javascript"
    ? `// Array access
function getFirstElement(arr) {
    return arr[0]; // Always takes same time regardless of array size
}`
    : language === "python"
    ? `# Dictionary lookup
def get_value(dictionary, key):
    return dictionary[key]  # Constant time operation`
    : `// Array access
int getElement(int arr[], int index) {
    return arr[index];  // O(1) operation
}`
}
\`\`\`

### O(log n) - Logarithmic Time
\`\`\`${language}
${
  language === "javascript"
    ? `// Binary search
function binarySearch(arr, target) {
    let left = 0, right = arr.length - 1;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (arr[mid] === target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}`
    : language === "python"
    ? `# Binary search
def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1`
    : `// Binary search
int binarySearch(int arr[], int n, int target) {
    int left = 0, right = n - 1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}`
}
\`\`\`

### O(n) - Linear Time
\`\`\`${language}
${
  language === "javascript"
    ? `// Linear search
function linearSearch(arr, target) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === target) return i;
    }
    return -1;
}`
    : language === "python"
    ? `# Linear search
def linear_search(arr, target):
    for i in range(len(arr)):
        if arr[i] == target:
            return i
    return -1`
    : `// Linear search
int linearSearch(int arr[], int n, int target) {
    for (int i = 0; i < n; i++) {
        if (arr[i] == target) return i;
    }
    return -1;
}`
}
\`\`\`

### O(n²) - Quadratic Time
\`\`\`${language}
${
  language === "javascript"
    ? `// Bubble sort
function bubbleSort(arr) {
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
        }
    }
    return arr;
}`
    : language === "python"
    ? `# Bubble sort
def bubble_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr`
    : `// Bubble sort
void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
}`
}
\`\`\`

## Tips for Analysis:
1. **Drop constants:** O(2n) → O(n)
2. **Drop lower-order terms:** O(n² + n) → O(n²)
3. **Consider worst-case scenario**
4. **Focus on input size growth**

Understanding time complexity helps you choose the right algorithm for your specific use case!`;
      } else {
        // Generic helpful response
        aiResponse = `I'd be happy to help you with that! Here are some ways I can assist you:

## 🔍 **Algorithm Help**
- Explain sorting algorithms (bubble, merge, quick, etc.)
- Search algorithms (binary search, linear search)
- Graph algorithms (BFS, DFS, Dijkstra)

## 📊 **Data Structures**
- Arrays, Linked Lists, Stacks, Queues
- Trees (Binary, BST, AVL, Red-Black)
- Hash Tables, Heaps, Graphs

## ⚡ **Code Analysis**
- Time and space complexity analysis
- Code optimization suggestions
- Debugging help

## 💡 **Problem Solving**
- Algorithm design strategies
- Common coding patterns
- Interview preparation

Feel free to ask me about any specific topic, share your code for review, or request help with a particular problem you're working on!

**Example questions you can ask:**
- "How does merge sort work?"
- "What's the time complexity of this code?"
- "Help me implement a binary tree"
- "Explain dynamic programming"`;
      }

      const aiMessage = {
        id: (Date.now() + 1).toString(),
        sender: "ai" as const,
        message: aiResponse,
        timestamp: new Date(),
      };

      setChatMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      toast.error("Failed to get AI response");
    } finally {
      setIsChatLoading(false);
    }
  };

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
              isOutputExpanded ? "h-96" : "h-60 sm:h-60 md:h-80"
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
        className="fixed bottom-4 right-4 z-30 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group hover:scale-110"
      >
        {showChat ? (
          <X className="h-5 w-5 sm:h-6 sm:w-6" />
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
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5" />
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
                    className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
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
