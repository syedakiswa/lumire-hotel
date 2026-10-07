import { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { api } from "../services/api";

const HERO_IMAGE = "/contactusbg.jpg";

const subjects = [
  "General Inquiry",
  "Room Reservation",
  "Dining Reservation",
  "Events & Conferences",
  "Feedback",
  "Other",
];

const emptyForm = { name: "", email: "", subject: "", message: "" };

const labelClass = "block text-xs uppercase tracking-widest text-gray-500 mb-2";
const fieldClass =
  "w-full bg-white border border-gray-300 text-gray-900 px-4 py-3 text-sm outline-none focus:border-amber-500 transition";

function ContactUs() {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSent(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.subject || !form.message.trim()) {
      setError("Please fill in all required fields.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setSending(true);
      setError("");
      await api.contact.send(form);
      setSent(true);
      setForm(emptyForm);
    } catch (err) {
      setError(err.message || "Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-black text-white">

      {/* ================= 1. HERO ================= */}
      <section className="relative h-[320px] sm:h-[400px] md:h-[460px] overflow-hidden">
        {HERO_IMAGE ? (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${HERO_IMAGE}')` }}
          ></div>
        ) : (
          <div className="absolute inset-0 bg-neutral-950"></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black"></div>

        <div className="relative z-10 h-full flex items-center justify-center text-center px-6">
          <div data-aos="fade-up">
            <p className="text-amber-400 uppercase tracking-[4px] text-xs md:text-sm mb-5">
              Lumière Grand Hotel
            </p>
            <div className="w-16 h-px bg-amber-400 mx-auto mb-6"></div>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light tracking-wide text-stone-50">
              Contact Us
            </h1>
            <p className="mt-5 text-stone-200/80 text-sm md:text-lg tracking-wide">
              We&apos;re here to help you
            </p>
          </div>
        </div>
      </section>

      {/* ================= 2. GET IN TOUCH ================= */}
      <section className="bg-stone-50 text-black py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-14">

          {/* LEFT: contact info */}
          <div data-aos="fade-right" className="lg:col-span-2">
            <p className="text-amber-600 uppercase tracking-[4px] text-xs md:text-sm mb-4">
              Contact
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-light tracking-wide">
              Get in Touch
            </h2>
            <div className="w-12 h-px bg-amber-500 mt-5"></div>

            <div className="mt-8 bg-black text-white border border-amber-400/30 p-7 md:p-9 space-y-7">
              <div className="flex gap-4">
                <MapPin className="w-5 h-5 mt-1 text-amber-400 shrink-0" />
                <div>
                  <p className="text-xs uppercase tracking-widest text-amber-400 mb-1">
                    Our Location
                  </p>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    123 Luxury Lane, Gulshan-e-Iqbal,
                    <br />
                    Karachi, Pakistan
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Phone className="w-5 h-5 mt-1 text-amber-400 shrink-0" />
                <div>
                  <p className="text-xs uppercase tracking-widest text-amber-400 mb-1">
                    Phone
                  </p>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    <a href="tel:+922112345678" className="hover:text-amber-400 transition">
                      +92 21 1234 5678
                    </a>
                    <br />
                    <a href="tel:+923001234567" className="hover:text-amber-400 transition">
                      +92 300 123 4567
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Mail className="w-5 h-5 mt-1 text-amber-400 shrink-0" />
                <div>
                  <p className="text-xs uppercase tracking-widest text-amber-400 mb-1">
                    Email
                  </p>
                  <a
                    href="mailto:info@lumieregrand.com"
                    className="text-gray-300 text-sm hover:text-amber-400 transition break-all"
                  >
                    info@lumieregrand.com
                  </a>
                </div>
              </div>

              <div className="flex gap-4">
                <Clock className="w-5 h-5 mt-1 text-amber-400 shrink-0" />
                <div>
                  <p className="text-xs uppercase tracking-widest text-amber-400 mb-1">
                    Working Hours
                  </p>
                  <p className="text-gray-300 text-sm">Mon - Sun, 24/7</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: form */}
          <div data-aos="fade-left" className="lg:col-span-3">
            <h2 className="font-serif text-3xl sm:text-4xl font-light tracking-wide">
              Send Us a Message
            </h2>
            <div className="w-12 h-px bg-amber-500 mt-5"></div>

            <form
              onSubmit={handleSubmit}
              className="mt-8 bg-white border border-gray-200 p-6 md:p-10"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className={fieldClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className={fieldClass}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className={labelClass}>Subject *</label>
                  <select
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    className={fieldClass}
                  >
                    <option value="">Select a subject</option>
                    {subjects.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className={labelClass}>Message *</label>
                  <textarea
                    name="message"
                    rows="7"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="How can we help you?"
                    className={`${fieldClass} resize-none`}
                  ></textarea>
                </div>
              </div>

              {error && (
                <p className="mt-6 text-sm text-red-600 border border-red-300 bg-red-50 px-4 py-3">
                  {error}
                </p>
              )}

              {sent && (
                <p className="mt-6 text-sm text-green-800 border border-green-300 bg-green-50 px-4 py-3">
                  Thank you for contacting us. Your message has been sent and
                  our team will get back to you shortly.
                </p>
              )}

              <button
                type="submit"
                disabled={sending}
                className="mt-8 w-full bg-amber-400 text-black py-4 uppercase tracking-widest text-sm font-medium hover:bg-amber-300 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {sending ? "Sending Message..." : "Send Message →"}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ================= 3. MAP ================= */}
      <section className="border-y border-amber-400/30">
        <iframe
          title="Lumière Grand Hotel location"
          src="https://www.google.com/maps?q=Gulshan-e-Iqbal,+Karachi,+Pakistan&z=14&output=embed"
          className="w-full h-[320px] md:h-[450px] block border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        ></iframe>
      </section>

      {/* ================= 4. FINAL CTA ================= */}
      <section className="bg-black py-20 md:py-24">
        <div
          data-aos="fade-up"
          className="max-w-2xl mx-auto px-6 text-center"
        >
          <div className="w-16 h-px bg-amber-400 mx-auto mb-6"></div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light tracking-wide">
            Need Assistance?
          </h2>
          <p className="mt-5 text-gray-400 text-sm md:text-base leading-relaxed">
            Our team is available 24/7 to assist you with reservations, dining,
            events and any other questions.
          </p>
          <Link
            to="/rooms"
            className="inline-block mt-8 px-9 py-3 border border-amber-400 text-amber-400 uppercase tracking-widest text-xs md:text-sm hover:bg-amber-400 hover:text-black transition duration-300"
          >
            Book Your Stay →
          </Link>
        </div>
      </section>

    </div>
  );
}

export default ContactUs;