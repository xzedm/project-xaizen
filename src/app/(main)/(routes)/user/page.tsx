"use client";

import { UserProfile } from "@clerk/clerk-react";
import BackToProfileButton from "./_components/BackToProfileButton";

const User = () => {
    return ( 
        <div className="py-20 flex gap-8">
            <BackToProfileButton />
            <UserProfile />    
        </div> 
    );
}

export default User;