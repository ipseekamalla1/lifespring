import React from 'react'
import Navbar from '../../../components/Navbar';
import ContactHero from '../../../components/client/contact/ContactHero';
import ContactOptions from '../../../components/client/contact/ContactOptions';

const page = () => {
  return (
    <div><Navbar/>
    <ContactHero/>
    <ContactOptions/></div>
  )
}

export default page