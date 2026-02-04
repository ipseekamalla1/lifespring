# Healthcare Management System

A full-featured healthcare management system for **admins, doctors, and patients**. This system allows seamless appointment management, patient record tracking, and doctor schedule management, all in a **clean, responsive interface**.

---

## Tech Stack

- **Frontend:** React.js  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB / PostgreSQL (Prisma supported)  
- **Authentication:** JWT-based role authentication (Admin, Doctor, Patient)  
- **Styling:** CSS / UI Library (PrimeReact if used)  
- **Deployment:** Vercel / Heroku (optional)  

---

## Project Overview

This system provides **role-based dashboards**:

- **Admin:** Manage doctors, patients, departments, and appointments.  
- **Doctor:** View and update appointments and patient info.  
- **Patient:** Book, view, reschedule, or cancel appointments.  
- **Role-based Access:** Ensures each user sees only their relevant data.  

The system is fully responsive and can be accessed on **desktop and mobile devices**. It provides a simple and efficient workflow for healthcare management.  

---

## Features

- Role-based dashboards for Admin, Doctor, and Patient  
- Appointment booking, rescheduling, and cancellation  
- Patient medical history management  
- Doctor profile and department management  
- Responsive design for desktop and mobile devices  
- Basic notifications for upcoming appointments  
- Secure authentication and authorization  

---

## Setup Instructions

Follow these steps to run the project locally:

1. **Clone the repository**  

```bash
git clone https://github.com/yourusername/healthcare-system.git
cd healthcare-system

2. Install dependencies

npm install


3. Set up environment variables

Create a .env file in the root folder with the following:

DATABASE_URL=your_database_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000


4. Run database migrations (if using Prisma)

npx prisma migrate dev --name init


5. Seed Admin Account

npx prisma db seed


6. Admin Login Credentials:

Email: admin@example.com

Password: Admin@123

You can change these credentials in the seed file if desired.

7. Run the application

npm run dev


8. Open in browser

Visit http://localhost:3000