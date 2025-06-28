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

const Settings = () => {
  const [activeSection, setActiveSection] = useState("themes");
  const [customColors, setCustomColors] = useState({
    primary: "#3b82f6",
    secondary: "#64748b",
    accent: "#8b5cf6",
    background: "#ffffff"
  });
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

  const themePresets = [
    { name: "Ocean Blue", colors: { primary: "#0ea5e9", secondary: "#0284c7", accent: "#06b6d4", background: "#f0f9ff" } },
    { name: "Forest Green", colors: { primary: "#10b981", secondary: "#059669", accent: "#34d399", background: "#f0fdf4" } },
    { name: "Sunset Orange", colors: { primary: "#f97316", secondary: "#ea580c", accent: "#fb923c", background: "#fff7ed" } },
    { name: "Purple Haze", colors: { primary: "#8b5cf6", secondary: "#7c3aed", accent: "#a78bfa", background: "#faf5ff" } },
    { name: "Rose Gold", colors: { primary: "#f43f5e", secondary: "#e11d48", accent: "#fb7185", background: "#fff1f2" } },
    { name: "Dark Mode", colors: { primary: "#6366f1", secondary: "#4f46e5", accent: "#818cf8", background: "#0f172a" } }
  ];

  const addBlockedSite = () => {
    if (newSite && !blockedSites.includes(newSite)) {
      setBlockedSites([...blockedSites, newSite]);
      setNewSite("");
    }
  };

  const removeBlockedSite = (site: string) => {
    setBlockedSites(blockedSites.filter(s => s !== site));
  };

  const applyTheme = (theme: typeof themePresets[0]) => {
    setCustomColors(theme.colors);
  };

  const renderThemeSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Theme Presets</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {themePresets.map((theme) => (
            <Card key={theme.name} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">{theme.name}</CardTitle>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => applyTheme(theme)}
                  >
                    Apply
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2">
                  <div 
                    className="w-6 h-6 rounded-full border-2 border-gray-200"
                    style={{ backgroundColor: theme.colors.primary }}
                  />
                  <div 
                    className="w-6 h-6 rounded-full border-2 border-gray-200"
                    style={{ backgroundColor: theme.colors.secondary }}
                  />
                  <div 
                    className="w-6 h-6 rounded-full border-2 border-gray-200"
                    style={{ backgroundColor: theme.colors.accent }}
                  />
                  <div 
                    className="w-6 h-6 rounded-full border-2 border-gray-200"
                    style={{ backgroundColor: theme.colors.background }}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Custom Colors</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(customColors).map(([key, value]) => (
            <div key={key} className="space-y-2">
              <Label className="capitalize">{key}</Label>
              <div className="flex space-x-2">
                <Input
                  type="color"
                  value={value}
                  onChange={(e) => setCustomColors(prev => ({ ...prev, [key]: e.target.value }))}
                  className="w-16 h-10 p-1 border rounded"
                />
                <Input
                  type="text"
                  value={value}
                  onChange={(e) => setCustomColors(prev => ({ ...prev, [key]: e.target.value }))}
                  className="flex-1"
                />
              </div>
            </div>
          ))}
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
        <CardContent className="space-y-4">
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
        </CardContent>
      </Card>

      <Card>
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
      </Card>
    </div>
  );

  const renderFocusSection = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Focus Timer Settings
          </CardTitle>
          <CardDescription>
            Customize your Pomodoro timer intervals
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
        </CardContent>
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
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Enable Website Blocking</Label>
              <p className="text-sm text-muted-foreground">Block access to distracting sites</p>
            </div>
            <Switch
              checked={focusSettings.blockingEnabled}
              onCheckedChange={(checked) => 
                setFocusSettings(prev => ({ ...prev, blockingEnabled: checked }))
              }
            />
          </div>
          
          {focusSettings.blockingEnabled && (
            <>
              <div className="space-y-2">
                <Label>Add Website to Block</Label>
                <div className="flex space-x-2">
                  <Input
                    placeholder="example.com"
                    value={newSite}
                    onChange={(e) => setNewSite(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addBlockedSite()}
                  />
                  <Button onClick={addBlockedSite} size="icon">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Blocked Websites</Label>
                <div className="flex flex-wrap gap-2">
                  {blockedSites.map((site) => (
                    <Badge key={site} variant="secondary" className="flex items-center gap-1">
                      {site}
                      <button
                        onClick={() => removeBlockedSite(site)}
                        className="ml-1 hover:text-red-500"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}
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
    <div className="min-h-screen bg-gray-50">
      <SidebarProvider>
        <div className="flex">
          <AppSidebar onSectionChange={setActiveSection} activeSection={activeSection} />
          
          <main className="flex-1 p-4 lg:p-8">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                  <p className="text-gray-600 mt-1">
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
                  <Button variant="outline">
                    Reset to Defaults
                  </Button>
                  <Button>
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Settings;