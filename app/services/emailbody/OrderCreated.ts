import Address from "#models/address";
import Order from "#models/order";
import AddressService from "#services/AddressService";
import CartService from "#services/CartService";
import theme from '#services/emailbody/theme';

export default class OrderCreated {
    public static async getEmailBody(order: Order) {
        const { billingAddress, pricedCart, selectedShippingOption, shippingAddress } = order;
        const t = theme.light;
        const escapeHtml = (value: string) =>
            value
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");

        const style = `
            <style>
                body {
                    font-family: ${t.fonts.base};
                    font-size: ${t.fonts.size};
                    background: ${t.colors.background};
                    color: ${t.colors.text};
                }
                h1, h2 {
                    color: ${t.colors.primary};
                }
                ul {
                    background: ${t.colors.cardBackground};
                    padding: 10px;
                    border-radius: 5px;
                }
                li {
                    color: ${t.colors.text};
                }
                a {
                    color: ${t.colors.link};
                }
                #card {
                    background-color: ${t.colors.cardBackground};
                    padding: 1rem 2rem 1.5rem 2rem;
                    border-radius: 1rem;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    align-items: center;
                    text-align: center;
                    margin-right: 1rem;
                    margin-left: 1rem;
                    width: calc(100% - 12rem);
                    max-width: 40rem;

                    @media (max-width: 30rem) {
                        padding: 1rem 2rem 1.5rem 2rem;
                        width: calc(100% - 6rem);
                    }
                }
            </style>
        `;

        const formattedBillingAddress = await AddressService.displayBillingAddress(JSON.parse(billingAddress) as Address);
        const formattedShippingAddress = await AddressService.displayShippingAddress(JSON.parse(shippingAddress) as Address);
        const parsedCart = JSON.parse(pricedCart);
        const bandName = CartService.getAttributeValue(parsedCart, "bandName");
        const albumTitle = CartService.getAttributeValue(parsedCart, "albumTitle");
        const catalogNumber = CartService.getAttributeValue(parsedCart, "catalogNumber");
        const totalQuantity = CartService.getItemBySku(parsedCart, "helios-total-quantity")?.quantity;
        const albumType = CartService.getAlbumType(parsedCart);
        const testPresses = CartService.getTestPresses(parsedCart);
        const colorItems = CartService.getWeighedColorItems(parsedCart);
        const colorSetupFee = CartService.getItemBySku(parsedCart, "helios-12inch-color-setup-fee");
        const centerLabels = CartService.getCenterLabelLabel(parsedCart);
        const outerPackaging = CartService.getOuterPackaging(parsedCart);
        const weight = CartService.getWeight(parsedCart);
        const setupFee = CartService.getRecordSetupFee(parsedCart);
        const innersleeve = CartService.getInnersleeveLabel(parsedCart);
        const assemblyOption = CartService.getAssemblyOptionLabel(parsedCart);
        const insert = CartService.getInsertLabel(parsedCart);
        const polybag = CartService.getPolybagLabel(parsedCart);
        const orderComment = order.orderComment ? escapeHtml(order.orderComment) : "";

        const shippingCost = JSON.parse(selectedShippingOption)?.totalCost || 0;
        const subTotal = await CartService.getSubTotalPrice(parsedCart);
        const totalCost = await CartService.getTotalPrice(subTotal, JSON.parse(selectedShippingOption));

        const emailBody = `
            <meta name="viewport" content="width=device-width, initial-scale=1">
            ${style}
            <body style="font-family: 'Trebuchet MS', sans-serif; font-size: ${t.fonts.size}; background: ${t.colors.background}; color: ${t.colors.text};">
                <div class="card" id="card" style="background:${t.colors.cardBackground};border-radius:1rem;padding:1rem 2rem 1.5rem 2rem;max-width:40rem;margin:auto;font-family:'Trebuchet MS',sans-serif;">
                    <img src="${process.env.VITE_REACT_APP_DOMAIN}/helios-text-yellow-1000.png" alt="Helios Press Logo" style="width: 100px; height: auto;" />
                    <h1>Order Confirmation: #${order.id}</h1>
                    <p>Thank you for your order! A member of the Helios team will be reaching out to you soon.</p>
                    <h2>Shipping Details</h2>
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:1rem;">
                        <tr>
                            <td valign="top" style="padding-right:10px;">${formattedBillingAddress}</td>
                            <td valign="top" style="padding-left:10px;">${formattedShippingAddress}</td>
                        </tr>
                    </table>
                    <p><strong>Shipping via:</strong> ${JSON.parse(selectedShippingOption)?.serviceName}</p>
                    <h2>Order Details</h2>
                    <table width="100%" cellpadding="4" cellspacing="0" style="background:${t.colors.background};border-radius:8px;font-family:'Trebuchet MS',sans-serif;">
                        <tr><td><strong>Catalog Number:</strong></td><td>${catalogNumber}</td></tr>
                        <tr><td><strong>Band/Album:</strong></td><td>${bandName} - ${albumTitle}</td></tr>
                        <tr><td><strong>Album Type:</strong></td><td>${albumType}</td></tr>
                        <tr><td><strong>Total Quantity:</strong></td><td>${totalQuantity}</td></tr>
                        <tr><td><strong>Weight:</strong></td><td>${weight?.label}</td></tr>
                        <tr><td><strong>Setup Fee:</strong></td><td>$${setupFee?.toFixed(2)}</td></tr>
                        <tr><td><strong>Test Presses:</strong></td><td>${testPresses?.quantity || 0}: $${testPresses.total}</td></tr>
                        <tr>
                            <td valign="top"><strong>Colors and Amounts:</strong></td>
                            <td>
                                <ul style="margin:0;padding-left:18px;">
                                    ${colorItems.map((item: any) => {
                                        const color = item.variation?.find((v: any) => v.attribute === "color")?.value || "Unknown";
                                        return `<li><strong>${color}:</strong> ${item.quantity} @ $${item.price?.toFixed(2) || "0.00"} each (Total: $${item.total?.toFixed(2) || "0.00"})</li>`;
                                    }).join("")}
                                </ul>
                            </td>
                        </tr>
                        <tr><td><strong>Color Setup Fees:</strong></td><td>$${colorSetupFee?.total?.toFixed(2) || "0.00"}</td></tr>
                        <tr><td><strong>Center Labels:</strong></td><td>${centerLabels?.label || "N/A"}${centerLabels?.total ? `: $${centerLabels.total.toFixed(2)}` : ""}</td></tr>
                        <tr><td><strong>Outer Packaging:</strong></td><td>${outerPackaging?.label || "N/A"}${outerPackaging?.total ? `: $${outerPackaging.total.toFixed(2)}` : ""}</td></tr>
                        <tr><td><strong>Innersleeves:</strong></td><td>${innersleeve?.label || "N/A"}${innersleeve?.total ? `: $${innersleeve.total.toFixed(2)}` : ""}</td></tr>
                        <tr><td><strong>Assembly Option:</strong></td><td>${assemblyOption?.label || "N/A"}${assemblyOption?.total ? `: $${assemblyOption.total.toFixed(2)}` : ""}</td></tr>
                        <tr><td><strong>Insert:</strong></td><td>${insert?.label || "N/A"}${insert?.total ? `: $${insert.total.toFixed(2)}` : ""}</td></tr>
                        <tr><td><strong>Polybag:</strong></td><td>${polybag?.label || "N/A"}${polybag?.total ? `: $${polybag.total.toFixed(2)}` : ""}</td></tr>
                        <tr><td><strong>Shipping Cost:</strong></td><td>$${shippingCost.toFixed(2)}</td></tr>
                        ${orderComment ? `<tr><td><strong>Customer Comment:</strong></td><td>${orderComment}</td></tr>` : ""}
                        <tr><td><strong>Total Cost:</strong></td><td><strong>$${totalCost.toFixed(2)}</strong></td></tr>
                    </table>
                </div>
            </body>
        `;
        return emailBody;
    }
}