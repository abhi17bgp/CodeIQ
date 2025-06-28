// import React from "react";
// import { Link } from "react-router-dom";
// import { Files, Brain, Plus } from "lucide-react";
// import { useAuth } from "../contexts/AuthContext";

// const Dashboard: React.FC = () => {
//   const { user } = useAuth();

//   const quickActions = [
//     {
//       title: "New Code File",
//       description: "Start a new coding project",
//       icon: Plus,
//       link: "/editor",
//       color: "from-blue-600 to-blue-700",
//     },
//     {
//       title: "Browse Files",
//       description: "View and manage your code files",
//       icon: Files,
//       link: "/files",
//       color: "from-green-600 to-green-700",
//     },
//     {
//       title: "AI Assistant",
//       description: "Get help with DSA concepts",
//       icon: Brain,
//       link: "/editor",
//       color: "from-purple-600 to-purple-700",
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
//         <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
//           {/* Header */}
//           <div className="text-center mb-12 lg:mb-16 max-w-4xl">
//             <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
//               Welcome back,{" "}
//               <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//                 {user?.profile.firstName || user?.username}
//               </span>
//               !
//             </h1>
//             <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 dark:text-gray-400 leading-relaxed">
//               Ready to continue your coding journey?
//             </p>
//           </div>

//           {/* Quick Actions */}
//           <div className="w-full max-w-6xl">
//             <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 lg:p-8 shadow-xl border border-gray-200/50 dark:border-gray-700/50">
//               <h2 className="text-xl lg:text-2xl font-semibold text-gray-900 dark:text-white mb-8 text-center">
//                 Quick Actions
//               </h2>

//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
//                 {quickActions.map((action, index) => (
//                   <Link
//                     key={index}
//                     to={action.link}
//                     className="group relative p-6 lg:p-8 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-transparent hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white dark:bg-gray-800"
//                   >
//                     {/* Gradient overlay on hover */}
//                     <div
//                       className={`absolute inset-0 bg-gradient-to-r ${action.color} opacity-0 group-hover:opacity-5 rounded-xl transition-opacity duration-300`}
//                     />

//                     <div className="relative z-10">
//                       <div
//                         className={`w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
//                       >
//                         <action.icon className="h-7 w-7 lg:h-8 lg:w-8 text-white" />
//                       </div>

//                       <h3 className="font-semibold text-lg lg:text-xl text-gray-900 dark:text-white mb-3 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors">
//                         {action.title}
//                       </h3>

//                       <p className="text-sm lg:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
//                         {action.description}
//                       </p>
//                     </div>
//                   </Link>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Additional Stats or Info */}
//           <div className="mt-12 lg:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl">
//             <div className="text-center p-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50">
//               <div className="text-2xl lg:text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
//                 10+
//               </div>
//               <div className="text-sm lg:text-base text-gray-600 dark:text-gray-400">
//                 Languages Supported
//               </div>
//             </div>

//             <div className="text-center p-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50">
//               <div className="text-2xl lg:text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
//                 AI
//               </div>
//               <div className="text-sm lg:text-base text-gray-600 dark:text-gray-400">
//                 Powered Assistant
//               </div>
//             </div>

//             <div className="text-center p-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50">
//               <div className="text-2xl lg:text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
//                 24/7
//               </div>
//               <div className="text-sm lg:text-base text-gray-600 dark:text-gray-400">
//                 Available
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;
import React from "react";
import { Link } from "react-router-dom";
import { Files, Brain, Plus } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import WelcomeBanner from "../components/WelcomeBanner";


const Dashboard: React.FC = () => {
    const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("showWelcome") === "true") {
      setShowBanner(true);
      localStorage.removeItem("showWelcome");
    }
  }, []);
  const { user } = useAuth();

  const quickActions = [
    {
      title: "New Code File",
      description: "Start a new coding project",
      icon: Plus,
      link: "/editor",
      color: "from-blue-600 to-blue-700",
    },
    {
      title: "Browse Files",
      description: "View and manage your code files",
      icon: Files,
      link: "/files",
      color: "from-green-600 to-green-700",
    },
    {
      title: "AI Assistant",
      description: "Get help with DSA concepts",
      icon: Brain,
      link: "/editor?ai=true",
      color: "from-purple-600 to-purple-700",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        {showBanner && (
        <WelcomeBanner username={user?.profile.firstName || "User"} />
      )}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
          {/* Header */}
          <div className="text-center mb-12 lg:mb-16 max-w-4xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
              Welcome back,{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {user?.profile.firstName || user?.username}
              </span>
              !
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 dark:text-gray-400 leading-relaxed">
              Ready to continue your coding journey?
            </p>
          </div>

          {/* Quick Actions */}
          <div className="w-full max-w-6xl">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 lg:p-8 shadow-xl border border-gray-200/50 dark:border-gray-700/50">
              <h2 className="text-xl lg:text-2xl font-semibold text-gray-900 dark:text-white mb-8 text-center">
                Quick Actions
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {quickActions.map((action, index) => (
                  <Link
                    key={index}
                    to={action.link}
                    className="group relative p-6 lg:p-8 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-transparent hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white dark:bg-gray-800"
                  >
                    {/* Gradient overlay on hover */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${action.color} opacity-0 group-hover:opacity-5 rounded-xl transition-opacity duration-300`}
                    />

                    <div className="relative z-10">
                      <div
                        className={`w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                      >
                        <action.icon className="h-7 w-7 lg:h-8 lg:w-8 text-white" />
                      </div>

                      <h3 className="font-semibold text-lg lg:text-xl text-gray-900 dark:text-white mb-3 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors">
                        {action.title}
                      </h3>

                      <p className="text-sm lg:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                        {action.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Additional Stats or Info */}
          <div className="mt-12 lg:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl">
            <div className="text-center p-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50">
              <div className="text-2xl lg:text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                10+
              </div>
              <div className="text-sm lg:text-base text-gray-600 dark:text-gray-400">
                Languages Supported
              </div>
            </div>

            <div className="text-center p-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50">
              <div className="text-2xl lg:text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                AI
              </div>
              <div className="text-sm lg:text-base text-gray-600 dark:text-gray-400">
                Powered Assistant
              </div>
            </div>

            <div className="text-center p-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50">
              <div className="text-2xl lg:text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                24/7
              </div>
              <div className="text-sm lg:text-base text-gray-600 dark:text-gray-400">
                Available
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
