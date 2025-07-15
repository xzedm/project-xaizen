"use client";

import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { SignInButton } from "@clerk/clerk-react";
import { useConvexAuth } from "convex/react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Pressure } from "./pressure";

export const Heading = () => {
    const {isAuthenticated, isLoading } = useConvexAuth();

    return (
        <div className="max-w-3xl space-y-4">
            <h1 className="text-3xl sm:text-5xl md:text-6xl ">Avoid <span className="font-bold"> distractions.</span> <br />
            Take the <span className="font-bold"> action.</span>
            </h1>
            <h3 className="text-base sm:text-xl md:text-2xl font-medium">
            An AI-powered Pomodoro app that helps you stay productive and beat distractions.
            </h3>
            {isLoading && (
                <div className="w-full flex items-center justify-center">
                    <Spinner size="lg"/>
                </div>
            )}
            {isAuthenticated && !isLoading && (
            <Button asChild>
                <Link href="/home">
                Enter xaizen
                <ArrowRight className="h-4 w-4" />
                </Link>
            </Button>
            )}

            {!isAuthenticated && !isLoading && (
                <SignInButton mode="modal">
                    <Button className="cursor-pointer">
                    Let&apos;s xaizen
                    <ArrowRight className="h-4 w-4 "/>
                    </Button>
                </SignInButton>
            )}
            <div className="mt-20">
                <Pressure />
            </div>

        </div>
    )
}