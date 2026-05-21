"use client";

const LOCATION_TABS = ["all", "fridge", "freezer", "pantry", "expiring"] as const;
export type LocationTab = (typeof LOCATION_TABS)[number];

const TAB_LABELS: Record<LocationTab, string> = {
  all: "All",
  fridge: "Fridge",
  freezer: "Freezer",
  pantry: "Pantry",
  expiring: "Expiring Soon",
};

interface LocationTabsProps {
  activeTab: LocationTab;
  onTabChange: (tab: LocationTab) => void;
  expiringCount: number;
}

export function LocationTabs({ activeTab, onTabChange, expiringCount }: LocationTabsProps) {
  return (
    <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
      {LOCATION_TABS.map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => onTabChange(tab)}
          className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === tab
              ? "bg-[#7a9a65] text-white"
              : "bg-[#f0f4ec] text-[#1c3a2a] hover:bg-[#e4ebe0]"
          }`}
        >
          {TAB_LABELS[tab]}
          {tab === "expiring" && expiringCount > 0 && (
            <span className="ml-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#ff9800] text-[10px] text-white">
              {expiringCount}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
