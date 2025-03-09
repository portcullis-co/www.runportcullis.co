const id = "documentation/commerce/data-fulfillment.mdx";
const collection = "docs";
const slug = "documentation/commerce/data-fulfillment";
const body = "\nThis is the fun part! Once you've received a payment for a data product, you get to fulfill the request! As of this writing, we have not currently set up a method to automate the process of exposing or emailing a link to your preferred Semantic Layer endpoint to your customer, but we have plans on our internal roadmap to enable dynamic sharing of protected data endpoints.\n\nFor now, you can simply email the link to your customer, and they can access the data through the link.\n\n## Steps to Fulfill Data Requests\n\n### 1. Receive Payment\n\nOnce a customer completes a payment for your data product, you will receive a notification. This notification will include details about the transaction, such as the amount paid and the customer's contact information.\n\n### 2. Generate Data Access Link\n\nAfter receiving the payment, you need to send your semantic layer endpoint to your custoner. This endpoint will provide the customer with access to the data they have purchased.\n\n### 3. Email the endpoint to the Customer\n\nOnce you have the data access link, you can email it to the customer by finding the customer's email address in the payments page. ";
const data = { title: "Data Fulfillment", description: "How to fulfill data requests" };
const _internal = {
  type: "content",
  filePath: "/Users/jdbohrman/www.runportcullis.co/src/content/docs/documentation/commerce/data-fulfillment.mdx",
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
