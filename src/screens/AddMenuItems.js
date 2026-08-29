import React, { Component } from 'react';
import Navbar2 from '../components/Navbar2';
import Footer from '../components/Footer';
import { addItem } from '../config/firebase';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const FOOD_CATEGORIES = [
    "Burgers", "Pizza", "Chicken", "Kebabs", "Biryani", "Vegetarian", "Desserts", "Beverages"
];

export default class AddMenuItems extends Component {
    constructor(props) {
        super(props);
        this.state = {
            itemTitle: "",
            itemIngredients: "",
            itemPrice: "",
            itemImage: null,
            itemImageLabel: "Choose dish photo...",
            itemImagePreview: null,
            chooseItemType: "Burgers",
            isSubmitting: false,
            errorMessage: "",
        };
        this.handleItemImage = this.handleItemImage.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleItemImage(e) {
        const file = e.target.files[0];
        if (file) {
            this.setState({
                itemImageLabel: file.name,
                itemImage: file,
                itemImagePreview: URL.createObjectURL(file)
            });
        } else {
            this.setState({
                itemImageLabel: "Choose dish photo...",
                itemImage: null,
                itemImagePreview: null
            });
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        const { itemTitle, itemIngredients, itemPrice, itemImage, chooseItemType } = this.state;

        if (!itemTitle.trim()) {
            this.setState({ errorMessage: "Please enter the dish title." });
            return;
        }
        if (!itemIngredients.trim()) {
            this.setState({ errorMessage: "Please describe the ingredients or flavor profile." });
            return;
        }
        if (!itemPrice || Number(itemPrice) <= 0) {
            this.setState({ errorMessage: "Please enter a valid price in RS." });
            return;
        }
        if (!itemImage) {
            this.setState({ errorMessage: "Please select a photo of the food item." });
            return;
        }
        if (!chooseItemType) {
            this.setState({ errorMessage: "Please select a food category." });
            return;
        }

        this.setState({ isSubmitting: true, errorMessage: "" });

        const itemDetails = {
            itemTitle: itemTitle.trim(),
            itemIngredients: itemIngredients.trim(),
            itemPrice: itemPrice.trim(),
            itemImage,
            chooseItemType,
            propsHistory: this.props.history,
        };

        try {
            const addItemReturn = await addItem(itemDetails);
            Swal.fire({
                title: 'Dish Added!',
                text: addItemReturn || 'Your new menu item is now live and orderable.',
                type: 'success',
            }).then(() => {
                this.props.history.push('/my-foods');
            });
        } catch (error) {
            this.setState({ isSubmitting: false });
            Swal.fire({
                title: 'Failed to Add Item',
                text: error ? String(error) : 'Please check your connection and try again.',
                type: 'error',
            });
        }
    }

    render() {
        const {
            itemTitle,
            itemIngredients,
            itemPrice,
            itemImageLabel,
            itemImagePreview,
            chooseItemType,
            isSubmitting,
            errorMessage
        } = this.state;

        return (
            <div className="d-flex flex-column min-vh-100">
                <Navbar2 history={this.props.history} />

                {/* Subheader */}
                <section className="py-5" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: '#fff' }}>
                    <div className="container text-center">
                        <span className="hero-pill mb-2">
                            <FontAwesomeIcon icon="utensils" className="mr-2" style={{ color: 'var(--primary)' }} />
                            Menu Management
                        </span>
                        <h1 className="text-white font-weight-bold mb-1" style={{ fontSize: '2.2rem' }}>
                            Add New Menu Item
                        </h1>
                        <p className="text-muted mb-0" style={{ maxWidth: '500px', margin: '0 auto' }}>
                            Create appetizing dishes for your online restaurant menu with custom pricing and photos.
                        </p>
                    </div>
                </section>

                {/* Form Section */}
                <main className="py-5 flex-grow-1" style={{ background: 'var(--bg-page)' }}>
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-lg-8 col-12">
                                <div className="bg-white rounded-lg p-4 p-md-5 border shadow-sm">
                                    {errorMessage && (
                                        <div className="alert alert-danger py-2 mb-4 small" role="alert">
                                            <FontAwesomeIcon icon="exclamation-circle" className="mr-2" />
                                            {errorMessage}
                                        </div>
                                    )}

                                    <form onSubmit={this.handleSubmit}>
                                        <div className="form-group mb-3">
                                            <label className="font-weight-bold small text-muted">DISH / ITEM TITLE</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="e.g. Truffle Smashed Burger"
                                                value={itemTitle}
                                                onChange={(e) => this.setState({ itemTitle: e.target.value })}
                                                required
                                            />
                                        </div>

                                        <div className="form-group mb-3">
                                            <label className="font-weight-bold small text-muted">INGREDIENTS &amp; DESCRIPTION</label>
                                            <textarea
                                                className="form-control"
                                                rows="3"
                                                placeholder="e.g. Double prime beef patty, aged cheddar, caramelized onions, house truffle aioli on toasted brioche."
                                                value={itemIngredients}
                                                onChange={(e) => this.setState({ itemIngredients: e.target.value })}
                                                required
                                            />
                                        </div>

                                        <div className="row mb-3">
                                            <div className="col-md-6 col-12 mb-3 mb-md-0">
                                                <label className="font-weight-bold small text-muted">PRICE (RS.)</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    placeholder="e.g. 650"
                                                    value={itemPrice}
                                                    onChange={(e) => this.setState({ itemPrice: e.target.value })}
                                                    required
                                                />
                                            </div>

                                            <div className="col-md-6 col-12">
                                                <label className="font-weight-bold small text-muted">CATEGORY</label>
                                                <select
                                                    className="form-control"
                                                    value={chooseItemType}
                                                    onChange={(e) => this.setState({ chooseItemType: e.target.value })}
                                                >
                                                    {FOOD_CATEGORIES.map((cat, idx) => (
                                                        <option key={idx} value={cat}>{cat}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="form-group mb-4">
                                            <label className="font-weight-bold small text-muted">DISH PHOTO</label>
                                            <div className="custom-file">
                                                <input
                                                    type="file"
                                                    className="custom-file-input"
                                                    id="foodPhotoUpload"
                                                    accept="image/*"
                                                    onChange={this.handleItemImage}
                                                />
                                                <label className="custom-file-label" htmlFor="foodPhotoUpload">
                                                    {itemImageLabel}
                                                </label>
                                            </div>

                                            {itemImagePreview && (
                                                <div className="mt-3 text-center">
                                                    <img
                                                        src={itemImagePreview}
                                                        alt="Dish Preview"
                                                        className="rounded border shadow-sm"
                                                        style={{ width: '140px', height: '140px', objectFit: 'cover' }}
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="btn btn-warning btn-block py-2 font-weight-bold text-uppercase"
                                        >
                                            {isSubmitting ? 'Publishing Item...' : 'Publish Food Item'}
                                        </button>
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