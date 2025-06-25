"use client";

import { Button } from "@/components/ui/button";
import { SignOutButton, UserButton, UserProfile, useUser } from "@clerk/clerk-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import ContributionCalendar from "./_components/ContributionCalendar";

const ProfilePage = () => {
    const { user } = useUser();
    const [open, setOpen] = useState(false);
    const dropDown = useRef<HTMLDivElement>(null);

    useEffect(() => {
       const handleClickOutside = (event: MouseEvent) => {
        if(dropDown.current && !dropDown.current.contains(event.target as Node)){
            setOpen(false);
        }
       };
       
       document.addEventListener("mousedown", handleClickOutside);
       return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return ( 
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* User Profile Section */}
            <div className="flex justify-center items-center py-10 gap-20"
            ref={dropDown}>
                <div className="flex flex-col justify-center items-center gap-4">
                    <img 
                    src={user?.imageUrl}
                    alt="Avatar"
                    className="rounded-full w-50 h-50"
                    />
                    <div className="text-center">
                        <h3 className="font-bold text-xl text-gray-900 dark:text-white">
                            {user?.fullName}
                        </h3>
                        <h5 className="text-gray-600 dark:text-gray-400">
                            {user?.username}
                        </h5>
                    </div>
                    
                    <Button variant="ghost"
                    className="cursor-pointer hover:bg-gray-200 border"
                    onClick={() => setOpen(!open)}
                    >
                        Manage Profile
                    </Button>

                    {open && (
                        <div>
                            <div className="flex flex-col gap-4">
                                <Button onClick={() => {
                                window.location.href = "/user";
                                }}
                                className="cursor-pointer">
                                    Manage Account
                                </Button>
                                <div className="bg-gray-200 cursor-pointer text-center rounded-lg py-1.5 hover:bg-gray-300">
                                    <SignOutButton>
                                        <p>Sign out</p>
                                    </SignOutButton>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div className="">
                    <ContributionCalendar />
                </div>
            </div>
        </div>
     );
}
 
export default ProfilePage;