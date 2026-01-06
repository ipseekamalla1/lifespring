import Navbar from "../components/Navbar";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div>
      <Navbar />
      <div className="text-center mt-20">
        <h1 className="text-4xl font-bold">Medical System</h1>
        <p className="text-gray-600 mt-4">Book appointments. View prescriptions. Manage medical data.</p>
                <Footer />

      </div>
    </div>
  );
}
