import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Footer = () => {
    return (
        <footer className="site-footer">
            <div className="container">
                <div className="row">
                    <div className="col-lg-4 col-md-6 col-12 mb-4 mb-lg-0">
                        <div className="d-flex align-items-center mb-3">
                            <img alt="Quick Food" src={require("../assets/images/logo.png")} style={{ height: '36px' }} />
                        </div>
                        <p style={{ color: '#94a3b8', fontSize: '0.9rem', maxWidth: '320px' }}>
                            Delivering hot, delicious meals from your favorite local restaurants right to your doorstep within minutes.
                        </p>
                        <div className="d-flex gap-3 mt-3">
                            <div className="d-flex align-items-center mr-4">
                                <FontAwesomeIcon icon="phone" className="mr-2" style={{ color: 'var(--primary)' }} />
                                <span style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>+1 (800) 555-FOOD</span>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-2 col-md-3 col-6 mb-4 mb-md-0">
                        <h5>Popular Cuisines</h5>
                        <ul>
                            <li><a href="#/restaurants">Burgers & Fast Food</a></li>
                            <li><a href="#/restaurants">Italian & Pizza</a></li>
                            <li><a href="#/restaurants">Asian & Sushi</a></li>
                            <li><a href="#/restaurants">BBQ & Steaks</a></li>
                            <li><a href="#/restaurants">Healthy & Bowls</a></li>
                        </ul>
                    </div>

                    <div className="col-lg-2 col-md-3 col-6 mb-4 mb-md-0">
                        <h5>Quick Links</h5>
                        <ul>
                            <li><a href="#/">Home</a></li>
                            <li><a href="#/restaurants">Restaurants</a></li>
                            <li><a href="#/register-restaurant">Partner with Us</a></li>
                            <li><a href="#/login">Account Sign In</a></li>
                        </ul>
                    </div>

                    <div className="col-lg-4 col-md-12 col-12">
                        <h5>Stay Updated</h5>
                        <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>
                            Subscribe to receive weekly chef specials, exclusive promo codes, and dining perks.
                        </p>
                        <form onSubmit={(e) => { e.preventDefault(); alert("Thanks for subscribing to Quick Food specials!"); }} className="d-flex mt-3">
                            <input
                                type="email"
                                placeholder="Enter your email address"
                                className="form-control"
                                required
                                style={{
                                    borderRadius: '8px 0 0 8px',
                                    border: '1px solid #334155',
                                    background: '#1e293b',
                                    color: '#fff',
                                    fontSize: '0.9rem'
                                }}
                            />
                            <button
                                type="submit"
                                className="btn btn-warning px-3"
                                style={{ borderRadius: '0 8px 8px 0' }}
                            >
                                Join
                            </button>
                        </form>
                    </div>
                </div>

                <div className="site-footer-bottom d-flex flex-column flex-md-row justify-content-between align-items-center">
                    <p className="mb-2 mb-md-0">
                        &copy; {new Date().getFullYear()} Quick Food Inc. All rights reserved.
                    </p>
                    <div className="d-flex gap-3">
                        <span className="mr-3 cursor-pointer text-muted">Privacy Policy</span>
                        <span className="mr-3 cursor-pointer text-muted">Terms of Service</span>
                        <span className="cursor-pointer text-muted">Cookie Preferences</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;