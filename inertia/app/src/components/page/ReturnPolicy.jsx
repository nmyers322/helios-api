import InformationPage from "../../styles/InformationPage";
import { PageTitle } from "../../styles/Page";

const returnPolicy = `Last Updated: 01/28/2025

<b>All Sales Are Final</b>
Please carefully review your order before confirming your purchase. All sales are considered final. We do not offer refunds or exchanges for any products or services sold through Helios Press LLC.  

<b>Exceptions to the No Refund Policy</b>
The only exceptions to our No Refund Policy include:
<ul><li>Defective or Damaged Items: In the case of items that are received defective or damaged, please report this within 7 days of receiving the item. In such cases, a replacement may be provided at the discretion of Helios Press LLC.</li>
<li>Wrong Item Sent: If you receive an item different from the one you ordered, please notify our Customer Service within 7 days for a possible refund or exchange.</li>
<li>Incomplete Service: If a purchased service is not fully delivered or does not meet the predefined criteria as advertised, a partial or full refund may be considered.</li>
<li>Legal Requirements: Following applicable laws, any other conditions or circumstances where we are legally required to offer a refund will be honored.</li></ul>
<b>How to Contact Us</b>
For any questions or concerns regarding this No Refund Policy, please contact us at:

contact@heliospressing.com

We reserve the right to modify this No Refund Policy at any time, effective upon posting of an updated version on our website. Please regularly check heliospressing.com for updates.`;

const ReturnPolicy = () => {
  return (
    <InformationPage>
      <PageTitle>Return Policy</PageTitle>
      <div dangerouslySetInnerHTML={{
        __html: returnPolicy.replace(/\n/g, "<br />") 
      }} />
    </InformationPage>
  );
};

export default ReturnPolicy;