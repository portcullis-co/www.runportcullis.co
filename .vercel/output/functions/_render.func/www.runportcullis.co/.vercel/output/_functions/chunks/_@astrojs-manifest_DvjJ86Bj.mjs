import 'cookie';
import { k as bold, l as red, y as yellow, m as dim, n as blue } from './astro/server_C2DrDyYu.mjs';
import 'clsx';

const dateTimeFormat = new Intl.DateTimeFormat([], {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false
});
const levels = {
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
  silent: 90
};
function log(opts, level, label, message, newLine = true) {
  const logLevel = opts.level;
  const dest = opts.dest;
  const event = {
    label,
    level,
    message,
    newLine
  };
  if (!isLogLevelEnabled(logLevel, level)) {
    return;
  }
  dest.write(event);
}
function isLogLevelEnabled(configuredLogLevel, level) {
  return levels[configuredLogLevel] <= levels[level];
}
function info(opts, label, message, newLine = true) {
  return log(opts, "info", label, message, newLine);
}
function warn(opts, label, message, newLine = true) {
  return log(opts, "warn", label, message, newLine);
}
function error(opts, label, message, newLine = true) {
  return log(opts, "error", label, message, newLine);
}
function debug(...args) {
  if ("_astroGlobalDebug" in globalThis) {
    globalThis._astroGlobalDebug(...args);
  }
}
function getEventPrefix({ level, label }) {
  const timestamp = `${dateTimeFormat.format(/* @__PURE__ */ new Date())}`;
  const prefix = [];
  if (level === "error" || level === "warn") {
    prefix.push(bold(timestamp));
    prefix.push(`[${level.toUpperCase()}]`);
  } else {
    prefix.push(timestamp);
  }
  if (label) {
    prefix.push(`[${label}]`);
  }
  if (level === "error") {
    return red(prefix.join(" "));
  }
  if (level === "warn") {
    return yellow(prefix.join(" "));
  }
  if (prefix.length === 1) {
    return dim(prefix[0]);
  }
  return dim(prefix[0]) + " " + blue(prefix.splice(1).join(" "));
}
if (typeof process !== "undefined") {
  let proc = process;
  if ("argv" in proc && Array.isArray(proc.argv)) {
    if (proc.argv.includes("--verbose")) ; else if (proc.argv.includes("--silent")) ; else ;
  }
}
class Logger {
  options;
  constructor(options) {
    this.options = options;
  }
  info(label, message, newLine = true) {
    info(this.options, label, message, newLine);
  }
  warn(label, message, newLine = true) {
    warn(this.options, label, message, newLine);
  }
  error(label, message, newLine = true) {
    error(this.options, label, message, newLine);
  }
  debug(label, ...messages) {
    debug(label, ...messages);
  }
  level() {
    return this.options.level;
  }
  forkIntegrationLogger(label) {
    return new AstroIntegrationLogger(this.options, label);
  }
}
class AstroIntegrationLogger {
  options;
  label;
  constructor(logging, label) {
    this.options = logging;
    this.label = label;
  }
  /**
   * Creates a new logger instance with a new label, but the same log options.
   */
  fork(label) {
    return new AstroIntegrationLogger(this.options, label);
  }
  info(message) {
    info(this.options, this.label, message);
  }
  warn(message) {
    warn(this.options, this.label, message);
  }
  error(message) {
    error(this.options, this.label, message);
  }
  debug(message) {
    debug(this.label, message);
  }
}

/**
 * Tokenize input string.
 */
function lexer(str) {
    var tokens = [];
    var i = 0;
    while (i < str.length) {
        var char = str[i];
        if (char === "*" || char === "+" || char === "?") {
            tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
            continue;
        }
        if (char === "\\") {
            tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
            continue;
        }
        if (char === "{") {
            tokens.push({ type: "OPEN", index: i, value: str[i++] });
            continue;
        }
        if (char === "}") {
            tokens.push({ type: "CLOSE", index: i, value: str[i++] });
            continue;
        }
        if (char === ":") {
            var name = "";
            var j = i + 1;
            while (j < str.length) {
                var code = str.charCodeAt(j);
                if (
                // `0-9`
                (code >= 48 && code <= 57) ||
                    // `A-Z`
                    (code >= 65 && code <= 90) ||
                    // `a-z`
                    (code >= 97 && code <= 122) ||
                    // `_`
                    code === 95) {
                    name += str[j++];
                    continue;
                }
                break;
            }
            if (!name)
                throw new TypeError("Missing parameter name at ".concat(i));
            tokens.push({ type: "NAME", index: i, value: name });
            i = j;
            continue;
        }
        if (char === "(") {
            var count = 1;
            var pattern = "";
            var j = i + 1;
            if (str[j] === "?") {
                throw new TypeError("Pattern cannot start with \"?\" at ".concat(j));
            }
            while (j < str.length) {
                if (str[j] === "\\") {
                    pattern += str[j++] + str[j++];
                    continue;
                }
                if (str[j] === ")") {
                    count--;
                    if (count === 0) {
                        j++;
                        break;
                    }
                }
                else if (str[j] === "(") {
                    count++;
                    if (str[j + 1] !== "?") {
                        throw new TypeError("Capturing groups are not allowed at ".concat(j));
                    }
                }
                pattern += str[j++];
            }
            if (count)
                throw new TypeError("Unbalanced pattern at ".concat(i));
            if (!pattern)
                throw new TypeError("Missing pattern at ".concat(i));
            tokens.push({ type: "PATTERN", index: i, value: pattern });
            i = j;
            continue;
        }
        tokens.push({ type: "CHAR", index: i, value: str[i++] });
    }
    tokens.push({ type: "END", index: i, value: "" });
    return tokens;
}
/**
 * Parse a string for the raw tokens.
 */
function parse(str, options) {
    if (options === void 0) { options = {}; }
    var tokens = lexer(str);
    var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a;
    var defaultPattern = "[^".concat(escapeString(options.delimiter || "/#?"), "]+?");
    var result = [];
    var key = 0;
    var i = 0;
    var path = "";
    var tryConsume = function (type) {
        if (i < tokens.length && tokens[i].type === type)
            return tokens[i++].value;
    };
    var mustConsume = function (type) {
        var value = tryConsume(type);
        if (value !== undefined)
            return value;
        var _a = tokens[i], nextType = _a.type, index = _a.index;
        throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
    };
    var consumeText = function () {
        var result = "";
        var value;
        while ((value = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR"))) {
            result += value;
        }
        return result;
    };
    while (i < tokens.length) {
        var char = tryConsume("CHAR");
        var name = tryConsume("NAME");
        var pattern = tryConsume("PATTERN");
        if (name || pattern) {
            var prefix = char || "";
            if (prefixes.indexOf(prefix) === -1) {
                path += prefix;
                prefix = "";
            }
            if (path) {
                result.push(path);
                path = "";
            }
            result.push({
                name: name || key++,
                prefix: prefix,
                suffix: "",
                pattern: pattern || defaultPattern,
                modifier: tryConsume("MODIFIER") || "",
            });
            continue;
        }
        var value = char || tryConsume("ESCAPED_CHAR");
        if (value) {
            path += value;
            continue;
        }
        if (path) {
            result.push(path);
            path = "";
        }
        var open = tryConsume("OPEN");
        if (open) {
            var prefix = consumeText();
            var name_1 = tryConsume("NAME") || "";
            var pattern_1 = tryConsume("PATTERN") || "";
            var suffix = consumeText();
            mustConsume("CLOSE");
            result.push({
                name: name_1 || (pattern_1 ? key++ : ""),
                pattern: name_1 && !pattern_1 ? defaultPattern : pattern_1,
                prefix: prefix,
                suffix: suffix,
                modifier: tryConsume("MODIFIER") || "",
            });
            continue;
        }
        mustConsume("END");
    }
    return result;
}
/**
 * Compile a string to a template function for the path.
 */
function compile(str, options) {
    return tokensToFunction(parse(str, options), options);
}
/**
 * Expose a method for transforming tokens into the path function.
 */
function tokensToFunction(tokens, options) {
    if (options === void 0) { options = {}; }
    var reFlags = flags(options);
    var _a = options.encode, encode = _a === void 0 ? function (x) { return x; } : _a, _b = options.validate, validate = _b === void 0 ? true : _b;
    // Compile all the tokens into regexps.
    var matches = tokens.map(function (token) {
        if (typeof token === "object") {
            return new RegExp("^(?:".concat(token.pattern, ")$"), reFlags);
        }
    });
    return function (data) {
        var path = "";
        for (var i = 0; i < tokens.length; i++) {
            var token = tokens[i];
            if (typeof token === "string") {
                path += token;
                continue;
            }
            var value = data ? data[token.name] : undefined;
            var optional = token.modifier === "?" || token.modifier === "*";
            var repeat = token.modifier === "*" || token.modifier === "+";
            if (Array.isArray(value)) {
                if (!repeat) {
                    throw new TypeError("Expected \"".concat(token.name, "\" to not repeat, but got an array"));
                }
                if (value.length === 0) {
                    if (optional)
                        continue;
                    throw new TypeError("Expected \"".concat(token.name, "\" to not be empty"));
                }
                for (var j = 0; j < value.length; j++) {
                    var segment = encode(value[j], token);
                    if (validate && !matches[i].test(segment)) {
                        throw new TypeError("Expected all \"".concat(token.name, "\" to match \"").concat(token.pattern, "\", but got \"").concat(segment, "\""));
                    }
                    path += token.prefix + segment + token.suffix;
                }
                continue;
            }
            if (typeof value === "string" || typeof value === "number") {
                var segment = encode(String(value), token);
                if (validate && !matches[i].test(segment)) {
                    throw new TypeError("Expected \"".concat(token.name, "\" to match \"").concat(token.pattern, "\", but got \"").concat(segment, "\""));
                }
                path += token.prefix + segment + token.suffix;
                continue;
            }
            if (optional)
                continue;
            var typeOfMessage = repeat ? "an array" : "a string";
            throw new TypeError("Expected \"".concat(token.name, "\" to be ").concat(typeOfMessage));
        }
        return path;
    };
}
/**
 * Escape a regular expression string.
 */
function escapeString(str) {
    return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
/**
 * Get the flags for a regexp from the options.
 */
function flags(options) {
    return options && options.sensitive ? "" : "i";
}

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getRouteGenerator(segments, addTrailingSlash) {
  const template = segments.map((segment) => {
    return "/" + segment.map((part) => {
      if (part.spread) {
        return `:${part.content.slice(3)}(.*)?`;
      } else if (part.dynamic) {
        return `:${part.content}`;
      } else {
        return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      }
    }).join("");
  }).join("");
  let trailing = "";
  if (addTrailingSlash === "always" && segments.length) {
    trailing = "/";
  }
  const toPath = compile(template + trailing);
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    const path = toPath(sanitizedParams);
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware(_, next) {
      return next();
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes
  };
}

const manifest = deserializeManifest({"adapterName":"@astrojs/vercel/serverless","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/.pnpm/astro@4.11.5/node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/invite","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/invite\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"invite","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/invite.ts","pathname":"/api/invite","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.Oozc_hRb.js"}],"styles":[{"type":"inline","content":"@keyframes astroFadeInOut{0%{opacity:1}to{opacity:0}}@keyframes astroFadeIn{0%{opacity:0}}@keyframes astroFadeOut{to{opacity:0}}@keyframes astroSlideFromRight{0%{transform:translate(100%)}}@keyframes astroSlideFromLeft{0%{transform:translate(-100%)}}@keyframes astroSlideToRight{to{transform:translate(100%)}}@keyframes astroSlideToLeft{to{transform:translate(-100%)}}@media (prefers-reduced-motion){::view-transition-group(*),::view-transition-old(*),::view-transition-new(*){animation:none!important}[data-astro-transition-scope]{animation:none!important}}\n"},{"type":"external","src":"/_astro/_slug_.6GIF0L8e.css"}],"routeData":{"route":"/blog/category/[category]","isIndex":false,"type":"page","pattern":"^\\/blog\\/category\\/([^/]+?)\\/?$","segments":[[{"content":"blog","dynamic":false,"spread":false}],[{"content":"category","dynamic":false,"spread":false}],[{"content":"category","dynamic":true,"spread":false}]],"params":["category"],"component":"src/pages/blog/category/[category].astro","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.Oozc_hRb.js"}],"styles":[{"type":"inline","content":"@keyframes astroFadeInOut{0%{opacity:1}to{opacity:0}}@keyframes astroFadeIn{0%{opacity:0}}@keyframes astroFadeOut{to{opacity:0}}@keyframes astroSlideFromRight{0%{transform:translate(100%)}}@keyframes astroSlideFromLeft{0%{transform:translate(-100%)}}@keyframes astroSlideToRight{to{transform:translate(100%)}}@keyframes astroSlideToLeft{to{transform:translate(-100%)}}@media (prefers-reduced-motion){::view-transition-group(*),::view-transition-old(*),::view-transition-new(*){animation:none!important}[data-astro-transition-scope]{animation:none!important}}\n"},{"type":"external","src":"/_astro/_slug_.6GIF0L8e.css"}],"routeData":{"route":"/blog","isIndex":true,"type":"page","pattern":"^\\/blog\\/?$","segments":[[{"content":"blog","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/blog/index.astro","pathname":"/blog","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.Oozc_hRb.js"}],"styles":[{"type":"inline","content":"@keyframes astroFadeInOut{0%{opacity:1}to{opacity:0}}@keyframes astroFadeIn{0%{opacity:0}}@keyframes astroFadeOut{to{opacity:0}}@keyframes astroSlideFromRight{0%{transform:translate(100%)}}@keyframes astroSlideFromLeft{0%{transform:translate(-100%)}}@keyframes astroSlideToRight{to{transform:translate(100%)}}@keyframes astroSlideToLeft{to{transform:translate(-100%)}}@media (prefers-reduced-motion){::view-transition-group(*),::view-transition-old(*),::view-transition-new(*){animation:none!important}[data-astro-transition-scope]{animation:none!important}}\n"},{"type":"external","src":"/_astro/_slug_.6GIF0L8e.css"}],"routeData":{"route":"/blog/[...slug]","isIndex":false,"type":"page","pattern":"^\\/blog(?:\\/(.*?))?\\/?$","segments":[[{"content":"blog","dynamic":false,"spread":false}],[{"content":"...slug","dynamic":true,"spread":true}]],"params":["...slug"],"component":"src/pages/blog/[...slug].astro","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.Oozc_hRb.js"}],"styles":[{"type":"external","src":"/_astro/_slug_.6GIF0L8e.css"}],"routeData":{"route":"/contact","isIndex":false,"type":"page","pattern":"^\\/contact\\/?$","segments":[[{"content":"contact","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/contact.astro","pathname":"/contact","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.Oozc_hRb.js"}],"styles":[{"type":"external","src":"/_astro/_slug_.6GIF0L8e.css"}],"routeData":{"route":"/landing","isIndex":false,"type":"page","pattern":"^\\/landing\\/?$","segments":[[{"content":"landing","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/landing.astro","pathname":"/landing","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.Oozc_hRb.js"}],"styles":[{"type":"external","src":"/_astro/_slug_.6GIF0L8e.css"}],"routeData":{"route":"/legal/privacy","isIndex":false,"type":"page","pattern":"^\\/legal\\/privacy\\/?$","segments":[[{"content":"legal","dynamic":false,"spread":false}],[{"content":"privacy","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/legal/privacy.md","pathname":"/legal/privacy","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.Oozc_hRb.js"}],"styles":[{"type":"external","src":"/_astro/_slug_.6GIF0L8e.css"}],"routeData":{"route":"/legal/terms","isIndex":false,"type":"page","pattern":"^\\/legal\\/terms\\/?$","segments":[[{"content":"legal","dynamic":false,"spread":false}],[{"content":"terms","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/legal/terms.md","pathname":"/legal/terms","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.Oozc_hRb.js"}],"styles":[{"type":"external","src":"/_astro/_slug_.6GIF0L8e.css"}],"routeData":{"route":"/pricing","isIndex":false,"type":"page","pattern":"^\\/pricing\\/?$","segments":[[{"content":"pricing","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/pricing.astro","pathname":"/pricing","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.Oozc_hRb.js"}],"styles":[{"type":"external","src":"/_astro/_slug_.6GIF0L8e.css"}],"routeData":{"route":"/referral","isIndex":false,"type":"page","pattern":"^\\/referral\\/?$","segments":[[{"content":"referral","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/referral.astro","pathname":"/referral","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.Oozc_hRb.js"}],"styles":[{"type":"inline","content":"@keyframes astroFadeInOut{0%{opacity:1}to{opacity:0}}@keyframes astroFadeIn{0%{opacity:0}}@keyframes astroFadeOut{to{opacity:0}}@keyframes astroSlideFromRight{0%{transform:translate(100%)}}@keyframes astroSlideFromLeft{0%{transform:translate(-100%)}}@keyframes astroSlideToRight{to{transform:translate(100%)}}@keyframes astroSlideToLeft{to{transform:translate(-100%)}}@media (prefers-reduced-motion){::view-transition-group(*),::view-transition-old(*),::view-transition-new(*){animation:none!important}[data-astro-transition-scope]{animation:none!important}}\n"},{"type":"external","src":"/_astro/_slug_.6GIF0L8e.css"}],"routeData":{"route":"/releases/[slug]","isIndex":false,"type":"page","pattern":"^\\/releases\\/([^/]+?)\\/?$","segments":[[{"content":"releases","dynamic":false,"spread":false}],[{"content":"slug","dynamic":true,"spread":false}]],"params":["slug"],"component":"src/pages/releases/[slug].astro","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.Oozc_hRb.js"}],"styles":[{"type":"external","src":"/_astro/_slug_.6GIF0L8e.css"}],"routeData":{"route":"/releases","isIndex":true,"type":"page","pattern":"^\\/releases\\/?$","segments":[[{"content":"releases","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/releases/index.astro","pathname":"/releases","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/rss.xml","isIndex":false,"type":"endpoint","pattern":"^\\/rss\\.xml\\/?$","segments":[[{"content":"rss.xml","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/rss.xml.js","pathname":"/rss.xml","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.Oozc_hRb.js"}],"styles":[{"type":"external","src":"/_astro/_slug_.6GIF0L8e.css"}],"routeData":{"route":"/services/clickhouse-support","isIndex":false,"type":"page","pattern":"^\\/services\\/clickhouse-support\\/?$","segments":[[{"content":"services","dynamic":false,"spread":false}],[{"content":"clickhouse-support","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/services/clickhouse-support.astro","pathname":"/services/clickhouse-support","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.Oozc_hRb.js"}],"styles":[{"type":"external","src":"/_astro/_slug_.6GIF0L8e.css"}],"routeData":{"route":"/services/content-writing","isIndex":false,"type":"page","pattern":"^\\/services\\/content-writing\\/?$","segments":[[{"content":"services","dynamic":false,"spread":false}],[{"content":"content-writing","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/services/content-writing.astro","pathname":"/services/content-writing","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/services/custom-poc","isIndex":false,"type":"page","pattern":"^\\/services\\/custom-poc\\/?$","segments":[[{"content":"services","dynamic":false,"spread":false}],[{"content":"custom-poc","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/services/custom-poc.astro","pathname":"/services/custom-poc","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.Oozc_hRb.js"}],"styles":[{"type":"external","src":"/_astro/_slug_.6GIF0L8e.css"}],"routeData":{"route":"/services/oss-support","isIndex":false,"type":"page","pattern":"^\\/services\\/oss-support\\/?$","segments":[[{"content":"services","dynamic":false,"spread":false}],[{"content":"oss-support","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/services/oss-support.astro","pathname":"/services/oss-support","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.Oozc_hRb.js"}],"styles":[{"type":"external","src":"/_astro/_slug_.6GIF0L8e.css"}],"routeData":{"route":"/services/query-optimization","isIndex":false,"type":"page","pattern":"^\\/services\\/query-optimization\\/?$","segments":[[{"content":"services","dynamic":false,"spread":false}],[{"content":"query-optimization","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/services/query-optimization.astro","pathname":"/services/query-optimization","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.Oozc_hRb.js"}],"styles":[{"type":"external","src":"/_astro/_slug_.6GIF0L8e.css"}],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}}],"site":"https://www.runportcullis.co","base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["/Users/jdbohrman/www.runportcullis.co/src/components/cards/blog-card.astro",{"propagation":"in-tree","containsHead":false}],["/Users/jdbohrman/www.runportcullis.co/src/pages/blog/category/[category].astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/blog/category/[category]@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astrojs-ssr-virtual-entry",{"propagation":"in-tree","containsHead":false}],["/Users/jdbohrman/www.runportcullis.co/src/pages/blog/index.astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/blog/index@_@astro",{"propagation":"in-tree","containsHead":false}],["/Users/jdbohrman/www.runportcullis.co/src/layouts/blog-post.astro",{"propagation":"in-tree","containsHead":false}],["/Users/jdbohrman/www.runportcullis.co/src/pages/blog/[...slug].astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/blog/[...slug]@_@astro",{"propagation":"in-tree","containsHead":false}],["/Users/jdbohrman/www.runportcullis.co/src/pages/legal/privacy.md",{"propagation":"none","containsHead":true}],["/Users/jdbohrman/www.runportcullis.co/src/pages/legal/terms.md",{"propagation":"none","containsHead":true}],["/Users/jdbohrman/www.runportcullis.co/src/pages/contact.astro",{"propagation":"none","containsHead":true}],["/Users/jdbohrman/www.runportcullis.co/src/pages/index.astro",{"propagation":"none","containsHead":true}],["/Users/jdbohrman/www.runportcullis.co/src/pages/landing.astro",{"propagation":"none","containsHead":true}],["/Users/jdbohrman/www.runportcullis.co/src/pages/pricing.astro",{"propagation":"none","containsHead":true}],["/Users/jdbohrman/www.runportcullis.co/src/pages/referral.astro",{"propagation":"none","containsHead":true}],["/Users/jdbohrman/www.runportcullis.co/src/pages/releases/[slug].astro",{"propagation":"in-tree","containsHead":true}],["/Users/jdbohrman/www.runportcullis.co/src/pages/releases/index.astro",{"propagation":"in-tree","containsHead":true}],["/Users/jdbohrman/www.runportcullis.co/src/pages/services/clickhouse-support.astro",{"propagation":"none","containsHead":true}],["/Users/jdbohrman/www.runportcullis.co/src/pages/services/content-writing.astro",{"propagation":"none","containsHead":true}],["/Users/jdbohrman/www.runportcullis.co/src/pages/services/oss-support.astro",{"propagation":"none","containsHead":true}],["/Users/jdbohrman/www.runportcullis.co/src/pages/services/query-optimization.astro",{"propagation":"none","containsHead":true}],["\u0000astro:content",{"propagation":"in-tree","containsHead":false}],["/Users/jdbohrman/www.runportcullis.co/src/lib/fetchers.ts",{"propagation":"in-tree","containsHead":false}],["/Users/jdbohrman/www.runportcullis.co/src/components/blog-header.astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/releases/[slug]@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/releases/index@_@astro",{"propagation":"in-tree","containsHead":false}],["/Users/jdbohrman/www.runportcullis.co/src/pages/rss.xml.js",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/rss.xml@_@js",{"propagation":"in-tree","containsHead":false}]],"renderers":[],"clientDirectives":[["idle","(()=>{var i=t=>{let e=async()=>{await(await t())()};\"requestIdleCallback\"in window?window.requestIdleCallback(e):setTimeout(e,200)};(self.Astro||(self.Astro={})).idle=i;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var s=(i,t)=>{let a=async()=>{await(await i())()};if(t.value){let e=matchMedia(t.value);e.matches?a():e.addEventListener(\"change\",a,{once:!0})}};(self.Astro||(self.Astro={})).media=s;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var l=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let a of e)if(a.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=l;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000astro-internal:middleware":"_astro-internal_middleware.mjs","\u0000@astro-page:node_modules/.pnpm/astro@4.11.5/node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","\u0000@astro-page:src/pages/api/invite@_@ts":"pages/api/invite.astro.mjs","\u0000@astro-page:src/pages/blog/category/[category]@_@astro":"pages/blog/category/_category_.astro.mjs","\u0000@astro-page:src/pages/blog/index@_@astro":"pages/blog.astro.mjs","\u0000@astro-page:src/pages/blog/[...slug]@_@astro":"pages/blog/_---slug_.astro.mjs","\u0000@astro-page:src/pages/contact@_@astro":"pages/contact.astro.mjs","\u0000@astro-page:src/pages/landing@_@astro":"pages/landing.astro.mjs","\u0000@astro-page:src/pages/legal/privacy@_@md":"pages/legal/privacy.astro.mjs","\u0000@astro-page:src/pages/legal/terms@_@md":"pages/legal/terms.astro.mjs","\u0000@astro-page:src/pages/pricing@_@astro":"pages/pricing.astro.mjs","\u0000@astro-page:src/pages/referral@_@astro":"pages/referral.astro.mjs","\u0000@astro-page:src/pages/releases/[slug]@_@astro":"pages/releases/_slug_.astro.mjs","\u0000@astro-page:src/pages/releases/index@_@astro":"pages/releases.astro.mjs","\u0000@astro-page:src/pages/rss.xml@_@js":"pages/rss.xml.astro.mjs","\u0000@astro-page:src/pages/services/clickhouse-support@_@astro":"pages/services/clickhouse-support.astro.mjs","\u0000@astro-page:src/pages/services/content-writing@_@astro":"pages/services/content-writing.astro.mjs","\u0000@astro-page:src/pages/services/custom-poc@_@astro":"pages/services/custom-poc.astro.mjs","\u0000@astro-page:src/pages/services/oss-support@_@astro":"pages/services/oss-support.astro.mjs","\u0000@astro-page:src/pages/services/query-optimization@_@astro":"pages/services/query-optimization.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","/Users/jdbohrman/www.runportcullis.co/node_modules/.pnpm/astro@4.11.5/node_modules/astro/dist/env/setup.js":"chunks/astro/env-setup_Cr6XTFvb.mjs","/Users/jdbohrman/www.runportcullis.co/node_modules/.pnpm/@astrojs+react@3.6.0_@types+react-dom@18.3.0_@types+react@18.3.3_react-dom@18.3.1_react@18.3.1_vite@5.4.11/node_modules/@astrojs/react/vnode-children.js":"chunks/vnode-children_C1YIWAGb.mjs","/node_modules/.pnpm/astro@4.11.5/node_modules/astro/dist/assets/endpoint/generic.js":"chunks/generic_yPr0GG51.mjs","/src/pages/api/invite.ts":"chunks/invite_BxKWG7Bg.mjs","/src/pages/blog/category/[category].astro":"chunks/_category__DBX1ayQN.mjs","/src/pages/blog/index.astro":"chunks/index_BXhrmvvG.mjs","/src/pages/blog/[...slug].astro":"chunks/_...slug__Be5Oude_.mjs","/src/pages/contact.astro":"chunks/contact_kf-wBqwj.mjs","/src/pages/landing.astro":"chunks/landing_CAEX3MUE.mjs","/src/pages/legal/privacy.md":"chunks/privacy_C7TkDHMj.mjs","/src/pages/legal/terms.md":"chunks/terms_CwwhAzam.mjs","/src/pages/pricing.astro":"chunks/pricing_DnPPOsO1.mjs","/src/pages/referral.astro":"chunks/referral_CRtNjVEP.mjs","/src/pages/releases/[slug].astro":"chunks/_slug__BkLUVN_M.mjs","/src/pages/releases/index.astro":"chunks/index_DJYu0P51.mjs","/src/pages/rss.xml.js":"chunks/rss.xml_BKSYOdrR.mjs","/src/pages/services/clickhouse-support.astro":"chunks/clickhouse-support_Dver1yu1.mjs","/src/pages/services/content-writing.astro":"chunks/content-writing_0BnSywNn.mjs","/src/pages/services/custom-poc.astro":"chunks/custom-poc_CGRZsdlM.mjs","/src/pages/services/oss-support.astro":"chunks/oss-support_jtA6fW5J.mjs","/src/pages/services/query-optimization.astro":"chunks/query-optimization_DM9RIZ4V.mjs","/src/pages/index.astro":"chunks/index_Cop_Mtv0.mjs","/Users/jdbohrman/www.runportcullis.co/src/content/blog/chdb-a-powerful-in-memory-clickhouse.md?astroContentCollectionEntry=true":"chunks/chdb-a-powerful-in-memory-clickhouse_DbPVXkB5.mjs","/Users/jdbohrman/www.runportcullis.co/src/content/blog/clickhouse-2025-roadmap.md?astroContentCollectionEntry=true":"chunks/clickhouse-2025-roadmap_C3B18mTL.mjs","/Users/jdbohrman/www.runportcullis.co/src/content/blog/clickhouse-use-case-guide-digital-twins.md?astroContentCollectionEntry=true":"chunks/clickhouse-use-case-guide-digital-twins_BJ1tS8wH.mjs","/Users/jdbohrman/www.runportcullis.co/src/content/blog/faster-clickhouse-queries-with-these-eight-tricks.md?astroContentCollectionEntry=true":"chunks/faster-clickhouse-queries-with-these-eight-tricks_DJRze0bD.mjs","/Users/jdbohrman/www.runportcullis.co/src/content/blog/primary-key-caching.md?astroContentCollectionEntry=true":"chunks/primary-key-caching_B5ZE_Dxn.mjs","/Users/jdbohrman/www.runportcullis.co/src/content/blog/setting-custom-http-headers.md?astroContentCollectionEntry=true":"chunks/setting-custom-http-headers_CxgiMMFh.mjs","/Users/jdbohrman/www.runportcullis.co/src/content/blog/use-cases-for-clickhouse-json.md?astroContentCollectionEntry=true":"chunks/use-cases-for-clickhouse-json_DD8Hde--.mjs","/Users/jdbohrman/www.runportcullis.co/src/content/blog/why-we-bet-on-clickhouse.md?astroContentCollectionEntry=true":"chunks/why-we-bet-on-clickhouse_EFfn2DwB.mjs","/Users/jdbohrman/www.runportcullis.co/src/content/docs/documentation/code-blocks.mdx?astroContentCollectionEntry=true":"chunks/code-blocks_C8X8lkGN.mjs","/Users/jdbohrman/www.runportcullis.co/src/content/docs/documentation/commerce/data-fulfillment.mdx?astroContentCollectionEntry=true":"chunks/data-fulfillment_Bo2cooMn.mjs","/Users/jdbohrman/www.runportcullis.co/src/content/docs/documentation/commerce/payment-links.mdx?astroContentCollectionEntry=true":"chunks/payment-links_BrZ8Ffxi.mjs","/Users/jdbohrman/www.runportcullis.co/src/content/docs/documentation/commerce/portals.mdx?astroContentCollectionEntry=true":"chunks/portals_5nfAIyF9.mjs","/Users/jdbohrman/www.runportcullis.co/src/content/docs/documentation/commerce/stripe-connect.mdx?astroContentCollectionEntry=true":"chunks/stripe-connect_BvUZadKk.mjs","/Users/jdbohrman/www.runportcullis.co/src/content/docs/documentation/concepts.mdx?astroContentCollectionEntry=true":"chunks/concepts_DNnbkV-7.mjs","/Users/jdbohrman/www.runportcullis.co/src/content/docs/documentation/index.mdx?astroContentCollectionEntry=true":"chunks/index_DGAuQEY5.mjs","/Users/jdbohrman/www.runportcullis.co/src/content/docs/documentation/style-guide.mdx?astroContentCollectionEntry=true":"chunks/style-guide_T9wS3SHm.mjs","/Users/jdbohrman/www.runportcullis.co/src/content/docs/getting-started.mdx?astroContentCollectionEntry=true":"chunks/getting-started_pz39Kvzg.mjs","/Users/jdbohrman/www.runportcullis.co/src/content/docs/in-progress.mdx?astroContentCollectionEntry=true":"chunks/in-progress_DcFhl0mJ.mjs","/Users/jdbohrman/www.runportcullis.co/src/content/blog/chdb-a-powerful-in-memory-clickhouse.md?astroPropagatedAssets":"chunks/chdb-a-powerful-in-memory-clickhouse_DAHRVkq3.mjs","/Users/jdbohrman/www.runportcullis.co/src/content/blog/clickhouse-2025-roadmap.md?astroPropagatedAssets":"chunks/clickhouse-2025-roadmap_C6jhsEJX.mjs","/Users/jdbohrman/www.runportcullis.co/src/content/blog/clickhouse-use-case-guide-digital-twins.md?astroPropagatedAssets":"chunks/clickhouse-use-case-guide-digital-twins_VZwjXBf2.mjs","/Users/jdbohrman/www.runportcullis.co/src/content/blog/faster-clickhouse-queries-with-these-eight-tricks.md?astroPropagatedAssets":"chunks/faster-clickhouse-queries-with-these-eight-tricks_B587QIE_.mjs","/Users/jdbohrman/www.runportcullis.co/src/content/blog/primary-key-caching.md?astroPropagatedAssets":"chunks/primary-key-caching_0nlt6Wc-.mjs","/Users/jdbohrman/www.runportcullis.co/src/content/blog/setting-custom-http-headers.md?astroPropagatedAssets":"chunks/setting-custom-http-headers_CXIKXj2u.mjs","/Users/jdbohrman/www.runportcullis.co/src/content/blog/use-cases-for-clickhouse-json.md?astroPropagatedAssets":"chunks/use-cases-for-clickhouse-json_B5z24b_1.mjs","/Users/jdbohrman/www.runportcullis.co/src/content/blog/why-we-bet-on-clickhouse.md?astroPropagatedAssets":"chunks/why-we-bet-on-clickhouse_CvaYMIEH.mjs","/Users/jdbohrman/www.runportcullis.co/src/content/docs/documentation/code-blocks.mdx?astroPropagatedAssets":"chunks/code-blocks_CchlCPi7.mjs","/Users/jdbohrman/www.runportcullis.co/src/content/docs/documentation/commerce/data-fulfillment.mdx?astroPropagatedAssets":"chunks/data-fulfillment_BhR1yYxg.mjs","/Users/jdbohrman/www.runportcullis.co/src/content/docs/documentation/commerce/payment-links.mdx?astroPropagatedAssets":"chunks/payment-links_B_do5xDn.mjs","/Users/jdbohrman/www.runportcullis.co/src/content/docs/documentation/commerce/portals.mdx?astroPropagatedAssets":"chunks/portals_CAQViyYZ.mjs","/Users/jdbohrman/www.runportcullis.co/src/content/docs/documentation/commerce/stripe-connect.mdx?astroPropagatedAssets":"chunks/stripe-connect_DIHv_sx_.mjs","/Users/jdbohrman/www.runportcullis.co/src/content/docs/documentation/concepts.mdx?astroPropagatedAssets":"chunks/concepts_CNeuGy_R.mjs","/Users/jdbohrman/www.runportcullis.co/src/content/docs/documentation/index.mdx?astroPropagatedAssets":"chunks/index_DVTgoFB6.mjs","/Users/jdbohrman/www.runportcullis.co/src/content/docs/documentation/style-guide.mdx?astroPropagatedAssets":"chunks/style-guide_C02QUv9H.mjs","/Users/jdbohrman/www.runportcullis.co/src/content/docs/getting-started.mdx?astroPropagatedAssets":"chunks/getting-started_DZ68ee_b.mjs","/Users/jdbohrman/www.runportcullis.co/src/content/docs/in-progress.mdx?astroPropagatedAssets":"chunks/in-progress_BLsH9pR0.mjs","/Users/jdbohrman/www.runportcullis.co/src/content/blog/chdb-a-powerful-in-memory-clickhouse.md":"chunks/chdb-a-powerful-in-memory-clickhouse_D_iZoJ4c.mjs","/Users/jdbohrman/www.runportcullis.co/src/content/blog/clickhouse-2025-roadmap.md":"chunks/clickhouse-2025-roadmap_By2EF1-X.mjs","/Users/jdbohrman/www.runportcullis.co/src/content/blog/clickhouse-use-case-guide-digital-twins.md":"chunks/clickhouse-use-case-guide-digital-twins_Dkq410HK.mjs","/Users/jdbohrman/www.runportcullis.co/src/content/blog/faster-clickhouse-queries-with-these-eight-tricks.md":"chunks/faster-clickhouse-queries-with-these-eight-tricks_D4x4NEwn.mjs","/Users/jdbohrman/www.runportcullis.co/src/content/blog/primary-key-caching.md":"chunks/primary-key-caching_itmFmoP6.mjs","/Users/jdbohrman/www.runportcullis.co/src/content/blog/setting-custom-http-headers.md":"chunks/setting-custom-http-headers_VfudGO_k.mjs","/Users/jdbohrman/www.runportcullis.co/src/content/blog/use-cases-for-clickhouse-json.md":"chunks/use-cases-for-clickhouse-json_CMnm6cWa.mjs","/Users/jdbohrman/www.runportcullis.co/src/content/blog/why-we-bet-on-clickhouse.md":"chunks/why-we-bet-on-clickhouse_Dz1xH6o2.mjs","/Users/jdbohrman/www.runportcullis.co/src/content/docs/documentation/code-blocks.mdx":"chunks/code-blocks_C_RXBWoF.mjs","/Users/jdbohrman/www.runportcullis.co/src/content/docs/documentation/commerce/data-fulfillment.mdx":"chunks/data-fulfillment_CtqSsBz0.mjs","/Users/jdbohrman/www.runportcullis.co/src/content/docs/documentation/commerce/payment-links.mdx":"chunks/payment-links_DUZC6nCb.mjs","/Users/jdbohrman/www.runportcullis.co/src/content/docs/documentation/commerce/portals.mdx":"chunks/portals_6c_1ewHE.mjs","/Users/jdbohrman/www.runportcullis.co/src/content/docs/documentation/commerce/stripe-connect.mdx":"chunks/stripe-connect_BdsVk9f-.mjs","/Users/jdbohrman/www.runportcullis.co/src/content/docs/documentation/concepts.mdx":"chunks/concepts_DC1lE1kY.mjs","/Users/jdbohrman/www.runportcullis.co/src/content/docs/documentation/index.mdx":"chunks/index_DRwtE2Q-.mjs","/Users/jdbohrman/www.runportcullis.co/src/content/docs/documentation/style-guide.mdx":"chunks/style-guide_Dhndmw5t.mjs","/Users/jdbohrman/www.runportcullis.co/src/content/docs/getting-started.mdx":"chunks/getting-started_ClxmDRYO.mjs","/Users/jdbohrman/www.runportcullis.co/src/content/docs/in-progress.mdx":"chunks/in-progress_CkW0PWfg.mjs","\u0000@astrojs-manifest":"manifest_BKyB99_8.mjs","@/components/slack-connect-dialog":"_astro/slack-connect-dialog.DL5S2Cf_.js","@astrojs/react/client.js":"_astro/client.BKVnlK2V.js","@/components/layout/sheet-mobile-nav":"_astro/sheet-mobile-nav.DDAQIoha.js","@/components/main-navigation-menu":"_astro/main-navigation-menu.BWw8cOBp.js","sonner":"_astro/_astro-entry_sonner.D8d_tHt7.js","/astro/hoisted.js?q=0":"_astro/hoisted.Oozc_hRb.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[],"assets":["/_astro/_slug_.6GIF0L8e.css","/favicon.svg","/firebase-messaging-sw.js","/happydash.svg","/og.png","/portcullis.svg","/splash.mp4","/_astro/_astro-entry_sonner.D8d_tHt7.js","/_astro/button.D-jiR9uq.js","/_astro/client.BKVnlK2V.js","/_astro/hoisted.Oozc_hRb.js","/_astro/index.9kEdNl7_.js","/_astro/index.Bkd2wcwY.js","/_astro/index.C0bvXPo0.js","/_astro/main-navigation-menu.BWw8cOBp.js","/_astro/sheet-mobile-nav.DDAQIoha.js","/_astro/slack-connect-dialog.DL5S2Cf_.js","/fonts/calsans-semibold.woff2","/fonts/inter.woff2","/blog/blog-cover-01.png","/blog/blog-cover-02.png","/blog/blog-cover-03.png","/blog/blog-cover-04.png","/blog/blog-cover-05.png","/blog/blog-cover-06.png","/blog/blog-cover-07.png","/blog/blog-cover-08.png","/blog/blog-cover-09.png","/blog/blog-cover-10.png","/blog/blog-cover-11.png","/blog/blog-cover-12.png","/blog/blog-cover-13.png","/blog/blog-cover-14.png","/blog/blog-cover-15.png","/blog/blog-cover-16.png","/blog/blog-cover-17.png","/blog/blog-cover-18.png","/blog/blog-cover-19.png","/blog/blog-cover-20.png","/blog/blog-cover-21.png","/blog/blog-cover-22.png","/blog/blog-cover-23.png","/blog/blog-cover-24.png","/blog/blog-cover-http-headers.png","/blog/blog-cover-juice.png","/blog/chdb-benchmarks.png","/blog/chdb-query.png","/blog/chdb-udf.png","/blog/excavator.jpg","/blog/json-storage.png","/blog/new-year-2025.png","/blog/primary-key-cache.png","/blog/time-series-chart.png","/blog/variant-type.png","/images/examples/about.jpg","/images/examples/animes.jpg","/images/examples/changelog.jpg","/images/examples/documentation.jpg","/images/examples/landing.jpg","/images/examples/newsletter.jpg","/images/examples/placeholder.jpg","/images/examples/pricing.jpg","/images/examples/static-blog.jpg","/images/examples/waitlist.jpg","/images/vs/vscensus.png","/images/vs/vsprequel.png","/images/blog/competition.png","/images/blog/indie-paywalls.png","/images/blog/indieprise00.png","/images/blog/indieprise01.png","/images/blog/placeholder-1.jpg","/images/blog/placeholder-2.jpg","/images/blog/placeholder-3.jpg","/images/blog/placeholder-4.jpg","/images/blog/placeholder-5.jpg","/images/blog/placeholder-about.jpg"],"buildFormat":"directory","checkOrigin":false,"rewritingEnabled":false,"experimentalEnvGetSecretEnabled":false});

export { AstroIntegrationLogger as A, Logger as L, getEventPrefix as g, levels as l, manifest as m };
