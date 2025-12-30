"use client";

import { useState } from "react";
import SettingsTabs from "./SettingsTabs";
import ProfileTab from "./ProfileTab";
import DepartmentTab from "./DepartmentTab.tsx";

export type Tab = "profile" | "department";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  return (
    <div className="p-6 space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your profile and department details
        </p>
      </div>

      {/* Tabs */}
      <SettingsTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Content */}
      {activeTab === "profile" && <ProfileTab />}
      {activeTab === "department" && <DepartmentTab />}
    </div>
  );
}
