import { Link } from 'react-router-dom';
import { AlertCircle, MessageSquare, Mail, Phone } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <AlertCircle size={24} className="text-blue-600" />
              <span className="font-bold text-xl">SCMS</span>
            </Link>
            <p className="mt-4 text-gray-600">
              Smart Complaint Management System - Streamlining the resolution of customer issues.
            </p>
          </div>
          
          {/* Quick links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Register
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Resources */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                  FAQs
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Mail size={18} className="text-blue-600 mt-0.5" />
                <span className="text-gray-600">support@scms.example.com</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={18} className="text-blue-600 mt-0.5" />
                <span className="text-gray-600">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start gap-3">
                <MessageSquare size={18} className="text-blue-600 mt-0.5" />
                <span className="text-gray-600">Live chat available 9am-5pm</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom copyright */}
        <div className="border-t border-gray-200 mt-8 pt-6 text-center md:text-left md:flex md:justify-between">
          <p className="text-gray-600 text-sm">
            &copy; {currentYear} Smart Complaint Management System. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors mx-3 md:ml-6 md:mr-0">
              Privacy
            </a>
            <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors mx-3">
              Terms
            </a>
            <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors mx-3">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;