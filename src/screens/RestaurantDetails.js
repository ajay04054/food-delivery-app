import React, { Component } from 'react';
import Navbar2 from '../components/Navbar2';
import Footer from '../components/Footer';
import firebase from '../config/firebase';
import { connect } from 'react-redux';
import { orderNow } from '../config/firebase';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const SAMPLE_MENU_ITEMS = [
    {
        id: "menu-sample-1",
        itemTitle: "Signature Double Smash Burger",
        itemIngredients: "Two 100% prime beef patties, aged cheddar, caramelized onions, house truffle aioli on brioche.",
        itemPrice: "650",
        itemImageUrl: require("../assets/images/listing-logo03.png"),
        category: "Burgers"
    },
    {
        id: "menu-sample-2",
        itemTitle: "Truffle & Wild Mushroom Pizza",
        itemIngredients: "Slow-fermented sourdough crust, buffalo mozzarella, wild mushrooms, fresh thyme, truffle glaze.",
        itemPrice: "980",
        itemImageUrl: require("../assets/images/listing-logo09.png"),
        category: "Pizza"
    },
    {
        id: "menu-sample-3",
        itemTitle: "Crispy Peri Peri Chicken Roast",
        itemIngredients: "Half flame-grilled chicken marinated in citrus peri-peri, served with garlic dip and herb rice.",
        itemPrice: "790",
        itemImageUrl: require("../assets/images/listing-logo15.png"),
        category: "Chicken"
    },
    {
        id: "menu-sample-4",
        itemTitle: "Artisan Iced Caramel Cold Brew",
        itemIngredients: "Single-origin slow steep cold brew, silky whole milk, salted caramel drizzle, crushed ice.",
        itemPrice: "340",
        itemImageUrl: require("../assets/images/listing-logo12.png"),
        category: "Beverages"
    }
];

class RestaurantDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: 'menu',
            menuItemsList: [],
            cartItemsList: [],
            totalPrice: 0,
            searchMenuQuery: "",
            selectedCategory: "All",
            promoCode: "",
            discountAmount: 0,
            promoApplied: false,
            deliveryFee: 100,
            specialNotes: "",
        };
        this.fetchMenuItems = this.fetchMenuItems.bind(this);
        this.addToCart = this.addToCart.bind(this);
        this.removeCartItem = this.removeCartItem.bind(this);
        this.applyPromoCode = this.applyPromoCode.bind(this);
        this.handleConfirmOrderBtn = this.handleConfirmOrderBtn.bind(this);
    }

    componentDidMount() {
        const state = this.props.location && this.props.location.state;
        if (state) {
            this.setState({ resDetails: state }, () => {
                this.fetchMenuItems();
            });
        } else {
            this.props.history.push('/restaurants');
        }
    }

    static getDerivedStateFromProps(props, state) {
        const locationState = props.location && props.location.state;
        return {
            resDetails: locationState || state.resDetails,
            userDetails: props.user,
        };
    }

    fetchMenuItems() {
        const { resDetails } = this.state;
        if (!resDetails || !resDetails.id) return;

        // If it's a demo restaurant ID, use sample items
        if (String(resDetails.id).startsWith("demo-res")) {
            this.setState({ menuItemsList: SAMPLE_MENU_ITEMS });
            return;
        }

        try {
            firebase.firestore().collection('users').doc(resDetails.id).collection("menuItems").onSnapshot(snapshot => {
                const list = [];
                snapshot.forEach(doc => {
                    list.push({ id: doc.id, ...doc.data() });
                });
                this.setState({
                    menuItemsList: list.length > 0 ? list : SAMPLE_MENU_ITEMS
                });
            }, () => {
                this.setState({ menuItemsList: SAMPLE_MENU_ITEMS });
            });
        } catch (e) {
            this.setState({ menuItemsList: SAMPLE_MENU_ITEMS });
        }
    }

    addToCart(item) {
        if (!item) return;
        this.setState(prevState => {
            const updatedCart = [...prevState.cartItemsList, item];
            const updatedTotal = prevState.totalPrice + Number(item.itemPrice || 0);
            return {
                cartItemsList: updatedCart,
                totalPrice: updatedTotal
            };
        });
    }

    removeCartItem(index) {
        this.setState(prevState => {
            const target = prevState.cartItemsList[index];
            const updatedCart = [...prevState.cartItemsList];
            updatedCart.splice(index, 1);
            const updatedTotal = Math.max(0, prevState.totalPrice - Number(target ? target.itemPrice : 0));
            return {
                cartItemsList: updatedCart,
                totalPrice: updatedTotal
            };
        });
    }

    applyPromoCode(e) {
        e.preventDefault();
        const { promoCode, totalPrice } = this.state;
        const code = promoCode.trim().toUpperCase();

        if (code === "QUICKFOOD20") {
            const discount = Math.round(totalPrice * 0.20);
            this.setState({
                discountAmount: discount,
                promoApplied: true
            });
            Swal.fire({
                title: 'Coupon Applied!',
                text: '20% discount has been applied to your order subtotal.',
                type: 'success'
            });
        } else if (code === "FREESHIP") {
            this.setState({
                deliveryFee: 0,
                promoApplied: true
            });
            Swal.fire({
                title: 'Free Delivery Applied!',
                text: 'Standard delivery fee has been waived.',
                type: 'success'
            });
        } else {
            Swal.fire({
                title: 'Invalid Coupon',
                text: 'Use code QUICKFOOD20 (20% off) or FREESHIP (Free Delivery).',
                type: 'warning'
            });
        }
    }

    async handleConfirmOrderBtn() {
        const { cartItemsList, totalPrice, discountAmount, deliveryFee, resDetails, userDetails } = this.state;
        const history = this.props.history;

        if (!userDetails || !userDetails.isLogin) {
            Swal.fire({
                title: 'Sign In Required',
                text: 'Please sign in to place and track your food order.',
                type: 'info',
                showCancelButton: true,
                confirmButtonText: 'Go to Sign In',
            }).then((result) => {
                if (result.value) {
                    history.push('/login');
                }
            });
            return;
        }

        if (userDetails.isRestaurant) {
            Swal.fire({
                title: 'Restaurant Account',
                text: 'Restaurant accounts cannot place customer orders. Please sign in with a customer account.',
                type: 'warning'
            });
            return;
        }

        if (cartItemsList.length === 0) {
            Swal.fire({
                title: 'Basket is Empty',
                text: 'Please add at least one delicious food item to your cart before proceeding.',
                type: 'warning'
            });
            return;
        }

        const netTotal = Math.max(0, totalPrice - discountAmount) + (totalPrice > 1000 ? 0 : deliveryFee);

        try {
            await orderNow(cartItemsList, netTotal, resDetails, userDetails, history);
            Swal.fire({
                title: 'Order Placed Successfully!',
                text: 'The restaurant is preparing your meal. Track live updates in My Orders.',
                type: 'success'
            }).then(() => {
                history.push('/my-orders');
            });
        } catch (error) {
            Swal.fire({
                title: 'Unable to Place Order',
                text: error ? String(error) : 'Please check your connection and try again.',
                type: 'error'
            });
        }
    }

    render() {
        const {
            activeTab,
            resDetails,
            menuItemsList,
            cartItemsList,
            totalPrice,
            discountAmount,
            deliveryFee,
            promoCode,
            searchMenuQuery,
            selectedCategory
        } = this.state;

        if (!resDetails) {
            return (
                <div className="d-flex flex-column min-vh-100">
                    <Navbar2 history={this.props.history} />
                    <div className="container py-5 text-center my-auto">
                        <p className="text-muted">Loading restaurant details...</p>
                    </div>
                    <Footer />
                </div>
            );
        }

        const typeOfFoodText = resDetails.typeOfFood && Array.isArray(resDetails.typeOfFood)
            ? resDetails.typeOfFood.join(', ')
            : (resDetails.typeOfFood || 'Multi-Cuisine');

        const activeDeliveryFee = totalPrice > 1000 ? 0 : deliveryFee;
        const finalNetTotal = Math.max(0, totalPrice - discountAmount) + (cartItemsList.length > 0 ? activeDeliveryFee : 0);

        // Filter menu items by search and category
        const displayItems = menuItemsList.filter(item => {
            const matchesQuery = !searchMenuQuery.trim() ||
                (item.itemTitle && item.itemTitle.toLowerCase().includes(searchMenuQuery.toLowerCase())) ||
                (item.itemIngredients && item.itemIngredients.toLowerCase().includes(searchMenuQuery.toLowerCase()));
            const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
            return matchesQuery && matchesCategory;
        });

        const categories = ["All", "Burgers", "Pizza", "Chicken", "Beverages"];

        return (
            <div className="d-flex flex-column min-vh-100">
                <Navbar2 history={this.props.history} />

                {/* Restaurant Banner Header */}
                <section className="py-5" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: '#fff' }}>
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-lg-2 col-md-3 col-12 text-center text-md-left mb-3 mb-md-0">
                                <img
                                    className="p-2 bg-white rounded shadow-sm"
                                    alt={resDetails.userName}
                                    style={{ width: "110px", height: "110px", objectFit: "contain" }}
                                    src={resDetails.userProfileImageUrl || require("../assets/images/listing-logo03.png")}
                                />
                            </div>
                            <div className="col-lg-7 col-md-6 col-12 text-center text-md-left">
                                <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-start gap-2 mb-2">
                                    <span className="badge-tag badge-tag-primary">Open Now</span>
                                    <span className="badge-tag badge-tag-success">Verified Kitchen</span>
                                </div>
                                <h1 className="text-white font-weight-bold mb-1" style={{ fontSize: '2.2rem' }}>
                                    {resDetails.userName}
                                </h1>
                                <p className="text-muted mb-2">{typeOfFoodText}</p>
                                <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-start gap-3" style={{ fontSize: '0.88rem', color: '#cbd5e1' }}>
                                    <span className="mr-3">
                                        <FontAwesomeIcon icon="star" className="text-warning mr-1" />
                                        <b>{resDetails.rating || '4.9'}</b> (120+ reviews)
                                    </span>
                                    <span className="mr-3">
                                        <FontAwesomeIcon icon="clock" className="text-primary mr-1" />
                                        20-30 min
                                    </span>
                                    <span>
                                        <FontAwesomeIcon icon="map-marker-alt" className="text-danger mr-1" />
                                        1.5 km away
                                    </span>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-3 col-12 text-center text-md-right mt-3 mt-md-0">
                                <div className="p-3 rounded" style={{ background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
                                    <div className="small text-muted mb-1">Coupon Promo</div>
                                    <div className="font-weight-bold text-warning" style={{ fontSize: '1.1rem' }}>QUICKFOOD20</div>
                                    <div className="small text-muted">Use for 20% off subtotal</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Main Content Area */}
                <main className="py-5 flex-grow-1" style={{ background: 'var(--bg-page)' }}>
                    <div className="container">
                        <div className="row">
                            {/* Left Main Section (Tabs, Menu, Reviews) */}
                            <section className="col-lg-8 col-12 mb-4">
                                {/* Navigation Tabs */}
                                <div className="bg-white rounded-lg p-2 mb-4 d-flex border shadow-sm" style={{ gap: '8px' }}>
                                    <button
                                        type="button"
                                        onClick={() => this.setState({ activeTab: 'menu' })}
                                        className={`btn flex-fill font-weight-bold ${activeTab === 'menu' ? 'btn-warning text-white' : 'btn-light text-muted'}`}
                                    >
                                        <FontAwesomeIcon icon="concierge-bell" className="mr-2" />
                                        Menu
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => this.setState({ activeTab: 'reviews' })}
                                        className={`btn flex-fill font-weight-bold ${activeTab === 'reviews' ? 'btn-warning text-white' : 'btn-light text-muted'}`}
                                    >
                                        <FontAwesomeIcon icon="comment-alt" className="mr-2" />
                                        Reviews (4.9)
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => this.setState({ activeTab: 'info' })}
                                        className={`btn flex-fill font-weight-bold ${activeTab === 'info' ? 'btn-warning text-white' : 'btn-light text-muted'}`}
                                    >
                                        <FontAwesomeIcon icon="info-circle" className="mr-2" />
                                        Info & Hours
                                    </button>
                                </div>

                                {activeTab === 'menu' && (
                                    <div>
                                        {/* Category Pills & Search */}
                                        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 mb-4">
                                            <div className="d-flex flex-wrap gap-2 mb-2 mb-sm-0">
                                                {categories.map((cat, idx) => (
                                                    <button
                                                        key={idx}
                                                        type="button"
                                                        onClick={() => this.setState({ selectedCategory: cat })}
                                                        className={`btn btn-sm px-3 mr-2 mb-1 ${selectedCategory === cat ? 'btn-warning' : 'btn-outline-secondary'}`}
                                                        style={{ borderRadius: 'var(--radius-full)' }}
                                                    >
                                                        {cat}
                                                    </button>
                                                ))}
                                            </div>

                                            <div className="position-relative" style={{ minWidth: '200px' }}>
                                                <input
                                                    type="text"
                                                    className="form-control form-control-sm"
                                                    placeholder="Search dish..."
                                                    value={searchMenuQuery}
                                                    onChange={(e) => this.setState({ searchMenuQuery: e.target.value })}
                                                    style={{ borderRadius: 'var(--radius-sm)' }}
                                                />
                                            </div>
                                        </div>

                                        {/* Food Items List */}
                                        {displayItems.length === 0 ? (
                                            <div className="bg-white p-5 text-center rounded border">
                                                <p className="text-muted mb-0">No dishes match your search criteria.</p>
                                            </div>
                                        ) : (
                                            displayItems.map((item) => (
                                                <div className="food-card" key={item.id}>
                                                    <img
                                                        alt={item.itemTitle}
                                                        src={item.itemImageUrl || require("../assets/images/listing-logo03.png")}
                                                        className="food-card-thumb"
                                                    />
                                                    <div className="food-card-info">
                                                        <h6 className="food-card-title">{item.itemTitle}</h6>
                                                        <p className="food-card-desc">{item.itemIngredients}</p>
                                                        <div className="food-card-price">RS. {item.itemPrice}</div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => this.addToCart(item)}
                                                        className="btn-add-food"
                                                    >
                                                        <FontAwesomeIcon icon="plus" />
                                                        <span>Add</span>
                                                    </button>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}

                                {activeTab === 'reviews' && (
                                    <div className="bg-white rounded-lg p-4 border">
                                        <h5 className="font-weight-bold mb-3">Customer Ratings & Reviews</h5>
                                        <div className="p-3 mb-3 rounded bg-light border">
                                            <div className="d-flex align-items-center mb-1">
                                                <b className="mr-2">Sarah Jenkins</b>
                                                <span className="text-warning small mr-2">
                                                    <FontAwesomeIcon icon="star" />
                                                    <FontAwesomeIcon icon="star" />
                                                    <FontAwesomeIcon icon="star" />
                                                    <FontAwesomeIcon icon="star" />
                                                    <FontAwesomeIcon icon="star" />
                                                </span>
                                                <small className="text-muted ml-auto">2 days ago</small>
                                            </div>
                                            <p className="small text-muted mb-0">
                                                "The smash burger was incredible! Super juicy patties and arrived hot in 20 minutes."
                                            </p>
                                        </div>

                                        <div className="p-3 rounded bg-light border">
                                            <div className="d-flex align-items-center mb-1">
                                                <b className="mr-2">David Miller</b>
                                                <span className="text-warning small mr-2">
                                                    <FontAwesomeIcon icon="star" />
                                                    <FontAwesomeIcon icon="star" />
                                                    <FontAwesomeIcon icon="star" />
                                                    <FontAwesomeIcon icon="star" />
                                                    <FontAwesomeIcon icon="star" />
                                                </span>
                                                <small className="text-muted ml-auto">1 week ago</small>
                                            </div>
                                            <p className="small text-muted mb-0">
                                                "High quality ingredients, neat packaging, and accurate tracking. Will order again!"
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'info' && (
                                    <div className="bg-white rounded-lg p-4 border">
                                        <h5 className="font-weight-bold mb-3">About {resDetails.userName}</h5>
                                        <p className="text-muted small">
                                            Fresh artisan meals prepared to order daily. We source our meats, produce, and seasonings locally to ensure maximum freshness and peak flavor.
                                        </p>
                                        <hr />
                                        <div className="row">
                                            <div className="col-sm-6 mb-2">
                                                <b className="small text-dark">Operating Hours:</b>
                                                <p className="small text-muted mb-0">11:00 AM – 11:30 PM (Mon–Sun)</p>
                                            </div>
                                            <div className="col-sm-6 mb-2">
                                                <b className="small text-dark">Hygiene & Safety:</b>
                                                <p className="small text-muted mb-0">100% Contactless Delivery, Sealed Packaging</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </section>

                            {/* Right Cart Sidebar */}
                            <aside className="col-lg-4 col-12">
                                <div className="filter-card position-sticky" style={{ top: '90px' }}>
                                    <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
                                        <h6 className="font-weight-bold mb-0">
                                            <FontAwesomeIcon icon="shopping-bag" className="mr-2" style={{ color: 'var(--primary)' }} />
                                            Your Order Basket
                                        </h6>
                                        <span className="badge badge-pill badge-danger">{cartItemsList.length} items</span>
                                    </div>

                                    {cartItemsList.length === 0 ? (
                                        <div className="py-4 text-center text-muted">
                                            <FontAwesomeIcon icon="shopping-basket" className="mb-2" style={{ fontSize: '2rem', opacity: 0.4 }} />
                                            <p className="small mb-0">Your basket is currently empty.<br />Add items to get started!</p>
                                        </div>
                                    ) : (
                                        <div>
                                            <div className="mb-3" style={{ maxHeight: '220px', overflowY: 'auto' }}>
                                                {cartItemsList.map((cartItem, idx) => (
                                                    <div className="d-flex justify-content-between align-items-center py-2 border-bottom" key={idx}>
                                                        <div className="pr-2" style={{ flex: 1 }}>
                                                            <div className="small font-weight-bold">{cartItem.itemTitle}</div>
                                                            <div className="small text-muted">RS. {cartItem.itemPrice}</div>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => this.removeCartItem(idx)}
                                                            className="btn btn-sm btn-link text-danger p-0 ml-2"
                                                            title="Remove item"
                                                        >
                                                            <FontAwesomeIcon icon="trash-alt" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Promo Code Input */}
                                            <form onSubmit={this.applyPromoCode} className="d-flex mb-3">
                                                <input
                                                    type="text"
                                                    className="form-control form-control-sm"
                                                    placeholder="Promo Code (e.g. QUICKFOOD20)"
                                                    value={promoCode}
                                                    onChange={(e) => this.setState({ promoCode: e.target.value })}
                                                    style={{ borderRadius: '6px 0 0 6px', textTransform: 'uppercase' }}
                                                />
                                                <button
                                                    type="submit"
                                                    className="btn btn-sm btn-dark px-3 font-weight-bold"
                                                    style={{ borderRadius: '0 6px 6px 0' }}
                                                >
                                                    Apply
                                                </button>
                                            </form>

                                            {/* Price Breakdown */}
                                            <div className="small text-muted mb-3">
                                                <div className="d-flex justify-content-between mb-1">
                                                    <span>Subtotal:</span>
                                                    <span>RS. {totalPrice}</span>
                                                </div>
                                                {discountAmount > 0 && (
                                                    <div className="d-flex justify-content-between text-success mb-1">
                                                        <span>Coupon Discount:</span>
                                                        <span>- RS. {discountAmount}</span>
                                                    </div>
                                                )}
                                                <div className="d-flex justify-content-between mb-1">
                                                    <span>Delivery Fee:</span>
                                                    <span>{activeDeliveryFee === 0 ? <b className="text-success">FREE</b> : `RS. ${activeDeliveryFee}`}</span>
                                                </div>
                                                <hr className="my-2" />
                                                <div className="d-flex justify-content-between font-weight-bold text-dark" style={{ fontSize: '1.05rem' }}>
                                                    <span>Total Amount:</span>
                                                    <span style={{ color: 'var(--primary)' }}>RS. {finalNetTotal}</span>
                                                </div>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={this.handleConfirmOrderBtn}
                                                className="btn btn-warning btn-block py-2 font-weight-bold text-uppercase"
                                            >
                                                Place Order (RS. {finalNetTotal})
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </aside>
                        </div>
                    </div>
                </main>

                <Footer />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    user: state.user,
});

export default connect(mapStateToProps, null)(RestaurantDetails);