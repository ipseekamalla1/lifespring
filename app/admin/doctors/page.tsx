"use client";

import { useState, useEffect } from "react";
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

// ---------------------------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------------------------
export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editDoctor, setEditDoctor] = useState<any>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    department: "",
    specialization: "",
    phone: "",
    experience: "",
  });

  // ---------------------------------------------------------------
  // LOAD DOCTORS
  // ---------------------------------------------------------------
  const fetchDoctors = async () => {
    const res = await fetch("/api/admin/doctors");
    const data = await res.json();
    setDoctors(data);
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  // ---------------------------------------------------------------
  // OPEN MODALS
  // ---------------------------------------------------------------
  const openAddModal = () => {
    setEditDoctor(null);
    setForm({
      name: "",
      email: "",
      department: "",
      specialization: "",
      phone: "",
      experience: "",
    });
    setIsOpen(true);
  };

  const openEditModal = (doc: any) => {
    setEditDoctor(doc);
    setForm({
      name: doc.name,
      email: doc.user.email,
      department: doc.department,
      specialization: doc.specialization,
      phone: doc.phone,
      experience: doc.experience,
    });
    setIsOpen(true);
  };

  // ---------------------------------------------------------------
  // SAVE (CREATE OR UPDATE)
  // ---------------------------------------------------------------
  const handleSave = async () => {
    setLoading(true);

    if (editDoctor) {
      // UPDATE
      await fetch("/api/admin/doctors", {
        method: "PUT",
        body: JSON.stringify({
          id: editDoctor.id,
          ...form,
        }),
      });
    } else {
      // CREATE
      await fetch("/api/admin/doctors", {
        method: "POST",
        body: JSON.stringify(form),
      });
    }

    setLoading(false);
    setIsOpen(false);
    fetchDoctors();
  };

  // ---------------------------------------------------------------
  // DELETE
  // ---------------------------------------------------------------
  const handleDelete = async (id: string) => {
    await fetch("/api/admin/doctors", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    });

    fetchDoctors();
  };

  // ---------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------
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
                <TableHead>Email</TableHead>
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
                  <TableCell>{doc.user.email}</TableCell>
                  <TableCell>{doc.department}</TableCell>
                  <TableCell>{doc.specialization}</TableCell>
                  <TableCell>{doc.experience} yrs</TableCell>
                  <TableCell>{doc.phone}</TableCell>

                  <TableCell className="space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditModal(doc)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(doc.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* MODAL -------------------------------------------------- */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editDoctor ? "Edit Doctor" : "Add Doctor"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <Input
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            {/* Email only required for NEW doctor */}
            {!editDoctor && (
              <Input
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            )}

            <Input
              placeholder="Department"
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
            />

            <Input
              placeholder="Specialization"
              value={form.specialization}
              onChange={(e) => setForm({ ...form, specialization: e.target.value })}
            />

            <Input
              placeholder="Phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />

            <Input
              placeholder="Experience (years)"
              value={form.experience}
              onChange={(e) =>
                setForm({ ...form, experience: e.target.value })
              }
            />
          </div>

          <DialogFooter>
            <Button
              onClick={() => setIsOpen(false)}
              variant="outline"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
