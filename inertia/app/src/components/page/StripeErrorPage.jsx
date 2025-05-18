import InformationPage from "../../styles/InformationPage";
import { PageTitle } from "../../styles/Page";

const StripeErrorPage = () => {
  return (
    <InformationPage>
      <PageTitle>Checkout Error</PageTitle>
      <p>There was an unknown error during your Stripe checkout process. Please contact us for support: contact@heliospressing.com</p>
    </InformationPage>
  );
};

export default StripeErrorPage;