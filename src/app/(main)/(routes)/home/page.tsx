"use client";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import MiniTimerWidget from "@/components/MiniTimerWidget";
import AIChatbot from "@/components/AIChatbot";

const HomePage = () => {
    const [time, setTime] = useState(new Date());
    const {user, isLoaded } = useUser();

    useEffect(() => {
        const interval = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(interval); // Cleanup on unmount
      }, []);

      const formatTime = (date: Date) => {
        return date.toLocaleTimeString();
      };

    return (
        <div className="min-h-screen flex flex-col px-4 sm:px-6 lg:px-8">
            {/* Main Content - Centered Clock */}
            <div className="flex-1 flex flex-col justify-center items-center gap-4 sm:gap-6 lg:gap-8 py-8 sm:py-12">
                {/* Greeting Text - Responsive sizing */}
                <div className="text-2xl sm:text-3xl lg:text-4xl font-medium text-center px-4 max-w-4xl">
                    Keep grinding, {user?.username || user?.firstName || "Friend"}!
                </div>
                
                {/* Clock Display - Responsive sizing */}
                <div className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-semibold text-black dark:text-white text-center break-all sm:break-normal">
                    {formatTime(time)}
                </div>
            </div>
            
            {/* Mini Timer Widget - Responsive positioning */}
            <div className="w-full flex justify-center mb-4 sm:mb-6">
                <MiniTimerWidget />
            </div>
            
            {/* AI Chatbot - Responsive positioning */}
            <div className="w-full">
                <AIChatbot 
                    apiKey={process.env.NEXT_PUBLIC_AZURE_AI_API_KEY || ""}
                    endpoint={process.env.NEXT_PUBLIC_AZURE_AI_ENDPOINT || ""}
                />
            </div>
        </div>
    );
};

export default HomePage;