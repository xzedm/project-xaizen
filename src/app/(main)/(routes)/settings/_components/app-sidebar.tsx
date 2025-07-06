import { 
  Palette, 
  Bell, 
  Clock, 
  Shield, 
  Volume2,
  Smartphone,
  Settings,
  Pen 
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

interface AppSidebarProps {
  onSectionChange?: (section: string) => void;
  activeSection?: string;
}

// Menu items for focus and productivity settings
const items = [
  {
    title: "Themes",
    id: "themes",
    icon: Palette,
    description: "Customize themes"
  },
  {
    title: "Notifications",
    id: "notifications", 
    icon: Bell,
    description: "Manage alerts and sounds"
  },
  {
    title: "Customization",
    id: "focus",
    icon: Pen,
    description: "Customize the fonts and appearance"
  },
  {
    title: "Website Blocking",
    id: "blocking",
    icon: Shield,
    description: "Block distracting websites"
  },
];

// Additional settings that could be added later
const additionalItems = [
  {
    title: "Mobile Settings",
    id: "mobile",
    icon: Smartphone,
    description: "App behavior on mobile devices",
    comingSoon: true
  },
  {
    title: "Advanced",
    id: "advanced",
    icon: Settings,
    description: "Advanced configuration options",
    comingSoon: true
  },
];

export function AppSidebar({ onSectionChange, activeSection = "themes" }: AppSidebarProps) {
  const handleItemClick = (itemId: string) => {
    if (onSectionChange) {
      onSectionChange(itemId);
    }
  };

  return (
    <Sidebar className="border-l border-r-0 order-2" side="right">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Focus Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    onClick={() => handleItemClick(item.id)}
                    isActive={activeSection === item.id}
                    className="flex flex-col items-start h-auto py-3 px-3 cursor-pointer"
                    tooltip={item.description}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <item.icon className="w-4 h-4 flex-shrink-0" />
                      <div className="flex-1 text-left">
                        <div className="font-medium text-sm">{item.title}</div>
                        <div className="text-xs text-muted-foreground hidden lg:block">
                          {item.description}
                        </div>
                      </div>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>More Options</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {additionalItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    onClick={() => !item.comingSoon && handleItemClick(item.id)}
                    isActive={activeSection === item.id}
                    className={`flex flex-col items-start h-auto py-3 px-3 ${
                      item.comingSoon ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                    }`}
                    tooltip={item.comingSoon ? 'Coming Soon' : item.description}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <item.icon className="w-4 h-4 flex-shrink-0" />
                      <div className="flex-1 text-left">
                        <div className="font-medium text-sm flex items-center gap-2">
                          {item.title}
                          {item.comingSoon && (
                            <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                              Soon
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground hidden lg:block">
                          {item.description}
                        </div>
                      </div>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}