"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

// Dummy doctor data for UI only
const initialDoctors = [
  {
    id: "1",
    name: "Dr. Sophia Sharma",
    department: "Cardiology",
    specialization: "Heart Specialist",
    phone: "9876543210",
    experience: 8,
  },
  {
    id: "2",
    name: "Dr. Aayush Karki",
    department: "Neurology",
    specialization: "Brain Specialist",
    phone: "9870003210",
    experience: 5,
  },
];

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState(initialDoctors);
  const [isOpen, setIsOpen] = useState(false);
  const [editDoctor, setEditDoctor] = useState(null as any);

  const [form, setForm] = useState({
    name: "",
    department: "",
    specialization: "",
    phone: "",
    experience: "",
  });

  function openAddModal() {
    setEditDoctor(null);
    setForm({
      name: "",
      department: "",
      specialization: "",
      phone: "",
      experience: "",
    });
    setIsOpen(true);
  }

  function openEditModal(doctor: any) {
    setEditDoctor(doctor);
    setForm(doctor);
    setIsOpen(true);
  }

  function handleSave() {
    if (editDoctor) {
      setDoctors(
        doctors.map((doc) =>
          doc.id === editDoctor.id ? { ...editDoctor, ...form } : doc
        )
      );
    } else {
      setDoctors([
        ...doctors,
        { id: Date.now().toString(), ...form },
      ]);
    }
    setIsOpen(false);
  }

  function handleDelete(id: string) {
    setDoctors(doctors.filter((d) => d.id !== id));
  }

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Doctors</h1>
        <Button onClick={openAddModal}>Add Doctor</Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Specialization</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {doctors.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell>{doc.name}</TableCell>
                  <TableCell>{doc.department}</TableCell>
                  <TableCell>{doc.specialization}</TableCell>
                  <TableCell>{doc.experience} Years</TableCell>
                  <TableCell>{doc.phone}</TableCell>

                  <TableCell className="space-x-2">
                    <Button size="sm" variant="outline" onClick={() => openEditModal(doc)}>
                      Edit
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(doc.id)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editDoctor ? "Edit Doctor" : "Add Doctor"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <Input placeholder="Name" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })} />

            <Input placeholder="Department" value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })} />

            <Input placeholder="Specialization" value={form.specialization}
              onChange={(e) => setForm({ ...form, specialization: e.target.value })} />

            <Input placeholder="Phone" value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })} />

            <Input placeholder="Experience (years)" value={form.experience}
              onChange={(e) => setForm({ ...form, experience: e.target.value })} />
          </div>

          <DialogFooter>
            <Button onClick={() => setIsOpen(false)} variant="outline">
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
