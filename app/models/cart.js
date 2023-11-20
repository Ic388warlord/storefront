// Add API calls into this 
import API from '../utils/api';

class Cart {
    constructor(items = []) {
        this.items = items;
    }

    add(product) {
        this.items.push(product);
    }

    remove(productId) {
        this.items = this.items.filter(item => item.id !== productId);

    }
 
    addAll(products) {
        this.items.push(...products);
    }

    subTotal() {
        console.log(this.items)
        return this.items.reduce((total, item) => total + item.product_price, 0);
    }

    tax() {
        return this.subTotal() * 0.13;
    }

    total() {
        return this.subTotal() + this.tax();
    }

    length() {
        return this.items.length;
    }

    // Optional: Method to display all items in the cart
    listItems() {
        return this.items;
    }
}

export default Cart;
