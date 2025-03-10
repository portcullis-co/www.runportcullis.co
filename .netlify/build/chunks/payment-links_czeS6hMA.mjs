const id = "documentation/commerce/payment-links.mdx";
const collection = "docs";
const slug = "documentation/commerce/payment-links";
const body = "\nAs a merchant on Portcullis, you are responsible for setting and managing your pricing and payment link experience. This means you can choose to offer your data for free, or you can set a price for your data. Currently, we rely on a trust-based system for fee-exchange after you've gotten paid, as Stripe Connect still has some API work to do.\n\nThe way it works is once you receive a payment for X amount, we will invoice you for 25% of that amount. Not the most elegant solution, but it's a good start.\n\n## How Payment Links Work\n\n1. **Generate Links**: Users can generate Payment Links directly from the Portcullis platform. These links can be customized to include specific details about the transaction, such as the amount and description.\n2. **Customization**: Payment Links can be tailored to fit the specific needs of different users and portals. This includes custom branding, descriptions, and pricing.\n3. **Sharing Links**: Once created, Payment Links can be shared with customers via email, social media, or any other communication channel. When a customer clicks the link, they are directed to a secure payment page.\n\n### Managing Payments\n\n1. **Transaction Completion**: Customers can complete their transactions using the secure payment page. Once the payment is processed, the funds are transferred to the user's Stripe Connect account.\n2. **Invoicing**: After a payment is received, Portcullis will invoice the user for 25% of the transaction amount. This fee covers the platform's operational costs and ensures the sustainability of the service.\n3. **Payout Management**: Stripe Connect manages payouts to data providers. Users can set up automatic payouts to their bank accounts, ensuring they receive their earnings promptly and securely.\n\n## Benefits of Payment Links\n\n### Flexibility\n\nPayment Links can be customized to fit the specific needs of different users and portals. This flexibility allows for a wide range of applications and use cases, making it easy to monetize your data.\n\n### Ease of Use\n\nCreating and sharing Payment Links is straightforward and user-friendly. The Portcullis platform provides intuitive tools for managing transactions, ensuring a seamless experience for both merchants and customers.\n\n### Transparency\n\nThe trust-based system for fee-exchange ensures transparency in the payment process. Users are aware of the fees they will be charged, and the invoicing process is clear and straightforward.\n";
const data = { title: "Payment Links", description: "About Payment Links" };
const _internal = {
  type: "content",
  filePath: "/Users/jdbohrman/www.runportcullis.co/src/content/docs/documentation/commerce/payment-links.mdx",
  rawData: void 0
};
export {
  _internal,
  body,
  collection,
  data,
  id,
  slug
};
