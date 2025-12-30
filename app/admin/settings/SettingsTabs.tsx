import { User, Building2 } from "lucide-react";
import TabButton from "./TabButton";
import { Tab } from "./page";

export default function SettingsTabs({
  activeTab,
  setActiveTab,
}: {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}) {
  return (
    <div className="flex gap-2 border-b">
      <TabButton
        active={activeTab === "profile"}
        onClick={() => setActiveTab("profile")}
        icon={<User size={16} />}
        label="Profile"
      />

      <TabButton
        active={activeTab === "department"}
        onClick={() => setActiveTab("department")}
        icon={<Building2 size={16} />}
        label="Department"
      />
    </div>
  );
}
