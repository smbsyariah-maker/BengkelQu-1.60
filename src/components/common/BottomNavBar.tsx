import React from 'react';
import { LayoutDashboard, Wrench, Receipt, Package, BarChart3 } from 'lucide-react';

interface BottomNavBarProps {
  currentTab: string;
  onTabChange: (tabId: string) => void;
  activeQueueCount?: number;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  currentTab,
  onTabChange,
  activeQueueCount = 4
}) => {
  const tabs = [
    { id: 'dashboard', label: 'Beranda', icon: LayoutDashboard },
    { id: 'servis', label: 'Servis', icon: Wrench, badge: activeQueueCount > 0 ? activeQueueCount : undefined },
    { id: 'kasir', label: 'Kasir POS', icon: Receipt },
    { id: 'inventaris', label: 'Inventaris', icon: Package },
    { id: 'laporan', label: 'Laporan', icon: BarChart3 }
  ];

  return (
    <nav 
      aria-label="Navigasi Cepat Bawah"
      className="w-full bg-white border-t border-slate-200/90 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] px-2 pt-2 pb-[max(env(safe-area-inset-bottom,0px),0.75rem)] flex items-center justify-around select-none shrink-0 z-40"
    >
      {tabs.map((tab) => {
        const IconComponent = tab.icon;
        const isActive = currentTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200 relative group cursor-pointer active:scale-95 ${
              isActive ? 'text-[#008952]' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <div className="relative">
              <div
                className={`p-1.5 rounded-xl transition-all ${
                  isActive ? 'bg-emerald-50 text-[#008952] scale-105' : 'group-hover:bg-slate-50'
                }`}
              >
                <IconComponent className="w-5 h-5 stroke-[2.3]" />
              </div>
              {tab.badge && (
                <span className="absolute -top-1 -right-2 bg-rose-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                  {tab.badge}
                </span>
              )}
            </div>
            <span
              className={`text-[10px] tracking-tight mt-0.5 transition-all ${
                isActive ? 'font-bold text-[#008952]' : 'font-medium text-slate-500'
              }`}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
