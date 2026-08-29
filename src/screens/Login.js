import React, { Component } from 'react';
import Navbar2 from '../components/Navbar2';
import Footer from '../components/Footer';
import { signUp, logIn } from '../config/firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isRegisterForm: false,
            registerFormError: "",
            loginFormError: "",
            userProfileImageLabel: "Choose image...",
            userName: "",
            userEmail: "",
            userPassword: "",
            userConfirmPassword: "",
            userCity: "",
            userCountry: "",
            userGender: "Male",
            userAge: "",
            userProfileImage: null,
            userTNC: false,
            showError: false,
            showLoginError: false,
            userLoginEmail: "",
            userLoginPassword: "",
            isLoading: false,
        };
        this.handleForms = this.handleForms.bind(this);
        this.handleCreateAccountBtn = this.handleCreateAccountBtn.bind(this);
        this.handleUserProfileImage = this.handleUserProfileImage.bind(this);
        this.handleLoginNowBtn = this.handleLoginNowBtn.bind(this);
        this.fillDemoCustomer = this.fillDemoCustomer.bind(this);
    }

    handleForms() {
        this.setState(prevState => ({
            isRegisterForm: !prevState.isRegisterForm,
            showError: false,
            showLoginError: false,
            registerFormError: "",
            loginFormError: "",
        }));
    }

    fillDemoCustomer() {
        this.setState({
            userLoginEmail: "customer@quickfood.demo",
            userLoginPassword: "password123",
            showLoginError: false,
            loginFormError: ""
        });
    }

    handleUserProfileImage(e) {
        const file = e.target.files && e.target.files[0];
        if (file) {
            this.setState({
                showError: false,
                registerFormError: "",
                userProfileImageLabel: file.name,
                userProfileImage: file
            });
        } else {
            this.setState({
                userProfileImageLabel: "Choose image...",
                userProfileImage: null,
            });
        }
    }

    async handleCreateAccountBtn() {
        const { userName, userEmail, userPassword, userConfirmPassword, userCity, userCountry, userGender, userAge, userProfileImage, userTNC } = this.state;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!userName || userName.trim().length < 2) {
            this.setState({ showError: true, registerFormError: "Please enter your full name (at least 2 characters)." });
            return;
        }
        if (!userEmail || !emailRegex.test(userEmail)) {
            this.setState({ showError: true, registerFormError: "Please enter a valid email address." });
            return;
        }
        if (!userPassword || userPassword.length < 6) {
            this.setState({ showError: true, registerFormError: "Password must be at least 6 characters long." });
            return;
        }
        if (userConfirmPassword !== userPassword) {
            this.setState({ showError: true, registerFormError: "Passwords do not match." });
            return;
        }
        if (!userCity || userCity.trim().length < 2) {
            this.setState({ showError: true, registerFormError: "Please enter your city." });
            return;
        }
        if (!userCountry || userCountry.trim().length < 2) {
            this.setState({ showError: true, registerFormError: "Please enter your country." });
            return;
        }
        if (!userAge || Number(userAge) <= 0) {
            this.setState({ showError: true, registerFormError: "Please enter a valid age." });
            return;
        }
        if (!userProfileImage) {
            this.setState({ showError: true, registerFormError: "Please upload an avatar image." });
            return;
        }
        if (!userTNC) {
            this.setState({ showError: true, registerFormError: "You must accept terms & conditions to proceed." });
            return;
        }

        this.setState({ isLoading: true, showError: false, registerFormError: "" });

        const userDetails = {
            userName: userName.trim(),
            userEmail: userEmail.trim(),
            userPassword,
            userCity: userCity.trim(),
            userCountry: userCountry.trim(),
            userGender,
            userAge,
            userProfileImage,
            isRestaurant: false,
            propsHistory: this.props.history,
            typeOfFood: [],
        };

        try {
            await signUp(userDetails);
        } catch (error) {
            this.setState({
                isLoading: false,
                showError: true,
                registerFormError: (error && error.message) || error || "Registration failed. Please try again.",
            });
        }
    }

    async handleLoginNowBtn() {
        const { userLoginEmail, userLoginPassword } = this.state;
        if (!userLoginEmail || !userLoginPassword) {
            this.setState({
                showLoginError: true,
                loginFormError: "Please enter both your email address and password.",
            });
            return;
        }

        this.setState({ isLoading: true, showLoginError: false, loginFormError: "" });

        const userLoginDetails = {
            userLoginEmail: userLoginEmail.trim(),
            userLoginPassword,
            propsHistory: this.props.history,
        };

        try {
            await logIn(userLoginDetails);
        } catch (error) {
            this.setState({
                isLoading: false,
                showLoginError: true,
                loginFormError: (error && error.message) || error || "Invalid email or password.",
            });
        }
    }

    render() {
        const {
            isRegisterForm,
            showError,
            registerFormError,
            showLoginError,
            loginFormError,
            userProfileImageLabel,
            userTNC,
            userGender,
            userName,
            userEmail,
            userPassword,
            userConfirmPassword,
            userCity,
            userCountry,
            userAge,
            userLoginEmail,
            userLoginPassword,
            isLoading
        } = this.state;

        return (
            <div className="d-flex flex-column min-vh-100">
                <Navbar2 history={this.props.history} />

                {/* Subheader */}
                <section className="py-5" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: '#fff' }}>
                    <div className="container text-center">
                        <span className="hero-pill mb-2">
                            <FontAwesomeIcon icon="user-circle" className="mr-2" style={{ color: 'var(--primary)' }} />
                            Customer Portal
                        </span>
                        <h1 className="text-white font-weight-bold mb-1" style={{ fontSize: '2.2rem' }}>
                            {isRegisterForm ? "Create Customer Account" : "Sign In to Your Account"}
                        </h1>
                        <p className="text-muted mb-0">
                            {isRegisterForm
                                ? "Join QuickFood to order delicious food and track live deliveries in real-time."
                                : "Welcome back! Access your order history and favorite restaurants."}
                        </p>
                    </div>
                </section>

                {/* Main Auth Form Area */}
                <main className="py-5 flex-grow-1" style={{ background: 'var(--bg-page)' }}>
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className={isRegisterForm ? "col-lg-7 col-md-9 col-12" : "col-lg-5 col-md-7 col-12"}>
                                <div className="bg-white rounded-lg p-4 p-md-5 border shadow-sm">
                                    {/* Register Form */}
                                    {isRegisterForm ? (
                                        <form onSubmit={(e) => { e.preventDefault(); this.handleCreateAccountBtn(); }}>
                                            <h4 className="font-weight-bold mb-4">Account Details</h4>

                                            {showError && (
                                                <div className="alert alert-danger py-2 small mb-3">
                                                    <FontAwesomeIcon icon="exclamation-circle" className="mr-2" />
                                                    {registerFormError}
                                                </div>
                                            )}

                                            <div className="form-row">
                                                <div className="form-group col-md-6 mb-3">
                                                    <label className="small font-weight-bold text-muted">FULL NAME</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="John Doe"
                                                        value={userName}
                                                        onChange={(e) => this.setState({ userName: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                                <div className="form-group col-md-6 mb-3">
                                                    <label className="small font-weight-bold text-muted">EMAIL ADDRESS</label>
                                                    <input
                                                        type="email"
                                                        className="form-control"
                                                        placeholder="john@example.com"
                                                        value={userEmail}
                                                        onChange={(e) => this.setState({ userEmail: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="form-row">
                                                <div className="form-group col-md-6 mb-3">
                                                    <label className="small font-weight-bold text-muted">PASSWORD</label>
                                                    <input
                                                        type="password"
                                                        className="form-control"
                                                        placeholder="At least 6 characters"
                                                        value={userPassword}
                                                        onChange={(e) => this.setState({ userPassword: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                                <div className="form-group col-md-6 mb-3">
                                                    <label className="small font-weight-bold text-muted">CONFIRM PASSWORD</label>
                                                    <input
                                                        type="password"
                                                        className="form-control"
                                                        placeholder="Re-enter password"
                                                        value={userConfirmPassword}
                                                        onChange={(e) => this.setState({ userConfirmPassword: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="form-row">
                                                <div className="form-group col-md-6 mb-3">
                                                    <label className="small font-weight-bold text-muted">CITY</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="e.g. New York"
                                                        value={userCity}
                                                        onChange={(e) => this.setState({ userCity: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                                <div className="form-group col-md-6 mb-3">
                                                    <label className="small font-weight-bold text-muted">COUNTRY</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="e.g. USA"
                                                        value={userCountry}
                                                        onChange={(e) => this.setState({ userCountry: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="form-row">
                                                <div className="form-group col-md-4 mb-3">
                                                    <label className="small font-weight-bold text-muted">GENDER</label>
                                                    <select
                                                        className="form-control"
                                                        value={userGender}
                                                        onChange={(e) => this.setState({ userGender: e.target.value })}
                                                    >
                                                        <option value="Male">Male</option>
                                                        <option value="Female">Female</option>
                                                        <option value="Other">Other</option>
                                                    </select>
                                                </div>
                                                <div className="form-group col-md-2 mb-3">
                                                    <label className="small font-weight-bold text-muted">AGE</label>
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        placeholder="24"
                                                        value={userAge}
                                                        onChange={(e) => this.setState({ userAge: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                                <div className="form-group col-md-6 mb-3">
                                                    <label className="small font-weight-bold text-muted">PROFILE AVATAR</label>
                                                    <div className="custom-file">
                                                        <input
                                                            type="file"
                                                            className="custom-file-input"
                                                            id="avatarFile"
                                                            accept="image/*"
                                                            onChange={this.handleUserProfileImage}
                                                        />
                                                        <label className="custom-file-label text-truncate" htmlFor="avatarFile">
                                                            {userProfileImageLabel}
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="form-group mb-4">
                                                <div className="custom-control custom-checkbox">
                                                    <input
                                                        type="checkbox"
                                                        className="custom-control-input"
                                                        id="termsCheck"
                                                        checked={userTNC}
                                                        onChange={() => this.setState(prev => ({ userTNC: !prev.userTNC }))}
                                                    />
                                                    <label className="custom-control-label small" htmlFor="termsCheck">
                                                        I agree to the Terms of Service &amp; Privacy Policy
                                                    </label>
                                                </div>
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={isLoading}
                                                className="btn btn-warning btn-block py-2 font-weight-bold text-uppercase"
                                            >
                                                {isLoading ? 'Creating Account...' : 'Create Account'}
                                            </button>

                                            <div className="text-center mt-4 small">
                                                Already have an account?{' '}
                                                <button
                                                    type="button"
                                                    onClick={this.handleForms}
                                                    className="btn btn-link p-0 font-weight-bold text-warning"
                                                >
                                                    Sign In Here
                                                </button>
                                            </div>
                                        </form>
                                    ) : (
                                        /* Login Form */
                                        <form onSubmit={(e) => { e.preventDefault(); this.handleLoginNowBtn(); }}>
                                            <h4 className="font-weight-bold mb-4">Customer Sign In</h4>

                                            {showLoginError && (
                                                <div className="alert alert-danger py-2 small mb-3">
                                                    <FontAwesomeIcon icon="exclamation-circle" className="mr-2" />
                                                    {loginFormError}
                                                </div>
                                            )}

                                            <div className="form-group mb-3">
                                                <label className="small font-weight-bold text-muted">EMAIL ADDRESS</label>
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    placeholder="Enter your email"
                                                    value={userLoginEmail}
                                                    onChange={(e) => this.setState({ userLoginEmail: e.target.value })}
                                                    required
                                                />
                                            </div>

                                            <div className="form-group mb-4">
                                                <label className="small font-weight-bold text-muted">PASSWORD</label>
                                                <input
                                                    type="password"
                                                    className="form-control"
                                                    placeholder="Enter password"
                                                    value={userLoginPassword}
                                                    onChange={(e) => this.setState({ userLoginPassword: e.target.value })}
                                                    required
                                                />
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={isLoading}
                                                className="btn btn-warning btn-block py-2 font-weight-bold text-uppercase mb-3"
                                            >
                                                {isLoading ? 'Signing in...' : 'Sign In'}
                                            </button>

                                            <div className="text-center mt-3 small">
                                                Don't have an account?{' '}
                                                <button
                                                    type="button"
                                                    onClick={this.handleForms}
                                                    className="btn btn-link p-0 font-weight-bold text-warning"
                                                >
                                                    Create One Now
                                                </button>
                                            </div>

                                            <hr className="my-3" />

                                            <div className="text-center small text-muted">
                                                Looking to manage a restaurant?{' '}
                                                <a href="#/register-restaurant" className="font-weight-bold text-dark ml-1">
                                                    Restaurant Portal
                                                </a>
                                            </div>
                                        </form>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                <Footer />
            </div>
        );
    }
}