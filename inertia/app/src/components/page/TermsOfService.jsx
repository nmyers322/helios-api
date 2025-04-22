import InformationPage from "../../styles/InformationPage";
import { PageTitle } from "../../styles/Page";

const tos = `1. Introduction

Welcome to Helios Press! These terms and conditions outline the rules and regulations for the use of Helios Press's Website, located at https://heliospressing.com.

By accessing this website, we assume you accept these terms and conditions. Do not continue to use Helios Press if you do not agree to all of the terms and conditions stated on this page.

2. Cookies

We employ the use of cookies and Local Storage. By accessing Helios Press, you agreed to use cookies and local storage in agreement with the Helios Press's Privacy Policy.

3. License

Unless otherwise stated, Helios Press and/or its licensors own the intellectual property rights for all material on Helios Press. All intellectual property rights are reserved. You may access this from Helios Press for your own personal use subjected to restrictions set in these terms and conditions.

You must not:

Republish material from Helios Press
Sell, rent, or sub-license material from Helios Press
Reproduce, duplicate, or copy material from Helios Press
Redistribute content from Helios Press

4. User Comments

Parts of this website offer an opportunity for users to post and exchange opinions and information in certain areas of the website. Helios Press does not filter, edit, publish or review Comments prior to their presence on the website. Comments do not reflect the views and opinions of Helios Press, its agents, and/or affiliates. Comments reflect the views and opinions of the person who posts their views and opinions.

Helios Press shall not be liable for the Comments or for any liability, damages, or expenses caused and/or suffered as a result of any use of and/or posting of and/or appearance of the Comments on this website.

Helios Press reserves the right to monitor all Comments and to remove any Comments which can be considered inappropriate, offensive, or causes a breach of these Terms and Conditions.

5. Hyperlinking to our Content

The following organizations may link to our Website without prior written approval:

Government agencies;
Search engines;
News organizations;
Online directory distributors may link to our Website in the same manner as they hyperlink to the Websites of other listed businesses; and
System-wide Accredited Businesses except soliciting non-profit organizations, charity shopping malls, and charity fundraising groups which may not hyperlink to our Web site.

6. iFrames

Without prior approval and written permission, you may not create frames around our Webpages that alter in any way the visual presentation or appearance of our Website.

7. Content Liability

We shall not be hold responsible for any content that appears on your Website. You agree to protect and defend us against all claims that is rising on your Website. No link(s) should appear on any Website that may be interpreted as libelous, obscene or criminal, or which infringes, otherwise violates, or advocates the infringement or other violation of, any third party rights.

8. Your Privacy

Please read Privacy Policy at https://heliospressing.com/privacy

9. Reservation of Rights

We reserve the right to request that you remove all links or any particular link to our Website. You approve to immediately remove all links to our Website upon request. We also reserve the right to amend these terms and conditions and its linking policy at any time. By continuously linking to our Website, you agree to be bound to and follow these linking terms and conditions.

10. Removal of links from our website

If you find any link on our Website that is offensive for any reason, you are free to contact and inform us any moment. We will consider requests to remove links but we are not obligated to or so or to respond to you directly.

We do not ensure that the information on this website is correct, we do not warrant its completeness or accuracy; nor do we promise to ensure that the website remains available or that the material on the website is kept up to date.

11. Disclaimer

To the maximum extent permitted by applicable law, we exclude all representations, warranties and conditions relating to our website and the use of this website. Nothing in this disclaimer will:

limit or exclude our or your liability for death or personal injury;
limit or exclude our or your liability for fraud or fraudulent misrepresentation;
limit any of our or your liabilities in any way that is not permitted under applicable law; or
exclude any of our or your liabilities that may not be excluded under applicable law.
The limitations and prohibitions of liability set in this Section and elsewhere in this disclaimer: (a) are subject to the preceding paragraph; and (b) govern all liabilities arising under the disclaimer, including liabilities arising in contract, in tort and for breach of statutory duty.
`;

const TermsOfService = () => {
  return (
    <InformationPage>
      <PageTitle>Terms of Service</PageTitle>
      <div dangerouslySetInnerHTML={{
        __html: tos.replace(/\n/g, "<br />") 
      }} />
    </InformationPage>
  );
};

export default TermsOfService;