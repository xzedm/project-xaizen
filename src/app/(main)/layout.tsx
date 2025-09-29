"use client";

import AudioPlayer from "@/components/AudioPlayer";
import NavigationMenu from "@/components/NavigationMenu";
import { Spinner } from "@/components/spinner";
import { TimerProvider } from "@/components/TimerContext";
import { useConvexAuth } from "convex/react";
import { redirect } from "next/navigation";
import { ThemeProvider } from "@/components/theme-provider";
import NextDynamic from "next/dynamic";

// Load client providers only on the client to avoid SSR importing Clerk
const MainLayout = ({
    children
}: {
    children: React.ReactNode;
}) => {
    const { isAuthenticated, isLoading } = useConvexAuth();

    if (isLoading) {
        return (
            <div className="flex h-full justify-center items-center">
                <Spinner size="lg" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return redirect("/");
    }

    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
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
        </ThemeProvider>
    );
}

export default MainLayout;