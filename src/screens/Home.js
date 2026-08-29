import React, { Component } from 'react';
import Navbar2 from '../components/Navbar2';
import Footer from '../components/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const FEATURED_RESTAURANTS = [
    {
        id: "res-1",
        name: "Artisan Burger & Grill",
        cuisines: "Gourmet Burgers, Crispy Fries, Shakes",
        rating: "4.9",
        reviews: 142,
        eta: "20-30 min",
        image: require("../assets/images/listing-logo03.png"),
        tag: "Free Delivery"
    },
    {
        id: "res-2",
        name: "Bella Italia Pizzeria",
        cuisines: "Woodfired Pizza, Pasta, Tiramisu",
        rating: "4.8",
        reviews: 98,
        eta: "25-35 min",
        image: require("../assets/images/listing-logo09.png"),
        tag: "Popular"
    },
    {
        id: "res-3",
        name: "Tokyo Express & Ramen",
        cuisines: "Tonkotsu Ramen, Gyoza, Sushi",
        rating: "4.9",
        reviews: 215,
        eta: "15-25 min",
        image: require("../assets/images/listing-logo12.png"),
        tag: "Chef's Choice"
    },
    {
        id: "res-4",
        name: "Spice Symphony & BBQ",
        cuisines: "Smoked Brisket, BBQ Wings, Ribs",
        rating: "4.7",
        reviews: 86,
        eta: "30-40 min",
        image: require("../assets/images/listing-logo15.png"),
        tag: "Top Rated"
    }
];

const CATEGORIES = [
    { name: "Burgers", icon: "hamburger" },
    { name: "Pizza", icon: "pizza-slice" },
    { name: "Healthy & Salads", icon: "leaf" },
    { name: "BBQ & Steaks", icon: "fire" },
    { name: "Beverages", icon: "cocktail" }
];

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchQuery: "",
        };
        this.handleSearch = this.handleSearch.bind(this);
        this.handleCategoryClick = this.handleCategoryClick.bind(this);
    }

    handleSearch(e) {
        e.preventDefault();
        const { searchQuery } = this.state;
        if (searchQuery.trim()) {
            this.props.history.push('/restaurants', searchQuery.trim());
        } else {
            this.props.history.push('/restaurants');
        }
    }

    handleCategoryClick(catName) {
        this.props.history.push('/restaurants', catName);
    }

    render() {
        const { searchQuery } = this.state;

        return (
            <div className="d-flex flex-column min-vh-100">
                <Navbar2 history={this.props.history} />

                {/* Hero Section */}
                <section className="hero-wrapper">
                    <div className="container position-relative" style={{ zIndex: 2 }}>
                        <div className="row align-items-center">
                            <div className="col-lg-7 col-md-12 mb-5 mb-lg-0">
                                <div className="hero-pill">
                                    <FontAwesomeIcon icon="bolt" style={{ color: '#f59e0b' }} />
                                    <span>Super Fast 30-Minute Delivery</span>
                                </div>
                                <h1 className="hero-title">
                                    Cravings delivered <br />
                                    <span className="hero-highlight">fresh & hot</span> to your door.
                                </h1>
                                <p className="hero-subtitle">
                                    Discover top-rated restaurants, authentic flavors, and chef-curated dishes delivered in minutes.
                                </p>

                                <form onSubmit={this.handleSearch} className="hero-search-box">
                                    <FontAwesomeIcon icon="search" className="ml-3 text-muted" />
                                    <input
                                        type="text"
                                        className="hero-search-input"
                                        placeholder="Search restaurants, cuisines, or dishes..."
                                        value={searchQuery}
                                        onChange={(e) => this.setState({ searchQuery: e.target.value })}
                                    />
                                    <button type="submit" className="btn btn-warning px-4 py-2 font-weight-bold">
                                        Find Food
                                    </button>
                                </form>

                                <div className="quick-category-pills">
                                    {CATEGORIES.map((cat, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => this.handleCategoryClick(cat.name)}
                                            className="quick-category-pill"
                                        >
                                            {cat.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="col-lg-5 col-md-12 text-center">
                                <img
                                    alt="Delicious Food Basket"
                                    src={require("../assets/images/options-img.png")}
                                    className="img-fluid rounded"
                                    style={{ maxHeight: '380px', objectFit: 'contain' }}
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats Bar */}
                <section className="stats-banner">
                    <div className="container">
                        <div className="row text-center">
                            <div className="col-md-4 col-12 mb-3 mb-md-0">
                                <div className="stat-item">
                                    <div className="stat-icon">
                                        <FontAwesomeIcon icon="store" />
                                    </div>
                                    <div className="text-left">
                                        <div className="stat-number">500+</div>
                                        <div className="stat-label">Partner Restaurants</div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-4 col-12 mb-3 mb-md-0">
                                <div className="stat-item">
                                    <div className="stat-icon">
                                        <FontAwesomeIcon icon="clock" />
                                    </div>
                                    <div className="text-left">
                                        <div className="stat-number">25 Min</div>
                                        <div className="stat-label">Average Delivery Time</div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-4 col-12">
                                <div className="stat-item">
                                    <div className="stat-icon">
                                        <FontAwesomeIcon icon="smile" />
                                    </div>
                                    <div className="text-left">
                                        <div className="stat-number">99.8%</div>
                                        <div className="stat-label">Satisfied Customers</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How It Works */}
                <section className="py-5" style={{ background: '#ffffff' }}>
                    <div className="container py-4">
                        <div className="text-center mb-5">
                            <span className="badge-tag badge-tag-primary mb-2 font-weight-bold">EASY 3-STEP PROCESS</span>
                            <h2 className="font-weight-bold" style={{ fontSize: '2.2rem' }}>How QuickFood Works</h2>
                            <p className="text-muted" style={{ maxWidth: '500px', margin: '0 auto' }}>
                                Enjoy your favorite meals in just three straightforward steps from order to doorstep.
                            </p>
                        </div>

                        <div className="row">
                            <div className="col-lg-4 col-md-4 col-12 mb-4 mb-md-0">
                                <div className="feature-card">
                                    <div className="feature-icon-wrapper">
                                        <img alt="Select Restaurant" src={require("../assets/images/how-to-work2.png")} style={{ height: '36px' }} />
                                    </div>
                                    <h4 className="font-weight-bold mb-2">1. Choose Restaurant</h4>
                                    <p className="text-muted small">
                                        Browse through hundreds of local favorites, verified reviews, and curated menus.
                                    </p>
                                </div>
                            </div>

                            <div className="col-lg-4 col-md-4 col-12 mb-4 mb-md-0">
                                <div className="feature-card">
                                    <div className="feature-icon-wrapper">
                                        <img alt="Order Food" src={require("../assets/images/how-to-work3.png")} style={{ height: '36px' }} />
                                    </div>
                                    <h4 className="font-weight-bold mb-2">2. Pick Your Dishes</h4>
                                    <p className="text-muted small">
                                        Customize your meals, apply exclusive coupon vouchers, and check out seamlessly.
                                    </p>
                                </div>
                            </div>

                            <div className="col-lg-4 col-md-4 col-12">
                                <div className="feature-card">
                                    <div className="feature-icon-wrapper">
                                        <img alt="Fast Delivery" src={require("../assets/images/how-to-work1.png")} style={{ height: '36px' }} />
                                    </div>
                                    <h4 className="font-weight-bold mb-2">3. Fast Delivery</h4>
                                    <p className="text-muted small">
                                        Track your delivery rider in real time until your order arrives fresh and piping hot.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Featured Restaurants */}
                <section className="py-5" style={{ background: 'var(--bg-page)' }}>
                    <div className="container py-3">
                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
                            <div>
                                <h2 className="font-weight-bold mb-1" style={{ fontSize: '2rem' }}>Featured Restaurants</h2>
                                <p className="text-muted mb-0">Hand-picked eateries offering the highest-rated dining experiences.</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => this.props.history.push('/restaurants')}
                                className="btn btn-outline-custom mt-3 mt-md-0"
                            >
                                View All Restaurants
                            </button>
                        </div>

                        <div className="row">
                            {FEATURED_RESTAURANTS.map((res) => (
                                <div className="col-lg-3 col-md-6 col-12 mb-4" key={res.id}>
                                    <div className="restaurant-card">
                                        <div className="restaurant-card-img-wrapper">
                                            <span className="badge-tag badge-tag-primary restaurant-badge-top">
                                                {res.tag}
                                            </span>
                                            <img alt={res.name} src={res.image} className="restaurant-card-img" />
                                            <div className="restaurant-eta-badge">
                                                <FontAwesomeIcon icon="clock" className="mr-1" />
                                                {res.eta}
                                            </div>
                                        </div>

                                        <div className="restaurant-card-body">
                                            <h5 className="restaurant-title">{res.name}</h5>
                                            <p className="restaurant-tags">{res.cuisines}</p>

                                            <div className="restaurant-footer-meta">
                                                <span className="rating-badge">
                                                    <FontAwesomeIcon icon="star" />
                                                    {res.rating} <span className="text-muted font-weight-normal">({res.reviews})</span>
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => this.props.history.push('/restaurants')}
                                                    className="btn btn-warning btn-sm px-3"
                                                >
                                                    Order Now
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Call to Action */}
                <section className="py-5 text-white text-center" style={{ background: 'linear-gradient(135deg, #ff5e3a 0%, #ff2a54 100%)' }}>
                    <div className="container py-4">
                        <h2 className="text-white font-weight-bold mb-3" style={{ fontSize: '2.4rem' }}>
                            Hungry? Your next favorite meal is one click away.
                        </h2>
                        <p className="mb-4 text-white-50" style={{ fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
                            Join thousands of happy food lovers who order with QuickFood daily.
                        </p>
                        <button
                            type="button"
                            onClick={() => this.props.history.push('/restaurants')}
                            className="btn btn-light px-4 py-3 font-weight-bold rounded-lg shadow"
                            style={{ color: 'var(--primary)', fontSize: '1rem', borderRadius: '12px' }}
                        >
                            Explore Full Menu
                        </button>
                    </div>
                </section>

                <Footer />
            </div>
        );
    }
}

export default Home;