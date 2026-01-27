"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import PatientDetailsTab from "./PatientDetailsTab";
import ChangePasswordTab from "./ChangePasswordTab";
import { User, Lock } from "lucide-react";

export default function PatientProfile() {
  return (
    <div className="min-h-screen flex justify-center items-start pt-16 bg-muted/40">
      <Card className="w-full max-w-4xl shadow-xl border">
        <CardHeader className="border-b">
          <h2 className="text-2xl font-semibold text-gray-900">
            Account Settings
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage your personal information and security preferences
          </p>
        </CardHeader>

        <CardContent className="pt-6">
          <Tabs defaultValue="profile" className="w-full">
            {/* Tabs bar */}
            <TabsList className="grid grid-cols-2 w-full mb-8 bg-muted p-1 rounded-lg">
              <TabsTrigger
                value="profile"
                className="
                  gap-2 rounded-md
                  data-[state=active]:bg-[#4ca626]
                  data-[state=active]:text-white
                  data-[state=active]:shadow
                "
              >
                <User className="h-4 w-4" />
                Profile
              </TabsTrigger>

              <TabsTrigger
                value="password"
                className="
                  gap-2 rounded-md
                  data-[state=active]:bg-[#4ca626]
                  data-[state=active]:text-white
                  data-[state=active]:shadow
                "
              >
                <Lock className="h-4 w-4" />
                Security
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <PatientDetailsTab />
            </TabsContent>

            <TabsContent value="password">
              <ChangePasswordTab />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
