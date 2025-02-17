export function createMessageDeepLink(params: {
  teamId: string,
  channelId: string,
  messageTs: string
}): string {
  const { teamId, channelId, messageTs } = params;
  return `slack://app?team=${teamId}&channel=${channelId}&message_ts=${messageTs}`;
}
