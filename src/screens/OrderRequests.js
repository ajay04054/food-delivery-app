import React, { Component } from 'react';
import Navbar2 from '../components/Navbar2';
import Footer from '../components/Footer';
import firebase from '../config/firebase';
import { connect } from 'react-redux';
import { order_request } from '../store/action';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Swal from 'sweetalert2';

class OrderRequests extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeFilter: "ALL",
        };
        this.handleSendToInProgressBtn = this.handleSendToInProgressBtn.bind(this);
        this.handleSendToDeliveredBtn = this.handleSendToDeliveredBtn.bind(this);
    }

    componentDidMount() {
        this.props.order_request();
    }

    handleSendToInProgressBtn(userUid, orderId) {
        const { user } = this.props;
        if (!user || !user.userUid) return;

        const restaurantUid = user.userUid;
        firebase.firestore().collection('users').doc(restaurantUid).collection('orderRequest').doc(orderId).update({
            status: "IN PROGRESS",
        }).then(() => {
            firebase.firestore().collection('users').doc(userUid).collection('myOrder').doc(orderId).update({
                status: "IN PROGRESS",
            }).then(() => {
                Swal.fire({
                    title: 'Order Updated',
                    text: 'Order status changed to IN PROGRESS. Kitchen is preparing the meal.',
                    type: 'success',
                    timer: 2000,
                    showConfirmButton: false
                });
            });
        });
    }

    handleSendToDeliveredBtn(userUid, orderId) {
        const { user } = this.props;
        if (!user || !user.userUid) return;

        const restaurantUid = user.userUid;
        firebase.firestore().collection('users').doc(restaurantUid).collection('orderRequest').doc(orderId).update({
            status: "DELIVERED",
        }).then(() => {
            firebase.firestore().collection('users').doc(userUid).collection('myOrder').doc(orderId).update({
                status: "DELIVERED",
            }).then(() => {
                Swal.fire({
                    title: 'Delivery Complete',
                    text: 'Order marked as DELIVERED.',
                    type: 'success',
                    timer: 2000,
                    showConfirmButton: false
                });
            });
        });
    }

    render() {
        const { orderRequest, user } = this.props;
        const { activeFilter } = this.state;

        let ordersList = [];
        if (orderRequest) {
            ordersList = Object.keys(orderRequest).map(key => ({ id: key, ...orderRequest[key] }));
        }

        const pendingCount = ordersList.filter(o => o.status === "PENDING").length;
        const inProgressCount = ordersList.filter(o => o.status === "IN PROGRESS").length;
        const deliveredCount = ordersList.filter(o => o.status === "DELIVERED").length;
        const totalSales = ordersList.reduce((acc, curr) => acc + (Number(curr.totalPrice) || 0), 0);

        let filteredOrders = ordersList;
        if (activeFilter === "PENDING") {
            filteredOrders = ordersList.filter(o => o.status === "PENDING");
        } else if (activeFilter === "IN_PROGRESS") {
            filteredOrders = ordersList.filter(o => o.status === "IN PROGRESS");
        } else if (activeFilter === "DELIVERED") {
            filteredOrders = ordersList.filter(o => o.status === "DELIVERED");
        }

        return (
            <div className="d-flex flex-column min-vh-100">
                <Navbar2 history={this.props.history} />

                {/* Subheader Banner */}
                <section className="py-5" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: '#fff' }}>
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-lg-8 col-12">
                                <span className="hero-pill mb-2">
                                    <FontAwesomeIcon icon="store" className="mr-2" style={{ color: 'var(--primary)' }} />
                                    Restaurant Management Console
                                </span>
                                <h1 className="text-white font-weight-bold mb-1" style={{ fontSize: '2.2rem' }}>
                                    {user && user.userName ? user.userName : "Incoming Orders"}
                                </h1>
                                <p className="text-muted mb-0">
                                    Manage kitchen workflow, accept new incoming orders, and track dispatch status.
                                </p>
                            </div>
                            <div className="col-lg-4 col-12 text-lg-right mt-3 mt-lg-0">
                                <button
                                    type="button"
                                    onClick={() => this.props.history.push('/add-menu-items')}
                                    className="btn btn-warning px-4 py-2 font-weight-bold"
                                >
                                    <FontAwesomeIcon icon="plus" className="mr-2" />
                                    Add New Dish
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats Metric Cards */}
                <section className="py-4 bg-white border-bottom shadow-sm">
                    <div className="container">
                        <div className="row text-center">
                            <div className="col-md-3 col-6 mb-3 mb-md-0">
                                <div className="p-3 rounded bg-light border">
                                    <div className="small text-muted font-weight-bold text-uppercase">Pending Orders</div>
                                    <div className="h3 font-weight-bold text-danger mb-0">{pendingCount}</div>
                                </div>
                            </div>
                            <div className="col-md-3 col-6 mb-3 mb-md-0">
                                <div className="p-3 rounded bg-light border">
                                    <div className="small text-muted font-weight-bold text-uppercase">In Kitchen</div>
                                    <div className="h3 font-weight-bold text-warning mb-0">{inProgressCount}</div>
                                </div>
                            </div>
                            <div className="col-md-3 col-6">
                                <div className="p-3 rounded bg-light border">
                                    <div className="small text-muted font-weight-bold text-uppercase">Delivered</div>
                                    <div className="h3 font-weight-bold text-success mb-0">{deliveredCount}</div>
                                </div>
                            </div>
                            <div className="col-md-3 col-6">
                                <div className="p-3 rounded bg-light border">
                                    <div className="small text-muted font-weight-bold text-uppercase">Total Sales</div>
                                    <div className="h3 font-weight-bold text-dark mb-0">RS. {totalSales}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Main Content Area */}
                <main className="py-5 flex-grow-1" style={{ background: 'var(--bg-page)' }}>
                    <div className="container">
                        {/* Filter Tabs */}
                        <div className="d-flex gap-2 mb-4">
                            <button
                                type="button"
                                onClick={() => this.setState({ activeFilter: "ALL" })}
                                className={`btn btn-sm px-4 mr-2 ${activeFilter === "ALL" ? 'btn-warning text-white font-weight-bold' : 'btn-white bg-white border text-muted'}`}
                                style={{ borderRadius: 'var(--radius-full)' }}
                            >
                                All ({ordersList.length})
                            </button>
                            <button
                                type="button"
                                onClick={() => this.setState({ activeFilter: "PENDING" })}
                                className={`btn btn-sm px-4 mr-2 ${activeFilter === "PENDING" ? 'btn-warning text-white font-weight-bold' : 'btn-white bg-white border text-muted'}`}
                                style={{ borderRadius: 'var(--radius-full)' }}
                            >
                                Pending ({pendingCount})
                            </button>
                            <button
                                type="button"
                                onClick={() => this.setState({ activeFilter: "IN_PROGRESS" })}
                                className={`btn btn-sm px-4 mr-2 ${activeFilter === "IN_PROGRESS" ? 'btn-warning text-white font-weight-bold' : 'btn-white bg-white border text-muted'}`}
                                style={{ borderRadius: 'var(--radius-full)' }}
                            >
                                In Progress ({inProgressCount})
                            </button>
                            <button
                                type="button"
                                onClick={() => this.setState({ activeFilter: "DELIVERED" })}
                                className={`btn btn-sm px-4 ${activeFilter === "DELIVERED" ? 'btn-warning text-white font-weight-bold' : 'btn-white bg-white border text-muted'}`}
                                style={{ borderRadius: 'var(--radius-full)' }}
                            >
                                Completed ({deliveredCount})
                            </button>
                        </div>

                        {/* Order Cards */}
                        {filteredOrders.length === 0 ? (
                            <div className="bg-white rounded-lg p-5 text-center border">
                                <FontAwesomeIcon icon="concierge-bell" className="text-muted mb-3" style={{ fontSize: '2.5rem', opacity: 0.4 }} />
                                <h5 className="font-weight-bold">No orders in this queue</h5>
                                <p className="text-muted small mb-0">New orders placed by customers will automatically appear here.</p>
                            </div>
                        ) : (
                            filteredOrders.map((order) => {
                                const isPending = order.status === "PENDING";
                                const isInProgress = order.status === "IN PROGRESS";
                                const isDelivered = order.status === "DELIVERED";
                                const statusClass = isDelivered ? "badge-tag-success" : isPending ? "badge-tag-warning" : "badge-tag-primary";
                                const items = Array.isArray(order.itemsList) ? order.itemsList : Object.values(order.itemsList || {});

                                return (
                                    <div className="order-tracker-card" key={order.id}>
                                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center border-bottom pb-3 mb-3">
                                            <div>
                                                <div className="d-flex align-items-center gap-2 mb-1">
                                                    <h5 className="font-weight-bold mb-0 mr-2">
                                                        Customer: {order.userName || "Customer"}
                                                    </h5>
                                                    <span className={`badge-tag ${statusClass}`}>
                                                        {order.status}
                                                    </span>
                                                </div>
                                                <small className="text-muted">Order ID: #{order.id}</small>
                                            </div>

                                            <div className="text-md-right mt-2 mt-md-0">
                                                <div className="small text-muted">Order Total</div>
                                                <div className="font-weight-bold" style={{ fontSize: '1.2rem', color: 'var(--primary)' }}>
                                                    RS. {order.totalPrice}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Items Ordered */}
                                        <div className="bg-light rounded p-3 mb-3 border">
                                            <div className="small font-weight-bold text-muted mb-2 text-uppercase">Items to Prepare:</div>
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
                                                            <div>
                                                                <div className="small font-weight-bold">{food.itemTitle}</div>
                                                                <small className="text-muted">RS. {food.itemPrice}</small>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Action Controls */}
                                        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center pt-2">
                                            <small className="text-muted mb-2 mb-sm-0">
                                                <FontAwesomeIcon icon="clock" className="mr-1" />
                                                Action required to advance order lifecycle
                                            </small>

                                            <div className="d-flex gap-2">
                                                {isPending && (
                                                    <button
                                                        type="button"
                                                        onClick={() => this.handleSendToInProgressBtn(order.userUid, order.id)}
                                                        className="btn btn-warning btn-sm px-4 font-weight-bold"
                                                    >
                                                        <FontAwesomeIcon icon="fire" className="mr-2" />
                                                        Accept &amp; Start Preparing
                                                    </button>
                                                )}
                                                {isInProgress && (
                                                    <button
                                                        type="button"
                                                        onClick={() => this.handleSendToDeliveredBtn(order.userUid, order.id)}
                                                        className="btn btn-success btn-sm px-4 font-weight-bold"
                                                    >
                                                        <FontAwesomeIcon icon="check-circle" className="mr-2" />
                                                        Mark as Delivered
                                                    </button>
                                                )}
                                                {isDelivered && (
                                                    <span className="text-success font-weight-bold small">
                                                        <FontAwesomeIcon icon="check" className="mr-1" />
                                                        Completed &amp; Settled
                                                    </span>
                                                )}
                                            </div>
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
    orderRequest: state.orderRequest,
    user: state.user,
});

const mapDispatchToProps = dispatch => ({
    order_request: () => dispatch(order_request()),
});

export default connect(mapStateToProps, mapDispatchToProps)(OrderRequests);