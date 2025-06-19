"use client";

import { Spinner } from "@/components/spinner";
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
        </div>
     );
}
 
export default MainLayout;