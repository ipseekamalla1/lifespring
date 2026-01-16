import React from 'react'
import AboutHero from '../../../components/client/about/AboutHero';
import  AboutCareSection  from '@/components/Home/AboutCareSection';
import MissionVisionSection from '../../../components/client/about/MisionVision';

const page = () => {
  return (
    <div><AboutHero/>
    <AboutCareSection/>
    <MissionVisionSection/>
    </div>
  )
}

export default page