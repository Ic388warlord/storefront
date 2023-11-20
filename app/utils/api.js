import Product from "../models/productModel";

class API {
    static listAllProductsUrl = "https://cwkc8gb6n1.execute-api.us-west-2.amazonaws.com/stage/api/product/list"
    static userShoppingListUrl = "https://cwkc8gb6n1.execute-api.us-west-2.amazonaws.com/stage/api/cart/" // Requires two api calls
    static userShoppingCartAddUrl = "https://cwkc8gb6n1.execute-api.us-west-2.amazonaws.com/stage/api/cart/addItem"
    static prouductUrl = "https://cwkc8gb6n1.execute-api.us-west-2.amazonaws.com/stage/api/product/"
    static favouriteUrl = "https://cwkc8gb6n1.execute-api.us-west-2.amazonaws.com/stage/api/product/favorite/"
    static chatboxUrl = "https://cwkc8gb6n1.execute-api.us-west-2.amazonaws.com/stage/api/chatbot/chat"
    static dummyProductUrl = "/dummyItems.json"

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

    static async getShoppingCart(email) {
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

    static async removeFromShoppingcart(email, id ) {
        const payload = {
            "user_email": email,
            "product_id": id
        }
        await fetch(this.userShoppingCartAddUrl, {
            method: 'DELETE',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })

    }

    static async postShoppingCart(email, id) {
        const payload = {
            "user_email": email,
            "product_id": id
        }
        await fetch(this.userShoppingCartAddUrl, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
    }

    static async postFavorites(operation, email, id) {
        const payload = {
            "operation": operation,
            "email": email,
            "product_id": id
        }
        await fetch(this.favouriteUrl, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
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

    static async postFavorites(operation, email, id) {
        const payload = {
            "operation": operation,
            "email": email,
            "product_id": id
        }
        await fetch(this.favouriteUrl, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
    }

    static async getFavorites(email) {
        try {
            const response = await fetch(this.favouriteUrl + email);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching favorites:", error);
            throw error;
        }
    }
      
    static async logout() {
        console.log(cookies.get('token'))
        if (cookies.get('token') == 'undefined') {
            localStorage.removeItem('username')
            return;
        }
        const payload = {
            "Authorization": `Bearer ${auth}`
        }
        const response  = await fetch("https://cwkc8gb6n1.execute-api.us-west-2.amazonaws.com/stage/api/auth/signout", {
            headers: payload
        })
        const data = await response;
        if (response.ok) {
            cookies.remove('token')
            localStorage.removeItem('username')
            router.push('/profile/login')
        } else {
            alert("Log out failed?")
        }
    }
    

}

export default API;