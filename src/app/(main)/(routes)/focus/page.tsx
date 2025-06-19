import Timer from "@/components/Timer";
import NavigationMenu from "@/components/NavigationMenu";

const FocusPage = () => {
    return (
        <div className="h-full flex flex-col items-center justify-center p-6">
            <div className="max-w-4xl w-full">
                <Timer />
            </div>
            <NavigationMenu />
        </div>
    );
}

export default FocusPage;