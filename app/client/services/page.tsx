import React from 'react'
import ServicesHero from '../../../components/client/services/ServicesHero';
import Navbar from '../../../components/Navbar';
import ServicesIntro from '../../../components/client/services/ServicesIntro';

const page = () => {
  return (
    <div>

<Navbar/>
        <ServicesHero/>
        <ServicesIntro/>
    </div>
  )
}

export default page