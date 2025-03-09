import { createRequire } from 'module';
const require = createRequire(import.meta.url);

let rtviPkg;
try {
  rtviPkg = require('realtime-ai');
} catch (error) {
  // Provide mock implementations for SSR/build
  rtviPkg = {
    RTVIClient: class RTVIClient {},
    RTVIError: class RTVIError extends Error {},
    RTVIEvent: { Error: 'error' },
    RTVIMessage: class RTVIMessage {}
  };
  console.warn('realtime-ai package not available, using mock implementation');
}

import type { RTVIClientConfigOption } from 'realtime-ai';

// Re-export all properties as named exports
export const { RTVIClient, RTVIError, RTVIEvent, RTVIMessage } = rtviPkg;
export type { RTVIClientConfigOption };

// Export everything else as a default export
export default rtviPkg; 