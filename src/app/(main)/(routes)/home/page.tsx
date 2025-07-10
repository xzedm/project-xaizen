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
        <div className="min-h-screen flex flex-col">
            {/* Main Content - Centered Clock */}
            <div className="flex-1 flex flex-col justify-center items-center gap-8">
                <div className="text-4xl font-medium text-center">
                    Keep grinding, {user?.username || user?.firstName || "Friend"}!
                </div>
                <div className="text-9xl font-semibold text-black dark:text-white">
                    {formatTime(time)}
                </div>
            </div>
            <MiniTimerWidget />
            
            {/* AI Chatbot */}
            <AIChatbot 
                apiKey={process.env.NEXT_PUBLIC_AZURE_AI_API_KEY || ""}
                endpoint={process.env.NEXT_PUBLIC_AZURE_AI_ENDPOINT || ""}
            />
        </div>
    );
};

export default HomePage;