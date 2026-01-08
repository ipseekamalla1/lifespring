import React from 'react'
import Navbar from '../../../components/Navbar';
import Footer from '@/components/Footer';
import DoctorsHero from '../../../components/client/Doctors/DoctorsHero';
import MeetOurTeam from '../../../components/client/Doctors/MeetOurTeam';

const page = () => {
  return (
    <div>

        <Navbar/>
        
       < DoctorsHero/>
       <MeetOurTeam/>
        <Footer/>

    </div>
  )
}

export default page