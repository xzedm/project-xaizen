"use client";
import { useEffect, useState } from "react";
import NavigationMenu from "@/components/NavigationMenu";

const HomePage = () => {

    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(interval); // Cleanup on unmount
      }, []);

      const formatTime = (date: Date) => {
        return date.toLocaleTimeString(); // e.g. 10:32:10 AM
      };

    return (
        <div className="min-h-screen flex flex-col">
            {/* Main Content - Centered Clock */}
            <div className="flex-1 flex justify-center items-center">
                <div className="text-9xl font-semibold text-black">
                    {formatTime(time)}
                </div>
            </div>
            
            {/* Navigation Menu at Bottom */}
            <div className="fixed bottom-0 left-0 right-0">
                <NavigationMenu />
            </div>
        </div>
    );
};

export default HomePage;