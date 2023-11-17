// Add API calls into this 
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
        return this.items.reduce((total, item) => total + item.price, 0);
    }

    tax() {
        return this.subTotal() * 0.13;
    }

    // Optional: Method to display all items in the cart
    listItems() {
        return this.items;
    }
}

export default Cart;
