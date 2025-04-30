// // layout.tsx
// "use client";

// import localFont from "next/font/local";
// import "./globals.css";
// import Sidebar from "@/components/Sidebar";
// import RightSide from "@/components/rightSide";
// import WalletContextProvider from "@/context/walletContextProvider";
// import { AppProvider } from "@/context/context";

// const geistSans = localFont({
//   src: "./fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });
// const geistMono = localFont({
//   src: "./fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body
//         className={`${geistSans.variable} ${geistMono.variable} antialiased`}
//       >
//         <WalletContextProvider>
//           <AppProvider>
//             <div className="flex h-screen w-full bg-black text-white">
//               {/* Sidebar */}
//               <div className="flex flex-col w-1/4 min-w-[240px] border-r-2 border-white">
//                 <Sidebar />
//               </div>

//               {/* Main Content */}
//               <div className="flex-grow border-r-1 border-white p-4 overflow-y-auto">
//                 {children}
//               </div>

//               {/* Right Sidebar / Extra Section w-5/12*/}
//               <div className="w-1/2 min-w-[240px] border-white border-l-2 p-4 overflow-y-auto">
//                 {/* <WhoToFollow suggestions={tweets} /> */}
//                 <RightSide />
//               </div>
//             </div>
//           </AppProvider>
//         </WalletContextProvider>
//       </body>
//     </html>
//   );
// }
// layout.tsx
"use client";

import localFont from "next/font/local";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import WalletContextProvider from "@/context/walletContextProvider";
import { AppProvider } from "@/context/context";
import RightSide from "@/components/rightSide";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <WalletContextProvider>
          <AppProvider>
            <div className="flex min-h-screen bg-black text-white">
              {/* Sidebar - hidden on small screens */}
              <div className="hidden md:flex flex-col w-16 xl:w-64 border-r border-gray-800 fixed h-full">
                <Sidebar />
              </div>

              {/* Main Content */}
              <div className="flex-grow md:ml-16 xl:ml-64 md:mr-80 w-full transition-all duration-300">
                <main className="max-w-[600px] mx-auto">
                  {children}
                </main>
              </div>

              {/* Right Sidebar - hidden on small screens */}
              <div className="hidden md:block w-80 border-l border-gray-800 fixed right-0 h-full overflow-y-auto">
                <RightSide />
              </div>
              
              {/* Mobile Bottom Navigation - visible only on small screens */}
              <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 p-2 flex justify-around items-center z-20">
                <button className="p-3 rounded-full hover:bg-gray-800">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </button>
                <button className="p-3 rounded-full hover:bg-gray-800">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
                <button className="p-3 rounded-full hover:bg-gray-800">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </button>
                <button className="p-3 rounded-full hover:bg-gray-800">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </button>
              </div>
            </div>
          </AppProvider>
        </WalletContextProvider>
      </body>
    </html>
  );
}