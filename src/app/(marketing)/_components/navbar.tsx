"use client";

import { useScrollTop } from "../../../../hooks/use-scroll";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { useConvexAuth } from "convex/react";
import { SignInButton, UserButton } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/spinner";
import Link from "next/link";

export const NavBar = () => {
    const { isAuthenticated, isLoading } = useConvexAuth();
    const scrolled = useScrollTop();

    return (
        <div className={cn(
            "z-50 bg-background dark:bg-[#1F1F1F] fixed top-0 flex items-center w-full p-6",
            scrolled && "border-b shadow-sm"
        )}>
            <Logo />
            <div className="md:ml-auto md:justify-end justify-between w-full flex items-center gap-x-2">
                {isLoading && (
                    <div className="flex items-center gap-x-2">
                        <Spinner />
    
                    </div>
                )}

                {!isAuthenticated && !isLoading && (
                    <div className="flex items-center gap-x-2">
                        <SignInButton mode="modal">
                            <Button 
                                variant="ghost" 
                                size="sm"
                                className="text-foreground hover:bg-accent hover:text-accent-foreground"
                            >
                                Log in
                            </Button>
                        </SignInButton>
                        <SignInButton mode="modal">
                            <Button 
                                size="sm"
                                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                            >
                                Let's xaizen
                            </Button>
                        </SignInButton>
                    </div>
                )}

                {isAuthenticated && !isLoading && (
                    <>
                    <Button variant="ghost" size="sm" asChild>
                        <Link href='/home'>
                        Enter xaizen
                        </Link>
                    </Button>
                    <UserButton 
                    afterSignOutUrl="/"
                    />
                    </>
                )}
            </div>
        </div>
    )
}