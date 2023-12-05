import json
import boto3
import uuid
import base64


def grab_product_details(dynamodb, products, count):
    
    table = dynamodb.Table('storefront_product')
    
    tally = dict()
    for i in range(len(products)):
        tally[products[i]] = count[i]

    
    all_products = []
    for product_id, quantity in tally.items():
        try:
            response = table.get_item(
                Key={
                    'product_id': product_id
                }
            )
            
            product_name = response['Item']['product_name']
            product_price = response['Item']['product_price']
            all_products.append((product_id, product_name, quantity, quantity * int(product_price)))
            

        except Exception as ex:
            print('Error: ', ex)
            return
    
    return all_products


def generate_short_uuid():
    unique_id = uuid.uuid4()
    uuid_bytes = unique_id.bytes
    encoded_uuid = base64.urlsafe_b64encode(uuid_bytes)
    short_uuid = encoded_uuid.decode('utf-8')

    return short_uuid[:8]
    
    
def add_to_order_table(dynamodb, email, products):
    order_table = dynamodb.Table('storefront_orders')
    
    try:
        order_id = generate_short_uuid()
        response = order_table.put_item(
            Item={
                'id': order_id,
                'email': email,
                'products': products
            }
        )
        
        return order_id
    
    except Exception as ex:
        print("Error: inserting row to orders table - ", ex)
        return
    

def generate_html(products, order_number):
    total = 0

    html_string = f"<h2>Your order is confirmed: #{order_number}</h2><h3>Order Summary:</h3><table border='1'><tr><th>Description</th><th>Quantity</th><th>Price</th></tr>"

    for product in products:
        product_id, product_name, quantity, price = product
        html_string += f"<tr><td>{product_name}</td><td>{quantity}</td><td>${price:.2f}</td></tr>"
        total += price

    tax = total * 0.13
    total_amount = total * 1.13
    html_string += f'<tr><td>TAX</td><td>-</td><td>${tax:.2f}</td></tr>'
    html_string += f'</table><p><b>TOTAL: ${total_amount:.2f}</b></p><p>Thank you for choosing to shop with us. You will receive a notification as soon as your product is dispatched for delivery.</p>'

    return html_string



def send_email(client, email, html_string, order_number):
    
    response = client.send_email(
        Source='storefront.exclusivity@gmail.com',
        Destination={
            'ToAddresses': [
                email
            ]
        },
        Message={
            'Subject': {
                'Data': 'Storefront Order Confirmation #' + order_number
            },
            'Body': {
                'Html': {
                    'Data': html_string
                    # 'Data': 'HTML Data <h2>Hello </h2>'
                    # 'Charset': 'string'
                }
            }
        },
        ReplyToAddresses=[
            'storefront.exclusivity@gmail.com',
        ]    
    )


def remove_shopping_cart_items(dynamodb, email, products):
    
    table = dynamodb.Table('storefront_shopping_cart')
    gsi = "storefront_shopping_cart_gsi"
    
    for product in products:
        product_id, name, quantity, total_price = product
        
        try:
            response = table.query(
                IndexName=gsi,
                KeyConditionExpression='user_email = :user_email AND product_id = :product_id',
                ExpressionAttributeValues={
                    ':user_email': email,
                    ':product_id': product_id
                }
            )
            
            if 'Items' in response:
                item = response['Items']

            cart_id = item[0]['cart_id']
            count = item[0]['count']
            count -= quantity
            
            if count > 0:
                table.update_item(
                    Key={
                        'cart_id': cart_id
                    },
                    UpdateExpression='SET #countAttr = :count',
                    ExpressionAttributeNames={
                        '#countAttr': 'count'
                    },
                    ExpressionAttributeValues={
                        ':count': count
                    }
                )
            else:
                table.delete_item(
                    Key={
                        'cart_id': cart_id
                    }
                )
                
        except Exception as ex:
            print("Error updating shopping cart table: ", ex)
            return
        


def lambda_handler(event, context):
    print("Event: ", event)
    
    try: 
        dynamodb = boto3.resource('dynamodb')
        ses_client = boto3.client('ses')
        
        email = event['email']
        products = event['products']
        count = event['count']
        
        all_products = grab_product_details(dynamodb, products, count)
        order_number = add_to_order_table(dynamodb, email, all_products)
        html_string = generate_html(all_products, order_number)
        
        send_email(ses_client, email, html_string, order_number)
        remove_shopping_cart_items(dynamodb, email, all_products)
        
        return {
            'statusCode': 200,
            'body': json.dumps('Success: order confirmation email sent.')
        }
        
    except Exception as ex:
        print("Error: confirmation email issue - ", ex)
        
        return {
            'statusCode': 500,
            'body': f"Error: {ex}"
        }
    