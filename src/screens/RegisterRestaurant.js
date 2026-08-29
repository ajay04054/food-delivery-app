import React, { Component } from 'react';
import Navbar2 from '../components/Navbar2';
import Footer from '../components/Footer';
import { signUp } from '../config/firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const AVAILABLE_CUISINES = [
    "Burgers", "Pizza", "Fast Food", "BB.Q", "Chicken Roast", "Beef Roast", "Chinese Soup", "Cold Coffee", "Fresh Juice", "Desserts"
];

export default class RegisterRestaurant extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: "",
            userEmail: "",
            userPassword: "",
            userConfirmPassword: "",
            userCity: "",
            userCountry: "",
            userGender: "Male",
            userAge: "",
            userProfileImage: null,
            userProfileImageLabel: "Upload logo/photo...",
            selectedCuisines: ["Burgers", "Fast Food"],
            userTNC: false,
            showError: false,
            registerFormError: "",
            isLoading: false,
        };
        this.handleCreateAccountBtn = this.handleCreateAccountBtn.bind(this);
        this.handleUserProfileImage = this.handleUserProfileImage.bind(this);
        this.toggleCuisine = this.toggleCuisine.bind(this);
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
                userProfileImageLabel: "Upload logo/photo...",
                userProfileImage: null,
            });
        }
    }

    toggleCuisine(cuisine) {
        this.setState(prevState => {
            const exists = prevState.selectedCuisines.includes(cuisine);
            const updated = exists
                ? prevState.selectedCuisines.filter(c => c !== cuisine)
                : [...prevState.selectedCuisines, cuisine];
            return { selectedCuisines: updated };
        });
    }

    async handleCreateAccountBtn() {
        const {
            userName,
            userEmail,
            userPassword,
            userConfirmPassword,
            userCity,
            userCountry,
            userGender,
            userAge,
            userProfileImage,
            selectedCuisines,
            userTNC
        } = this.state;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!userName || userName.trim().length < 2) {
            this.setState({ showError: true, registerFormError: "Please enter your restaurant business name." });
            return;
        }
        if (!userEmail || !emailRegex.test(userEmail)) {
            this.setState({ showError: true, registerFormError: "Please enter a valid business email address." });
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
            this.setState({ showError: true, registerFormError: "Please enter representative age." });
            return;
        }
        if (!userProfileImage) {
            this.setState({ showError: true, registerFormError: "Please upload your restaurant storefront image or logo." });
            return;
        }
        if (selectedCuisines.length === 0) {
            this.setState({ showError: true, registerFormError: "Please choose at least one cuisine type." });
            return;
        }
        if (!userTNC) {
            this.setState({ showError: true, registerFormError: "Please agree to partner terms & conditions." });
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
            isRestaurant: true,
            propsHistory: this.props.history,
            typeOfFood: selectedCuisines.length > 0 ? selectedCuisines : ['Burgers', 'Fast Food']
        };

        try {
            await signUp(userDetails);
        } catch (error) {
            this.setState({
                isLoading: false,
                showError: true,
                registerFormError: (error && error.message) || error || "Restaurant registration failed. Please try again.",
            });
        }
    }

    render() {
        const {
            showError,
            registerFormError,
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
            selectedCuisines,
            isLoading
        } = this.state;

        return (
            <div className="d-flex flex-column min-vh-100">
                <Navbar2 history={this.props.history} />

                {/* Subheader */}
                <section className="py-5" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: '#fff' }}>
                    <div className="container text-center">
                        <span className="hero-pill mb-2">
                            <FontAwesomeIcon icon="store" className="mr-2" style={{ color: 'var(--primary)' }} />
                            Merchant Partnership
                        </span>
                        <h1 className="text-white font-weight-bold mb-1" style={{ fontSize: '2.2rem' }}>
                            Register Your Restaurant
                        </h1>
                        <p className="text-muted mb-0" style={{ maxWidth: '540px', margin: '0 auto' }}>
                            Reach thousands of hungry local customers and grow your restaurant business on QuickFood.
                        </p>
                    </div>
                </section>

                {/* Main Content Area */}
                <main className="py-5 flex-grow-1" style={{ background: 'var(--bg-page)' }}>
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-lg-8 col-12">
                                <div className="bg-white rounded-lg p-4 p-md-5 border shadow-sm">
                                    <h4 className="font-weight-bold mb-4">Restaurant Information</h4>

                                    {showError && (
                                        <div className="alert alert-danger py-2 small mb-3">
                                            <FontAwesomeIcon icon="exclamation-circle" className="mr-2" />
                                            {registerFormError}
                                        </div>
                                    )}

                                    <form onSubmit={(e) => { e.preventDefault(); this.handleCreateAccountBtn(); }}>
                                        <div className="form-row">
                                            <div className="form-group col-md-6 mb-3">
                                                <label className="small font-weight-bold text-muted">RESTAURANT / BUSINESS NAME</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="e.g. Bella Italia Bistro"
                                                    value={userName}
                                                    onChange={(e) => this.setState({ userName: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="form-group col-md-6 mb-3">
                                                <label className="small font-weight-bold text-muted">BUSINESS EMAIL</label>
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    placeholder="owner@restaurant.com"
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
                                                    placeholder="e.g. Chicago"
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
                                                <label className="small font-weight-bold text-muted">OWNER GENDER</label>
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
                                                    placeholder="30"
                                                    value={userAge}
                                                    onChange={(e) => this.setState({ userAge: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="form-group col-md-6 mb-3">
                                                <label className="small font-weight-bold text-muted">STORE LOGO / PHOTO</label>
                                                <div className="custom-file">
                                                    <input
                                                        type="file"
                                                        className="custom-file-input"
                                                        id="restaurantImageUpload"
                                                        accept="image/*"
                                                        onChange={this.handleUserProfileImage}
                                                    />
                                                    <label className="custom-file-label text-truncate" htmlFor="restaurantImageUpload">
                                                        {userProfileImageLabel}
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Cuisine Types Selector */}
                                        <div className="form-group mb-4">
                                            <label className="small font-weight-bold text-muted d-block mb-2">
                                                SPECIALTY CUISINES (Select all that apply)
                                            </label>
                                            <div className="d-flex flex-wrap gap-2">
                                                {AVAILABLE_CUISINES.map((cuisine, idx) => {
                                                    const isSelected = selectedCuisines.includes(cuisine);
                                                    return (
                                                        <button
                                                            key={idx}
                                                            type="button"
                                                            onClick={() => this.toggleCuisine(cuisine)}
                                                            className={`btn btn-sm mr-2 mb-2 ${isSelected ? 'btn-warning text-white font-weight-bold' : 'btn-light text-muted border'}`}
                                                            style={{ borderRadius: 'var(--radius-full)' }}
                                                        >
                                                            {isSelected ? <FontAwesomeIcon icon="check" className="mr-1" /> : null}
                                                            {cuisine}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        <div className="form-group mb-4">
                                            <div className="custom-control custom-checkbox">
                                                <input
                                                    type="checkbox"
                                                    className="custom-control-input"
                                                    id="partnerTnc"
                                                    checked={userTNC}
                                                    onChange={() => this.setState(prev => ({ userTNC: !prev.userTNC }))}
                                                />
                                                <label className="custom-control-label small" htmlFor="partnerTnc">
                                                    I agree to the Restaurant Partner Agreement &amp; Delivery Standards
                                                </label>
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="btn btn-warning btn-block py-2 font-weight-bold text-uppercase mb-3"
                                        >
                                            {isLoading ? 'Registering Restaurant...' : 'Register Restaurant'}
                                        </button>

                                        <div className="text-center small">
                                            Already registered?{' '}
                                            <a href="#/login" className="font-weight-bold text-warning ml-1">
                                                Merchant Login
                                            </a>
                                        </div>
                                    </form>
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
