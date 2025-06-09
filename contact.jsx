import React, { useState } from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaPaperPlane, FaCheckCircle } from 'react-icons/fa';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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
        message: ''
      });
      
      // Reset submission status after 5 seconds
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 1500);
  };

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="container">
          <h1>Hubungi Kami</h1>
          <p>Tim support kami siap membantu Anda 24/7. Jangan ragu untuk menghubungi kami melalui berbagai channel yang tersedia.</p>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="contact-info-section">
        <div className="container">
          <div className="contact-info-grid">
            {/* Location */}
            <div className="info-card">
              <div className="info-icon">
                <FaMapMarkerAlt />
              </div>
              <h3>Lokasi Kami</h3>
              <p>Jl. Teknologi No. 123, Cyber Park<br />Jakarta Selatan, Indonesia 12520</p>
            </div>

            {/* Phone */}
            <div className="info-card">
              <div className="info-icon">
                <FaPhone />
              </div>
              <h3>Telepon</h3>
              <p>+62 21 1234 5678 (Office)<br />+62 812 3456 7890 (WhatsApp)</p>
              <a href="https://wa.me/6281234567890" className="whatsapp-btn">Chat via WhatsApp</a>
            </div>

            {/* Email */}
            <div className="info-card">
              <div className="info-icon">
                <FaEnvelope />
              </div>
              <h3>Email</h3>
              <p>support@zallhosting.biz.id<br />sales@zallhosting.biz.id</p>
              <a href="mailto:support@zallhosting.biz.id" className="email-btn">Kirim Email</a>
            </div>

            {/* Hours */}
            <div className="info-card">
              <div className="info-icon">
                <FaClock />
              </div>
              <h3>Jam Operasional</h3>
              <p>Senin - Jumat: 08.00 - 17.00 WIB<br />Sabtu: 08.00 - 14.00 WIB<br />Minggu: Tutup</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="contact-form-section">
        <div className="container">
          <div className="form-container">
            <div className="form-header">
              <h2>Kirim Pesan Langsung</h2>
              <p>Isi formulir di bawah ini dan tim kami akan menghubungi Anda secepatnya.</p>
            </div>

            {isSubmitted ? (
              <div className="success-message">
                <FaCheckCircle className="success-icon" />
                <h3>Terima kasih!</h3>
                <p>Pesan Anda telah berhasil dikirim. Kami akan menghubungi Anda segera.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                  <label htmlFor="name">Nama Lengkap</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Masukkan nama Anda"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Alamat Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Masukkan email Anda"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Subjek</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="Subjek pesan Anda"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Pesan</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    placeholder="Tulis pesan Anda disini..."
                  ></textarea>
                </div>

                <button type="submit" className="submit-btn" disabled={isLoading}>
                  {isLoading ? 'Mengirim...' : (
                    <>
                      <FaPaperPlane className="send-icon" /> Kirim Pesan
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          <div className="map-container">
            <iframe
              title="ZallHosting Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.521260322283!2d106.81956135078236!3d-6.194741395493371!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f5390917b759%3A0x9b7ace5e62e0d7f1!2sJakarta%20Selatan%2C%20Kota%20Jakarta%20Selatan%2C%20Daerah%20Khusus%20Ibukota%20Jakarta!5e0!3m2!1sid!2sid!4v1621234567890!5m2!1sid!2sid"
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="support-section">
        <div className="container">
          <div className="support-content">
            <h2>Butuh Bantuan Cepat?</h2>
            <p>Tim support teknis kami siap membantu Anda melalui live chat 24/7.</p>
            <a href="#" className="live-chat-btn">Mulai Live Chat</a>
          </div>
        </div>
      </section>

      {/* CSS Styles */}
      <style jsx>{`
        .contact-page {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #333;
          line-height: 1.6;
        }
        
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }
        
        /* Hero Section */
        .contact-hero {
          background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
          color: white;
          padding: 80px 0;
          text-align: center;
        }
        
        .contact-hero h1 {
          font-size: 2.5rem;
          margin-bottom: 20px;
        }
        
        .contact-hero p {
          font-size: 1.2rem;
          max-width: 700px;
          margin: 0 auto;
          opacity: 0.9;
        }
        
        /* Contact Info Section */
        .contact-info-section {
          padding: 60px 0;
          background: #f8f9fa;
        }
        
        .contact-info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 30px;
        }
        
        .info-card {
          background: white;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
          text-align: center;
          transition: transform 0.3s ease;
        }
        
        .info-card:hover {
          transform: translateY(-5px);
        }
        
        .info-icon {
          width: 60px;
          height: 60px;
          background: #3498db;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          font-size: 1.5rem;
        }
        
        .info-card h3 {
          color: #2c3e50;
          margin-bottom: 15px;
          font-size: 1.3rem;
        }
        
        .info-card p {
          color: #7f8c8d;
          margin-bottom: 20px;
        }
        
        .whatsapp-btn, .email-btn {
          display: inline-block;
          padding: 8px 15px;
          border-radius: 5px;
          font-weight: 500;
          text-decoration: none;
          transition: background 0.3s ease;
        }
        
        .whatsapp-btn {
          background: #25D366;
          color: white;
        }
        
        .whatsapp-btn:hover {
          background: #128C7E;
        }
        
        .email-btn {
          background: #3498db;
          color: white;
        }
        
        .email-btn:hover {
          background: #2980b9;
        }
        
        /* Contact Form Section */
        .contact-form-section {
          padding: 60px 0;
        }
        
        .form-container {
          background: white;
          border-radius: 8px;
          box-shadow: 0 5px 25px rgba(0, 0, 0, 0.05);
          padding: 40px;
          margin-bottom: 40px;
        }
        
        .form-header {
          text-align: center;
          margin-bottom: 30px;
        }
        
        .form-header h2 {
          color: #2c3e50;
          font-size: 1.8rem;
          margin-bottom: 10px;
        }
        
        .form-header p {
          color: #7f8c8d;
        }
        
        .contact-form .form-group {
          margin-bottom: 20px;
        }
        
        .contact-form label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: #2c3e50;
        }
        
        .contact-form input,
        .contact-form textarea {
          width: 100%;
          padding: 12px 15px;
          border: 1px solid #ddd;
          border-radius: 5px;
          font-size: 1rem;
          transition: border 0.3s ease;
        }
        
        .contact-form input:focus,
        .contact-form textarea:focus {
          border-color: #3498db;
          outline: none;
        }
        
        .contact-form textarea {
          resize: vertical;
          min-height: 150px;
        }
        
        .submit-btn {
          background: #3498db;
          color: white;
          border: none;
          padding: 12px 25px;
          border-radius: 5px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          transition: background 0.3s ease;
        }
        
        .submit-btn:hover {
          background: #2980b9;
        }
        
        .submit-btn:disabled {
          background: #95a5a6;
          cursor: not-allowed;
        }
        
        .send-icon {
          margin-right: 8px;
        }
        
        /* Success Message */
        .success-message {
          text-align: center;
          padding: 30px;
        }
        
        .success-icon {
          color: #2ecc71;
          font-size: 3rem;
          margin-bottom: 20px;
        }
        
        .success-message h3 {
          color: #2c3e50;
          font-size: 1.5rem;
          margin-bottom: 10px;
        }
        
        .success-message p {
          color: #7f8c8d;
        }
        
        /* Map Container */
        .map-container {
          height: 400px;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 5px 25px rgba(0, 0, 0, 0.05);
        }
        
        .map-container iframe {
          width: 100%;
          height: 100%;
          border: none;
        }
        
        /* Support Section */
        .support-section {
          background: linear-gradient(135deg, #3498db 0%, #2c3e50 100%);
          color: white;
          padding: 60px 0;
          text-align: center;
        }
        
        .support-content h2 {
          font-size: 2rem;
          margin-bottom: 15px;
        }
        
        .support-content p {
          font-size: 1.1rem;
          max-width: 600px;
          margin: 0 auto 25px;
          opacity: 0.9;
        }
        
        .live-chat-btn {
          display: inline-block;
          background: white;
          color: #3498db;
          padding: 12px 30px;
          border-radius: 50px;
          font-weight: 600;
          text-decoration: none;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .live-chat-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        
        /* Responsive Styles */
        @media (max-width: 768px) {
          .contact-hero {
            padding: 60px 0;
          }
          
          .contact-hero h1 {
            font-size: 2rem;
          }
          
          .form-container {
            padding: 30px 20px;
          }
        }
        
        @media (max-width: 576px) {
          .contact-hero h1 {
            font-size: 1.8rem;
          }
          
          .contact-hero p {
            font-size: 1rem;
          }
          
          .support-content h2 {
            font-size: 1.6rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ContactPage;
