import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./auth.css";

const img = (id) =>
  `https://images.unsplash.com/${id}?w=1400&q=80&auto=format&fit=crop`;

const SLIDES = [
  {
    image: img("photo-1601506521937-0121a7fc2a6b"),
    title: "Manage Your Rental House",
    text: "Keep your inventory, pricing, and availability in one place built for production rentals.",
  },
  {
    image: img("photo-1516035069371-29a1b244cc32"),
    title: "Process Orders with Ease",
    text: "Accept, track, and manage orders from productions seamlessly with real-time updates.",
  },
  {
    image: img("photo-1492691527719-9d1e07e534b4"),
    title: "Track Every Piece of Gear",
    text: "Know where every camera, light, and cable is, from check-out to return.",
  },
  {
    image: img("photo-1574717024653-61fd2cf4d44d"),
    title: "Simplify Scheduling",
    text: "Plan pickups, deliveries, and returns around the shoot calendar without the back-and-forth.",
  },
  {
    image: img("photo-1594909122845-11baa439b7bf"),
    title: "Stay Connected with Productions",
    text: "Communicate directly with production teams for updates, changes, and special requests.",
  },
  {
    image: img("photo-1601506521937-0121a7fc2a6b"),
    title: "Get Paid Faster",
    text: "Send invoices and collect payments as soon as the job wraps.",
  },
  {
    image: img("photo-1516035069371-29a1b244cc32"),
    title: "Grow Your Business",
    text: "Reach new productions looking for the equipment you already have.",
  },
  {
    image: img("photo-1492691527719-9d1e07e534b4"),
    title: "Handle Damages Clearly",
    text: "Document condition at pickup and return so disputes are quick to settle.",
  },
  {
    image: img("photo-1574717024653-61fd2cf4d44d"),
    title: "Work as a Team",
    text: "Give your staff the access they need to prep, ship, and receive orders.",
  },
  {
    image: img("photo-1594909122845-11baa439b7bf"),
    title: "Insights at a Glance",
    text: "See utilization and revenue trends to decide what gear to add next.",
  },
];

const AUTOPLAY_MS = 5000;

const AuthLayout = ({ children, initialSlide = 0 }) => {
  const [active, setActive] = useState(initialSlide);
  const { pathname } = useLocation();
  const isSignup = pathname === "/signup";

  useEffect(() => {
    const timer = setTimeout(
      () => setActive((i) => (i + 1) % SLIDES.length),
      AUTOPLAY_MS,
    );
    return () => clearTimeout(timer);
  }, [active]);

  const go = (step) =>
    setActive((i) => (i + step + SLIDES.length) % SLIDES.length);

  return (
    <div className="auth">
      <header className="auth-header">
        <Link to="/login" className="auth-logo" aria-label="ReelTrak home">
          <span className="auth-logo-r">R</span>EELTRAK
        </Link>
        <nav className="auth-header-actions">
          <Link
            to="/signup"
            className={`auth-pill ${isSignup ? "auth-pill--primary" : "auth-pill--light"}`}
          >
            Sign Up
          </Link>
          <Link
            to="/login"
            className={`auth-pill ${isSignup ? "auth-pill--light" : "auth-pill--primary"}`}
          >
            Sign In
          </Link>
        </nav>
      </header>

      <div className="auth-body">
        <aside className="auth-hero">
          {SLIDES.map((slide, i) => (
            <div
              key={i}
              className={`auth-hero-slide ${i === active ? "is-active" : ""}`}
              style={{ backgroundImage: `url(${slide.image})` }}
              aria-hidden={i !== active}
            />
          ))}
          <div className="auth-hero-shade" />

          <div className="auth-hero-content">
            <h2 className="auth-hero-title">{SLIDES[active].title}</h2>
            <p className="auth-hero-text">{SLIDES[active].text}</p>

            <div className="auth-carousel-nav">
              <button
                type="button"
                className="auth-arrow"
                onClick={() => go(-1)}
                aria-label="Previous slide"
              >
                <svg viewBox="0 0 24 24" width="22" height="22">
                  <path d="M15 5l-7 7 7 7" />
                </svg>
              </button>
              <div className="auth-dots">
                {SLIDES.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`auth-dot ${i === active ? "is-active" : ""}`}
                    onClick={() => setActive(i)}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
              <button
                type="button"
                className="auth-arrow"
                onClick={() => go(1)}
                aria-label="Next slide"
              >
                <svg viewBox="0 0 24 24" width="22" height="22">
                  <path d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <nav className="auth-hero-links">
              <a href="#">Contact Us</a>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms &amp; Conditions</a>
              <a href="#">FAQ</a>
            </nav>
          </div>
        </aside>

        <section className="auth-panel">
          <div className="auth-panel-inner">{children}</div>
          <p className="auth-copyright">
            © {new Date().getFullYear()}, ReelTrak, Inc. or its affiliates
          </p>
        </section>
      </div>
    </div>
  );
};

export default AuthLayout;
