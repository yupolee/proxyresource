/*
#!name= EmbyChameleon
#!desc= 解除Emby观看客户端限制
#!author= Chris
[Script]
http-request ^https?:\/\/emby\.xxx script-path=EmbyChameleon.js, timeout = 5, tag=EmbyChameleon, args="client=&device=&deviceId=&version="

[MITM]
hostname = emby.xxx
*/
const isRequest = typeof $request !== "undefined";
const hasArgs = typeof $argument !== "undefined";


if (!hasArgs) {$done({});};

if (isRequest) {

    let headers = JSON.parse($request.headers);
    let url = $request.url;

    if (url.includes("emby/videos")) {
        headers["User-Agent"] = "libmpv";
        $done({headers: headers});
    };

    if (headers.indexOf("x-emby-authorization") != -1) {
        var auth = headers["x-emby-authorization"].replaceAll("\"", "");

        if (headers.indexOf("x-emby-token") != -1) {
            auth = auth.replace(/^(?!MediaBrowser)/, "MediaBrowser Token=".concat(headers["x-emby-token"], ", "));
        };
        auth = auth.replace(/Client=[\w-]+/i, "Client=".concat($argument.client));
        auth = auth.replace(/Device=[\w-]+/i, "Device=".concat($argument.device));
        auth = auth.replace(/DeviceId=[\w-]+/i, "DeviceId=".concat($argument.deviceId));
        auth = auth.replace(/Version=[\d\.]+/i, "Version=".concat($argument.version));

        headers["x-emby-authorization"] = auth;
        headers["user-agent"] = $argument.client.concat("/", $argument.version);

        $done({headers: JSON.stringify(headers)});
    };

};
