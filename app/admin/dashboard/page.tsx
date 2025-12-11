"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDashboard() {
  const cards = [
    { title: "Total Doctors", value: 12 },
    { title: "Total Patients", value: 94 },
    { title: "Departments", value: 6 },
  ];

  return (
    <div className="space-y-10 p-4">
      {/* Title */}
      <motion.h1
        className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Welcome, Admin
      </motion.h1>

      {/* Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.12 }}
          >
            <Card
              className="
                bg-white/10 backdrop-blur-lg 
                border border-white/20 
                shadow-xl rounded-2xl 
                hover:shadow-2xl 
                transition-all 
                hover:scale-[1.03] 
                hover:border-blue-400/40 
                cursor-pointer
              "
            >
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  {item.title}
                </CardTitle>
              </CardHeader>

              <CardContent>
                <motion.p
                  className="text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 150 }}
                >
                  {item.value}
                </motion.p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Bottom Section - Can add charts later */}
      <motion.div
        className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl shadow-md dark:from-gray-800 dark:to-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h2 className="text-xl font-semibold mb-2">
          Analytics Overview
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Add charts, graphs, or insights here later for a more complete dashboard.
        </p>
      </motion.div>
    </div>
  );
}
