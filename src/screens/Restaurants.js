import React, { Component } from 'react';
import Navbar2 from '../components/Navbar2';
import Footer from '../components/Footer';
import { connect } from 'react-redux';
import { restaurant_list } from '../store/action';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const DEFAULT_CATEGORIES = [
    "Burgers",
    "Pizza",
    "BB.Q",
    "Chicken Roast",
    "Beef Roast",
    "Chinese Soup",
    "Cold Coffee",
    "Apple Juice",
    "Fresh Juice",
    "Fast Food",
    "Desserts"
];

const SAMPLE_RESTAURANTS = [
    {
        id: "demo-res-1",
        userName: "Gourmet Burger Bar",
        userProfileImageUrl: require("../assets/images/listing-logo03.png"),
        typeOfFood: ["Burgers", "Fast Food", "Cold Coffee"],
        rating: 4.9,
        reviewsCount: 124,
        deliveryTime: "20-30 min",
        minOrder: "RS. 300"
    },
    {
        id: "demo-res-2",
        userName: "La Pizzeria & Bistro",
        userProfileImageUrl: require("../assets/images/listing-logo09.png"),
        typeOfFood: ["Pizza", "Chicken Roast", "Apple Juice"],
        rating: 4.8,
        reviewsCount: 89,
        deliveryTime: "25-35 min",
        minOrder: "RS. 450"
    },
    {
        id: "demo-res-3",
        userName: "The Smokehouse BBQ",
        userProfileImageUrl: require("../assets/images/listing-logo15.png"),
        typeOfFood: ["BB.Q", "Beef Roast", "Fresh Juice"],
        rating: 4.7,
        reviewsCount: 156,
        deliveryTime: "30-45 min",
        minOrder: "RS. 500"
    },
    {
        id: "demo-res-4",
        userName: "Tokyo Express Kitchen",
        userProfileImageUrl: require("../assets/images/listing-logo12.png"),
        typeOfFood: ["Chinese Soup", "Fast Food"],
        rating: 4.9,
        reviewsCount: 210,
        deliveryTime: "15-25 min",
        minOrder: "RS. 350"
    }
];

class Restaurants extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedCategories: [],
            searchQuery: "",
            sortBy: "best_match",
            favorites: {},
        };
        this.handleSearchChange = this.handleSearchChange.bind(this);
        this.handleCategoryToggle = this.handleCategoryToggle.bind(this);
        this.handleSortChange = this.handleSortChange.bind(this);
        this.toggleFavorite = this.toggleFavorite.bind(this);
        this.handleViewMenu = this.handleViewMenu.bind(this);
    }

    componentDidMount() {
        this.props.restaurant_list();
        const incomingQuery = this.props.location && this.props.location.state;
        if (incomingQuery && typeof incomingQuery === 'string') {
            this.setState({ searchQuery: incomingQuery });
        }
    }

    handleSearchChange(e) {
        this.setState({ searchQuery: e.target.value });
    }

    handleCategoryToggle(category) {
        this.setState(prevState => {
            const exists = prevState.selectedCategories.includes(category);
            const updated = exists
                ? prevState.selectedCategories.filter(c => c !== category)
                : [...prevState.selectedCategories, category];
            return { selectedCategories: updated };
        });
    }

    handleSortChange(sortKey) {
        this.setState({ sortBy: sortKey });
    }

    toggleFavorite(resId) {
        this.setState(prevState => ({
            favorites: {
                ...prevState.favorites,
                [resId]: !prevState.favorites[resId]
            }
        }));
    }

    handleViewMenu(restaurant) {
        this.props.history.push('/restaurant-details', restaurant);
    }

    getFilteredRestaurants() {
        const { restaurantList } = this.props;
        const { searchQuery, selectedCategories, sortBy } = this.state;

        let list = (restaurantList && restaurantList.length > 0) ? restaurantList : SAMPLE_RESTAURANTS;

        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            list = list.filter(res => {
                const nameMatch = res.userName && res.userName.toLowerCase().includes(query);
                const foods = Array.isArray(res.typeOfFood) ? res.typeOfFood.join(' ').toLowerCase() : '';
                const foodMatch = foods.includes(query);
                return nameMatch || foodMatch;
            });
        }

        // Filter by categories
        if (selectedCategories.length > 0) {
            list = list.filter(res => {
                if (!res.typeOfFood || !Array.isArray(res.typeOfFood)) return false;
                return res.typeOfFood.some(food =>
                    selectedCategories.some(cat => cat.toLowerCase() === food.toLowerCase())
                );
            });
        }

        // Sort
        const sorted = [...list];
        if (sortBy === "rating") {
            sorted.sort((a, b) => (b.rating || 4.5) - (a.rating || 4.5));
        } else if (sortBy === "alphabetical") {
            sorted.sort((a, b) => (a.userName || '').localeCompare(b.userName || ''));
        }

        return sorted;
    }

    render() {
        const { searchQuery, selectedCategories, sortBy, favorites } = this.state;
        const filteredList = this.getFilteredRestaurants();

        return (
            <div className="d-flex flex-column min-vh-100">
                <Navbar2 history={this.props.history} />

                {/* Subheader Banner */}
                <section className="py-5" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: '#fff' }}>
                    <div className="container text-center">
                        <span className="hero-pill mb-3">
                            <FontAwesomeIcon icon="utensils" className="mr-2" style={{ color: 'var(--primary)' }} />
                            Curated Selection
                        </span>
                        <h1 className="font-weight-bold text-white mb-2" style={{ fontSize: '2.5rem' }}>
                            Explore Restaurants & Cuisines
                        </h1>
                        <p className="text-muted" style={{ maxWidth: '540px', margin: '0 auto 24px' }}>
                            Find the best rated local kitchens, cafes, and restaurants open for instant delivery.
                        </p>

                        <div className="mx-auto" style={{ maxWidth: '580px' }}>
                            <div className="hero-search-box">
                                <FontAwesomeIcon icon="search" className="ml-3 text-muted" />
                                <input
                                    type="text"
                                    className="hero-search-input"
                                    placeholder="Search by restaurant name or dish..."
                                    value={searchQuery}
                                    onChange={this.handleSearchChange}
                                />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={() => this.setState({ searchQuery: '' })}
                                        className="btn btn-sm btn-link text-muted mr-2"
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Main Content Area */}
                <main className="py-5 flex-grow-1" style={{ background: 'var(--bg-page)' }}>
                    <div className="container">
                        <div className="row">
                            {/* Left Filters Sidebar */}
                            <aside className="col-lg-3 col-md-4 col-12 mb-4">
                                <div className="filter-card mb-4">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h6 className="filter-group-title mb-0">Cuisines & Types</h6>
                                        {selectedCategories.length > 0 && (
                                            <button
                                                type="button"
                                                onClick={() => this.setState({ selectedCategories: [] })}
                                                className="btn btn-sm btn-link p-0 text-danger"
                                                style={{ fontSize: '0.8rem' }}
                                            >
                                                Reset
                                            </button>
                                        )}
                                    </div>

                                    <div>
                                        {DEFAULT_CATEGORIES.map((cat, idx) => {
                                            const isSelected = selectedCategories.includes(cat);
                                            return (
                                                <div
                                                    key={idx}
                                                    onClick={() => this.handleCategoryToggle(cat)}
                                                    className="filter-chip-item"
                                                    style={{
                                                        backgroundColor: isSelected ? 'var(--primary-light)' : 'transparent',
                                                        color: isSelected ? 'var(--primary)' : 'var(--slate)',
                                                        fontWeight: isSelected ? '700' : '500'
                                                    }}
                                                >
                                                    <span>{cat}</span>
                                                    <input
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        onChange={() => {}}
                                                        style={{ accentColor: 'var(--primary)' }}
                                                    />
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </aside>

                            {/* Center/Right Restaurant Listings */}
                            <section className="col-lg-9 col-md-8 col-12">
                                <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-4">
                                    <h4 className="font-weight-bold mb-2 mb-sm-0" style={{ fontSize: '1.4rem' }}>
                                        {filteredList.length} {filteredList.length === 1 ? 'Restaurant' : 'Restaurants'} Available
                                    </h4>

                                    <div className="d-flex align-items-center gap-2">
                                        <span className="text-muted small mr-2 font-weight-bold">Sort by:</span>
                                        <select
                                            className="form-control form-control-sm"
                                            value={sortBy}
                                            onChange={(e) => this.handleSortChange(e.target.value)}
                                            style={{ width: '160px', borderRadius: 'var(--radius-sm)' }}
                                        >
                                            <option value="best_match">Best Match</option>
                                            <option value="rating">Highest Rated</option>
                                            <option value="alphabetical">Alphabetical (A-Z)</option>
                                        </select>
                                    </div>
                                </div>

                                {filteredList.length === 0 ? (
                                    <div className="bg-white rounded-lg p-5 text-center border">
                                        <div className="mb-3 text-muted" style={{ fontSize: '2.5rem' }}>
                                            <FontAwesomeIcon icon="search" />
                                        </div>
                                        <h5 className="font-weight-bold">No restaurants found</h5>
                                        <p className="text-muted small mb-3">
                                            We couldn't find any matches for your current filter and search criteria.
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => this.setState({ searchQuery: '', selectedCategories: [] })}
                                            className="btn btn-warning btn-sm px-4"
                                        >
                                            Reset Filters
                                        </button>
                                    </div>
                                ) : (
                                    <div className="row">
                                        {filteredList.map((res) => {
                                            const foodsText = Array.isArray(res.typeOfFood)
                                                ? res.typeOfFood.join(', ')
                                                : (res.typeOfFood || 'Multi-Cuisine');
                                            const isFav = favorites[res.id];

                                            return (
                                                <div className="col-lg-6 col-12 mb-4" key={res.id}>
                                                    <div className="restaurant-card">
                                                        <div className="restaurant-card-img-wrapper" style={{ height: '180px' }}>
                                                            <span className="badge-tag badge-tag-primary restaurant-badge-top">
                                                                Fast Delivery
                                                            </span>
                                                            <img
                                                                alt={res.userName}
                                                                src={res.userProfileImageUrl || require("../assets/images/listing-logo03.png")}
                                                                className="restaurant-card-img"
                                                            />
                                                            <div className="restaurant-eta-badge">
                                                                <FontAwesomeIcon icon="clock" className="mr-1" />
                                                                {res.deliveryTime || '20-30 min'}
                                                            </div>
                                                        </div>

                                                        <div className="restaurant-card-body">
                                                            <div className="d-flex justify-content-between align-items-start mb-2">
                                                                <h5 className="restaurant-title mb-0">{res.userName}</h5>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => this.toggleFavorite(res.id)}
                                                                    className="btn btn-link p-0 border-0"
                                                                    style={{ color: isFav ? '#ef4444' : '#cbd5e1', fontSize: '1.1rem' }}
                                                                    title="Save to favorites"
                                                                >
                                                                    <FontAwesomeIcon icon="heart" />
                                                                </button>
                                                            </div>

                                                            <p className="restaurant-tags">{foodsText}</p>

                                                            <div className="restaurant-footer-meta">
                                                                <span className="rating-badge">
                                                                    <FontAwesomeIcon icon="star" />
                                                                    {res.rating || '4.8'}
                                                                    <span className="text-muted font-weight-normal">
                                                                        ({res.reviewsCount || 18})
                                                                    </span>
                                                                </span>

                                                                <button
                                                                    type="button"
                                                                    onClick={() => this.handleViewMenu(res)}
                                                                    className="btn btn-warning btn-sm px-3"
                                                                >
                                                                    View Menu
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </section>
                        </div>
                    </div>
                </main>

                <Footer />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    restaurantList: state.restaurantList,
});

const mapDispatchToProps = dispatch => ({
    restaurant_list: () => dispatch(restaurant_list()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Restaurants);

