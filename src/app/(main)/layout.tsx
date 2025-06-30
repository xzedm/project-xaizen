"use client";

import AudioPlayer from "@/components/AudioPlayer";
import NavigationMenu from "@/components/NavigationMenu";
import { Spinner } from "@/components/spinner";
import { TimerProvider } from "@/components/TimerContext";
import { useConvexAuth } from "convex/react";
import { usePathname } from "next/navigation";
import { redirect } from "next/navigation";

const MainLayout = ({
    children
}: {
    children: React.ReactNode;
}) => {
    const { isAuthenticated, isLoading } = useConvexAuth();
    const pathname = usePathname();
    
    // Check if we're on the settings page
    const isSettingsPage = pathname === "/settings";

    if (isLoading) {
        return (
            <div className="flex justify-center items-center">
                <Spinner size="lg"/>
            </div>
        );
    }

    if (!isAuthenticated) {
        return redirect("/");
    }

    return ( 
        <div className="flex flex-col justify-center items-center">

            <TimerProvider>
                {children}
            </TimerProvider>
            <div>
                <AudioPlayer />
            </div>
            
            <div>
                <NavigationMenu />
            </div>
        </div>
    );
}
 
export default MainLayout;