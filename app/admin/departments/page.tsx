"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Department = {
  id: string;
  name: string;
};

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [filtered, setFiltered] = useState<Department[]>([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [name, setName] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const perPage = 10;

  const fetchDepartments = async () => {
    const res = await fetch("/api/admin/departments");
    const data = await res.json();
    setDepartments(data);
    setFiltered(data);
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    const f = departments.filter((d) =>
      d.name.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(f);
    setPage(1);
  }, [search, departments]);

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Department name is required");
      return;
    }

    const res = await fetch("/api/admin/departments", {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(isEdit ? { id: selectedId, name } : { name }),
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.error || "Something went wrong");
      return;
    }

    toast.success(data.message);
    setOpen(false);
    setName("");
    setIsEdit(false);
    setSelectedId(null);
    fetchDepartments();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this department?")) return;

    const res = await fetch("/api/admin/departments", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.error || "Failed to delete");
      return;
    }

    toast.success(data.message);
    fetchDepartments();
  };

  const start = (page - 1) * perPage;
  const paginated = filtered.slice(start, start + perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  return (
    <Card className="border-green-100">
      <CardContent className="space-y-6 p-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-green-800">
            Departments
          </h1>
          <Button className="bg-green-600 hover:bg-green-700">
            <Plus size={18} className="mr-2" />
            Add Department
          </Button>
        </div>

        {/* Search */}
        <div className="relative w-72">
          <Search className="absolute left-3 top-2.5 text-green-400" size={18} />
          <input
            className="w-full rounded-lg border border-green-200 px-10 py-2 text-sm
              focus:outline-none focus:ring-1 focus:ring-green-600"
            placeholder="Search department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-lg border border-green-100">
          <table className="w-full text-sm">
            <thead className="bg-green-50 text-left text-green-800">
              <tr>
                <th className="px-4 py-3">Department Name</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={2} className="py-6 text-center text-gray-500">
                    No departments found
                  </td>
                </tr>
              )}

              {paginated.map((d) => (
                <tr
                  key={d.id}
                  className="border-t hover:bg-green-50 transition"
                >
                  <td className="px-4 py-3 font-medium">
                    {d.name}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="icon" variant="outline">
                        <Pencil size={16} />
                      </Button>
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => handleDelete(d.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-end gap-2">
            <Button variant="outline" disabled={page === 1}>
              Previous
            </Button>
            <span className="flex items-center text-sm text-green-700">
              Page {page} of {totalPages}
            </span>
            <Button variant="outline" disabled={page === totalPages}>
              Next
            </Button>
          </div>
        )}
      </CardContent>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-sm rounded-xl bg-white shadow-xl">
            <div className="border-b px-6 py-4 bg-green-50">
              <h2 className="text-lg font-semibold text-green-800">
                {isEdit ? "Edit Department" : "Add Department"}
              </h2>
              <p className="text-sm text-green-600">
                Department names must be unique
              </p>
            </div>

            <div className="space-y-4 px-6 py-5">
              <label className="text-sm font-medium text-green-800">
                Department Name
              </label>
              <input
                className="w-full rounded-lg border border-green-200 px-3 py-2 text-sm
                  focus:outline-none focus:ring-1 focus:ring-green-600"
                placeholder="e.g. Cardiology"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-3 border-t bg-green-50 px-6 py-4">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={handleSave}
              >
                {isEdit ? "Update" : "Create"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
