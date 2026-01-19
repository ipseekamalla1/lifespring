import React from 'react'
import AboutHero from '../../../components/client/about/AboutHero';
import  AboutCareSection  from '@/components/Home/AboutCareSection';
import MissionVisionSection from '../../../components/client/about/MisionVision';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import HowItWorksSection from '@/components/Home/HowItWorksSection';

const page = () => {
  return (
    <div>
        <Navbar/><AboutHero/>
    <AboutCareSection/>
    <MissionVisionSection/>
    <HowItWorksSection/>
    <Footer/>
    </div>
  )
}

export default page