"use client";

import { UserProfile } from "@clerk/clerk-react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/router";
import BackToProfileButton from "./_components/BackToProfileButton";

const User = () => {


    return ( 
    <div className="py-20 flex gap-8">
        <BackToProfileButton />
        <UserProfile />    
    </div> );
}
 
export default User;