"use client";

import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./_components/app-sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Palette, 
  Volume2, 
  Bell, 
  Clock, 
  Shield, 
  Smartphone, 
  Moon, 
  Sun, 
  Monitor,
  Check,
  Plus,
  Trash2
} from "lucide-react";
import { useTheme } from "next-themes";

const Settings = () => {
  const [activeSection, setActiveSection] = useState("themes");

  const [notifications, setNotifications] = useState({
    breakReminders: true,
    sessionComplete: true,
    dailyGoals: false,
    soundEnabled: true,
    volume: [75]
  });
  const [focusSettings, setFocusSettings] = useState({
    blockingEnabled: true,
    workDuration: [25],
    shortBreak: [5],
    longBreak: [15],
    autoStartBreaks: false,
    strictMode: false
  });
  const [blockedSites, setBlockedSites] = useState([
    "facebook.com",
    "twitter.com",
    "instagram.com"
  ]);
  const [newSite, setNewSite] = useState("");


  const addBlockedSite = () => {
    if (newSite && !blockedSites.includes(newSite)) {
      setBlockedSites([...blockedSites, newSite]);
      setNewSite("");
    }
  };

  const removeBlockedSite = (site: string) => {
    setBlockedSites(blockedSites.filter(s => s !== site));
  };


    const { theme, setTheme } = useTheme();
  
    const handleThemeToggle = () => {
      setTheme(theme === 'dark' ? 'dark' : 'dark');
    }

    const handleWhiteThemeToggle = () => {
      setTheme(theme === 'light' ? 'light' : 'light');
    }


  const renderThemeSection = () => (
  <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-4">Theme Library</h3>
        <h1 className="text-xl font-semibold mb-4">Minimalism</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
                <div className="bg-black text-white rounded-lg p-4 text-center cursor-pointer w-40 h-25 flex items-center justify-center"
                onClick={handleThemeToggle}>
                  <h4 className="text-xl font-semibold">
                    20:04
                  </h4>
                </div>
            <CardTitle className="text-center">
              Minimal Black
            </CardTitle>
          </div>
          <div className="space-y-2">
            <div className="bg-white text-black rounded-lg p-4 text-center cursor-pointer w-40 h-25 flex items-center justify-center"
            onClick={handleWhiteThemeToggle}>
                  <h4 className="text-xl font-semibold">
                    20:04
                  </h4>
                </div>
            <CardTitle className="text-center">
              Minimal White
            </CardTitle>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationSection = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notification Preferences
          </CardTitle>
          <CardDescription>
            Configure when and how you want to be notified
          </CardDescription>
        </CardHeader>
        {/* need to FIX */}
        <CardTitle className="text-center">
          Soon...
        </CardTitle>
        {/* <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Break Reminders</Label>
              <p className="text-sm text-muted-foreground">Get notified when it's time for a break</p>
            </div>
            <Switch
              checked={notifications.breakReminders}
              onCheckedChange={(checked) => 
                setNotifications(prev => ({ ...prev, breakReminders: checked }))
              }
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Session Complete</Label>
              <p className="text-sm text-muted-foreground">Notification when focus session ends</p>
            </div>
            <Switch
              checked={notifications.sessionComplete}
              onCheckedChange={(checked) => 
                setNotifications(prev => ({ ...prev, sessionComplete: checked }))
              }
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Daily Goals</Label>
              <p className="text-sm text-muted-foreground">Reminders about your daily focus goals</p>
            </div>
            <Switch
              checked={notifications.dailyGoals}
              onCheckedChange={(checked) => 
                setNotifications(prev => ({ ...prev, dailyGoals: checked }))
              }
            />
          </div>
        </CardContent> */}
      </Card>

      {/* <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="w-5 h-5" />
            Sound Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Enable Sounds</Label>
            <Switch
              checked={notifications.soundEnabled}
              onCheckedChange={(checked) => 
                setNotifications(prev => ({ ...prev, soundEnabled: checked }))
              }
            />
          </div>
          
          {notifications.soundEnabled && (
            <div className="space-y-2">
              <Label>Volume: {notifications.volume[0]}%</Label>
              <Slider
                value={notifications.volume}
                onValueChange={(value) => 
                  setNotifications(prev => ({ ...prev, volume: value }))
                }
                max={100}
                step={1}
                className="w-full"
              />
            </div>
          )}
        </CardContent>
      </Card> */}
    </div>
  );

  const renderFocusSection = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Customization Settings
          </CardTitle>
          <CardDescription>
            Customize anything you want
          </CardDescription>
        </CardHeader>
        <CardTitle className="text-center">
          Soon...
        </CardTitle>
        {/* <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Work Duration: {focusSettings.workDuration[0]} minutes</Label>
            <Slider
              value={focusSettings.workDuration}
              onValueChange={(value) => 
                setFocusSettings(prev => ({ ...prev, workDuration: value }))
              }
              min={15}
              max={60}
              step={5}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Short Break: {focusSettings.shortBreak[0]} minutes</Label>
            <Slider
              value={focusSettings.shortBreak}
              onValueChange={(value) => 
                setFocusSettings(prev => ({ ...prev, shortBreak: value }))
              }
              min={3}
              max={15}
              step={1}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Long Break: {focusSettings.longBreak[0]} minutes</Label>
            <Slider
              value={focusSettings.longBreak}
              onValueChange={(value) => 
                setFocusSettings(prev => ({ ...prev, longBreak: value }))
              }
              min={15}
              max={30}
              step={5}
              className="w-full"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Auto-start Breaks</Label>
              <p className="text-sm text-muted-foreground">Automatically start break timer</p>
            </div>
            <Switch
              checked={focusSettings.autoStartBreaks}
              onCheckedChange={(checked) => 
                setFocusSettings(prev => ({ ...prev, autoStartBreaks: checked }))
              }
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Strict Mode</Label>
              <p className="text-sm text-muted-foreground">Prevent pausing or stopping sessions</p>
            </div>
            <Switch
              checked={focusSettings.strictMode}
              onCheckedChange={(checked) => 
                setFocusSettings(prev => ({ ...prev, strictMode: checked }))
              }
            />
          </div>
        </CardContent> */}
      </Card>
    </div>
  );

  const renderBlockingSection = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Website Blocking
          </CardTitle>
          <CardDescription>
            Block distracting websites during focus sessions
          </CardDescription>
          <CardTitle className="text-center">Soon...</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "themes":
        return renderThemeSection();
      case "notifications":
        return renderNotificationSection();
      case "focus":
        return renderFocusSection();
      case "blocking":
        return renderBlockingSection();
      default:
        return renderThemeSection();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-transparent">
      <SidebarProvider>
        <div className="flex">
          {/* Main content now comes first */}
          <main className="flex-1 p-4 lg:p-8 ml-20">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
                  <p className="text-gray-600 mt-1 dark:text-white">
                    Customize your focus experience
                  </p>
                </div>
                <SidebarTrigger className="lg:hidden" />
              </div>

              <div className="lg:hidden mb-6">
                <Tabs value={activeSection} onValueChange={setActiveSection}>
                  <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
                    <TabsTrigger value="themes">Themes</TabsTrigger>
                    <TabsTrigger value="notifications">Notifications</TabsTrigger>
                    <TabsTrigger value="focus">Focus</TabsTrigger>
                    <TabsTrigger value="blocking">Blocking</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {renderContent()}

              <div className="flex justify-end mt-8 pt-6 border-t">
                <div className="flex space-x-3">
                  <Button variant="outline" className="cursor-pointer">
                    Reset to Defaults
                  </Button>
                  <Button className="cursor-pointer">
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>
          </main>

          {/* Sidebar now comes second and is positioned on the right */}
          <AppSidebar onSectionChange={setActiveSection} activeSection={activeSection} />
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Settings;