"use client";
import React, { useState } from "react";
// Assuming you have this file set up for Supabase connection
import { supabase } from "@/lib/supabase"; 

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null); 
  const [isSubmitting, setIsSubmitting] = useState(false); 

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    if (!formData.name || !formData.email || !formData.message) {
      setError("Please fill out your Name, Email, and Message.");
      setIsSubmitting(false);
      return;
    }

    try {
      const { data, error: submitError } = await supabase
        .from("contact_submissions")
        .insert([
          {
            name: formData.name,
            email: formData.email,
            subject: formData.subject,
            message: formData.message,
          },
        ]);

      if (submitError) {
        throw submitError;
      }
      
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ name: "", email: "", subject: "", message: "" });
      }, 3000);

    } catch (err) {
      console.error("Submission Error:", err);
      setError("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactMethods = [
    {
      icon: "📧",
      title: "Email Support",
      detail: "Godricfashionfactory@gmail.com",
      description: "Send us a detailed inquiry anytime, 24/7.",
    },
    {
      icon: "📞",
      title: "Phone (India)",
      detail: "+91 9354410145",
      description: "Mon-Fri from 8:00 AM to 6:00 PM (IST).",
    },
    {
      icon: "💬",
      title: "Online Chat",
      detail: "Response within 1 Hour",
      description: "Available for quick questions and immediate help.",
    },
    {
      icon: "📍",
      title: "Our Location",
      detail: "Mahendra enclave, Shastri Nagar, Ghaziabad",
      description: "Please schedule an appointment before visiting.",
    },
  ];

  const faqs = [
    {
      question: "How long does shipping take?",
      answer:
        "Standard shipping typically takes 5-7 business days. Express shipping is available for 2-3 day delivery.",
    },
    {
      question: "What is your return policy?",
      answer:
        "We offer a 30-day money-back guarantee on all products. Items must be in original condition with tags attached.",
    },
    {
      question: "Do you ship internationally?",
      answer:
        "Yes! We ship to over 100 countries worldwide. International shipping times vary by location.",
    },
    {
      question: "How can I track my order?",
      answer:
        "Once your order ships, you'll receive a tracking number via email. You can also track orders in your account dashboard.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAwIDIwIEwgNDAgMjAgTSAwIDMwIEwgNDAgMzAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzU1NTU1NSIgc3Ryb2tlLXdpZHRoPSIxIi8+PHBhdGggZD0iTSAxMCAwIEwgMTAgNDAgTSAyMCAwIEwgMjAgNDAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzU1NTU1NSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')]"></div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 text-center">
          <p className="text-indigo-400 text-sm font-semibold uppercase tracking-widest mb-3">
            Customer Support
          </p>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            Connect With Our Team
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            We are dedicated to providing fast and comprehensive support. Reach out
            to us using the method that suits you best.
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactMethods.map((method, index) => (
              <div
                key={index}
                className="bg-white border border-gray-100 rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 ease-out transform hover:-translate-y-1"
              >
                <div className="text-4xl text-indigo-600 mb-4">{method.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {method.title}
                </h3>
                <p className="text-indigo-600 font-semibold mb-1 truncate">
                  {method.detail}
                </p>
                <p className="text-gray-500 text-sm">{method.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & FAQ Section */}
      <section className="py-16 bg-white border-t border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            
            {/* Form */}
            <div className="p-8 border border-gray-200 rounded-2xl shadow-xl">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Send a Direct Message
              </h2>
              <p className="text-gray-600 mb-8">
                For detailed inquiries, submit this form. We aim to reply within
                one business day.
              </p>

              {/* Status Messages */}
              {submitted && (
                <div className="mb-6 bg-green-50 border border-green-300 text-green-700 rounded-xl p-4 flex items-start gap-3">
                  <span className="text-xl">✅</span>
                  <div>
                    <span className="font-semibold block">Message Sent!</span>
                    <p className="text-sm">Thank you, we'll be in touch shortly.</p>
                  </div>
                </div>
              )}
              {error && (
                <div className="mb-6 bg-red-50 border border-red-300 text-red-700 rounded-xl p-4 flex items-start gap-3">
                  <span className="text-xl">❌</span>
                  <div>
                    <span className="font-semibold block">Error:</span>
                    <p className="text-sm">{error}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Input Fields (Refined styles) */}
                <InputGroup
                  label="Your Name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                />
                <InputGroup
                  label="Email Address"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  required
                />
                <InputGroup
                  label="Subject"
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Order Inquiry / Partnership Request"
                />

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message*
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="5"
                    placeholder="Tell us more about your inquiry..."
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none shadow-sm"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 rounded-lg font-bold text-lg transition-all duration-300 shadow-md ${
                    isSubmitting
                      ? 'bg-indigo-300 cursor-not-allowed'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-xl'
                  }`}
                >
                  {isSubmitting ? "Sending..." : "Submit Inquiry"}
                </button>
              </form>
            </div>

            {/* FAQ */}
            <div className="space-y-8">
              <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-3">
                  Quick Answers (FAQ)
                </h3>
                <div className="space-y-6">
                  {faqs.map((faq, index) => (
                    <div
                      key={index}
                      className="pb-4"
                    >
                      <h4 className="font-semibold text-indigo-600 mb-1 text-lg">
                        {faq.question}
                      </h4>
                      <p className="text-gray-600 leading-relaxed text-base">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Office Hours */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Operational Hours
            </h2>
            <p className="text-gray-600 text-lg">
              Our core team is available during these hours for phone and chat support.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            <TimeCard icon="🏢" day="Monday - Friday" hours="8:00 AM - 6:00 PM IST" />
            <TimeCard icon="🧑‍💻" day="Saturday" hours="10:00 AM - 4:00 PM IST" isWeekend />
            <TimeCard icon="🚪" day="Sunday" hours="Closed" isClosed />
          </div>
        </div>
      </section>
    </div>
  );
}

// Reusable Input Component (For cleaner JSX)
const InputGroup = ({ label, type, name, value, onChange, placeholder, required = false }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
      {label}{required && "*"}
    </label>
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
    />
  </div>
);

// Reusable TimeCard Component (For cleaner JSX)
const TimeCard = ({ icon, day, hours, isWeekend, isClosed }) => (
  <div className={`text-center p-4 rounded-lg transition-all ${isClosed ? 'bg-gray-50 text-gray-400' : isWeekend ? 'bg-indigo-50 text-indigo-800' : 'bg-white text-gray-900'}`}>
    <div className="text-3xl mb-3">{icon}</div>
    <h3 className={`font-bold mb-1 ${isClosed ? 'text-gray-500' : 'text-gray-900'}`}>{day}</h3>
    <p className={`text-lg font-semibold ${isClosed ? 'text-gray-500' : 'text-indigo-600'}`}>{hours}</p>
  </div>
);