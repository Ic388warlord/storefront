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
        return this.items.reduce((total, item) => total + item.product_price * item.count, 0);
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

    listItems() {
        return this.items;
    }

    update(productId, newCount) {
        const itemIndex = this.items.findIndex((item) => item.product_id === productId);

        if (itemIndex !== -1) {
            this.items[itemIndex].count = newCount;
        }

        const totalCount = this.items.reduce((total, item) => total + item.count, 0);
        return totalCount;
    }
}

export default Cart;
