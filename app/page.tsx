import Navbar from "../components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/Home/HeroSection";
import TrustSection from "@/components/Home/TrustSection";
import AboutCareSection from "@/components/Home/AboutCareSection";

export default function Home() {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <TrustSection/>
      <AboutCareSection/>
                <Footer />

      </div>
   
  );
}
