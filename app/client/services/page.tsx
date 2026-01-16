import React from 'react'
import ServicesHero from '../../../components/client/services/ServicesHero';
import Navbar from '../../../components/Navbar';
import ServicesIntro from '../../../components/client/services/ServicesIntro';
import CareStepsSection from '../../../components/client/services/CareStepSection';

const page = () => {
  return (
    <div>

<Navbar/>
        <ServicesHero/>
        <ServicesIntro/>
        <CareStepsSection/>
    </div>
  )
}

export default page