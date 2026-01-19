import React from 'react'
import Navbar from '../../../components/Navbar';
import ContactHero from '../../../components/client/contact/ContactHero';
import ContactOptions from '../../../components/client/contact/ContactOptions';
import ContactFormSection from '../../../components/client/contact/ContactFormSection';

const page = () => {
  return (
    <div><Navbar/>
    <ContactHero/>
    <ContactOptions/>
    <ContactFormSection/></div>
  )
}

export default page