import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from './paymentForm/paymentForm';

const stripePromise = loadStripe('pk_test_51OrjgR01xya3lYTPQBNckpF3wWEAD1gpp6Qea0l41xhRNoewm2u62fIm8YbeAUXFfqeXTbmeBSsuaqa3pSKfXWSf00j6OWe604')
function App() {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm />
    </Elements>
  );
}

export default App;
