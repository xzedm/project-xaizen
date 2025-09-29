"use client";

import { UserProfile } from "@clerk/clerk-react";
import BackToProfileButton from "./_components/BackToProfileButton";

// Force dynamic rendering to avoid SSR issues with Clerk hooks
export const dynamic = "force-dynamic";

const User = () => {
    return ( 
        <div className="py-20 flex gap-8">
            <BackToProfileButton />
            <UserProfile />    
        </div> 
    );
}

export default User;