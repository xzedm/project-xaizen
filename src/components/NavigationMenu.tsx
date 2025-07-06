"use client";
import Dock from "@/blocks/Components/Dock/Dock";
import { VscHome, VscTarget, VscAccount, VscSettingsGear } from 'react-icons/vsc';
import { useRouter, usePathname } from 'next/navigation';

export default function NavigationMenu() {
  const router = useRouter();
  const pathname = usePathname();

  const items = [
    { 
      icon: <VscHome size={18} />, 
      label: 'Home', 
      onClick: () => router.push('/home'),
      path: '/home'
    },
    { 
      icon: <VscTarget size={18} />, 
      label: 'Focus', 
      onClick: () => router.push('/focus'),
      path: '/focus'
    },
    { 
      icon: <VscAccount size={18} />, 
      label: 'Profile', 
      onClick: () => router.push('/profile'),
      path: '/profile'
    },
    { 
      icon: <VscSettingsGear size={18} />, 
      label: 'Settings', 
      onClick: () => router.push('/settings'),
      path: '/settings'
    },
  ];

  // Add active state styling based on current path
  const enhancedItems = items.map(item => ({
    ...item,
    className: pathname === item.path ? 'bg-transparent border-blue-500' : ''
  }));

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
      <div className="flex items-end justify-center pointer-events-auto">
        <Dock
          items={enhancedItems}
          panelHeight={68}
          baseItemSize={50}
          magnification={70}
        />
      </div>
    </div>
  );
}