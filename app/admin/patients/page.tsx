"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogHeader, DialogTitle, DialogContent, DialogFooter,
} from "@/components/ui/dialog";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";

export default function PatientsPage() {
  const [patients, setPatients] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editPatient, setEditPatient] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    age: "",
    gender: "",
    address: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let e = {};

    if (!form.name.trim()) e.name = "Name required.";
    if (!editPatient && !form.email.trim()) e.email = "Email required.";

    if (!editPatient && form.email && !/^\S+@\S+\.\S+$/.test(form.email))
      e.email = "Invalid email.";

    if (!form.phone.trim()) e.phone = "Phone required.";
    if (form.phone.length < 7) e.phone = "Phone must be at least 7 digits.";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const fetchPatients = async () => {
    const res = await fetch("/api/admin/patients");
    const data = await res.json();
    setPatients(data);
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const openAddModal = () => {
    setEditPatient(null);
    setForm({
      name: "",
      email: "",
      age: "",
      gender: "",
      address: "",
      phone: "",
    });
    setErrors({});
    setIsOpen(true);
  };

  const openEditModal = (p) => {
    setEditPatient(p);
    setForm({
      name: p.name || "",
      email: p.user.email,
      age: p.age || "",
      gender: p.gender || "",
      address: p.address || "",
      phone: p.phone || "",
    });
    setErrors({});
    setIsOpen(true);
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);

    if (editPatient) {
      await fetch("/api/admin/patients", {
        method: "PUT",
        body: JSON.stringify({ id: editPatient.id, ...form }),
      });
    } else {
      await fetch("/api/admin/patients", {
        method: "POST",
        body: JSON.stringify(form),
      });
    }

    setLoading(false);
    setIsOpen(false);
    fetchPatients();
  };

  const handleDelete = async (id) => {
    await fetch("/api/admin/patients", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    });
    fetchPatients();
  };

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Patients</h1>
        <Button onClick={openAddModal}>Add Patient</Button>
      </div>

      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {patients.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.name}</TableCell>
                  <TableCell>{p.user.email}</TableCell>
                  <TableCell>{p.age}</TableCell>
                  <TableCell>{p.gender}</TableCell>
                  <TableCell>{p.address}</TableCell>
                  <TableCell>{p.phone}</TableCell>

                  <TableCell className="space-x-2">
                    <Button variant="outline" size="sm" onClick={() => openEditModal(p)}>Edit</Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(p.id)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>

          </Table>
        </CardContent>
      </Card>

      {/* MODAL */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editPatient ? "Edit Patient" : "Add Patient"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <Input
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            {errors.name && <p className="text-red-500">{errors.name}</p>}

            {!editPatient && (
              <>
                <Input
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                {errors.email && <p className="text-red-500">{errors.email}</p>}
              </>
            )}

            <Input
              placeholder="Age"
              value={form.age}
              onChange={(e) => setForm({ ...form, age: e.target.value })}
            />

            <Input
              placeholder="Gender"
              value={form.gender}
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
            />

            <Input
              placeholder="Address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />

            <Input
              placeholder="Phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            {errors.phone && <p className="text-red-500">{errors.phone}</p>}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)} disabled={loading}>
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
