import React from "react";
import { Link } from "react-router-dom";
import "../styles.css";

const About = () => {
  return (
    <div className="bg-white min-vh-100">
      {/* Hero Section */}
      <div className="about-hero">
        <div className="about-hero-content">
          <h1>About This App</h1>
          <p>
            Gamifying coding challenges to make programming more engaging and
            competitive
          </p>
          <Link
            to="/login"
            className="about-btn about-btn-primary text-decoration-none"
            role="button"
          >
            Start Now
          </Link>
          <button className="about-btn about-btn-outline">Get App</button>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="main-content">
        <div className="about-content-container">
          {/* Left Container - Features */}
          <div className="about-main-content">
            <div className="about-card">
              <div className="about-card-body">
                <h2>Key Features</h2>
                <ul className="about-features-list">
                  <li className="about-feature-item">
                    <span className="about-feature-icon">🎯</span>
                    <div className="about-feature-content">
                      <h5>Time-based Coding Challenges</h5>
                      <p>Solve problems under time constraints.</p>
                    </div>
                  </li>
                  <li className="about-feature-item">
                    <span className="about-feature-icon">🏆</span>
                    <div className="about-feature-content">
                      <h5>Ranking System</h5>
                      <p>
                        Earn points based on difficulty and code efficiency.
                      </p>
                    </div>
                  </li>
                  <li className="about-feature-item">
                    <span className="about-feature-icon">🔒</span>
                    <div className="about-feature-content">
                      <h5>Anti-Cheat Mechanism</h5>
                      <p>Fair competition for all participants.</p>
                    </div>
                  </li>
                  <li className="about-feature-item">
                    <span className="about-feature-icon">📊</span>
                    <div className="about-feature-content">
                      <h5>Live Leaderboard</h5>
                      <p>Track progress and compare with others.</p>
                    </div>
                  </li>
                  <li className="about-feature-item">
                    <span className="about-feature-icon">🎮</span>
                    <div className="about-feature-content">
                      <h5>Gamified Experience</h5>
                      <p>Competitive and fun way to improve coding skills.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <div className="about-card">
              <div className="about-card-body">
                <h2>Our Goal</h2>
                <p>
                  We aim to create an interactive{" "}
                  <strong>coding competition platform</strong> where developers
                  can challenge themselves, improve problem-solving skills, and
                  have fun while coding.
                </p>
              </div>
            </div>
          </div>

          {/* Right Container - Additional Info */}
          <div className="about-sidebar">
            <div className="about-card">
              <div className="about-card-body">
                <h3>App Information</h3>
                <p className="small">
                  This website is designed to{" "}
                  <strong>gamify coding challenges</strong>, making programming
                  more engaging and competitive.
                </p>
                <button className="about-btn about-btn-outline w-100 mt-3">
                  Download App
                </button>
              </div>
            </div>

            <div className="about-card">
              <div className="about-card-body">
                <h3>Quick Links</h3>
                <ul className="about-quick-links">
                  <li>
                    <a href="#">API Documentation</a>
                  </li>
                  <li>
                    <a href="#">Privacy Policy</a>
                  </li>
                  <li>
                    <a href="#">Terms of Service</a>
                  </li>
                  <li>
                    <a href="#">Careers</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
