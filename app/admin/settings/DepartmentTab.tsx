import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function DepartmentTab() {
  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <h2 className="text-lg font-semibold">Department Settings</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Department Name" placeholder="Cardiology" />
          <Field label="Department Code" placeholder="CARD-01" />
          <Field label="Head of Department" placeholder="Dr. John Doe" />
          <Field label="Contact Email" placeholder="cardio@hospital.com" />
        </div>

        <div className="flex justify-end">
          <Button disabled>Update Department</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function Field({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input placeholder={placeholder} />
    </div>
  );
}
