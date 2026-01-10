import React from 'react'
import Navbar from '../../../components/Navbar';
import Footer from '@/components/Footer';
import DoctorsHero from '../../../components/client/Doctors/DoctorsHero';
import MeetOurTeam from '../../../components/client/Doctors/MeetOurTeam';
import DepartmentsTabsSection from '@/components/client/Doctors/DepartmentTabsSection';

const page = () => {
  return (
    <div>

        <Navbar/>
        
       < DoctorsHero/>
       <MeetOurTeam/>
       <DepartmentsTabsSection/>

    </div>
  )
}

export default page