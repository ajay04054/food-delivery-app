import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { update_user, remove_user } from '../store/action';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class Navbar2 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isNavOpen: false,
        };
        this.handleLogOut = this.handleLogOut.bind(this);
        this.toggleNav = this.toggleNav.bind(this);
    }

    componentDidMount() {
        this.props.update_user();
    }

    handleLogOut() {
        this.props.remove_user();
        if (this.props.history) {
            this.props.history.push('/');
        }
    }

    toggleNav() {
        this.setState(prevState => ({ isNavOpen: !prevState.isNavOpen }));
    }

    renderUserMenu(user) {
        if (!user || !user.isLogin) {
            return (
                <ul className="navbar-nav ml-auto align-items-center">
                    <li className="nav-item">
                        <Link className="nav-link px-3" to="/restaurants">
                            <FontAwesomeIcon icon="utensils" className="mr-2" style={{ color: 'var(--primary)' }} />
                            Explore Restaurants
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link px-3" to="/login">
                            Sign In
                        </Link>
                    </li>
                    <li className="nav-item ml-lg-2 mt-2 mt-lg-0">
                        <Link to="/register-restaurant" className="btn btn-warning btn-sm px-3 py-2 text-white font-weight-bold">
                            Partner with Us
                        </Link>
                    </li>
                </ul>
            );
        }

        const isRestaurant = user.isRestaurant;
        const initial = (user.userName && user.userName.charAt(0).toUpperCase()) || 'U';

        if (isRestaurant) {
            return (
                <ul className="navbar-nav ml-auto align-items-center">
                    <li className="nav-item">
                        <Link className="nav-link px-3" to="/order-requests">
                            <FontAwesomeIcon icon="tasks" className="mr-2" />
                            Order Requests
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link px-3" to="/my-foods">
                            <FontAwesomeIcon icon="utensils" className="mr-2" />
                            My Menu
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link px-3" to="/add-menu-items">
                            <FontAwesomeIcon icon="plus" className="mr-2" />
                            Add Dish
                        </Link>
                    </li>
                    <li className="nav-item ml-lg-2">
                        <div className="nav-user-badge">
                            <span className="nav-avatar-circle">{initial}</span>
                            <span>{user.userName}</span>
                        </div>
                    </li>
                    <li className="nav-item ml-lg-2 mt-2 mt-lg-0">
                        <button type="button" onClick={this.handleLogOut} className="btn btn-outline-light btn-sm px-3 py-2">
                            Log Out
                        </button>
                    </li>
                </ul>
            );
        }

        return (
            <ul className="navbar-nav ml-auto align-items-center">
                <li className="nav-item">
                    <Link className="nav-link px-3" to="/restaurants">
                        <FontAwesomeIcon icon="search" className="mr-2" />
                        Find Food
                    </Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link px-3" to="/my-orders">
                        <FontAwesomeIcon icon="shopping-basket" className="mr-2" />
                        My Orders
                    </Link>
                </li>
                <li className="nav-item ml-lg-2">
                    <div className="nav-user-badge">
                        <span className="nav-avatar-circle">{initial}</span>
                        <span>{user.userName}</span>
                    </div>
                </li>
                <li className="nav-item ml-lg-2 mt-2 mt-lg-0">
                    <button type="button" onClick={this.handleLogOut} className="btn btn-outline-light btn-sm px-3 py-2">
                        Log Out
                    </button>
                </li>
            </ul>
        );
    }

    render() {
        const { user } = this.props;
        const { isNavOpen } = this.state;
        const homeLink = user && user.isRestaurant ? '/order-requests' : '/';

        return (
            <header className="site-navbar">
                <div className="container">
                    <nav className="navbar navbar-expand-lg navbar-dark p-0">
                        <Link className="navbar-brand d-flex align-items-center" to={homeLink}>
                            <img alt="Quick Food Logo" src={require("../assets/images/logo.png")} />
                        </Link>

                        <button
                            className="navbar-toggler border-0"
                            type="button"
                            onClick={this.toggleNav}
                            aria-label="Toggle navigation"
                        >
                            <span className="navbar-toggler-icon"></span>
                        </button>

                        <div className={`collapse navbar-collapse ${isNavOpen ? 'show mt-3 mt-lg-0' : ''}`} id="siteNavbarContent">
                            {this.renderUserMenu(user)}
                        </div>
                    </nav>
                </div>
            </header>
        );
    }
}

const mapStateToProps = state => ({
    user: state.user,
});

const mapDispatchToProps = dispatch => ({
    update_user: () => dispatch(update_user()),
    remove_user: () => dispatch(remove_user()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Navbar2));



