import React, { useState } from 'react';
import {
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaClock,
  FaPaperPlane,
  FaCheckCircle,
} from 'react-icons/fa';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      console.log('Form submitted:', formData);
      setIsLoading(false);
      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
          <FaEnvelope /> Hubungi Kami
        </h1>

        {isSubmitted && (
          <div className="bg-green-600 text-white p-4 mb-4 rounded flex items-center gap-2">
            <FaCheckCircle /> Pesan kamu sudah dikirim!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full p-2 rounded bg-gray-800 border border-gray-700"
            type="text"
            name="name"
            placeholder="Nama"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            className="w-full p-2 rounded bg-gray-800 border border-gray-700"
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            className="w-full p-2 rounded bg-gray-800 border border-gray-700"
            type="text"
            name="subject"
            placeholder="Subjek"
            value={formData.subject}
            onChange={handleChange}
            required
          />
          <textarea
            className="w-full p-2 rounded bg-gray-800 border border-gray-700"
            name="message"
            rows="4"
            placeholder="Pesan"
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded flex items-center gap-2"
            disabled={isLoading}
          >
            <FaPaperPlane />
            {isLoading ? 'Mengirim...' : 'Kirim Pesan'}
          </button>
        </form>

        <div className="mt-10 space-y-2 text-gray-400">
          <div className="flex items-center gap-2">
            <FaMapMarkerAlt /> Kalimantan Timur, Indonesia
          </div>
          <div className="flex items-center gap-2">
            <FaPhone /> +62 812-xxxx-xxxx
          </div>
          <div className="flex items-center gap-2">
            <FaEnvelope /> support@zallmarket.com
          </div>
          <div className="flex items-center gap-2">
            <FaClock /> Senin - Jumat, 09:00 - 17:00
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
