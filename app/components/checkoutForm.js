import React from "react";
import API from "../utils/api";
import {
  PaymentElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import { useRouter } from 'next/navigation';

export default function CheckoutForm({items, productCounts}) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter()

  const [message, setMessage] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(async ({ paymentIntent }) => {
        switch (paymentIntent.status) {
        case "succeeded":
          setMessage("Payment succeeded!");
          break;
        case "processing":
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.");
          break;
        default:
          setMessage("Something went wrong.");
          break;
      }
    });
  }, [stripe]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "http://storefront-ebs-env.eba-ztgpx9h9.us-west-2.elasticbeanstalk.com/shoppingCart/checkout",
        // return_url: "http://localhost:3000/shoppingCart/checkout", //change it to actual link
      },
      redirect: "if_required"
    });

    if (error) {
      console.error(error);
      // handleError();
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      console.log("Payment succeeded");
      const productIds = items.map(item => item.product_id);
      const counts = productCounts;
      try {
          await API.postOrder(productIds, counts);
      } catch (error) {
          console.error("Error posting order:", error);
      }
      router.push('/shoppingCart/checkout');
    } else {
      console.log("Payment failed");
      // handleOther();
    }

    setIsLoading(false);
  };

  const paymentElementOptions = {
    layout: "tabs",
  };

  return (
    <div className= {`flex flex-col gap-3 justify-evenly border shadow-md w-full ${message ? `h-[550px]` : `h-[450px]`} p-5 mt-5`}>
        <form id="payment-form" className="mt-3" onSubmit={handleSubmit}>
        <PaymentElement id="payment-element" options={paymentElementOptions} />
        <button disabled={isLoading || !stripe || !elements} id="submit" className='w-full p-2 my-5 uppercase text-lg text-center bg-blue-600 hover:bg-blue-800 text-white'>
            <span id="button-text">
            {isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
            </span>
        </button>
        {/* Show any error or success messages */}
        {message && <div id="payment-message">{message}</div>}
        </form>
    </div>
  );
}