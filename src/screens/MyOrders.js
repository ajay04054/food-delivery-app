import React, { Component } from 'react';
import Navbar2 from '../components/Navbar2';
import Footer from '../components/Footer';
import { connect } from 'react-redux';
import { my_order } from '../store/action';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const SAMPLE_CUSTOMER_ORDERS = [
    {
        id: "demo-order-101",
        userName: "Gourmet Burger Bar",
        status: "IN PROGRESS",
        createdAt: "Today, 12:15 PM",
        totalPrice: 1390,
        itemsList: [
            {
                itemTitle: "Signature Double Smash Burger",
                itemIngredients: "Two 100% prime beef patties, aged cheddar, truffle aioli",
                itemPrice: "650",
                itemImageUrl: require("../assets/images/listing-logo03.png")
            },
            {
                itemTitle: "Crispy Peri Peri Chicken Roast",
                itemIngredients: "Flame grilled chicken with peri-peri glaze & fries",
                itemPrice: "740",
                itemImageUrl: require("../assets/images/listing-logo15.png")
            }
        ]
    },
    {
        id: "demo-order-100",
        userName: "Bella Italia Pizzeria",
        status: "DELIVERED",
        createdAt: "Yesterday, 8:40 PM",
        totalPrice: 980,
        itemsList: [
            {
                itemTitle: "Truffle & Wild Mushroom Pizza",
                itemIngredients: "Sourdough crust, buffalo mozzarella, wild mushrooms",
                itemPrice: "980",
                itemImageUrl: require("../assets/images/listing-logo09.png")
            }
        ]
    }
];

class MyOrders extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeFilter: "ALL",
        };
    }

    componentDidMount() {
        this.props.my_order();
    }

    getOrderStepIndex(status) {
        switch (status) {
            case "PENDING":
                return 1;
            case "IN PROGRESS":
                return 2;
            case "OUT_FOR_DELIVERY":
                return 3;
            case "DELIVERED":
                return 4;
            default:
                return 1;
        }
    }

    renderStepper(status) {
        const step = this.getOrderStepIndex(status);
        const progressWidth = step === 1 ? '15%' : step === 2 ? '50%' : step === 3 ? '80%' : '100%';

        return (
            <div className="stepper-track">
                <div className="stepper-track-progress" style={{ width: progressWidth }}></div>

                <div className={`stepper-step ${step >= 1 ? (step === 1 ? 'active' : 'completed') : ''}`}>
                    <div className="stepper-icon">
                        <FontAwesomeIcon icon={step > 1 ? "check" : "file-alt"} />
                    </div>
                    <span className="stepper-label">Order Placed</span>
                </div>

                <div className={`stepper-step ${step >= 2 ? (step === 2 ? 'active' : 'completed') : ''}`}>
                    <div className="stepper-icon">
                        <FontAwesomeIcon icon={step > 2 ? "check" : "fire"} />
                    </div>
                    <span className="stepper-label">Kitchen Preparing</span>
                </div>

                <div className={`stepper-step ${step >= 3 ? (step === 3 ? 'active' : 'completed') : ''}`}>
                    <div className="stepper-icon">
                        <FontAwesomeIcon icon={step > 3 ? "check" : "motorcycle"} />
                    </div>
                    <span className="stepper-label">Out for Delivery</span>
                </div>

                <div className={`stepper-step ${step >= 4 ? 'completed' : ''}`}>
                    <div className="stepper-icon">
                        <FontAwesomeIcon icon={step >= 4 ? "check" : "home"} />
                    </div>
                    <span className="stepper-label">Delivered</span>
                </div>
            </div>
        );
    }

    render() {
        const { myOrder } = this.props;
        const { activeFilter } = this.state;

        // Use real orders if present, otherwise sample orders for realistic preview
        let ordersList = [];
        if (myOrder && Object.keys(myOrder).length > 0) {
            ordersList = Object.keys(myOrder).map(key => ({ id: key, ...myOrder[key] }));
        } else {
            ordersList = SAMPLE_CUSTOMER_ORDERS;
        }

        // Apply active tab filter
        if (activeFilter === "IN_PROGRESS") {
            ordersList = ordersList.filter(o => o.status === "PENDING" || o.status === "IN PROGRESS");
        } else if (activeFilter === "DELIVERED") {
            ordersList = ordersList.filter(o => o.status === "DELIVERED");
        }

        return (
            <div className="d-flex flex-column min-vh-100">
                <Navbar2 history={this.props.history} />

                {/* Subheader */}
                <section className="py-5" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: '#fff' }}>
                    <div className="container">
                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center">
                            <div>
                                <span className="hero-pill mb-2">
                                    <FontAwesomeIcon icon="shopping-bag" className="mr-2" style={{ color: 'var(--primary)' }} />
                                    Live Order Tracking
                                </span>
                                <h1 className="text-white font-weight-bold mb-1" style={{ fontSize: '2.2rem' }}>
                                    My Orders
                                </h1>
                                <p className="text-muted mb-0">
                                    Track real-time kitchen progress, delivery driver location, and past order receipts.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => this.props.history.push('/restaurants')}
                                className="btn btn-warning mt-3 mt-md-0 px-4 py-2 font-weight-bold"
                            >
                                Order More Food
                            </button>
                        </div>
                    </div>
                </section>

                {/* Main Content Area */}
                <main className="py-5 flex-grow-1" style={{ background: 'var(--bg-page)' }}>
                    <div className="container">
                        {/* Status Filter Tabs */}
                        <div className="d-flex gap-2 mb-4">
                            <button
                                type="button"
                                onClick={() => this.setState({ activeFilter: "ALL" })}
                                className={`btn btn-sm px-4 mr-2 ${activeFilter === "ALL" ? 'btn-warning text-white font-weight-bold' : 'btn-white bg-white border text-muted'}`}
                                style={{ borderRadius: 'var(--radius-full)' }}
                            >
                                All Orders
                            </button>
                            <button
                                type="button"
                                onClick={() => this.setState({ activeFilter: "IN_PROGRESS" })}
                                className={`btn btn-sm px-4 mr-2 ${activeFilter === "IN_PROGRESS" ? 'btn-warning text-white font-weight-bold' : 'btn-white bg-white border text-muted'}`}
                                style={{ borderRadius: 'var(--radius-full)' }}
                            >
                                Active & In Progress
                            </button>
                            <button
                                type="button"
                                onClick={() => this.setState({ activeFilter: "DELIVERED" })}
                                className={`btn btn-sm px-4 ${activeFilter === "DELIVERED" ? 'btn-warning text-white font-weight-bold' : 'btn-white bg-white border text-muted'}`}
                                style={{ borderRadius: 'var(--radius-full)' }}
                            >
                                Completed Deliveries
                            </button>
                        </div>

                        {/* Order Cards List */}
                        {ordersList.length === 0 ? (
                            <div className="bg-white rounded-lg p-5 text-center border">
                                <FontAwesomeIcon icon="clipboard-list" className="text-muted mb-3" style={{ fontSize: '2.5rem', opacity: 0.4 }} />
                                <h5 className="font-weight-bold">No orders found</h5>
                                <p className="text-muted small mb-4">You have no orders in this category yet.</p>
                                <button
                                    type="button"
                                    onClick={() => this.props.history.push('/restaurants')}
                                    className="btn btn-warning px-4"
                                >
                                    Explore Restaurants
                                </button>
                            </div>
                        ) : (
                            ordersList.map((order) => {
                                const isDelivered = order.status === "DELIVERED";
                                const statusBadgeClass = isDelivered ? "badge-tag-success" : "badge-tag-warning";
                                const items = Array.isArray(order.itemsList) ? order.itemsList : Object.values(order.itemsList || {});

                                return (
                                    <div className="order-tracker-card" key={order.id}>
                                        {/* Card Header */}
                                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center border-bottom pb-3 mb-3">
                                            <div>
                                                <div className="d-flex align-items-center gap-2 mb-1">
                                                    <h5 className="font-weight-bold mb-0 mr-2">{order.userName || 'Restaurant'}</h5>
                                                    <span className={`badge-tag ${statusBadgeClass}`}>
                                                        {order.status}
                                                    </span>
                                                </div>
                                                <small className="text-muted">Order ID: #{order.id}</small>
                                            </div>

                                            <div className="text-md-right mt-2 mt-md-0">
                                                <div className="small text-muted">Total Amount</div>
                                                <div className="font-weight-bold" style={{ fontSize: '1.2rem', color: 'var(--primary)' }}>
                                                    RS. {order.totalPrice}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Visual Progression Stepper */}
                                        {this.renderStepper(order.status)}

                                        {/* Items Breakdown */}
                                        <div className="bg-light rounded p-3 mt-4 border">
                                            <div className="small font-weight-bold text-muted mb-2 text-uppercase">Ordered Items:</div>
                                            <div className="row">
                                                {items.map((food, fIdx) => (
                                                    <div className="col-md-6 col-12 mb-2" key={fIdx}>
                                                        <div className="d-flex align-items-center">
                                                            <img
                                                                alt={food.itemTitle}
                                                                src={food.itemImageUrl || require("../assets/images/listing-logo03.png")}
                                                                className="rounded mr-3"
                                                                style={{ width: '45px', height: '45px', objectFit: 'cover' }}
                                                            />
                                                            <div className="mr-auto">
                                                                <div className="small font-weight-bold">{food.itemTitle}</div>
                                                                <small className="text-muted">RS. {food.itemPrice}</small>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Actions Footer */}
                                        <div className="d-flex justify-content-between align-items-center mt-3 pt-2">
                                            <small className="text-muted">
                                                <FontAwesomeIcon icon="info-circle" className="mr-1" />
                                                Need help with this order? <a href="#/" className="text-primary font-weight-bold ml-1">Contact Support</a>
                                            </small>
                                            <button
                                                type="button"
                                                onClick={() => this.props.history.push('/restaurants')}
                                                className="btn btn-outline-custom btn-sm px-3"
                                            >
                                                Order Again
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </main>

                <Footer />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    myOrder: state.myOrder,
    user: state.user,
});

const mapDispatchToProps = dispatch => ({
    my_order: () => dispatch(my_order()),
});

export default connect(mapStateToProps, mapDispatchToProps)(MyOrders);