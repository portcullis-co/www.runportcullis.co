import { a as createComponent, r as renderComponent, b as renderTemplate, m as maybeRenderHead } from "./astro/server_aMtVhhw-.mjs";
import { a as cn, d as Button, $ as $$MainLayout } from "./main-layout_C4s2EEtb.mjs";
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import * as React from "react";
import React__default, { forwardRef, useRef, useEffect, useCallback, useContext, createContext, useState } from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { ChevronDown, ChevronUp, Check, Mic, Loader2 } from "lucide-react";
import { a as getDefaultExportFromCjs } from "./_commonjsHelpers_azxtCg0z.mjs";
import $eINDk$events from "events";
import { v4 } from "uuid";
import { createStore, atom, useAtomValue, useAtom } from "jotai";
import { Provider } from "jotai/react";
import { atomFamily, useAtomCallback } from "jotai/utils";
import "../renderers.mjs";
const Card = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    ),
    ...props
  }
));
Card.displayName = "Card";
const CardHeader = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn("flex flex-col space-y-1.5 p-6", className),
    ...props
  }
));
CardHeader.displayName = "CardHeader";
const CardTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "h3",
  {
    ref,
    className: cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    ),
    ...props
  }
));
CardTitle.displayName = "CardTitle";
const CardDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "p",
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
CardDescription.displayName = "CardDescription";
const CardContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { ref, className: cn("p-6 pt-0", className), ...props }));
CardContent.displayName = "CardContent";
const CardFooter = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn("flex items-center p-6 pt-0", className),
    ...props
  }
));
CardFooter.displayName = "CardFooter";
const Select = SelectPrimitive.Root;
const SelectValue = SelectPrimitive.Value;
const SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  SelectPrimitive.Trigger,
  {
    ref,
    className: cn(
      "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsx(SelectPrimitive.Icon, { asChild: true, children: /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4 opacity-50" }) })
    ]
  }
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;
const SelectScrollUpButton = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.ScrollUpButton,
  {
    ref,
    className: cn(
      "flex cursor-default items-center justify-center py-1",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsx(ChevronUp, { className: "h-4 w-4" })
  }
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;
const SelectScrollDownButton = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.ScrollDownButton,
  {
    ref,
    className: cn(
      "flex cursor-default items-center justify-center py-1",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4" })
  }
));
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;
const SelectContent = React.forwardRef(({ className, children, position = "popper", ...props }, ref) => /* @__PURE__ */ jsx(SelectPrimitive.Portal, { children: /* @__PURE__ */ jsxs(
  SelectPrimitive.Content,
  {
    ref,
    className: cn(
      "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
      className
    ),
    position,
    ...props,
    children: [
      /* @__PURE__ */ jsx(SelectScrollUpButton, {}),
      /* @__PURE__ */ jsx(
        SelectPrimitive.Viewport,
        {
          className: cn(
            "p-1",
            position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
          ),
          children
        }
      ),
      /* @__PURE__ */ jsx(SelectScrollDownButton, {})
    ]
  }
) }));
SelectContent.displayName = SelectPrimitive.Content.displayName;
const SelectLabel = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.Label,
  {
    ref,
    className: cn("px-2 py-1.5 text-sm font-semibold", className),
    ...props
  }
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;
const SelectItem = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  SelectPrimitive.Item,
  {
    ref,
    className: cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsx("span", { className: "absolute right-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsx(SelectPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" }) }) }),
      /* @__PURE__ */ jsx(SelectPrimitive.ItemText, { children })
    ]
  }
));
SelectItem.displayName = SelectPrimitive.Item.displayName;
const SelectSeparator = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.Separator,
  {
    ref,
    className: cn("-mx-1 my-1 h-px bg-muted", className),
    ...props
  }
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;
var toString = Object.prototype.toString;
var kindOf = function kindOf2(val) {
  if (val === void 0) return "undefined";
  if (val === null) return "null";
  var type = typeof val;
  if (type === "boolean") return "boolean";
  if (type === "string") return "string";
  if (type === "number") return "number";
  if (type === "symbol") return "symbol";
  if (type === "function") {
    return isGeneratorFn(val) ? "generatorfunction" : "function";
  }
  if (isArray(val)) return "array";
  if (isBuffer(val)) return "buffer";
  if (isArguments(val)) return "arguments";
  if (isDate(val)) return "date";
  if (isError(val)) return "error";
  if (isRegexp(val)) return "regexp";
  switch (ctorName(val)) {
    case "Symbol":
      return "symbol";
    case "Promise":
      return "promise";
    case "WeakMap":
      return "weakmap";
    case "WeakSet":
      return "weakset";
    case "Map":
      return "map";
    case "Set":
      return "set";
    case "Int8Array":
      return "int8array";
    case "Uint8Array":
      return "uint8array";
    case "Uint8ClampedArray":
      return "uint8clampedarray";
    case "Int16Array":
      return "int16array";
    case "Uint16Array":
      return "uint16array";
    case "Int32Array":
      return "int32array";
    case "Uint32Array":
      return "uint32array";
    case "Float32Array":
      return "float32array";
    case "Float64Array":
      return "float64array";
  }
  if (isGeneratorObj(val)) {
    return "generator";
  }
  type = toString.call(val);
  switch (type) {
    case "[object Object]":
      return "object";
    case "[object Map Iterator]":
      return "mapiterator";
    case "[object Set Iterator]":
      return "setiterator";
    case "[object String Iterator]":
      return "stringiterator";
    case "[object Array Iterator]":
      return "arrayiterator";
  }
  return type.slice(8, -1).toLowerCase().replace(/\s/g, "");
};
function ctorName(val) {
  return typeof val.constructor === "function" ? val.constructor.name : null;
}
function isArray(val) {
  if (Array.isArray) return Array.isArray(val);
  return val instanceof Array;
}
function isError(val) {
  return val instanceof Error || typeof val.message === "string" && val.constructor && typeof val.constructor.stackTraceLimit === "number";
}
function isDate(val) {
  if (val instanceof Date) return true;
  return typeof val.toDateString === "function" && typeof val.getDate === "function" && typeof val.setDate === "function";
}
function isRegexp(val) {
  if (val instanceof RegExp) return true;
  return typeof val.flags === "string" && typeof val.ignoreCase === "boolean" && typeof val.multiline === "boolean" && typeof val.global === "boolean";
}
function isGeneratorFn(name, val) {
  return ctorName(name) === "GeneratorFunction";
}
function isGeneratorObj(val) {
  return typeof val.throw === "function" && typeof val.return === "function" && typeof val.next === "function";
}
function isArguments(val) {
  try {
    if (typeof val.length === "number" && typeof val.callee === "function") {
      return true;
    }
  } catch (err) {
    if (err.message.indexOf("callee") !== -1) {
      return true;
    }
  }
  return false;
}
function isBuffer(val) {
  if (val.constructor && typeof val.constructor.isBuffer === "function") {
    return val.constructor.isBuffer(val);
  }
  return false;
}
/*!
 * shallow-clone <https://github.com/jonschlinkert/shallow-clone>
 *
 * Copyright (c) 2015-present, Jon Schlinkert.
 * Released under the MIT License.
 */
const valueOf = Symbol.prototype.valueOf;
const typeOf$1 = kindOf;
function clone$1(val, deep) {
  switch (typeOf$1(val)) {
    case "array":
      return val.slice();
    case "object":
      return Object.assign({}, val);
    case "date":
      return new val.constructor(Number(val));
    case "map":
      return new Map(val);
    case "set":
      return new Set(val);
    case "buffer":
      return cloneBuffer(val);
    case "symbol":
      return cloneSymbol(val);
    case "arraybuffer":
      return cloneArrayBuffer(val);
    case "float32array":
    case "float64array":
    case "int16array":
    case "int32array":
    case "int8array":
    case "uint16array":
    case "uint32array":
    case "uint8clampedarray":
    case "uint8array":
      return cloneTypedArray(val);
    case "regexp":
      return cloneRegExp(val);
    case "error":
      return Object.create(val);
    default: {
      return val;
    }
  }
}
function cloneRegExp(val) {
  const flags = val.flags !== void 0 ? val.flags : /\w+$/.exec(val) || void 0;
  const re = new val.constructor(val.source, flags);
  re.lastIndex = val.lastIndex;
  return re;
}
function cloneArrayBuffer(val) {
  const res = new val.constructor(val.byteLength);
  new Uint8Array(res).set(new Uint8Array(val));
  return res;
}
function cloneTypedArray(val, deep) {
  return new val.constructor(val.buffer, val.byteOffset, val.length);
}
function cloneBuffer(val) {
  const len = val.length;
  const buf = Buffer.allocUnsafe ? Buffer.allocUnsafe(len) : Buffer.from(len);
  val.copy(buf);
  return buf;
}
function cloneSymbol(val) {
  return valueOf ? Object(valueOf.call(val)) : {};
}
var shallowClone = clone$1;
/*!
 * isobject <https://github.com/jonschlinkert/isobject>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */
var isobject = function isObject(val) {
  return val != null && typeof val === "object" && Array.isArray(val) === false;
};
/*!
 * is-plain-object <https://github.com/jonschlinkert/is-plain-object>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */
var isObject2 = isobject;
function isObjectObject(o) {
  return isObject2(o) === true && Object.prototype.toString.call(o) === "[object Object]";
}
var isPlainObject$1 = function isPlainObject(o) {
  var ctor, prot;
  if (isObjectObject(o) === false) return false;
  ctor = o.constructor;
  if (typeof ctor !== "function") return false;
  prot = ctor.prototype;
  if (isObjectObject(prot) === false) return false;
  if (prot.hasOwnProperty("isPrototypeOf") === false) {
    return false;
  }
  return true;
};
const clone = shallowClone;
const typeOf = kindOf;
const isPlainObject2 = isPlainObject$1;
function cloneDeep(val, instanceClone) {
  switch (typeOf(val)) {
    case "object":
      return cloneObjectDeep(val, instanceClone);
    case "array":
      return cloneArrayDeep(val, instanceClone);
    default: {
      return clone(val);
    }
  }
}
function cloneObjectDeep(val, instanceClone) {
  if (typeof instanceClone === "function") {
    return instanceClone(val);
  }
  if (instanceClone || isPlainObject2(val)) {
    const res = new val.constructor();
    for (let key in val) {
      res[key] = cloneDeep(val[key], instanceClone);
    }
    return res;
  }
  return val;
}
function cloneArrayDeep(val, instanceClone) {
  const res = new val.constructor(val.length);
  for (let i = 0; i < val.length; i++) {
    res[i] = cloneDeep(val[i], instanceClone);
  }
  return res;
}
var cloneDeep_1 = cloneDeep;
const $eINDk$clonedeep = /* @__PURE__ */ getDefaultExportFromCjs(cloneDeep_1);
function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, { get: v, set: s, enumerable: true, configurable: true });
}
function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}
var $4bb349f22aee5185$exports = {};
$parcel$export($4bb349f22aee5185$exports, "httpActionGenerator", () => $4bb349f22aee5185$export$8728b60ea57bf43e);
async function $4bb349f22aee5185$export$8728b60ea57bf43e(actionUrl, action, params, handleResponse) {
  try {
    (0, $7afbbd59ebaa42bf$export$af88d00dbe7f521).debug("[RTVI] Fetch action", actionUrl, action);
    const headers = new Headers({
      ...Object.fromEntries((params.headers ?? new Headers()).entries())
    });
    if (!headers.has("Content-Type")) headers.set("Content-Type", "application/json");
    headers.set("Cache-Control", "no-cache");
    headers.set("Connection", "keep-alive");
    const response = await fetch(actionUrl, {
      method: "POST",
      headers,
      body: JSON.stringify({
        ...params.requestData,
        actions: [
          action
        ]
      })
    });
    const contentType = response.headers.get("content-type");
    if (!response.ok) {
      const errorMessage = await response.text();
      throw new (0, $8ead7b33b8402751$export$59b4786f333aac02)(`Failed to resolve action: ${errorMessage}`, response.status);
    }
    if (response.body && contentType?.includes("text/event-stream")) {
      const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
      let buffer = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += value;
        let boundary = buffer.indexOf("\n\n");
        while (boundary !== -1) {
          const message = buffer.slice(0, boundary);
          buffer = buffer.slice(boundary + 2);
          const lines = message.split("\n");
          let encodedData = "";
          for (const line of lines) {
            const colonIndex = line.indexOf(":");
            if (colonIndex !== -1) encodedData += line.slice(colonIndex + 1).trim();
          }
          try {
            const jsonData = atob(encodedData);
            const parsedData = JSON.parse(jsonData);
            handleResponse(parsedData);
          } catch (error) {
            (0, $7afbbd59ebaa42bf$export$af88d00dbe7f521).error("[RTVI] Failed to parse JSON:", error);
            throw error;
          }
          boundary = buffer.indexOf("\n\n");
        }
      }
    } else {
      const data = await response.json();
      handleResponse(data);
    }
  } catch (error) {
    $7afbbd59ebaa42bf$export$af88d00dbe7f521.error("[RTVI] Error during fetch:", error);
    throw error;
  }
}
var $a7c324a73303ad55$exports = {};
$parcel$export($a7c324a73303ad55$exports, "RTVIClient", () => $a7c324a73303ad55$export$fa42a01c1d60f4a1);
var $e3bad9cc25e327f7$exports = {};
$e3bad9cc25e327f7$exports = JSON.parse('{"name":"@pipecat-ai/client-js","version":"0.3.3","license":"BSD-2-Clause","main":"dist/index.js","module":"dist/index.module.js","types":"dist/index.d.ts","source":"src/index.ts","repository":{"type":"git","url":"git+https://github.com/pipecat-ai/pipecat-client-web.git"},"files":["dist","package.json","README.md"],"scripts":{"build":"jest --silent && parcel build --no-cache","dev":"parcel watch","lint":"eslint src/ --report-unused-disable-directives --max-warnings 0","test":"jest"},"jest":{"preset":"ts-jest","testEnvironment":"node"},"devDependencies":{"@jest/globals":"^29.7.0","@types/clone-deep":"^4.0.4","@types/jest":"^29.5.12","@types/uuid":"^10.0.0","eslint":"^9.11.1","eslint-config-prettier":"^9.1.0","eslint-plugin-simple-import-sort":"^12.1.1","jest":"^29.7.0","ts-jest":"^29.2.5"},"dependencies":{"@types/events":"^3.0.3","clone-deep":"^4.0.1","events":"^3.3.0","typed-emitter":"^2.1.0","uuid":"^10.0.0"}}');
var $8ead7b33b8402751$exports = {};
$parcel$export($8ead7b33b8402751$exports, "RTVIError", () => $8ead7b33b8402751$export$59b4786f333aac02);
$parcel$export($8ead7b33b8402751$exports, "ConnectionTimeoutError", () => $8ead7b33b8402751$export$c67992fa684a81a6);
$parcel$export($8ead7b33b8402751$exports, "StartBotError", () => $8ead7b33b8402751$export$e7544ab812238a61);
$parcel$export($8ead7b33b8402751$exports, "TransportStartError", () => $8ead7b33b8402751$export$e0624a511a2c4e9);
$parcel$export($8ead7b33b8402751$exports, "BotNotReadyError", () => $8ead7b33b8402751$export$885fb96b850e8fbb);
$parcel$export($8ead7b33b8402751$exports, "ConfigUpdateError", () => $8ead7b33b8402751$export$4eda4fd287fbbca5);
$parcel$export($8ead7b33b8402751$exports, "ActionEndpointNotSetError", () => $8ead7b33b8402751$export$be839f0100cd3132);
class $8ead7b33b8402751$export$59b4786f333aac02 extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}
class $8ead7b33b8402751$export$c67992fa684a81a6 extends $8ead7b33b8402751$export$59b4786f333aac02 {
  constructor(message) {
    super(message ?? "Bot did not enter ready state within the specified timeout period.");
  }
}
class $8ead7b33b8402751$export$e7544ab812238a61 extends $8ead7b33b8402751$export$59b4786f333aac02 {
  constructor(message, status) {
    super(message ?? `Failed to connect / invalid auth bundle from base url`, status ?? 500);
    this.error = "invalid-request-error";
  }
}
class $8ead7b33b8402751$export$e0624a511a2c4e9 extends $8ead7b33b8402751$export$59b4786f333aac02 {
  constructor(message) {
    super(message ?? "Unable to connect to transport");
  }
}
class $8ead7b33b8402751$export$885fb96b850e8fbb extends $8ead7b33b8402751$export$59b4786f333aac02 {
  constructor(message) {
    super(message ?? "Attempt to call action on transport when not in 'ready' state.");
  }
}
class $8ead7b33b8402751$export$4eda4fd287fbbca5 extends $8ead7b33b8402751$export$59b4786f333aac02 {
  constructor(message) {
    super(message ?? "Unable to update configuration");
    this.status = 400;
  }
}
class $8ead7b33b8402751$export$be839f0100cd3132 extends $8ead7b33b8402751$export$59b4786f333aac02 {
  constructor(message) {
    super(message ?? "Action endpoint is not set");
  }
}
function $16f019d4d16917df$export$f1586721024c4dab(_target, propertyKey, descriptor) {
  const originalMethod = descriptor.value;
  descriptor.value = function(...args) {
    if (this.state === "ready") return originalMethod.apply(this, args);
    else throw new $8ead7b33b8402751$export$885fb96b850e8fbb(`Attempt to call ${propertyKey.toString()} when transport not in ready state. Await connect() first.`);
  };
  return descriptor;
}
function $16f019d4d16917df$export$5c35b4fe6fa8c9a6(...states) {
  states = [
    "ready",
    ...states
  ];
  return function(_target, propertyKey, descriptor) {
    const originalGetter = descriptor.get;
    descriptor.get = function() {
      if (states.includes(this.state)) return originalGetter?.apply(this);
      else throw new $8ead7b33b8402751$export$885fb96b850e8fbb(`Attempt to call ${propertyKey.toString()} when transport not in ${states}. Await connect() first.`);
    };
    return descriptor;
  };
}
var $f9fc0c57b9aaed9c$exports = {};
$parcel$export($f9fc0c57b9aaed9c$exports, "RTVIEvent", () => $f9fc0c57b9aaed9c$export$6b4624d233c61fcb);
var $f9fc0c57b9aaed9c$export$6b4624d233c61fcb;
(function(RTVIEvent) {
  RTVIEvent["MessageError"] = "messageError";
  RTVIEvent["Error"] = "error";
  RTVIEvent["Connected"] = "connected";
  RTVIEvent["Disconnected"] = "disconnected";
  RTVIEvent["TransportStateChanged"] = "transportStateChanged";
  RTVIEvent["Config"] = "config";
  RTVIEvent["ConfigDescribe"] = "configDescribe";
  RTVIEvent["ActionsAvailable"] = "actionsAvailable";
  RTVIEvent["ParticipantConnected"] = "participantConnected";
  RTVIEvent["ParticipantLeft"] = "participantLeft";
  RTVIEvent["TrackStarted"] = "trackStarted";
  RTVIEvent["TrackStopped"] = "trackStopped";
  RTVIEvent["ScreenTrackStarted"] = "screenTrackStarted";
  RTVIEvent["ScreenTrackStopped"] = "screenTrackStopped";
  RTVIEvent["ScreenShareError"] = "screenShareError";
  RTVIEvent["AvailableCamsUpdated"] = "availableCamsUpdated";
  RTVIEvent["AvailableMicsUpdated"] = "availableMicsUpdated";
  RTVIEvent["AvailableSpeakersUpdated"] = "availableSpeakersUpdated";
  RTVIEvent["CamUpdated"] = "camUpdated";
  RTVIEvent["MicUpdated"] = "micUpdated";
  RTVIEvent["SpeakerUpdated"] = "speakerUpdated";
  RTVIEvent["BotConnected"] = "botConnected";
  RTVIEvent["BotReady"] = "botReady";
  RTVIEvent["BotDisconnected"] = "botDisconnected";
  RTVIEvent["BotStartedSpeaking"] = "botStartedSpeaking";
  RTVIEvent["BotStoppedSpeaking"] = "botStoppedSpeaking";
  RTVIEvent["RemoteAudioLevel"] = "remoteAudioLevel";
  RTVIEvent["UserStartedSpeaking"] = "userStartedSpeaking";
  RTVIEvent["UserStoppedSpeaking"] = "userStoppedSpeaking";
  RTVIEvent["LocalAudioLevel"] = "localAudioLevel";
  RTVIEvent["Metrics"] = "metrics";
  RTVIEvent["UserTranscript"] = "userTranscript";
  RTVIEvent["BotTranscript"] = "botTranscript";
  RTVIEvent["BotLlmText"] = "botLlmText";
  RTVIEvent["BotLlmStarted"] = "botLlmStarted";
  RTVIEvent["BotLlmStopped"] = "botLlmStopped";
  RTVIEvent["BotTtsText"] = "botTtsText";
  RTVIEvent["BotTtsStarted"] = "botTtsStarted";
  RTVIEvent["BotTtsStopped"] = "botTtsStopped";
  RTVIEvent["LLMFunctionCall"] = "llmFunctionCall";
  RTVIEvent["LLMFunctionCallStart"] = "llmFunctionCallStart";
  RTVIEvent["LLMJsonCompletion"] = "llmJsonCompletion";
  RTVIEvent["StorageItemStored"] = "storageItemStored";
  RTVIEvent["BotLlmSearchResponse"] = "botLlmSearchResponse";
  RTVIEvent["ServerMessage"] = "serverMessage";
})($f9fc0c57b9aaed9c$export$6b4624d233c61fcb || ($f9fc0c57b9aaed9c$export$6b4624d233c61fcb = {}));
var $7614fb2168c523cc$exports = {};
$parcel$export($7614fb2168c523cc$exports, "RTVIClientHelper", () => $7614fb2168c523cc$export$23bc637255b2a471);
class $7614fb2168c523cc$export$23bc637255b2a471 {
  constructor(options) {
    this._options = options;
  }
  set client(client) {
    this._client = client;
  }
  set service(service) {
    this._service = service;
  }
}
var $7afbbd59ebaa42bf$exports = {};
$parcel$export($7afbbd59ebaa42bf$exports, "LogLevel", () => $7afbbd59ebaa42bf$export$243e62d78d3b544d);
$parcel$export($7afbbd59ebaa42bf$exports, "logger", () => $7afbbd59ebaa42bf$export$af88d00dbe7f521);
var $7afbbd59ebaa42bf$export$243e62d78d3b544d;
(function(LogLevel) {
  LogLevel[LogLevel["NONE"] = 0] = "NONE";
  LogLevel[LogLevel["ERROR"] = 1] = "ERROR";
  LogLevel[LogLevel["WARN"] = 2] = "WARN";
  LogLevel[LogLevel["INFO"] = 3] = "INFO";
  LogLevel[LogLevel["DEBUG"] = 4] = "DEBUG";
})($7afbbd59ebaa42bf$export$243e62d78d3b544d || ($7afbbd59ebaa42bf$export$243e62d78d3b544d = {}));
class $7afbbd59ebaa42bf$var$Logger {
  constructor() {
    this.level = $7afbbd59ebaa42bf$export$243e62d78d3b544d.DEBUG;
  }
  static getInstance() {
    if (!$7afbbd59ebaa42bf$var$Logger.instance) $7afbbd59ebaa42bf$var$Logger.instance = new $7afbbd59ebaa42bf$var$Logger();
    return $7afbbd59ebaa42bf$var$Logger.instance;
  }
  setLevel(level) {
    this.level = level;
  }
  debug(...args) {
    if (this.level >= $7afbbd59ebaa42bf$export$243e62d78d3b544d.DEBUG) console.debug(...args);
  }
  info(...args) {
    if (this.level >= $7afbbd59ebaa42bf$export$243e62d78d3b544d.INFO) console.info(...args);
  }
  warn(...args) {
    if (this.level >= $7afbbd59ebaa42bf$export$243e62d78d3b544d.WARN) console.warn(...args);
  }
  error(...args) {
    if (this.level >= $7afbbd59ebaa42bf$export$243e62d78d3b544d.ERROR) console.error(...args);
  }
}
const $7afbbd59ebaa42bf$export$af88d00dbe7f521 = $7afbbd59ebaa42bf$var$Logger.getInstance();
var $b48f893ed1354c1e$exports = {};
$parcel$export($b48f893ed1354c1e$exports, "RTVI_MESSAGE_LABEL", () => $b48f893ed1354c1e$export$882b13c7fda338f5);
$parcel$export($b48f893ed1354c1e$exports, "RTVIMessageType", () => $b48f893ed1354c1e$export$38b3db05cbf0e240);
$parcel$export($b48f893ed1354c1e$exports, "RTVIMessage", () => $b48f893ed1354c1e$export$69aa9ab0334b212);
$parcel$export($b48f893ed1354c1e$exports, "RTVI_ACTION_TYPE", () => $b48f893ed1354c1e$export$28ad8d0d400d3e2d);
$parcel$export($b48f893ed1354c1e$exports, "RTVIActionRequest", () => $b48f893ed1354c1e$export$378529d7a8bead8b);
$parcel$export($b48f893ed1354c1e$exports, "MessageDispatcher", () => $b48f893ed1354c1e$export$e9a960646cc432aa);
const $b48f893ed1354c1e$export$882b13c7fda338f5 = "rtvi-ai";
var $b48f893ed1354c1e$export$38b3db05cbf0e240;
(function(RTVIMessageType) {
  RTVIMessageType["CLIENT_READY"] = "client-ready";
  RTVIMessageType["UPDATE_CONFIG"] = "update-config";
  RTVIMessageType["GET_CONFIG"] = "get-config";
  RTVIMessageType["DESCRIBE_CONFIG"] = "describe-config";
  RTVIMessageType["DESCRIBE_ACTIONS"] = "describe-actions";
  RTVIMessageType["DISCONNECT_BOT"] = "disconnect-bot";
  RTVIMessageType["BOT_READY"] = "bot-ready";
  RTVIMessageType["ERROR"] = "error";
  RTVIMessageType["ERROR_RESPONSE"] = "error-response";
  RTVIMessageType["CONFIG"] = "config";
  RTVIMessageType["CONFIG_AVAILABLE"] = "config-available";
  RTVIMessageType["CONFIG_ERROR"] = "config-error";
  RTVIMessageType["ACTIONS_AVAILABLE"] = "actions-available";
  RTVIMessageType["ACTION_RESPONSE"] = "action-response";
  RTVIMessageType["METRICS"] = "metrics";
  RTVIMessageType["USER_TRANSCRIPTION"] = "user-transcription";
  RTVIMessageType["BOT_TRANSCRIPTION"] = "bot-transcription";
  RTVIMessageType["USER_STARTED_SPEAKING"] = "user-started-speaking";
  RTVIMessageType["USER_STOPPED_SPEAKING"] = "user-stopped-speaking";
  RTVIMessageType["BOT_STARTED_SPEAKING"] = "bot-started-speaking";
  RTVIMessageType["BOT_STOPPED_SPEAKING"] = "bot-stopped-speaking";
  RTVIMessageType["USER_LLM_TEXT"] = "user-llm-text";
  RTVIMessageType["BOT_LLM_TEXT"] = "bot-llm-text";
  RTVIMessageType["BOT_LLM_STARTED"] = "bot-llm-started";
  RTVIMessageType["BOT_LLM_STOPPED"] = "bot-llm-stopped";
  RTVIMessageType["BOT_TTS_TEXT"] = "bot-tts-text";
  RTVIMessageType["BOT_TTS_STARTED"] = "bot-tts-started";
  RTVIMessageType["BOT_TTS_STOPPED"] = "bot-tts-stopped";
  RTVIMessageType["BOT_LLM_SEARCH_RESPONSE"] = "bot-llm-search-response";
  RTVIMessageType["STORAGE_ITEM_STORED"] = "storage-item-stored";
  RTVIMessageType["SERVER_MESSAGE"] = "server-message";
})($b48f893ed1354c1e$export$38b3db05cbf0e240 || ($b48f893ed1354c1e$export$38b3db05cbf0e240 = {}));
class $b48f893ed1354c1e$export$69aa9ab0334b212 {
  constructor(type, data, id) {
    this.label = $b48f893ed1354c1e$export$882b13c7fda338f5;
    this.type = type;
    this.data = data;
    this.id = id || v4().slice(0, 8);
  }
  // Outbound message types
  static clientReady() {
    return new $b48f893ed1354c1e$export$69aa9ab0334b212($b48f893ed1354c1e$export$38b3db05cbf0e240.CLIENT_READY, {});
  }
  static updateConfig(config, interrupt = false) {
    return new $b48f893ed1354c1e$export$69aa9ab0334b212($b48f893ed1354c1e$export$38b3db05cbf0e240.UPDATE_CONFIG, {
      config,
      interrupt
    });
  }
  static describeConfig() {
    return new $b48f893ed1354c1e$export$69aa9ab0334b212($b48f893ed1354c1e$export$38b3db05cbf0e240.DESCRIBE_CONFIG, {});
  }
  static getBotConfig() {
    return new $b48f893ed1354c1e$export$69aa9ab0334b212($b48f893ed1354c1e$export$38b3db05cbf0e240.GET_CONFIG, {});
  }
  static describeActions() {
    return new $b48f893ed1354c1e$export$69aa9ab0334b212($b48f893ed1354c1e$export$38b3db05cbf0e240.DESCRIBE_ACTIONS, {});
  }
  static disconnectBot() {
    return new $b48f893ed1354c1e$export$69aa9ab0334b212($b48f893ed1354c1e$export$38b3db05cbf0e240.DISCONNECT_BOT, {});
  }
}
const $b48f893ed1354c1e$export$28ad8d0d400d3e2d = "action";
class $b48f893ed1354c1e$export$378529d7a8bead8b extends $b48f893ed1354c1e$export$69aa9ab0334b212 {
  constructor(data) {
    super($b48f893ed1354c1e$export$28ad8d0d400d3e2d, data);
  }
}
class $b48f893ed1354c1e$export$e9a960646cc432aa {
  constructor(client) {
    this._queue = new Array();
    this._gcTime = 1e4;
    this._queue = [];
    this._client = client;
  }
  dispatch(message) {
    const promise = new Promise((resolve, reject) => {
      this._queue.push({
        message,
        timestamp: Date.now(),
        resolve,
        reject
      });
    });
    $7afbbd59ebaa42bf$export$af88d00dbe7f521.debug("[MessageDispatcher] dispatch", message);
    this._client.sendMessage(message);
    this._gc();
    return promise;
  }
  async dispatchAction(action, onMessage) {
    const promise = new Promise((resolve, reject) => {
      this._queue.push({
        message: action,
        timestamp: Date.now(),
        resolve,
        reject
      });
    });
    $7afbbd59ebaa42bf$export$af88d00dbe7f521.debug("[MessageDispatcher] action", action);
    if (this._client.connected)
      this._client.sendMessage(action);
    else {
      if (!this._client.params.endpoints?.action) {
        $7afbbd59ebaa42bf$export$af88d00dbe7f521.error("[MessageDispatcher] Action endpoint is required when dispatching action in disconnected state");
        throw new $8ead7b33b8402751$export$be839f0100cd3132();
      }
      const actionUrl = this._client.constructUrl("action");
      try {
        await (0, $4bb349f22aee5185$export$8728b60ea57bf43e)(actionUrl, action, this._client.params, (response) => {
          onMessage(response);
        });
      } catch (e) {
        onMessage(new $b48f893ed1354c1e$export$69aa9ab0334b212($b48f893ed1354c1e$export$38b3db05cbf0e240.ERROR_RESPONSE, `Action endpoint '${actionUrl}' returned an error response`, action.id));
      }
    }
    this._gc();
    return promise;
  }
  _resolveReject(message, resolve = true) {
    const queuedMessage = this._queue.find((msg) => msg.message.id === message.id);
    if (queuedMessage) {
      if (resolve) {
        $7afbbd59ebaa42bf$export$af88d00dbe7f521.debug("[MessageDispatcher] Resolve", message);
        queuedMessage.resolve(message.type === $b48f893ed1354c1e$export$38b3db05cbf0e240.ACTION_RESPONSE ? message : message);
      } else {
        $7afbbd59ebaa42bf$export$af88d00dbe7f521.debug("[MessageDispatcher] Reject", message);
        queuedMessage.reject(message);
      }
      this._queue = this._queue.filter((msg) => msg.message.id !== message.id);
      $7afbbd59ebaa42bf$export$af88d00dbe7f521.debug("[MessageDispatcher] Queue", this._queue);
    }
    return message;
  }
  resolve(message) {
    return this._resolveReject(message, true);
  }
  reject(message) {
    return this._resolveReject(message, false);
  }
  _gc() {
    this._queue = this._queue.filter((msg) => {
      return Date.now() - msg.timestamp < this._gcTime;
    });
    $7afbbd59ebaa42bf$export$af88d00dbe7f521.debug("[MessageDispatcher] GC", this._queue);
  }
}
var $a7c324a73303ad55$var$__decorate = function(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
const $a7c324a73303ad55$var$defaultEndpoints = {
  connect: "/connect",
  action: "/action"
};
class $a7c324a73303ad55$var$RTVIEventEmitter extends $eINDk$events {
}
class $a7c324a73303ad55$export$fa42a01c1d60f4a1 extends $a7c324a73303ad55$var$RTVIEventEmitter {
  constructor(options) {
    super();
    this.params = {
      ...options.params,
      endpoints: {
        ...$a7c324a73303ad55$var$defaultEndpoints,
        ...options.params.endpoints ?? {}
      }
    };
    this._helpers = {};
    this._transport = options.transport;
    const wrappedCallbacks = {
      ...options.callbacks,
      onMessageError: (message) => {
        options?.callbacks?.onMessageError?.(message);
        this.emit($f9fc0c57b9aaed9c$export$6b4624d233c61fcb.MessageError, message);
      },
      onError: (message) => {
        options?.callbacks?.onError?.(message);
        this.emit($f9fc0c57b9aaed9c$export$6b4624d233c61fcb.Error, message);
      },
      onConnected: () => {
        options?.callbacks?.onConnected?.();
        this.emit($f9fc0c57b9aaed9c$export$6b4624d233c61fcb.Connected);
      },
      onDisconnected: () => {
        options?.callbacks?.onDisconnected?.();
        this.emit($f9fc0c57b9aaed9c$export$6b4624d233c61fcb.Disconnected);
      },
      onTransportStateChanged: (state) => {
        options?.callbacks?.onTransportStateChanged?.(state);
        this.emit($f9fc0c57b9aaed9c$export$6b4624d233c61fcb.TransportStateChanged, state);
      },
      onConfig: (config) => {
        options?.callbacks?.onConfig?.(config);
        this.emit($f9fc0c57b9aaed9c$export$6b4624d233c61fcb.Config, config);
      },
      onConfigDescribe: (configDescription) => {
        options?.callbacks?.onConfigDescribe?.(configDescription);
        this.emit($f9fc0c57b9aaed9c$export$6b4624d233c61fcb.ConfigDescribe, configDescription);
      },
      onActionsAvailable: (actionsAvailable) => {
        options?.callbacks?.onActionsAvailable?.(actionsAvailable);
        this.emit($f9fc0c57b9aaed9c$export$6b4624d233c61fcb.ActionsAvailable, actionsAvailable);
      },
      onParticipantJoined: (p) => {
        options?.callbacks?.onParticipantJoined?.(p);
        this.emit($f9fc0c57b9aaed9c$export$6b4624d233c61fcb.ParticipantConnected, p);
      },
      onParticipantLeft: (p) => {
        options?.callbacks?.onParticipantLeft?.(p);
        this.emit($f9fc0c57b9aaed9c$export$6b4624d233c61fcb.ParticipantLeft, p);
      },
      onTrackStarted: (track, p) => {
        options?.callbacks?.onTrackStarted?.(track, p);
        this.emit($f9fc0c57b9aaed9c$export$6b4624d233c61fcb.TrackStarted, track, p);
      },
      onTrackStopped: (track, p) => {
        options?.callbacks?.onTrackStopped?.(track, p);
        this.emit($f9fc0c57b9aaed9c$export$6b4624d233c61fcb.TrackStopped, track, p);
      },
      onScreenTrackStarted: (track, p) => {
        options?.callbacks?.onScreenTrackStarted?.(track, p);
        this.emit($f9fc0c57b9aaed9c$export$6b4624d233c61fcb.ScreenTrackStarted, track, p);
      },
      onScreenTrackStopped: (track, p) => {
        options?.callbacks?.onScreenTrackStopped?.(track, p);
        this.emit($f9fc0c57b9aaed9c$export$6b4624d233c61fcb.ScreenTrackStopped, track, p);
      },
      onScreenShareError: (errorMessage) => {
        options?.callbacks?.onScreenShareError?.(errorMessage);
        this.emit($f9fc0c57b9aaed9c$export$6b4624d233c61fcb.ScreenShareError, errorMessage);
      },
      onAvailableCamsUpdated: (cams) => {
        options?.callbacks?.onAvailableCamsUpdated?.(cams);
        this.emit($f9fc0c57b9aaed9c$export$6b4624d233c61fcb.AvailableCamsUpdated, cams);
      },
      onAvailableMicsUpdated: (mics) => {
        options?.callbacks?.onAvailableMicsUpdated?.(mics);
        this.emit($f9fc0c57b9aaed9c$export$6b4624d233c61fcb.AvailableMicsUpdated, mics);
      },
      onAvailableSpeakersUpdated: (speakers) => {
        options?.callbacks?.onAvailableSpeakersUpdated?.(speakers);
        this.emit($f9fc0c57b9aaed9c$export$6b4624d233c61fcb.AvailableSpeakersUpdated, speakers);
      },
      onCamUpdated: (cam) => {
        options?.callbacks?.onCamUpdated?.(cam);
        this.emit($f9fc0c57b9aaed9c$export$6b4624d233c61fcb.CamUpdated, cam);
      },
      onMicUpdated: (mic) => {
        options?.callbacks?.onMicUpdated?.(mic);
        this.emit($f9fc0c57b9aaed9c$export$6b4624d233c61fcb.MicUpdated, mic);
      },
      onSpeakerUpdated: (speaker) => {
        options?.callbacks?.onSpeakerUpdated?.(speaker);
        this.emit($f9fc0c57b9aaed9c$export$6b4624d233c61fcb.SpeakerUpdated, speaker);
      },
      onBotConnected: (p) => {
        options?.callbacks?.onBotConnected?.(p);
        this.emit($f9fc0c57b9aaed9c$export$6b4624d233c61fcb.BotConnected, p);
      },
      onBotReady: (botReadyData) => {
        options?.callbacks?.onBotReady?.(botReadyData);
        this.emit($f9fc0c57b9aaed9c$export$6b4624d233c61fcb.BotReady, botReadyData);
      },
      onBotDisconnected: (p) => {
        options?.callbacks?.onBotDisconnected?.(p);
        this.emit($f9fc0c57b9aaed9c$export$6b4624d233c61fcb.BotDisconnected, p);
      },
      onBotStartedSpeaking: () => {
        options?.callbacks?.onBotStartedSpeaking?.();
        this.emit($f9fc0c57b9aaed9c$export$6b4624d233c61fcb.BotStartedSpeaking);
      },
      onBotStoppedSpeaking: () => {
        options?.callbacks?.onBotStoppedSpeaking?.();
        this.emit($f9fc0c57b9aaed9c$export$6b4624d233c61fcb.BotStoppedSpeaking);
      },
      onRemoteAudioLevel: (level, p) => {
        options?.callbacks?.onRemoteAudioLevel?.(level, p);
        this.emit($f9fc0c57b9aaed9c$export$6b4624d233c61fcb.RemoteAudioLevel, level, p);
      },
      onUserStartedSpeaking: () => {
        options?.callbacks?.onUserStartedSpeaking?.();
        this.emit($f9fc0c57b9aaed9c$export$6b4624d233c61fcb.UserStartedSpeaking);
      },
      onUserStoppedSpeaking: () => {
        options?.callbacks?.onUserStoppedSpeaking?.();
        this.emit($f9fc0c57b9aaed9c$export$6b4624d233c61fcb.UserStoppedSpeaking);
      },
      onLocalAudioLevel: (level) => {
        options?.callbacks?.onLocalAudioLevel?.(level);
        this.emit($f9fc0c57b9aaed9c$export$6b4624d233c61fcb.LocalAudioLevel, level);
      },
      onUserTranscript: (data) => {
        options?.callbacks?.onUserTranscript?.(data);
        this.emit($f9fc0c57b9aaed9c$export$6b4624d233c61fcb.UserTranscript, data);
      },
      onBotTranscript: (text) => {
        options?.callbacks?.onBotTranscript?.(text);
        this.emit($f9fc0c57b9aaed9c$export$6b4624d233c61fcb.BotTranscript, text);
      },
      onBotLlmText: (text) => {
        options?.callbacks?.onBotLlmText?.(text);
        this.emit($f9fc0c57b9aaed9c$export$6b4624d233c61fcb.BotLlmText, text);
      },
      onBotLlmStarted: () => {
        options?.callbacks?.onBotLlmStarted?.();
        this.emit($f9fc0c57b9aaed9c$export$6b4624d233c61fcb.BotLlmStarted);
      },
      onBotLlmStopped: () => {
        options?.callbacks?.onBotLlmStopped?.();
        this.emit($f9fc0c57b9aaed9c$export$6b4624d233c61fcb.BotLlmStopped);
      },
      onBotTtsText: (text) => {
        options?.callbacks?.onBotTtsText?.(text);
        this.emit($f9fc0c57b9aaed9c$export$6b4624d233c61fcb.BotTtsText, text);
      },
      onBotTtsStarted: () => {
        options?.callbacks?.onBotTtsStarted?.();
        this.emit($f9fc0c57b9aaed9c$export$6b4624d233c61fcb.BotTtsStarted);
      },
      onBotTtsStopped: () => {
        options?.callbacks?.onBotTtsStopped?.();
        this.emit($f9fc0c57b9aaed9c$export$6b4624d233c61fcb.BotTtsStopped);
      },
      onStorageItemStored: (data) => {
        options?.callbacks?.onStorageItemStored?.(data);
        this.emit($f9fc0c57b9aaed9c$export$6b4624d233c61fcb.StorageItemStored, data);
      }
    };
    this._options = {
      ...options,
      callbacks: wrappedCallbacks,
      enableMic: options.enableMic ?? true,
      enableCam: options.enableCam ?? false
    };
    this._initialize();
    $7afbbd59ebaa42bf$export$af88d00dbe7f521.debug("[RTVI Client] Initialized", this.version);
  }
  constructUrl(endpoint) {
    if (!this.params.baseUrl) throw new $8ead7b33b8402751$export$59b4786f333aac02("Base URL not set. Please set rtviClient.params.baseUrl");
    const baseUrl = this.params.baseUrl.replace(/\/+$/, "");
    return baseUrl + (this.params.endpoints?.[endpoint] ?? "");
  }
  setLogLevel(level) {
    $7afbbd59ebaa42bf$export$af88d00dbe7f521.setLevel(level);
  }
  // ------ Transport methods
  /**
   * Initialize local media devices
   */
  async initDevices() {
    $7afbbd59ebaa42bf$export$af88d00dbe7f521.debug("[RTVI Client] Initializing devices...");
    await this._transport.initDevices();
  }
  /**
   * Connect the voice client session with chosen transport
   * Call async (await) to handle errors
   */
  async connect() {
    if ([
      "authenticating",
      "connecting",
      "connected",
      "ready"
    ].includes(this._transport.state)) throw new $8ead7b33b8402751$export$59b4786f333aac02("Voice client has already been started. Please call disconnect() before starting again.");
    this._abortController = new AbortController();
    return new Promise((resolve, reject) => {
      (async () => {
        this._startResolve = resolve;
        if (this._transport.state === "disconnected") await this._transport.initDevices();
        this._transport.state = "authenticating";
        if (this._options.timeout) this._handshakeTimeout = setTimeout(async () => {
          this._abortController?.abort();
          await this.disconnect();
          this._transport.state = "error";
          reject(new $8ead7b33b8402751$export$c67992fa684a81a6());
        }, this._options.timeout);
        let authBundle;
        const customConnectHandler = this._options.customConnectHandler;
        $7afbbd59ebaa42bf$export$af88d00dbe7f521.debug("[RTVI Client] Start params", this.params);
        this.params = {
          ...this.params,
          requestData: {
            ...this.params.requestData,
            rtvi_client_version: this.version
          }
        };
        if (!this.params.baseUrl && !this.params.endpoints?.connect) {
          $7afbbd59ebaa42bf$export$af88d00dbe7f521.debug("[RTVI Client] Connecting directly (skipping handshake / auth)...");
          clearTimeout(this._handshakeTimeout);
        } else {
          const connectUrl = this.constructUrl("connect");
          $7afbbd59ebaa42bf$export$af88d00dbe7f521.debug("[RTVI Client] Connecting...", connectUrl);
          $7afbbd59ebaa42bf$export$af88d00dbe7f521.debug("[RTVI Client] Start params", this.params);
          try {
            if (customConnectHandler) authBundle = await customConnectHandler(this.params, this._handshakeTimeout, this._abortController);
            else authBundle = await fetch(connectUrl, {
              method: "POST",
              mode: "cors",
              headers: new Headers({
                "Content-Type": "application/json",
                ...Object.fromEntries((this.params.headers ?? new Headers()).entries())
              }),
              body: JSON.stringify({
                config: this.params.config,
                ...this.params.services ? {
                  services: this.params.services
                } : {},
                ...this.params.requestData
              }),
              signal: this._abortController?.signal
            }).then((res) => {
              clearTimeout(this._handshakeTimeout);
              if (res.ok) return res.json();
              return Promise.reject(res);
            });
          } catch (e) {
            clearTimeout(this._handshakeTimeout);
            if (this._abortController?.signal.aborted) return;
            this._transport.state = "error";
            if (e instanceof Response) {
              const errorResp = await e.json();
              reject(new $8ead7b33b8402751$export$e7544ab812238a61(errorResp.info ?? errorResp.detail ?? e.statusText, e.status));
            } else reject(new $8ead7b33b8402751$export$e7544ab812238a61());
            return;
          }
          $7afbbd59ebaa42bf$export$af88d00dbe7f521.debug("[RTVI Client] Auth bundle received", authBundle);
        }
        try {
          await this._transport.connect(authBundle, this._abortController);
        } catch (e) {
          clearTimeout(this._handshakeTimeout);
          reject(e);
          return;
        }
        await this._transport.sendReadyMessage();
      })();
    });
  }
  /**
   * Disconnect the voice client from the transport
   * Reset / reinitialize transport and abort any pending requests
   */
  async disconnect() {
    if (this._abortController) this._abortController.abort();
    clearTimeout(this._handshakeTimeout);
    await this._transport.disconnect();
    this._initialize();
  }
  _initialize() {
    this._transport = this._options.transport;
    this._transport.initialize(this._options, this.handleMessage.bind(this));
    this._messageDispatcher = new $b48f893ed1354c1e$export$e9a960646cc432aa(this);
  }
  /**
   * Get the current state of the transport
   */
  get connected() {
    return [
      "connected",
      "ready"
    ].includes(this._transport.state);
  }
  get state() {
    return this._transport.state;
  }
  get version() {
    return (/* @__PURE__ */ $parcel$interopDefault($e3bad9cc25e327f7$exports)).version;
  }
  // ------ Device methods
  async getAllMics() {
    return await this._transport.getAllMics();
  }
  async getAllCams() {
    return await this._transport.getAllCams();
  }
  async getAllSpeakers() {
    return await this._transport.getAllSpeakers();
  }
  get selectedMic() {
    return this._transport.selectedMic;
  }
  get selectedCam() {
    return this._transport.selectedCam;
  }
  get selectedSpeaker() {
    return this._transport.selectedSpeaker;
  }
  updateMic(micId) {
    this._transport.updateMic(micId);
  }
  updateCam(camId) {
    this._transport.updateCam(camId);
  }
  updateSpeaker(speakerId) {
    this._transport.updateSpeaker(speakerId);
  }
  enableMic(enable) {
    this._transport.enableMic(enable);
  }
  get isMicEnabled() {
    return this._transport.isMicEnabled;
  }
  enableCam(enable) {
    this._transport.enableCam(enable);
  }
  get isCamEnabled() {
    return this._transport.isCamEnabled;
  }
  tracks() {
    return this._transport.tracks();
  }
  enableScreenShare(enable) {
    return this._transport.enableScreenShare(enable);
  }
  get isSharingScreen() {
    return this._transport.isSharingScreen;
  }
  // ------ Config methods
  /**
   * Request the bot to send the current configuration
   * @returns Promise<RTVIClientConfigOption[]> - Promise that resolves with the bot's configuration
   */
  async getConfig() {
    const configMsg = await this._messageDispatcher.dispatch($b48f893ed1354c1e$export$69aa9ab0334b212.getBotConfig());
    return configMsg.data.config;
  }
  /**
   * Update pipeline and services
   * @param config - RTVIClientConfigOption[] partial object with the new configuration
   * @param interrupt - boolean flag to interrupt the current pipeline, or wait until the next turn
   * @returns Promise<RTVIMessage> - Promise that resolves with the updated configuration
   */
  async updateConfig(config, interrupt = false) {
    $7afbbd59ebaa42bf$export$af88d00dbe7f521.debug("[RTVI Client] Updating config", config);
    return this._messageDispatcher.dispatch($b48f893ed1354c1e$export$69aa9ab0334b212.updateConfig(config, interrupt));
  }
  /**
   * Request bot describe the current configuration options
   * @returns Promise<unknown> - Promise that resolves with the bot's configuration description
   */
  async describeConfig() {
    return this._messageDispatcher.dispatch($b48f893ed1354c1e$export$69aa9ab0334b212.describeConfig());
  }
  /**
   * Returns configuration options for specified service key
   * @param serviceKey - Service name to get options for (e.g. "llm")
   * @param config? - Optional RTVIClientConfigOption[] to query (vs. using remote config)
   * @returns RTVIClientConfigOption | undefined - Configuration options array for the service with specified key or undefined
   */
  async getServiceOptionsFromConfig(serviceKey, config) {
    if (!config && this.state !== "ready") throw new $8ead7b33b8402751$export$885fb96b850e8fbb("getServiceOptionsFromConfig called without config array before bot is ready");
    return Promise.resolve().then(async () => {
      if (!serviceKey) {
        $7afbbd59ebaa42bf$export$af88d00dbe7f521.debug("Target service name is required");
        return void 0;
      }
      const passedConfig = config ?? await this.getConfig();
      const configServiceKey = passedConfig.find((config2) => config2.service === serviceKey);
      if (!configServiceKey) {
        $7afbbd59ebaa42bf$export$af88d00dbe7f521.debug("No service with name " + serviceKey + " not found in config");
        return void 0;
      }
      return configServiceKey;
    });
  }
  /**
   * Returns configuration option value (unknown) for specified service key and option name
   * @param serviceKey - Service name to get options for (e.g. "llm")
   * @optional option Name of option return from the config (e.g. "model")
   * @returns Promise<unknown | undefined> - Service configuration option value or undefined
   */
  async getServiceOptionValueFromConfig(serviceKey, option, config) {
    const configServiceKey = await this.getServiceOptionsFromConfig(serviceKey, config);
    if (!configServiceKey) {
      $7afbbd59ebaa42bf$export$af88d00dbe7f521.debug("Service with name " + serviceKey + " not found in config");
      return void 0;
    }
    const optionValue = configServiceKey.options.find((o) => o.name === option);
    return optionValue ? optionValue.value : void 0;
  }
  _updateOrAddOption(existingOptions, newOption) {
    const existingOptionIndex = existingOptions.findIndex((item) => item.name === newOption.name);
    if (existingOptionIndex !== -1)
      return existingOptions.map((item, index) => index === existingOptionIndex ? {
        ...item,
        value: newOption.value
      } : item);
    else
      return [
        ...existingOptions,
        {
          name: newOption.name,
          value: newOption.value
        }
      ];
  }
  /**
   * Returns config with updated option(s) for specified service key and option name
   * Note: does not update current config, only returns a new object (call updateConfig to apply changes)
   * @param serviceKey - Service name to get options for (e.g. "llm")
   * @param option - Service name to get options for (e.g. "model")
   * @param config - Optional RTVIClientConfigOption[] to update (vs. using current config)
   * @returns Promise<RTVIClientConfigOption[] | undefined> - Configuration options array with updated option(s) or undefined
   */
  async setServiceOptionInConfig(serviceKey, option, config) {
    const newConfig = $eINDk$clonedeep(config ?? await this.getConfig());
    const serviceOptions = await this.getServiceOptionsFromConfig(serviceKey, newConfig);
    if (!serviceOptions) {
      $7afbbd59ebaa42bf$export$af88d00dbe7f521.debug("Service with name '" + serviceKey + "' not found in config");
      return newConfig;
    }
    const optionsArray = Array.isArray(option) ? option : [
      option
    ];
    for (const opt of optionsArray) {
      const existingItem = newConfig.find((item) => item.service === serviceKey);
      const updatedOptions = existingItem ? this._updateOrAddOption(existingItem.options, opt) : [
        {
          name: opt.name,
          value: opt.value
        }
      ];
      if (existingItem) existingItem.options = updatedOptions;
      else newConfig.push({
        service: serviceKey,
        options: updatedOptions
      });
    }
    return newConfig;
  }
  /**
   * Returns config object with updated properties from passed array.
   * @param configOptions - Array of RTVIClientConfigOption[] to update
   * @param config? - Optional RTVIClientConfigOption[] to update (vs. using current config)
   * @returns Promise<RTVIClientConfigOption[]> - Configuration options
   */
  async setConfigOptions(configOptions, config) {
    let accumulator = $eINDk$clonedeep(config ?? await this.getConfig());
    for (const configOption of configOptions) accumulator = await this.setServiceOptionInConfig(configOption.service, configOption.options, accumulator) || accumulator;
    return accumulator;
  }
  // ------ Actions
  /**
   * Dispatch an action message to the bot or http single-turn endpoint
   */
  async action(action) {
    return this._messageDispatcher.dispatchAction(new $b48f893ed1354c1e$export$378529d7a8bead8b(action), this.handleMessage.bind(this));
  }
  /**
   * Describe available / registered actions the bot has
   * @returns Promise<unknown> - Promise that resolves with the bot's actions
   */
  async describeActions() {
    return this._messageDispatcher.dispatch($b48f893ed1354c1e$export$69aa9ab0334b212.describeActions());
  }
  // ------ Transport methods
  /**
   * Get the session expiry time for the transport session (if applicable)
   * @returns number - Expiry time in milliseconds
   */
  get transportExpiry() {
    return this._transport.expiry;
  }
  // ------ Messages
  /**
   * Directly send a message to the bot via the transport
   * @param message - RTVIMessage object to send
   */
  sendMessage(message) {
    this._transport.sendMessage(message);
  }
  /**
   * Disconnects the bot, but keeps the session alive
   */
  disconnectBot() {
    this._transport.sendMessage(new $b48f893ed1354c1e$export$69aa9ab0334b212($b48f893ed1354c1e$export$38b3db05cbf0e240.DISCONNECT_BOT, {}));
  }
  handleMessage(ev) {
    $7afbbd59ebaa42bf$export$af88d00dbe7f521.debug("[RTVI Message]", ev);
    switch (ev.type) {
      case $b48f893ed1354c1e$export$38b3db05cbf0e240.BOT_READY:
        clearTimeout(this._handshakeTimeout);
        this._startResolve?.(ev.data);
        this._options.callbacks?.onBotReady?.(ev.data);
        break;
      case $b48f893ed1354c1e$export$38b3db05cbf0e240.CONFIG_AVAILABLE:
        this._messageDispatcher.resolve(ev);
        this._options.callbacks?.onConfigDescribe?.(ev.data);
        break;
      case $b48f893ed1354c1e$export$38b3db05cbf0e240.CONFIG: {
        const resp = this._messageDispatcher.resolve(ev);
        this._options.callbacks?.onConfig?.(resp.data.config);
        break;
      }
      case $b48f893ed1354c1e$export$38b3db05cbf0e240.ACTIONS_AVAILABLE:
        this._messageDispatcher.resolve(ev);
        this._options.callbacks?.onActionsAvailable?.(ev.data);
        break;
      case $b48f893ed1354c1e$export$38b3db05cbf0e240.ACTION_RESPONSE:
        this._messageDispatcher.resolve(ev);
        break;
      case $b48f893ed1354c1e$export$38b3db05cbf0e240.ERROR_RESPONSE: {
        const resp = this._messageDispatcher.reject(ev);
        this._options.callbacks?.onMessageError?.(resp);
        break;
      }
      case $b48f893ed1354c1e$export$38b3db05cbf0e240.ERROR:
        this._options.callbacks?.onError?.(ev);
        break;
      case $b48f893ed1354c1e$export$38b3db05cbf0e240.USER_STARTED_SPEAKING:
        this._options.callbacks?.onUserStartedSpeaking?.();
        break;
      case $b48f893ed1354c1e$export$38b3db05cbf0e240.USER_STOPPED_SPEAKING:
        this._options.callbacks?.onUserStoppedSpeaking?.();
        break;
      case $b48f893ed1354c1e$export$38b3db05cbf0e240.BOT_STARTED_SPEAKING:
        this._options.callbacks?.onBotStartedSpeaking?.();
        break;
      case $b48f893ed1354c1e$export$38b3db05cbf0e240.BOT_STOPPED_SPEAKING:
        this._options.callbacks?.onBotStoppedSpeaking?.();
        break;
      case $b48f893ed1354c1e$export$38b3db05cbf0e240.USER_TRANSCRIPTION: {
        const TranscriptData = ev.data;
        this._options.callbacks?.onUserTranscript?.(TranscriptData);
        break;
      }
      case $b48f893ed1354c1e$export$38b3db05cbf0e240.BOT_TRANSCRIPTION:
        this._options.callbacks?.onBotTranscript?.(ev.data);
        break;
      case $b48f893ed1354c1e$export$38b3db05cbf0e240.BOT_LLM_TEXT:
        this._options.callbacks?.onBotLlmText?.(ev.data);
        break;
      case $b48f893ed1354c1e$export$38b3db05cbf0e240.BOT_LLM_STARTED:
        this._options.callbacks?.onBotLlmStarted?.();
        break;
      case $b48f893ed1354c1e$export$38b3db05cbf0e240.BOT_LLM_STOPPED:
        this._options.callbacks?.onBotLlmStopped?.();
        break;
      case $b48f893ed1354c1e$export$38b3db05cbf0e240.BOT_TTS_TEXT:
        this._options.callbacks?.onBotTtsText?.(ev.data);
        break;
      case $b48f893ed1354c1e$export$38b3db05cbf0e240.BOT_TTS_STARTED:
        this._options.callbacks?.onBotTtsStarted?.();
        break;
      case $b48f893ed1354c1e$export$38b3db05cbf0e240.BOT_TTS_STOPPED:
        this._options.callbacks?.onBotTtsStopped?.();
        break;
      case $b48f893ed1354c1e$export$38b3db05cbf0e240.BOT_LLM_SEARCH_RESPONSE:
        this._options.callbacks?.onBotLlmSearchResponse?.(ev.data);
        this.emit($f9fc0c57b9aaed9c$export$6b4624d233c61fcb.BotLlmSearchResponse, ev.data);
        break;
      case $b48f893ed1354c1e$export$38b3db05cbf0e240.METRICS:
        this.emit($f9fc0c57b9aaed9c$export$6b4624d233c61fcb.Metrics, ev.data);
        this._options.callbacks?.onMetrics?.(ev.data);
        break;
      case $b48f893ed1354c1e$export$38b3db05cbf0e240.STORAGE_ITEM_STORED:
        this._options.callbacks?.onStorageItemStored?.(ev.data);
        break;
      case $b48f893ed1354c1e$export$38b3db05cbf0e240.SERVER_MESSAGE:
        this._options.callbacks?.onServerMessage?.(ev.data);
        this.emit($f9fc0c57b9aaed9c$export$6b4624d233c61fcb.ServerMessage, ev.data);
        break;
      default: {
        let match = false;
        for (const helper of Object.values(this._helpers)) if (helper.getMessageTypes().includes(ev.type)) {
          match = true;
          helper.handleMessage(ev);
        }
        if (!match) this._options.callbacks?.onGenericMessage?.(ev.data);
      }
    }
  }
  // ------ Helpers
  /**
   * Register a new helper to the client
   * This (optionally) provides a way to reference helpers directly
   * from the client and use the event dispatcher
   * @param service - Target service for this helper
   * @param helper - Helper instance
   * @returns RTVIClientHelper - Registered helper instance
   */
  registerHelper(service, helper) {
    if (this._helpers[service]) throw new Error(`Helper with name '${service}' already registered`);
    if (!(helper instanceof $7614fb2168c523cc$export$23bc637255b2a471)) throw new Error(`Helper must be an instance of RTVIClientHelper`);
    helper.service = service;
    helper.client = this;
    this._helpers[service] = helper;
    return this._helpers[service];
  }
  getHelper(service) {
    const helper = this._helpers[service];
    if (!helper) {
      $7afbbd59ebaa42bf$export$af88d00dbe7f521.debug(`Helper targeting service '${service}' not found`);
      return void 0;
    }
    return helper;
  }
  unregisterHelper(service) {
    if (!this._helpers[service]) return;
    delete this._helpers[service];
  }
}
$a7c324a73303ad55$var$__decorate([
  $16f019d4d16917df$export$f1586721024c4dab
], $a7c324a73303ad55$export$fa42a01c1d60f4a1.prototype, "getConfig", null);
$a7c324a73303ad55$var$__decorate([
  $16f019d4d16917df$export$f1586721024c4dab
], $a7c324a73303ad55$export$fa42a01c1d60f4a1.prototype, "updateConfig", null);
$a7c324a73303ad55$var$__decorate([
  $16f019d4d16917df$export$f1586721024c4dab
], $a7c324a73303ad55$export$fa42a01c1d60f4a1.prototype, "describeConfig", null);
$a7c324a73303ad55$var$__decorate([
  $16f019d4d16917df$export$f1586721024c4dab
], $a7c324a73303ad55$export$fa42a01c1d60f4a1.prototype, "describeActions", null);
$a7c324a73303ad55$var$__decorate([
  $16f019d4d16917df$export$5c35b4fe6fa8c9a6("connected", "ready")
], $a7c324a73303ad55$export$fa42a01c1d60f4a1.prototype, "transportExpiry", null);
$a7c324a73303ad55$var$__decorate([
  $16f019d4d16917df$export$f1586721024c4dab
], $a7c324a73303ad55$export$fa42a01c1d60f4a1.prototype, "sendMessage", null);
$a7c324a73303ad55$var$__decorate([
  $16f019d4d16917df$export$f1586721024c4dab
], $a7c324a73303ad55$export$fa42a01c1d60f4a1.prototype, "disconnectBot", null);
var $0908f693e3e0724c$exports = {};
$parcel$export($0908f693e3e0724c$exports, "LLMMessageType", () => $0908f693e3e0724c$export$441bcd2e10762760);
$parcel$export($0908f693e3e0724c$exports, "LLMHelper", () => $0908f693e3e0724c$export$3cf39a62d076dd5c);
var $0908f693e3e0724c$export$441bcd2e10762760;
(function(LLMMessageType) {
  LLMMessageType["LLM_FUNCTION_CALL"] = "llm-function-call";
  LLMMessageType["LLM_FUNCTION_CALL_START"] = "llm-function-call-start";
  LLMMessageType["LLM_FUNCTION_CALL_RESULT"] = "llm-function-call-result";
  LLMMessageType["LLM_JSON_COMPLETION"] = "llm-json-completion";
})($0908f693e3e0724c$export$441bcd2e10762760 || ($0908f693e3e0724c$export$441bcd2e10762760 = {}));
class $0908f693e3e0724c$export$3cf39a62d076dd5c extends $7614fb2168c523cc$export$23bc637255b2a471 {
  constructor(options) {
    super(options);
    this._functionCallCallback = null;
  }
  getMessageTypes() {
    return Object.values($0908f693e3e0724c$export$441bcd2e10762760);
  }
  // --- Actions
  /**
   * Retrieve the bot's current LLM context.
   * @returns Promise<LLMContext>
   */
  async getContext() {
    if (this._client.state !== "ready") throw new $8ead7b33b8402751$export$885fb96b850e8fbb("getContext called while transport not in ready state");
    const actionResponseMsg = await this._client.action({
      service: this._service,
      action: "get_context"
    });
    return actionResponseMsg.data.result;
  }
  /**
   * Update the bot's LLM context.
   * If this is called while the transport is not in the ready state, the local context will be updated
   * @param context LLMContext - The new context
   * @param interrupt boolean - Whether to interrupt the bot, or wait until it has finished speaking
   * @returns Promise<boolean>
   */
  async setContext(context, interrupt = false) {
    if (this._client.state !== "ready") throw new $8ead7b33b8402751$export$885fb96b850e8fbb("setContext called while transport not in ready state");
    const actionResponse = await this._client.action({
      service: this._service,
      action: "set_context",
      arguments: [
        {
          name: "messages",
          value: context.messages
        },
        {
          name: "interrupt",
          value: interrupt
        }
      ]
    });
    return !!actionResponse.data.result;
  }
  /**
   * Append a new message to the LLM context.
   * If this is called while the transport is not in the ready state, the local context will be updated
   * @param context LLMContextMessage
   * @param runImmediately boolean - wait until pipeline is idle before running
   * @returns boolean
   */
  async appendToMessages(context, runImmediately = false) {
    if (this._client.state !== "ready") throw new $8ead7b33b8402751$export$885fb96b850e8fbb("setContext called while transport not in ready state");
    const actionResponse = await this._client.action({
      service: this._service,
      action: "append_to_messages",
      arguments: [
        {
          name: "messages",
          value: [
            context
          ]
        },
        {
          name: "run_immediately",
          value: runImmediately
        }
      ]
    });
    return !!actionResponse.data.result;
  }
  /**
   * Run the bot's current LLM context.
   * Useful when appending messages to the context without runImmediately set to true.
   * Will do nothing if the bot is not in the ready state.
   * @param interrupt boolean - Whether to interrupt the bot, or wait until it has finished speaking
   * @returns Promise<unknown>
   */
  async run(interrupt = false) {
    if (this._client.state !== "ready") return;
    return this._client.action({
      service: this._service,
      action: "run",
      arguments: [
        {
          name: "interrupt",
          value: interrupt
        }
      ]
    });
  }
  // --- Handlers
  /**
   * If the LLM wants to call a function, RTVI will invoke the callback defined
   * here. Whatever the callback returns will be sent to the LLM as the function result.
   * @param callback
   * @returns void
   */
  handleFunctionCall(callback) {
    this._functionCallCallback = callback;
  }
  handleMessage(ev) {
    switch (ev.type) {
      case $0908f693e3e0724c$export$441bcd2e10762760.LLM_JSON_COMPLETION:
        this._options.callbacks?.onLLMJsonCompletion?.(ev.data);
        this._client.emit($f9fc0c57b9aaed9c$export$6b4624d233c61fcb.LLMJsonCompletion, ev.data);
        break;
      case $0908f693e3e0724c$export$441bcd2e10762760.LLM_FUNCTION_CALL: {
        const d = ev.data;
        this._options.callbacks?.onLLMFunctionCall?.(ev.data);
        this._client.emit($f9fc0c57b9aaed9c$export$6b4624d233c61fcb.LLMFunctionCall, ev.data);
        if (this._functionCallCallback) {
          const fn = {
            functionName: d.function_name,
            arguments: d.args
          };
          if (this._client.state === "ready") this._functionCallCallback(fn).then((result) => {
            this._client.sendMessage(new $b48f893ed1354c1e$export$69aa9ab0334b212($0908f693e3e0724c$export$441bcd2e10762760.LLM_FUNCTION_CALL_RESULT, {
              function_name: d.function_name,
              tool_call_id: d.tool_call_id,
              arguments: d.args,
              result
            }));
          });
          else throw new $8ead7b33b8402751$export$885fb96b850e8fbb("Attempted to send a function call result from bot while transport not in ready state");
        }
        break;
      }
      case $0908f693e3e0724c$export$441bcd2e10762760.LLM_FUNCTION_CALL_START: {
        const e = ev.data;
        this._options.callbacks?.onLLMFunctionCallStart?.(e.function_name);
        this._client.emit($f9fc0c57b9aaed9c$export$6b4624d233c61fcb.LLMFunctionCallStart, e.function_name);
        break;
      }
    }
  }
}
var $4086f06442fcb7d7$exports = {};
$parcel$export($4086f06442fcb7d7$exports, "Transport", () => $4086f06442fcb7d7$export$86495b081fef8e52);
class $4086f06442fcb7d7$export$86495b081fef8e52 {
  constructor() {
    this._state = "disconnected";
    this._expiry = void 0;
  }
  get expiry() {
    return this._expiry;
  }
}
const index_module = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ActionEndpointNotSetError: $8ead7b33b8402751$export$be839f0100cd3132,
  BotNotReadyError: $8ead7b33b8402751$export$885fb96b850e8fbb,
  ConfigUpdateError: $8ead7b33b8402751$export$4eda4fd287fbbca5,
  ConnectionTimeoutError: $8ead7b33b8402751$export$c67992fa684a81a6,
  LLMHelper: $0908f693e3e0724c$export$3cf39a62d076dd5c,
  get LLMMessageType() {
    return $0908f693e3e0724c$export$441bcd2e10762760;
  },
  get LogLevel() {
    return $7afbbd59ebaa42bf$export$243e62d78d3b544d;
  },
  MessageDispatcher: $b48f893ed1354c1e$export$e9a960646cc432aa,
  RTVIActionRequest: $b48f893ed1354c1e$export$378529d7a8bead8b,
  RTVIClient: $a7c324a73303ad55$export$fa42a01c1d60f4a1,
  RTVIClientHelper: $7614fb2168c523cc$export$23bc637255b2a471,
  RTVIError: $8ead7b33b8402751$export$59b4786f333aac02,
  get RTVIEvent() {
    return $f9fc0c57b9aaed9c$export$6b4624d233c61fcb;
  },
  RTVIMessage: $b48f893ed1354c1e$export$69aa9ab0334b212,
  get RTVIMessageType() {
    return $b48f893ed1354c1e$export$38b3db05cbf0e240;
  },
  RTVI_ACTION_TYPE: $b48f893ed1354c1e$export$28ad8d0d400d3e2d,
  RTVI_MESSAGE_LABEL: $b48f893ed1354c1e$export$882b13c7fda338f5,
  StartBotError: $8ead7b33b8402751$export$e7544ab812238a61,
  Transport: $4086f06442fcb7d7$export$86495b081fef8e52,
  TransportStartError: $8ead7b33b8402751$export$e0624a511a2c4e9,
  httpActionGenerator: $4bb349f22aee5185$export$8728b60ea57bf43e,
  logger: $7afbbd59ebaa42bf$export$af88d00dbe7f521
}, Symbol.toStringTag, { value: "Module" }));
const $f3f7d4263dc13c6a$var$defaultStore = createStore();
const $f3f7d4263dc13c6a$export$8d2b07cbee622e7c = /* @__PURE__ */ createContext({});
const $f3f7d4263dc13c6a$export$4a4ae2d5dc96782 = ({ children, client, jotaiStore = $f3f7d4263dc13c6a$var$defaultStore }) => {
  return jsx(Provider, {
    store: jotaiStore,
    children: jsx($f3f7d4263dc13c6a$export$8d2b07cbee622e7c.Provider, {
      value: {
        client
      },
      children
    })
  });
};
$f3f7d4263dc13c6a$export$4a4ae2d5dc96782.displayName = "RTVIClientProvider";
const $54a3c9f5bdbf0854$export$31a5f6a22c9b8fba = () => {
  const { client } = useContext($f3f7d4263dc13c6a$export$8d2b07cbee622e7c);
  return client;
};
const $824ea64b5f757259$export$33a6ac53b8f02625 = (event, handler) => {
  const client = $54a3c9f5bdbf0854$export$31a5f6a22c9b8fba();
  useEffect(() => {
    if (!client) return;
    client.on(event, handler);
    return () => {
      client.off(event, handler);
    };
  }, [
    event,
    handler,
    client
  ]);
};
const $194c75143b7a1fa0$var$localAudioTrackAtom = atom(null);
const $194c75143b7a1fa0$var$localVideoTrackAtom = atom(null);
const $194c75143b7a1fa0$var$localScreenAudioTrackAtom = atom(null);
const $194c75143b7a1fa0$var$localScreenVideoTrackAtom = atom(null);
const $194c75143b7a1fa0$var$botAudioTrackAtom = atom(null);
const $194c75143b7a1fa0$var$botVideoTrackAtom = atom(null);
const $194c75143b7a1fa0$var$trackAtom = atomFamily(({ local, trackType }) => {
  if (local) switch (trackType) {
    case "audio":
      return $194c75143b7a1fa0$var$localAudioTrackAtom;
    case "screenAudio":
      return $194c75143b7a1fa0$var$localScreenAudioTrackAtom;
    case "screenVideo":
      return $194c75143b7a1fa0$var$localScreenVideoTrackAtom;
    case "video":
      return $194c75143b7a1fa0$var$localVideoTrackAtom;
  }
  return trackType === "audio" ? $194c75143b7a1fa0$var$botAudioTrackAtom : $194c75143b7a1fa0$var$botVideoTrackAtom;
});
const $194c75143b7a1fa0$export$7c03381e0d26a6c3 = (trackType, participantType) => {
  const client = $54a3c9f5bdbf0854$export$31a5f6a22c9b8fba();
  const track = useAtomValue($194c75143b7a1fa0$var$trackAtom({
    local: participantType === "local",
    trackType
  }));
  const updateTrack = useAtomCallback(useCallback((get, set, track2, trackType2, local) => {
    const atom2 = $194c75143b7a1fa0$var$trackAtom({
      local,
      trackType: trackType2
    });
    const oldTrack = get(atom2);
    if (oldTrack?.id === track2.id) return;
    set(atom2, track2);
  }, [
    participantType,
    track,
    trackType
  ]));
  $824ea64b5f757259$export$33a6ac53b8f02625($f9fc0c57b9aaed9c$export$6b4624d233c61fcb.TrackStarted, useCallback((track2, participant) => {
    updateTrack(track2, track2.kind, Boolean(participant?.local));
  }, []));
  $824ea64b5f757259$export$33a6ac53b8f02625($f9fc0c57b9aaed9c$export$6b4624d233c61fcb.ScreenTrackStarted, useCallback((track2, participant) => {
    const trackType2 = track2.kind === "audio" ? "screenAudio" : "screenVideo";
    updateTrack(track2, trackType2, Boolean(participant?.local));
  }, []));
  useEffect(() => {
    if (!client) return;
    const tracks = client.tracks();
    const track2 = tracks?.[participantType]?.[trackType];
    if (!track2) return;
    updateTrack(track2, trackType, participantType === "local");
  }, [
    participantType,
    trackType,
    updateTrack,
    client
  ]);
  return track;
};
const $f8b885726fc652c0$export$ba1245f7cbf3ae02 = () => {
  const botAudioRef = useRef(null);
  const botAudioTrack = $194c75143b7a1fa0$export$7c03381e0d26a6c3("audio", "bot");
  useEffect(() => {
    if (!botAudioRef.current || !botAudioTrack) return;
    if (botAudioRef.current.srcObject) {
      const oldTrack = botAudioRef.current.srcObject.getAudioTracks()[0];
      if (oldTrack.id === botAudioTrack.id) return;
    }
    botAudioRef.current.srcObject = new MediaStream([
      botAudioTrack
    ]);
  }, [
    botAudioTrack
  ]);
  $824ea64b5f757259$export$33a6ac53b8f02625($f9fc0c57b9aaed9c$export$6b4624d233c61fcb.SpeakerUpdated, useCallback((speaker) => {
    if (!botAudioRef.current) return;
    if (typeof botAudioRef.current.setSinkId !== "function") return;
    botAudioRef.current.setSinkId(speaker.deviceId);
  }, []));
  return jsx(Fragment, {
    children: jsx("audio", {
      ref: botAudioRef,
      autoPlay: true
    })
  });
};
$f8b885726fc652c0$export$ba1245f7cbf3ae02.displayName = "RTVIClientAudio";
function $9098519210cf34e2$var$useMergedRef(...refs) {
  return useCallback(
    (element) => {
      for (let i = 0; i < refs.length; i++) {
        const ref = refs[i];
        if (typeof ref === "function") ref(element);
        else if (ref && typeof ref === "object") ref.current = element;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    refs
  );
}
var $9098519210cf34e2$export$2e2bcd8739ae039 = $9098519210cf34e2$var$useMergedRef;
const $b76d887910983811$export$d090a384943608eb = /* @__PURE__ */ forwardRef(function VoiceClientVideo({ participant = "local", fit = "contain", mirror, onResize, style = {}, trackType = "video", ...props }, ref) {
  const videoTrack = $194c75143b7a1fa0$export$7c03381e0d26a6c3(trackType, participant);
  const videoEl = useRef(null);
  const videoRef = $9098519210cf34e2$export$2e2bcd8739ae039(videoEl, ref);
  useEffect(function setupVideoEvents() {
    const video = videoEl.current;
    if (!video) return;
    const playVideo = () => {
      const promise = video.play();
      if (promise !== void 0) promise.then(() => {
        video.controls = false;
      }).catch((error) => {
        video.controls = true;
        console.warn("Failed to play video", error);
      });
    };
    const handleCanPlay = () => {
      if (!video.paused) return;
      playVideo();
    };
    const handleEnterPIP = () => {
      video.style.transform = "scale(1)";
    };
    const handleLeavePIP = () => {
      video.style.transform = "";
      setTimeout(() => {
        if (video.paused) playVideo();
      }, 100);
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") return;
      if (!video.paused) return;
      playVideo();
    };
    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("enterpictureinpicture", handleEnterPIP);
    video.addEventListener("leavepictureinpicture", handleLeavePIP);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("enterpictureinpicture", handleEnterPIP);
      video.removeEventListener("leavepictureinpicture", handleLeavePIP);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);
  useEffect(function updateSrcObject() {
    const video = videoEl.current;
    if (!video || !videoTrack) return;
    video.srcObject = new MediaStream([
      videoTrack
    ]);
    video.load();
    return () => {
      video.srcObject = null;
      video.load();
    };
  }, [
    videoTrack,
    videoTrack?.id
  ]);
  useEffect(function reportVideoDimensions() {
    const video = videoEl.current;
    if (!onResize || !video) return;
    let frame;
    function handleResize() {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const video2 = videoEl.current;
        if (!video2 || document.hidden) return;
        const videoWidth = video2.videoWidth;
        const videoHeight = video2.videoHeight;
        if (videoWidth && videoHeight) onResize?.({
          aspectRatio: videoWidth / videoHeight,
          height: videoHeight,
          width: videoWidth
        });
      });
    }
    handleResize();
    video.addEventListener("loadedmetadata", handleResize);
    video.addEventListener("resize", handleResize);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      video.removeEventListener("loadedmetadata", handleResize);
      video.removeEventListener("resize", handleResize);
    };
  }, [
    onResize
  ]);
  return jsx("video", {
    autoPlay: true,
    muted: true,
    playsInline: true,
    ref: videoRef,
    style: {
      objectFit: fit,
      transform: mirror ? "scale(-1, 1)" : "",
      ...style
    },
    ...props
  });
});
$b76d887910983811$export$d090a384943608eb.displayName = "RTVIClientVideo";
atom([]);
atom([]);
atom([]);
atom({});
atom({});
atom({});
const $8376ffbc1b1f3c97$var$transportStateAtom = atom("disconnected");
const $8376ffbc1b1f3c97$export$599fa01283bd4ece = () => {
  const [transportState, setTransportState] = useAtom($8376ffbc1b1f3c97$var$transportStateAtom);
  $824ea64b5f757259$export$33a6ac53b8f02625($f9fc0c57b9aaed9c$export$6b4624d233c61fcb.TransportStateChanged, setTransportState);
  return transportState;
};
const $993a744193844a95$export$59bf27bd43679db6 = /* @__PURE__ */ React__default.memo(({ backgroundColor = "transparent", barColor = "black", barWidth = 30, barGap = 12, barMaxHeight = 120, participantType }) => {
  const canvasRef = useRef(null);
  const track = $194c75143b7a1fa0$export$7c03381e0d26a6c3("audio", participantType);
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvasWidth = 5 * barWidth + 4 * barGap;
    const canvasHeight = barMaxHeight;
    const canvas = canvasRef.current;
    const scaleFactor = 2;
    const resizeCanvas = () => {
      canvas.width = canvasWidth * scaleFactor;
      canvas.height = canvasHeight * scaleFactor;
      canvas.style.width = `${canvasWidth}px`;
      canvas.style.height = `${canvasHeight}px`;
      canvasCtx.lineCap = "round";
      canvasCtx.scale(scaleFactor, scaleFactor);
    };
    const canvasCtx = canvas.getContext("2d");
    resizeCanvas();
    if (!track) return;
    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(new MediaStream([
      track
    ]));
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 1024;
    source.connect(analyser);
    const frequencyData = new Uint8Array(analyser.frequencyBinCount);
    canvasCtx.lineCap = "round";
    const bands = [
      {
        startFreq: 85,
        endFreq: 255,
        smoothValue: 0
      },
      {
        startFreq: 255,
        endFreq: 500,
        smoothValue: 0
      },
      {
        startFreq: 500,
        endFreq: 2e3,
        smoothValue: 0
      },
      {
        startFreq: 2e3,
        endFreq: 4e3,
        smoothValue: 0
      },
      {
        startFreq: 4e3,
        endFreq: 8e3,
        smoothValue: 0
      }
    ];
    const getFrequencyBinIndex = (frequency) => {
      const nyquist = audioContext.sampleRate / 2;
      return Math.round(frequency / nyquist * (analyser.frequencyBinCount - 1));
    };
    function drawSpectrum() {
      analyser.getByteFrequencyData(frequencyData);
      canvasCtx.clearRect(0, 0, canvas.width / scaleFactor, canvas.height / scaleFactor);
      canvasCtx.fillStyle = backgroundColor;
      canvasCtx.fillRect(0, 0, canvas.width / scaleFactor, canvas.height / scaleFactor);
      let isActive = false;
      const totalBarsWidth = bands.length * barWidth + (bands.length - 1) * barGap;
      const startX = (canvas.width / scaleFactor - totalBarsWidth) / 2;
      const adjustedCircleRadius = barWidth / 2;
      bands.forEach((band, i) => {
        const startIndex = getFrequencyBinIndex(band.startFreq);
        const endIndex = getFrequencyBinIndex(band.endFreq);
        const bandData = frequencyData.slice(startIndex, endIndex);
        const bandValue = bandData.reduce((acc, val) => acc + val, 0) / bandData.length;
        const smoothingFactor = 0.2;
        if (bandValue < 1) band.smoothValue = Math.max(band.smoothValue - smoothingFactor * 5, 0);
        else {
          band.smoothValue = band.smoothValue + (bandValue - band.smoothValue) * smoothingFactor;
          isActive = true;
        }
        const x = startX + i * (barWidth + barGap);
        const barHeight = Math.min(band.smoothValue / 255 * barMaxHeight, barMaxHeight);
        const yTop = Math.max(canvas.height / scaleFactor / 2 - barHeight / 2, adjustedCircleRadius);
        const yBottom = Math.min(canvas.height / scaleFactor / 2 + barHeight / 2, canvas.height / scaleFactor - adjustedCircleRadius);
        if (band.smoothValue > 0) {
          canvasCtx.beginPath();
          canvasCtx.moveTo(x + barWidth / 2, yTop);
          canvasCtx.lineTo(x + barWidth / 2, yBottom);
          canvasCtx.lineWidth = barWidth;
          canvasCtx.strokeStyle = barColor;
          canvasCtx.stroke();
        } else {
          canvasCtx.beginPath();
          canvasCtx.arc(x + barWidth / 2, canvas.height / scaleFactor / 2, adjustedCircleRadius, 0, 2 * Math.PI);
          canvasCtx.fillStyle = barColor;
          canvasCtx.fill();
          canvasCtx.closePath();
        }
      });
      if (!isActive) drawInactiveCircles(adjustedCircleRadius, barColor);
      requestAnimationFrame(drawSpectrum);
    }
    function drawInactiveCircles(circleRadius, color) {
      const totalBarsWidth = bands.length * barWidth + (bands.length - 1) * barGap;
      const startX = (canvas.width / scaleFactor - totalBarsWidth) / 2;
      const y = canvas.height / scaleFactor / 2;
      bands.forEach((_, i) => {
        const x = startX + i * (barWidth + barGap);
        canvasCtx.beginPath();
        canvasCtx.arc(x + barWidth / 2, y, circleRadius, 0, 2 * Math.PI);
        canvasCtx.fillStyle = color;
        canvasCtx.fill();
        canvasCtx.closePath();
      });
    }
    drawSpectrum();
    window.addEventListener("resize", resizeCanvas);
    return () => {
      audioContext.close();
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [
    backgroundColor,
    barColor,
    barGap,
    barMaxHeight,
    barWidth,
    track
  ]);
  return jsx("canvas", {
    ref: canvasRef,
    style: {
      display: "block",
      width: "100%",
      height: "100%"
    }
  });
});
$993a744193844a95$export$59bf27bd43679db6.displayName = "VoiceVisualizer";
function AssistantContent() {
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  const rtviClient = $54a3c9f5bdbf0854$export$31a5f6a22c9b8fba();
  const transportState = $8376ffbc1b1f3c97$export$599fa01283bd4ece();
  useEffect(() => {
    async function getDevices() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((track) => track.stop());
        const devices2 = await navigator.mediaDevices.enumerateDevices();
        const microphones = devices2.filter((device) => device.kind === "audioinput");
        setDevices(microphones);
        if (microphones.length > 0) {
          setSelectedDevice(microphones[0].deviceId);
        }
      } catch (err) {
        setError("Could not access microphone");
        console.error(err);
      }
    }
    getDevices();
  }, []);
  useEffect(() => {
    if (rtviClient && selectedDevice) {
      try {
        rtviClient.setAudioInput?.(selectedDevice);
      } catch (err) {
        console.warn("Failed to set audio input device:", err);
      }
    }
  }, [rtviClient, selectedDevice]);
  const handleConnect = async () => {
    if (!rtviClient) return;
    setIsConnecting(true);
    setError(null);
    try {
      if (transportState === "disconnected") {
        await rtviClient.connect();
      } else if (transportState === "connected") {
        await rtviClient.disconnect();
      }
    } catch (err) {
      setError("Failed to connect to assistant");
      console.error(err);
    } finally {
      setIsConnecting(false);
    }
  };
  const getButtonText = () => {
    if (isConnecting) return "Connecting...";
    switch (transportState) {
      case "connected":
        return "Disconnect";
      case "connecting":
        return "Connecting...";
      case "authenticating":
        return "Authenticating...";
      case "disconnected":
        return "Start Conversation";
      default:
        return "Start Conversation";
    }
  };
  const isButtonDisabled = () => {
    return isConnecting || !selectedDevice || !rtviClient;
  };
  return /* @__PURE__ */ jsxs(Card, { className: "w-full max-w-md mx-auto", children: [
    /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "Talk to Portcullis" }) }),
    /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx("label", { className: "text-sm font-medium", children: "Select Microphone" }),
        /* @__PURE__ */ jsxs(Select, { value: selectedDevice, onValueChange: setSelectedDevice, children: [
          /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Choose a microphone" }) }),
          /* @__PURE__ */ jsx(SelectContent, { children: devices.map((device) => /* @__PURE__ */ jsx(SelectItem, { value: device.deviceId, children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Mic, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsx("span", { children: device.label || `Microphone ${device.deviceId.slice(0, 5)}...` })
          ] }) }, device.deviceId)) })
        ] })
      ] }),
      error && /* @__PURE__ */ jsx("div", { className: "text-sm text-red-500", children: error })
    ] }),
    /* @__PURE__ */ jsx(CardFooter, { children: /* @__PURE__ */ jsxs(
      Button,
      {
        className: "w-full",
        onClick: handleConnect,
        disabled: isButtonDisabled(),
        children: [
          isConnecting && /* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }),
          getButtonText()
        ]
      }
    ) })
  ] });
}
function Assistant() {
  const [client, setClient] = useState(null);
  useEffect(() => {
    async function loadClient() {
      try {
        const { RTVIClient } = await Promise.resolve().then(() => index_module);
        const { DailyTransport } = await import("./index.module_BlCrbqe3.mjs");
        const transport = new DailyTransport({
          dailyFactoryOptions: {
            // Daily.co specific configuration
            // The roomUrl property is used to specify the Daily room URL
            url: "https://runportcullis.daily.co/catbox"
          }
        });
        const rtviClient = new RTVIClient({
          transport,
          enableMic: true,
          enableCam: false,
          params: {
            baseUrl: "https://www.runportcullis.co/api",
            endpoint: {
              connect: "/connect"
            }
          }
        });
        setClient(rtviClient);
      } catch (error) {
        console.error("Failed to load Pipecat client:", error);
      }
    }
    loadClient();
  }, []);
  if (!client) {
    return /* @__PURE__ */ jsx("div", { children: "Loading assistant..." });
  }
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs($f3f7d4263dc13c6a$export$4a4ae2d5dc96782, { client, children: [
    /* @__PURE__ */ jsx(AssistantContent, {}),
    /* @__PURE__ */ jsx($f8b885726fc652c0$export$ba1245f7cbf3ae02, {})
  ] }) });
}
const $$Talk = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Talk to Portcullis", "mainClass": "flex-1 bg-background-200" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="flex items-center justify-center min-h-screen"> <div class="flex flex-col gap-4 w-full max-w-[58rem] items-center p-4"> ${renderComponent($$result2, "Assistant", Assistant, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/Assistant", "client:component-export": "Assistant" })} </div> </section> ` })}`;
}, "/Users/jdbohrman/www.runportcullis.co/src/pages/talk.astro", void 0);
const $$file = "/Users/jdbohrman/www.runportcullis.co/src/pages/talk.astro";
const $$url = "/talk";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Talk,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  $4086f06442fcb7d7$export$86495b081fef8e52 as $,
  $7afbbd59ebaa42bf$export$af88d00dbe7f521 as a,
  $8ead7b33b8402751$export$59b4786f333aac02 as b,
  $8ead7b33b8402751$export$e0624a511a2c4e9 as c,
  $b48f893ed1354c1e$export$69aa9ab0334b212 as d,
  page as p
};
