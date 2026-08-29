import React, { Component } from 'react';
import Navbar2 from '../components/Navbar2';
import Footer from '../components/Footer';
import { connect } from 'react-redux';
import { my_foods } from '../store/action';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const SAMPLE_MY_FOODS = [
    {
        id: "sample-food-1",
        itemTitle: "Gourmet Beef Truffle Burger",
        itemIngredients: "Two prime patties, aged cheddar, caramelised onions, truffle aioli",
        itemPrice: "650",
        itemImageUrl: require("../assets/images/listing-logo03.png")
    },
    {
        id: "sample-food-2",
        itemTitle: "Smoky BBQ Wings Basket",
        itemIngredients: "Crispy chicken wings glazed in house hickory BBQ sauce",
        itemPrice: "480",
        itemImageUrl: require("../assets/images/listing-logo15.png")
    }
];

class MyFoods extends Component {
    componentDidMount() {
        this.props.my_foods();
    }

    render() {
        const { user, myFoods } = this.props;

        let foodsList = [];
        if (myFoods && Object.keys(myFoods).length > 0) {
            foodsList = Object.keys(myFoods).map(key => ({ id: key, ...myFoods[key] }));
        } else {
            foodsList = SAMPLE_MY_FOODS;
        }

        const restaurantName = user && user.userName ? user.userName : "My Restaurant";
        const typeOfFoodText = user && user.typeOfFood && Array.isArray(user.typeOfFood)
            ? user.typeOfFood.join(', ')
            : ((user && user.typeOfFood) || 'Multi-Cuisine');

        return (
            <div className="d-flex flex-column min-vh-100">
                <Navbar2 history={this.props.history} />

                {/* Subheader Banner */}
                <section className="py-5" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: '#fff' }}>
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-lg-8 col-12">
                                <span className="hero-pill mb-2">
                                    <FontAwesomeIcon icon="utensils" className="mr-2" style={{ color: 'var(--primary)' }} />
                                    Menu Catalog
                                </span>
                                <h1 className="text-white font-weight-bold mb-1" style={{ fontSize: '2.2rem' }}>
                                    {restaurantName} – Dishes
                                </h1>
                                <p className="text-muted mb-0">{typeOfFoodText}</p>
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

                {/* Main Food List */}
                <main className="py-5 flex-grow-1" style={{ background: 'var(--bg-page)' }}>
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-lg-9 col-12">
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h4 className="font-weight-bold mb-0">Active Menu Dishes ({foodsList.length})</h4>
                                </div>

                                {foodsList.length === 0 ? (
                                    <div className="bg-white rounded-lg p-5 text-center border">
                                        <FontAwesomeIcon icon="utensils" className="text-muted mb-3" style={{ fontSize: '2.5rem', opacity: 0.4 }} />
                                        <h5 className="font-weight-bold">No food items added yet</h5>
                                        <p className="text-muted small mb-4">Start by adding your first signature dish to attract customers.</p>
                                        <button
                                            type="button"
                                            onClick={() => this.props.history.push('/add-menu-items')}
                                            className="btn btn-warning px-4"
                                        >
                                            Add Your First Item
                                        </button>
                                    </div>
                                ) : (
                                    foodsList.map((food) => (
                                        <div className="food-card" key={food.id}>
                                            <img
                                                alt={food.itemTitle}
                                                src={food.itemImageUrl || require("../assets/images/listing-logo03.png")}
                                                className="food-card-thumb"
                                            />
                                            <div className="food-card-info">
                                                <h6 className="food-card-title">{food.itemTitle}</h6>
                                                <p className="food-card-desc">{food.itemIngredients}</p>
                                                <div className="food-card-price">RS. {food.itemPrice}</div>
                                            </div>
                                            <span className="badge-tag badge-tag-success">Available</span>
                                        </div>
                                    ))
                                )}
                            </div>
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
    myFoods: state.myFoods,
});

const mapDispatchToProps = dispatch => ({
    my_foods: () => dispatch(my_foods()),
});

export default connect(mapStateToProps, mapDispatchToProps)(MyFoods);