"use client";

import localFont from "next/font/local";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import RightSide from "@/components/rightSide";
import WalletContextProvider from "@/context/walletContextProvider";
import { AppProvider } from "@/context/context";

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
            <div className="flex h-screen w-full bg-black text-white">
              {/* Sidebar */}
              <div className="flex flex-col w-1/4 min-w-[240px] border-r-2 border-white">
                <Sidebar />
              </div>

              {/* Main Content */}
              <div className="flex-grow border-r-1 border-white p-4 overflow-y-auto">
                {children}
              </div>

              {/* Right Sidebar / Extra Section w-5/12*/}
              <div className="w-1/2 min-w-[240px] border-white border-l-2 p-4 overflow-y-auto">
                {/* <WhoToFollow suggestions={tweets} /> */}
                <RightSide />
              </div>
            </div>
          </AppProvider>
        </WalletContextProvider>
      </body>
    </html>
  );
}
