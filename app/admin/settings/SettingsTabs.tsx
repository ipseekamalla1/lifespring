import { Tab } from "./page";

export default function SettingsTabs({
  activeTab,
  setActiveTab,
}: {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}) {
  const tabClass = (tab: Tab) =>
    `px-1 pb-3 text-sm font-medium cursor-pointer transition
     ${
       activeTab === tab
         ? "text-emerald-700 border-b-2 border-emerald-600"
         : "text-muted-foreground hover:text-emerald-700"
     }`;

  return (
    <div className="border-b">
      <div className="flex gap-8">
        <button onClick={() => setActiveTab("profile")} className={tabClass("profile")}>
          Profile
        </button>

        

        <button onClick={() => setActiveTab("admin")} className={tabClass("admin")}>
          Admin Management
        </button>
      </div>
    </div>
  );
}
