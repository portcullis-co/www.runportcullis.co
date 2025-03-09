import { renderers } from "../../renderers.mjs";
const post = async ({ request }) => {
  const { channelName, message } = await request.json();
  const slackToken = "YOUR_SLACK_BOT_TOKEN";
  const slackChannel = channelName;
  const response = await fetch("https://slack.com/api/chat.postMessage", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${slackToken}`
    },
    body: JSON.stringify({
      channel: slackChannel,
      text: message
    })
  });
  const data = await response.json();
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      "Content-Type": "application/json"
    }
  });
};
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  post
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
