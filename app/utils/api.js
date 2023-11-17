import Product from "../models/productModel";

class API {
    static listAllProductsUrl = "https://cwkc8gb6n1.execute-api.us-west-2.amazonaws.com/stage/api/product/list"
    static prouductUrl = "https://cwkc8gb6n1.execute-api.us-west-2.amazonaws.com/stage/api/product/"
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
}

export default API;