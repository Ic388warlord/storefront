import Product from "../models/productModel";
import Cookies from "js-cookie";

class API {
    static listAllProductsUrl = "https://cwkc8gb6n1.execute-api.us-west-2.amazonaws.com/stage/api/product/list"
    static userShoppingListUrl = "https://cwkc8gb6n1.execute-api.us-west-2.amazonaws.com/stage/api/cart/" // Requires two api calls
    static userShoppingCartAddUrl = "https://cwkc8gb6n1.execute-api.us-west-2.amazonaws.com/stage/api/cart/addItem"
    static userShoppingDeleteUrl = "https://cwkc8gb6n1.execute-api.us-west-2.amazonaws.com/stage//api/cart/delete_item_from_cart"
    static prouductUrl = "https://cwkc8gb6n1.execute-api.us-west-2.amazonaws.com/stage/api/product/"
    static favouriteUrl = "https://cwkc8gb6n1.execute-api.us-west-2.amazonaws.com/stage/api/product/favorite/"
    static chatboxUrl = "https://cwkc8gb6n1.execute-api.us-west-2.amazonaws.com/stage/api/chatbot/chat"
    static contact = "https://cwkc8gb6n1.execute-api.us-west-2.amazonaws.com/stage/api/contact/us"
    static loginUrl = "https://cwkc8gb6n1.execute-api.us-west-2.amazonaws.com/stage/api/auth/signin"
    static logoutUrl = "https://cwkc8gb6n1.execute-api.us-west-2.amazonaws.com/stage/api/auth/signout"
    static meUrl = "https://cwkc8gb6n1.execute-api.us-west-2.amazonaws.com/stage/api/auth/me"
    static searchUrl = "https://cwkc8gb6n1.execute-api.us-west-2.amazonaws.com/stage/api/product/search/"
    static dummyProductUrl = "/dummyItems.json"
    static bigMoneySquadGangGangUrl = "https://cwkc8gb6n1.execute-api.us-west-2.amazonaws.com/stage/api/cart/checkout"
    static addItemUrl = "https://cwkc8gb6n1.execute-api.us-west-2.amazonaws.com/stage/api/product/inventory"

    static clearCookies() {
        Cookies.remove('token')
        Cookies.remove('email')
    }

    static getToken() {
        return Cookies.get('token')
    }
    static getEmail() {
        return Cookies.get('email')
    }

    static async getProducts() {
        const query = await fetch(this.listAllProductsUrl) // Change
        const data = await query.json()
        const products = data.body.map(item => new Product(
            item.product_id,
            item.product_category,
            item.product_description,
            item.product_images,
            item.product_name,
            item.product_price
        ));
        return products
    }
    static async getEmail() {
        const query = await fetch(this.meUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Cookies.get('token')}`
            },
        })
        const data = await query.json()
        console.log(data);
        return data;

    }


    static async login (username, password) {
        const payload = {
            "email": username,
            "password": password
        }
        const response = await fetch(this.loginUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        })
        const data = await response.json();
        console.log("From API " + data.token);
        Cookies.set('token', data.token, { path: '/' });
        Cookies.set('email', data.email, { path: '/' });
        Cookies.set('admin', true, { path: '/' });
        return data;
    }

    static async logOut () {
        const auth = Cookies.get('token');
        const payload = {
            "Authorization": `Bearer ${auth}`,
            'Content-Type': 'application/json'
        };
        const response = await fetch(this.logoutUrl, {
            method: 'GET',
            headers: payload
        })
        const data = await response.json();
        console.log(data);
        return data;

    }

    static async chatBox(message) {
        const payload = {
            "text": message
        }

        const query = await fetch(this.chatboxUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })

        const data = await query.json()

        console.log(data.lexResponse)

        return data.lexResponse;
    }

    static async contactForm(payload) {
        const response = await fetch(this.contact, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
        const data = await response.json();
        return data;
    }

    static async getShoppingCart() {
        const email = Cookies.get('email')
        const products = []
        const payload = {
            "user_email": email
        }
        const query = await fetch(this.userShoppingListUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
        const data = await query.json()

        const productsEmail = data.body
        console.log(data)
        for (const element of productsEmail) {
            const productid = element.product_id;
            const query2 = await fetch(this.prouductUrl + productid); 
            const productData = await query2.json(); 
            const product = new Product(
                productData.body.product_id,
                productData.body.product_category,
                productData.body.product_description,
                productData.body.product_images,
                productData.body.product_name,
                productData.body.product_price
            )
            products.push(product); 
        }
        return products;
    }

    static async removeFromShoppingcart(id ) {
        const email = Cookies.get('email')
        const payload = {
            "user_email": email,
            "product_id": id
        }
        const result = await fetch(this.userShoppingDeleteUrl, {
            method: 'DELETE',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
        console.log(result);
        return result;
        

    }

    static async postShoppingCart(id) {
        const email = Cookies.get('email')
        const payload = {
            "user_email": email,
            "product_id": id
        }
        const query = await fetch(this.userShoppingCartAddUrl, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
        const data = await query.json()
        // console.log(data);
        return data.body;

    }

    static async getSearchProducts(searchTerm) {
        const productList = []

        const query = await fetch(this.searchUrl + searchTerm, {
            method: 'GET',
        })
        const data = await query.json()
        console.log(data.body);
        for (const element of data.body) {
            const product = new Product(
                element.product_id,
                element.product_category,
                element.product_description,
                element.product_images,
                element.product_name,
                element.product_price
            )
            productList.push(product);
        }

        return productList;
    }

    static async getDummyProduct() {
        const query = await fetch(this.dummyProductUrl)
        const data = await query.json()
        const product = new Product(
            data[0].product_id,
            data[0].product_category,
            data[0].product_description,
            data[0].product_images,
            data[0].product_name,
            data[0].product_price
        );
        return product
    }

    static async getProductById(id){
        const query = await fetch(this.prouductUrl + id)
        const data = await query.json()
        console.log(data.body);
        const product = new Product(
            data.body.product_id,
            data.body.product_category,
            data.body.product_description,
            data.body.product_images,
            data.body.product_name,
            data.body.product_price
        );
        return product
    }

    static async postFavorites(operation, id) {
        const email = Cookies.get('email')
        const payload = {
            "operation": operation,
            "email": email,
            "product_id": id
        }
        const query = await fetch(this.favouriteUrl, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
        console.log(query.json());
        
    }

    static async getFavorites() {
        try {
            const response = await fetch(this.favouriteUrl + Cookies.get('email'));
            const data = await response.json();
            console.log(data);
            return data;
        } catch (error) {
            console.error("Error fetching favorites:", error);
            throw error;
        }
    }

    static async addItem(product) {
        const payload = {
            "product_name": product.product_name,
            "product_price": product.product_price,
            "product_category": product.product_category,
            "amount": product.amount,
            "product_description": product.product_description,
            "product_images": []
            
        }
        console.log(payload);
        try {
            const query = await fetch(this.addItemUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })
            console.log(query.json());
        } catch (e) {
            console.log("couldnt add item", e);
            throw e;
        }
        
    }

    static async stripeCheckout(amount, currency = "cad") {
        const payload = {
            "amount": (amount * 100),
            "currency": currency,
        }
        try {
            const response = await fetch(this.bigMoneySquadGangGangUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })
            const data = await response.json()
            return data;
        } catch (e) {
            console.log("couldnt get the Stripe checkout page", e);
            throw e;
        }
    }
}

export default API;