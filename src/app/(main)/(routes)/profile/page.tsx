"use client";

import { Button } from "@/components/ui/button";
import { SignOutButton, UserButton, UserProfile, useUser } from "@clerk/clerk-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import ContributionCalendar from "./_components/ContributionCalendar";
import { useRouter } from "next/navigation";
import { Settings, LogOut, User } from "lucide-react";

const ProfilePage = () => {
    const { user } = useUser();
    const [open, setOpen] = useState(false);
    const dropDown = useRef<HTMLDivElement>(null);
    const router = useRouter();

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
        <div className="min-h-screen bg-gray-50 dark:bg-[#0f0f0f]">
            {/* Mobile-first responsive container */}
            <div className="w-full max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
                
                {/* User Profile Section - Mobile Stack, Desktop Side-by-side */}
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start lg:items-center">
                    
                    {/* User Info Card */}
                    <div className="w-full lg:w-auto flex-shrink-0" ref={dropDown}>
                        <div className="bg-white dark:bg-[#111111] rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                            <div className="flex flex-col items-center space-y-4">
                                {/* Avatar */}
                                <div className="relative">
                                    <img 
                                        src={user?.imageUrl}
                                        alt="Avatar"
                                        className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-lg"
                                    />
                                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white dark:border-gray-700"></div>
                                </div>
                                
                                {/* User Details */}
                                <div className="text-center space-y-1">
                                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                                        {user?.fullName}
                                    </h1>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                                        @{user?.username}
                                    </p>
                                </div>
                                
                                {/* Action Button */}
                                <div className="relative w-full sm:w-auto">
                                    <Button 
                                        variant="outline"
                                        className="w-full sm:w-auto flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                        onClick={() => setOpen(!open)}
                                    >
                                        <Settings className="w-4 h-4" />
                                        Manage Profile
                                    </Button>

                                    {/* Dropdown Menu */}
                                    {open && (
                                        <div className="absolute top-full left-0 right-0 sm:left-auto sm:right-auto sm:w-48 mt-2 bg-white dark:bg-[#111111] rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
                                            <div className="py-2">
                                                <button
                                                    onClick={() => {
                                                        router.push('/user');
                                                        setOpen(false);
                                                    }}
                                                    className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-700 dark:text-gray-300 transition-colors"
                                                >
                                                    <User className="w-4 h-4" />
                                                    Manage Account
                                                </button>
                                                <div className="border-t border-gray-200 dark:border-gray-700 mt-1 pt-1">
                                                    <SignOutButton>
                                                        <button className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 text-red-600 dark:text-red-400 transition-colors">
                                                            <LogOut className="w-4 h-4" />
                                                            Sign out
                                                        </button>
                                                    </SignOutButton>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contribution Calendar - Full width on mobile */}
                    <div className="">
                        <ContributionCalendar />
                    </div>
                </div>
            </div>
        </div>
     );
}
 
export default ProfilePage;