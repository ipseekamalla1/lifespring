"use client";


export default function Footer() {
  return (
    <footer className="bg-gray-100 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Brand */}
        <div>
          <h2 className="text-lg font-semibold text-blue-600">
            HealthCare+
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            Simple and secure healthcare appointment booking.
          </p>
        </div>

        {/* Links */}
        <div>
          <h3 className="font-medium mb-2">Quick Links</h3>
          <ul className="space-y-1 text-sm">
            <li>Home</li>
            <li>Doctors</li>
            <li>About</li>
            <li>Contact</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-medium mb-2">Contact</h3>
          <p className="text-sm text-gray-600">Canada</p>
          <p className="text-sm text-gray-600">support@healthcare.com</p>
        </div>
      </div>

      <div className="text-center text-sm text-gray-500 border-t py-4">
        © {new Date().getFullYear()} HealthCare+. All rights reserved.
      </div>
    </footer>
  );
}
