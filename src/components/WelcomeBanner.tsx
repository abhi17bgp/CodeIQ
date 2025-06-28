// // // import React, { useEffect, useState } from "react";

// // // interface WelcomeBannerProps {
// // //   username: string;
// // // }

// // // const WelcomeBanner: React.FC<WelcomeBannerProps> = ({ username }) => {
// // //   const [visible, setVisible] = useState(true);
// // //   const [hide, setHide] = useState(false);

// // //   useEffect(() => {
// // //     const hideTimer = setTimeout(() => setHide(true), 3000); // Start exit after 3s
// // //     const removeTimer = setTimeout(() => setVisible(false), 4000); // Remove from DOM after 1s exit
// // //     return () => {
// // //       clearTimeout(hideTimer);
// // //       clearTimeout(removeTimer);
// // //     };
// // //   }, []);

// // //   if (!visible) return null;

// // //   return (
// // //     <div className="mt-24 flex justify-center perspective-[1000px]">
// // //       <div
// // //         className={`text-white px-8 py-4 text-lg rounded-xl shadow-2xl
// // //           bg-gradient-to-r from-purple-500 to-indigo-500
// // //           origin-top transition-transform duration-1000 ease-in-out
// // //           ${
// // //             hide
// // //               ? "opacity-0 -translate-y-52 rotate-x-60"
// // //               : "animate-[hingeDrop_1.5s_ease-out_forwards]"
// // //           }`}
// // //       >
// // //         👋 Welcome, {username}!
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default WelcomeBanner;
// // import React, { useEffect, useState } from "react";
// // import { Sparkles } from "lucide-react";

// // interface WelcomeBannerProps {
// //   username: string;
// //   duration?: number; // Optional: time to stay visible (default 4000ms)
// // }

// // const WelcomeBanner: React.FC<WelcomeBannerProps> = ({
// //   username,
// //   duration = 4000,
// // }) => {
// //   const [hide, setHide] = useState(false);
// //   const [visible, setVisible] = useState(true);

// //   useEffect(() => {
// //     const hideTimer = setTimeout(() => setHide(true), duration - 1000); // trigger exit
// //     const removeTimer = setTimeout(() => setVisible(false), duration);

// //     return () => {
// //       clearTimeout(hideTimer);
// //       clearTimeout(removeTimer);
// //     };
// //   }, [duration]);

// //   if (!visible) return null;

// //   return (
// //     <div className="fixed top-12 inset-x-0 z-50 flex justify-center pointer-events-none">
// //       <div
// //         className={`transform transition-all duration-1000 ease-in-out origin-top
// //           px-6 py-4 rounded-2xl shadow-xl border border-white/30 backdrop-blur-xl bg-gradient-to-r from-purple-500 via-indigo-600 to-blue-500
// //           text-white text-lg sm:text-xl font-semibold flex items-center gap-2
// //           ${
// //             hide
// //               ? "opacity-0 -translate-y-28 rotate-x-75"
// //               : "animate-[hingeDrop_1.5s_ease-out_forwards] opacity-100"
// //           }`}
// //       >
// //         <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" />
// //         <span className="drop-shadow-md"> 👋Welcome back, {username}!</span>
// //       </div>
// //     </div>
// //   );
// // };

// // export default WelcomeBanner;
// import React, { useEffect, useState } from "react";
// import { Sparkles } from "lucide-react";

// interface WelcomeBannerProps {
//   username: string;
//   duration?: number;
// }

// const WelcomeBanner: React.FC<WelcomeBannerProps> = ({
//   username,
//   duration = 5000,
// }) => {
//   const [hide, setHide] = useState(false);
//   const [visible, setVisible] = useState(true);

//   useEffect(() => {
//     const hideTimer = setTimeout(() => setHide(true), duration - 1000);
//     const removeTimer = setTimeout(() => setVisible(false), duration);

//     return () => {
//       clearTimeout(hideTimer);
//       clearTimeout(removeTimer);
//     };
//   }, [duration]);

//   if (!visible) return null;

//   return (
//     <div className="fixed top-0 inset-x-0 z-50 flex justify-center items-start pointer-events-none">
//       {/* Ropes */}
//       <div className="relative flex flex-col items-center animate-ropeDrop">
//         <div className="flex gap-14 justify-between absolute -top-16 w-full z-0">
//           <div className="h-16 w-0.5 bg-yellow-300 animate-ropeBounce"></div>
//           <div className="h-16 w-0.5 bg-yellow-300 animate-ropeBounce"></div>
//         </div>

//         {/* Banner */}
//         <div
//           className={`transform transition-all duration-1000 ease-in-out origin-top
//           mt-16 px-6 py-4 rounded-2xl shadow-xl border border-white/30 backdrop-blur-xl bg-gradient-to-r from-purple-500 via-indigo-600 to-blue-500
//           text-white text-lg sm:text-xl font-semibold flex items-center gap-2
//           ${
//             hide
//               ? "opacity-0 -translate-y-28 rotate-x-75"
//               : "animate-[swingIn_1.5s_ease-out_forwards] opacity-100"
//           }`}
//         >
//           <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" />
//           <span className="drop-shadow-md">👋 Welcome back, {username}!</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default WelcomeBanner;
import React, { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

interface WelcomeBannerProps {
  username: string;
  duration?: number;
}

const WelcomeBanner: React.FC<WelcomeBannerProps> = ({
  username,
  duration = 5000,
}) => {
  const [showBanner, setShowBanner] = useState(false);
  const [hide, setHide] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Show banner after ropes come down
    const showTimer = setTimeout(() => setShowBanner(true), 1000);

    // Start exit animations
    const hideTimer = setTimeout(() => setHide(true), duration - 1000);

    // Fully remove after animations
    const removeTimer = setTimeout(() => setVisible(false), duration);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
      clearTimeout(removeTimer);
    };
  }, [duration]);

  if (!visible) return null;

  return (
    <div className="fixed top-0 inset-x-0 z-[9999] flex justify-center items-start pointer-events-none">
      <div className="relative flex flex-col items-center">
        {/* Ropes */}
        <div
          className={`absolute ${
            hide ? "-top-0" : "-top-28"
          } flex justify-between w-32 z-0 transition-all duration-1000`}
        >
          <div
            className={`w-0.5 bg-yellow-300 transition-all duration-1000 ${
              hide ? "h-0" : "h-28"
            }`}
          />
          <div
            className={`w-0.5 bg-yellow-300 transition-all duration-1000 ${
              hide ? "h-0" : "h-28"
            }`}
          />
        </div>

        {/* Banner */}
        <div
          className={`mt-[7rem] px-6 py-4 rounded-2xl shadow-xl border border-white/30 backdrop-blur-xl
          bg-gradient-to-r from-purple-500 via-indigo-600 to-blue-500
          text-white text-lg sm:text-xl font-semibold flex items-center gap-2 origin-top
          transform transition-all duration-1000 ease-in-out
          ${
            !showBanner
              ? "opacity-0 scale-95 -translate-y-10"
              : hide
              ? "opacity-0 -translate-y-28 rotate-x-75"
              : "animate-[swingIn_1.5s_ease-out_forwards] opacity-100"
          }`}
        >
          <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" />
          <span>👋 Welcome back, {username}!</span>
        </div>
      </div>
    </div>
  );
};

export default WelcomeBanner;
