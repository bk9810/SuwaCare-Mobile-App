import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/WelcomeScreen.css";

export default function WelcomeScreen() {
  const navigate = useNavigate();
  const [clickCount, setClickCount] = useState(0);
  const [showAdmin, setShowAdmin] = useState(false);

  // handle clicks on background
  const handleHiddenClick = () => {
    setClickCount((prev) => prev + 1);
  };

  // watch for 5 clicks
  useEffect(() => {
    if (clickCount >= 5) {
      setShowAdmin(true); // show admin button
      setClickCount(0);   // reset counter
    }
  }, [clickCount]);

  return (
    <div 
      className="welcome-container"
      onClick={handleHiddenClick}
    >
      
      

     
      <div className="welcome-content">
        
        
        <div className="logo-section">
          <div className="logo-circle">
            <div className="plus-icon">+</div>
          </div>
          
          <div className="brand-text">
            <h1 className="brand-name">SuwaCare</h1>
            <p className="brand-tagline">Together for Lifelong Care</p>
          </div>
        </div>

        
        <div className="welcome-message">
          <h2 className="welcome-title">Welcome to SuwaCare</h2>
          <p className="welcome-description">
            Support for every step of your chronic care journey.
          </p>
          <p className="app-section">Pharmacy Part</p>
        </div>

        
        <div className="button-section">
          {showAdmin && (
            <button
              className="btn btn-admin"
              onClick={(e) => {
                e.stopPropagation();
                navigate("/admin-login");
              }}
            >
              ADMIN
            </button>
          )}
          
          <button
            className="btn btn-primary"
            onClick={(e) => {
              e.stopPropagation();
              navigate("/pharmacy-login");
            }}
          >
            GET STARTED
          </button>
        </div>

        
        <div className="footer-text">
          <p>Secure • Reliable • Professional</p>
        </div>
      </div>

      
      <div className="bottom-indicator"></div>
    </div>
  );
}