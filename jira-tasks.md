# HELIOS Jira Tasks (Local Mirror)

Source board: https://nmyers322.atlassian.net/jira/software/projects/HELIOS/boards/1  
Pulled: 2026-03-10

### Not started

Please note: For all tasks that add a new option the customer can check or enter, ensure the order summary panel, the order summary page, database structures, cached data, and email templates are all updated to reflect the new data. That also includes admin views!

Please note: We aren't going to be migrating any time soon, so the tickets about data imports or data duplication aren't high priority. We just need to think about what will happen in the scenario that we need to deploy the server again.

- [ ] `HELIOS-329` get back to order summary from admin
- [ ] `HELIOS-338` color minimum 50 if you already 100 black. If you remove the 100 black, show errors again preventing checkout
- [ ] `HELIOS-328` Price per record on summary
- [ ] `HELIOS-325` customer supplied stampers - You can see there's a "record setup fee", that differs based on LP vs Double LP. Allow the customer to remove this fee by offering a new checkbox on Record Details that allows them to supply their own stampers. This fee is there in order to cover creating the stampers. Of course there needs to be a disclaimer (when checked) similar to the other disclaimers we already have, stating that they need to get it to us.
- [ ] `HELIOS-337` Option for no test press - Allow the customer to check a box saying they don't want a test press. Add disclaimer when they do check saying that we aren't responsible for turnout of record.
- [X] `HELIOS-369` The zip files - just need to upload. Fixed 404 issue
- [ ] `HELIOS-336` Order confirmation email sent to admins too - When we get an order, there should be a "you just got a new order" email that gets sent to admins. Admin users are listed in the db, ensure we have emails for them there. If not, add a new column. Look at user structure and see if the UI supports admin email (i'm pretty sure it does already). Send the email to all admins. The email that gets sent needs a new template. It should be similar to the customer's order email but the admin view would be slightly different. Need to look at existing admin orders detail page and just use that data. 
- [ ] `HELIOS-372` Disable fetching shipping rates - Right now the shipping rates calculation is broken because we aren't paying the premium API cost. So let's just keep the code but instead of calling, just say that shipping is currently out of order. 
- [ ] `HELIOS-358` 5% discount for bank transfer option. When the user selects bank transfer, we should be discounting the entire order by 5%, and show the discount on the order details. Need to ensure we are calculating totals correctly, showing the discount before the total amount, and ensure we are showing this on all order summaries and emails. 
- [ ] `HELIOS-360` weight upcharge "hidden" - Right now there's a separate row for "Weight", but instead of showing that to the customer, we need to just lump it into the quantities cost. That way people aren't complaining about getting charged for something they don't understand.
- [ ] `HELIOS-330` play speed option - 33RPM or 45RPM. Just another option that needs to go on the record details section. 
- [ ] `HELIOS-366` addresses are duplicated on import - Customer addresses were getting duplicated on import because the data was inserted multiple times. Might need to check the DB and clean it up.
- [ ] `HELIOS-367` postgres sequence id needs to be max id after import - Just make sure we aren't overwriting data upon insert of imported data.
- [X] `HELIOS-368` dump and import after dns change - Not sure what this ticket was about. I think it was just the act of transfering data, but it's all up and running now.
- [ ] `HELIOS-373` press enter to submit password - I was unable to hit enter after typing my password on the login screen. Need to check if this is still an issue or not.

## Backlog

### Low Priority (Jira column)
- [ ] `HELIOS-295` order form dropdowns cutoff on mobile, can't scroll to see them.
- [ ] `HELIOS-255` Show detailed error and contact info after failed checkout - ensure we have robust error handling
- [ ] `HELIOS-196` Direct path access to order form must take you back to valid card - it's possible to directly access any point in the order flow by URL, so check data and then go back to the last valid card if you happen to do that.
- [ ] `HELIOS-71` mobile order progress menu - We are going to allow customers to check in on their order. Not sure what this looks like yet.
- [ ] `HELIOS-238` change my passwords on servers - this is a personal task. I don't want personal passwords getting stolen
- [ ] `HELIOS-258` checkout should kick you back if address invalid - just check for populated fields. Address should have been filled out by now, but it's possible they accessed checkout by URL or something.
- [ ] `HELIOS-260` address/checkout page Nav sidebar - Don't remember how this stands but it could probably be improved - let's check it out and decide what to do.
- [ ] `HELIOS-280` set beenBlurred after auto populating address - weird UI behavior, just check the experience
- [ ] `HELIOS-167` client-side cart validation - this was never implemented. Can't remember where we stand. Use common methods so when we add new fields we don't have to update everything everywhere
- [ ] `HELIOS-44` Tooltips on important/confusing fields - Skip for now, I don't know what they want to put
- [ ] `HELIOS-184` serialization.santizeUserInput implementation
- [ ] `HELIOS-259` dark mode address wrong color text
- [ ] `HELIOS-290` general error handling from app to API

### Phase 2 (Jira column)
- [ ] `HELIOS-39` “If your project falls outside the scope of these options, please use the contact form for a custom order” - skip for now
- [ ] `HELIOS-231` Offer media mail for orders less than 100 - skip for now
- [ ] `HELIOS-35` contact us form, inside customer portal - I think we did this? Need to check
- [ ] `HELIOS-213` quote flow - This is basically the same as creating an order, except you don't checkout. You create a "quote" object so you can send it to the customer. Then, they can sign-up from there and checkout. If you go to the link, it should populate a new object that is locally stored like "currentQuote" or whatever is similar to our existing local storage. Then when they are logged in and click the "continue to order" button, whatever it should actually say, it populates the existing order/checkout flow and they can checkout like normal. So to recap, they land on a particular custom quote page that is not tied to any customer, and then they can click a button that will convert it into an active order and they can enter the order flow from there. The quotes are created by an admin: There should be a new admin section where you can fill out all the details. Re-use the regular order form components, and at the end, a button that allows you to create the quote, which would then display a link that you can send to the customer, or enter the customer's email and then it would send it to them. New email template with the quote button to access it. Will need new quote object in the db. Also need a new admin view where you can see the list of quotes and their status (new, opened, converted to order - with order number perhaps?)
- [ ] `HELIOS-16` 404 not found page - when directly accessing non-existent URL ensure we see a not found page
- [ ] `HELIOS-43` Parse uploaded art files into preview/mock then show it on the in-progress order page - skip for now
- [ ] `HELIOS-50` Upload File component class. To be used later for customer to upload art files (made from templates).
- [ ] `HELIOS-55` On landing page after you submit the Order Form, offer a zip file that is custom tailored to the parameters they submitted i.e. Standard Jacket, single sided insert, etc
- [ ] `HELIOS-57` New Admin section where owners can reply to customer's questions that come from the customer portal contact form - skip for now
- [ ] `HELIOS-61` in customer portal, list all releases they have in progress or completed
- [ ] `HELIOS-62` in customer portal, next to each release in list, allow customer to re-order the release
- [ ] `HELIOS-128` Colors detail popup - skip for now
- [ ] `HELIOS-90` User cookie acceptance
- [ ] `HELIOS-112` Enforce special rules on backend api - everything in the UI needs to be also enforced on API endpoints, like certain options that only go together or certain numbers of colors, etc
- [ ] `HELIOS-119` DPA handling - cron job that auto deletes data if user hasn't logged in for 5 years
- [ ] `HELIOS-197` Back-end accept file upload endpoint
