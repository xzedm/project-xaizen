import Timer from "@/components/Timer";

// Force dynamic rendering to avoid SSR issues
export const dynamic = "force-dynamic";

const FocusPage = () => {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Main Content - Centered Timer */}
            <div className="flex-1 flex justify-center items-center p-6">
                <div className="max-w-4xl w-full">
                    <Timer />
                </div>
            </div>
        </div>
    );
}

export default FocusPage;