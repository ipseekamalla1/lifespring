"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import PatientDetailsTab from "./PatientDetailsTab";
import ChangePasswordTab from "./ChangePasswordTab";

export default function PatientProfile() {
  return (
    <Card className="max-w-xl w-full">
      <CardHeader>
        <h2 className="text-xl font-semibold">My Profile</h2>
        <p className="text-sm text-muted-foreground">
          Manage your personal details and security
        </p>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="profile">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="profile">Profile Details</TabsTrigger>
            <TabsTrigger value="password">Change Password</TabsTrigger>
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
  );
}
