"use client";

import AudioPlayer from "@/components/AudioPlayer";
import { Spinner } from "@/components/spinner";
import SpotifyPlayer from "@/components/SpotifyPlayer";
import { useConvexAuth } from "convex/react";
import { redirect } from "next/navigation";

const MainLayout = ({
    children
}: {
    children: React.ReactNode;
}) => {

    const {isAuthenticated, isLoading } = useConvexAuth();

    if (isLoading){
        return (
            <div className="flex justify-center items-center">
                <Spinner size="lg"/>
            </div>
        );
    }

    if (!isAuthenticated){
        return redirect("/");
    }

    return ( 
        <div className="flex flex-col justify-center items-center">
            {children}
            <div>
                <AudioPlayer />
                
            </div>
        </div>
     );
}
 
export default MainLayout;