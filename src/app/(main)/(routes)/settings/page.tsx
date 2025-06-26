import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./_components/app-sidebar";

const Settings = () => {
    return ( 
        <div>
            <SidebarProvider className="">
                <AppSidebar />
                
            </SidebarProvider>
        </div>
     );
}
 
export default Settings;