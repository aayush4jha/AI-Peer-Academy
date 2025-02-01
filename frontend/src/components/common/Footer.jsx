import React from "react";
import { FaFacebook, FaInstagram, FaTwitter, FaGithub } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-slate-900 text-gray-300 py-12 w-full p-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo and Description Section */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-teal-400 rounded-full"></div>
            <span className="text-xl font-semibold text-teal-400">
              Ai Peer Master
            </span>
          </div>
          <p className="text-sm text-gray-400">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Incidunt
            consequuntur amet culpa cum itaque neque.
          </p>
          <div className="flex space-x-4">
            <FaFacebook className="w-5 h-5 text-gray-400 hover:text-teal-400 cursor-pointer" />
            <FaInstagram className="w-5 h-5 text-gray-400 hover:text-teal-400 cursor-pointer" />
            <FaTwitter className="w-5 h-5 text-gray-400 hover:text-teal-400 cursor-pointer" />
            <FaGithub className="w-5 h-5 text-gray-400 hover:text-teal-400 cursor-pointer" />
          </div>
        </div>

        {/* About Us Section */}
        <div className="space-y-4">
          <h3 className="text-white font-semibold text-lg">About Us</h3>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:text-teal-400">
                Company History
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-teal-400">
                Meet the Team
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-teal-400">
                Careers
              </a>
            </li>
          </ul>
        </div>

        {/* Our Services Section */}
        <div className="space-y-4">
          <h3 className="text-white font-semibold text-lg">Our Services</h3>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:text-teal-400">
                abc
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-teal-400">
                xyz
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Us Section */}
        <div className="space-y-4">
          <h3 className="text-white font-semibold text-lg">Contact Us</h3>
          <ul className="space-y-2">
            <li className="flex items-center space-x-2">
              <span>📧</span>
              <span>abc@gmail.com</span>
            </li>
            <li className="flex items-center space-x-2">
              <span>📞</span>
              <span>0123456789</span>
            </li>
            <li className="flex items-center -space-x-2">
              <span>📍 {"   "} SVNIT </span>
              <span></span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-6xl mx-auto pt-8 mt-8 border-t border-gray-700">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">© 2022 QuizMaster</p>
          <div className="flex space-x-4 text-sm text-gray-400">
            <a href="#" className="hover:text-teal-400">
              Terms & Conditions
            </a>
            <span>•</span>
            <a href="#" className="hover:text-teal-400">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
