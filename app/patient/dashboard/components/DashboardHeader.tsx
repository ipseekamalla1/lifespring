import { motion } from "framer-motion";

export default function DashboardHeader({
  firstName,
}: {
  firstName?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-1"
    >
      <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
        Welcome{firstName ? `, ${firstName}` : ""}
      </h1>
      <p className="text-sm text-gray-500">
        Here’s a quick overview of your health activity
      </p>
    </motion.div>
  );
}
