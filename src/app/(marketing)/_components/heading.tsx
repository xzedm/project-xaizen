"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const Heading = () => {
    return (
        <div className="max-w-3xl space-y-4">
            <h1 className="text-3xl sm:text-5xl md:text-6xl ">Avoid <span className="font-bold"> distractions.</span> Take the 
                <span className="font-bold"> action.</span>
            </h1>
            <h3 className="text-base sm:text-xl md:text-2xl font-medium">
            An AI-powered Pomodoro app that helps you stay productive and beat distractions.
            </h3>
            <Button>
                Enter xaizen
                <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
        </div>
    )
}