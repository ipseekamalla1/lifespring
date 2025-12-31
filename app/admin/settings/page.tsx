"use client";

import { useState } from "react";
import SettingsTabs from "./SettingsTabs";
import ProfileTab from "./ProfileTab";
import DepartmentTab from "./DepartmentTab";
import AdminManagementTab from "./AdminMangementTab";

export type Tab = "profile" | "department" | "admin";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  return (
    <div className="p-6 space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-muted-foreground">
          Manage system configuration and administrators
        </p>
      </div>

      {/* Tabs */}
      <SettingsTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Content */}
      {activeTab === "profile" && <ProfileTab />}
      {activeTab === "department" && <DepartmentTab />}
      {activeTab === "admin" && <AdminManagementTab />}
    </div>
  );
}
