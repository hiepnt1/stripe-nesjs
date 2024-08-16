import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";

function usePaymentForm() {
    const stripe = useStripe();
    const elements = useElements();

    const getPaymentMethodId = async () => {
        const cardElement = elements?.getElement(CardElement);

        if (!stripe || !elements || !cardElement) {
            return;
        }

        const stripeResponse = await stripe?.createPaymentMethod({
            type: 'card',
            card: cardElement
        });

        const { error, paymentMethod } = stripeResponse;

        if (error || !paymentMethod) {
            return;
        }

        return paymentMethod.id;
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        const paymentMethodId = await getPaymentMethodId();

        if (!paymentMethodId) {
            return;
        }

        const response = await fetch(`${process.env.REACT_APP_API_URL}/credit-cards`, {
            method: 'POST',
            body: JSON.stringify(({
                paymentMethodId,
            })),
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
        })

        const responseJson = await response.json();

        const clientSecret = responseJson.client_secret;

        stripe?.confirmCardSetup(clientSecret);
    };

    return {
        handleSubmit
    }
}

export default usePaymentForm;