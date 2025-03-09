import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const rtviPkg = require('realtime-ai');
import type { RTVIClientConfigOption } from 'realtime-ai';

// Re-export all properties as named exports
export const { RTVIClient, RTVIError, RTVIEvent, RTVIMessage } = rtviPkg;
export type { RTVIClientConfigOption };

// Export everything else as a default export
export default rtviPkg; 