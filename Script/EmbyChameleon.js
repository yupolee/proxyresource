/*
#!name= EmbyChameleon
#!desc= 解除Emby观看客户端限制
#!author= Chris
#!usage= 以Loon为例，添加到Script部分并配置args
[Script]
http-request ^https?:\/\/emby\.xxx script-path=EmbyChameleon.js, timeout = 5, tag=EmbyChameleon, args="client=&version=&token=&device=&deviceId="

[MITM]
hostname = emby.xxx
*/
const isRequest = typeof $request !== "undefined";
const hasArgs = typeof $argument !== "undefined";

let headers = $request.headers;
let url = $request.url;

function setHeader(obj, key, value) {
    const realKey = Object.keys(obj).find(
        k => k.toLowerCase() === key.toLowerCase()
    );
    if (realKey) obj[realKey] = value;
};

function getHeader(obj, key) {
    const realKey = Object.keys(obj).find(
        k => k.toLowerCase() === key.toLowerCase()
    );
    if (realKey) return obj[realKey];
};

function isSafari(headers) {
    const ua = getHeader(headers, "user-agent").toLowerCase();
    return ua.includes("iphone") && ua.includes("safari") && ua.includes("mobile");
};

if (isSafari(headers)) $done({});
if (!hasArgs) $done({});

const parseArgument = argu =>
    (argu || '').split('&').filter(Boolean).reduce((o, kv) => {
        const [k, v = ''] = kv.split('=');
        o[k] = v;
        return o;
    }, {});
const argu = parseArgument($argument);

if (isRequest) {
    if (url.includes("emby/videos")) {
        setHeader(headers, "user-agent", "libmpv");

        ["X-Emby-Authorization", "X-Emby-Token"].forEach(k => delete headers[k]);
        $done({headers: headers});
    };

    if (Object.hasOwn(headers, "x-emby-authorization")) {
        var auth = headers["x-emby-authorization"].replaceAll("\"", "");

        if (Object.hasOwn(headers, "x-emby-token")) {
            headers["x-emby-token"] = argu.token;
            auth = auth.replace(/^(?!MediaBrowser)/, "MediaBrowser Token=".concat(argu.token, ", "));
        };
        auth = auth.replace(/Client=[\w-]+/i, "Client=".concat(argu.client));
        auth = auth.replace(/Device=[\w-]+/i, "Device=".concat(argu.device));
        auth = auth.replace(/DeviceId=[\w-]+/i, "DeviceId=".concat(argu.deviceId));
        auth = auth.replace(/Version=[\d\.]+/i, "Version=".concat(argu.version));

        headers["x-emby-authorization"] = auth;
    };

    setHeader(headers, "user-agent", argu.client.concat("/", argu.version));
    $done({headers: headers});
};
