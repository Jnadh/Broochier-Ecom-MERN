import React, { useEffect, useState } from "react";
import { apiFetch as fetch } from "../api";
import { Link } from "react-router-dom";
import ProductCard from "../components/productCard";
import "../styles/product.css";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(data.slice(0, 4));
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="hero-container">
      <div className="hero-banner">
        {/* Editorial hero copy pairs with the background image styled in product.css. */}
        <div className="hero-content">
          <span className="hero-eyebrow">Thoughtfully chosen. Made to last.</span>
          <h1>Little details.<br />Lasting impressions.</h1>
          <p>Discover distinctive pieces that bring a little more meaning to everyday style.</p>
          <Link to="/shop" className="hero-cta">Explore the collection <span aria-hidden="true">→</span></Link>
        </div>
      </div>
      <div className="home-section-heading">
        <div>
          <span className="section-eyebrow">The edit</span>
          <h2>Featured pieces</h2>
        </div>
        <Link to="/shop">View all products <span aria-hidden="true">→</span></Link>
      </div>
      {loading ? (
        <div className="loading-state">Finding something lovely…</div>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
      <div className="home-benefits">
        <div className="home-benefit">
          <span className="benefit-mark" aria-hidden="true">✳</span>
          <span><strong>Thoughtful design</strong>Details worth keeping</span>
        </div>
        <div className="home-benefit">
          <span className="benefit-mark" aria-hidden="true">♡</span>
          <span><strong>Made for gifting</strong>A little something special</span>
        </div>
        <div className="home-benefit">
          <span className="benefit-mark" aria-hidden="true">↗</span>
          <span><strong>Easy to explore</strong>Find your next favorite</span>
        </div>
      </div>
    </div>
  );
};

export default Home;
