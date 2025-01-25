import React, { useState } from "react";
import { PiPhoneCallFill } from "react-icons/pi";
import { IoMail, IoLocationSharp } from "react-icons/io5";
import { GiGraduateCap } from "react-icons/gi";
import toast from "react-hot-toast";

function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // post request here
    // alert("Message sent successfully!");
    toast.error("Failed to send mail due to server error");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 ">
      {/* Main container */}
      <div className="max-w-7xl mx-auto mt-20">
        {/* Contact info and form container */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left side - Contact Info */}
          <div className="w-full lg:w-8/12">
            {/* Get In Touch Header */}
            <div className="text-center bg-gray-50 p-6 rounded-md mb-6">
              <GiGraduateCap className="inline text-3xl mr-5 text-blue-500" />
              <h2 className="text-4xl inline text-[#c16d1f] font-bold">
                Contact Info
              </h2>
              <p className="text-[#0d364c] text-2xl font-semibold mt-2">
                Get In Touch
              </p>
            </div>

            {/* Contact Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Phone Support */}
              <div className="bg-[#bbd3e0] p-6 rounded-md relative min-h-[200px]">
                <div className="flex flex-col items-center">
                  <div className="border border-gray-300 bg-white rounded-full p-4">
                    <PiPhoneCallFill size={40} />
                  </div>
                  <div className="mt-8 text-center">
                    <a
                      href="tel:+9198765"
                      className="block font-bold text-lg hover:opacity-70"
                    >
                      +91 98765 XXXXX
                    </a>
                    <a
                      href="tel:0261 220 1505"
                      className="block font-bold text-lg hover:opacity-70"
                    >
                      (123) 456-7890
                    </a>
                  </div>
                  <p className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-gray-500">
                    Phone Support
                  </p>
                </div>
              </div>

              {/* Email Address */}
              <div className="bg-[#ab9073] p-6 rounded-md relative min-h-[200px]">
                <div className="flex flex-col items-center">
                  <div className="border border-gray-300 bg-white rounded-full p-4">
                    <IoMail size={40} />
                  </div>
                  <div className="mt-8 text-center">
                    <a
                      href="mailto:xyz@gmail.com"
                      className="block font-bold text-lg hover:opacity-70"
                    >
                      info@aipacademy.com
                    </a>
                    <a
                      href="mailto:abc@gmail.com"
                      className="block font-bold text-lg hover:opacity-70"
                    >
                      abc@gmail.com
                    </a>
                  </div>
                  <p className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-gray-500">
                    Email Address
                  </p>
                </div>
              </div>

              {/* Address */}
              <div className="bg-[#bbd3e0] p-6 rounded-md relative min-h-[310px]">
                <div className="flex flex-col items-center">
                  <div className="border border-gray-300 bg-white rounded-full p-4">
                    <IoLocationSharp size={40} />
                  </div>
                  <div className="mt-4 text-center text-[15px] font-semibold ">
                    <p className="">AI Peer Academy,</p>
                    <p>123 Academy St., Some City, 12345</p>
                  </div>
                  <p className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-gray-500">
                    Address
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Contact Form */}
          <div className="w-full lg:w-1/2">
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">
                Contact Us
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-600"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-600"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-600"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-md"
                    rows="4"
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#0077B6] text-white py-3 rounded-md hover:bg-[#015786] transition duration-300"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-8 w-full">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3720.6299713642256!2d72.78262877503546!3d21.167119180517044!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04dec8b56fdf3%3A0x423b99085d26d1f9!2sSardar%20Vallabhbhai%20National%20Institute%20of%20Technology!5e0!3m2!1sen!2sin!4v1735906516723!5m2!1sen!2sin"
            className="w-full h-[400px]"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  );
}

export default ContactUs;
