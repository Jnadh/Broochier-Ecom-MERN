import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    // Footer classes keep navigation and branding consistent across pages.
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <h3>Broochier</h3>
          <p>
            Premium E-Commerce Platform.
          </p>
        </div>

        <div className="footer-links">
          <Link to="/about">
            About Us
          </Link>
          <Link to="/returnpolicy">
            Return Policy
          </Link>
          <Link to="/disclaimer">
            Disclaimer
          </Link>
        </div>

        <div className="footer-copy">
          &copy; {new Date().getFullYear()} Broochier. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
