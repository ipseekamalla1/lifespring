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
    <div className="p-6 space-y-6 min-h-screen bg-white">

      {/* TITLE */}
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold text-[#4ca626]">Settings</h1>
        <p className="text-sm text-gray-500">
          Manage system configuration and administrators
        </p>
      </div>

      {/* TABS */}
      <div className="bg-white rounded-2xl shadow-sm">
        <SettingsTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* CONTENT */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        {activeTab === "profile" && <ProfileTab />}
        {activeTab === "department" && <DepartmentTab />}
        {activeTab === "admin" && <AdminManagementTab />}
      </div>
    </div>
  );
}
