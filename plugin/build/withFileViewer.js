"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_plugins_1 = require("@expo/config-plugins");
let pkg = { name: "react-native-file-viewer" };
try {
    const pkg = require("react-native-file-viewer/package.json");
}
catch (e) { }
const withFileViewer = (config, props) => {
    return withFileViewerAndroidManifest(config, props);
};
const withFileViewerAndroidManifest = (config, props) => {
    return (0, config_plugins_1.withAndroidManifest)(config, (config) => {
        var _a;
        config.modResults = addAndroidMimeTypes(config.modResults, (_a = props === null || props === void 0 ? void 0 : props.android) === null || _a === void 0 ? void 0 : _a.mimeTypes);
        return config;
    });
};
const queryHasMimeType = (query, mimeType) => !!(query.intent &&
    query.intent.find((intent) => {
        var _a, _b, _c;
        return ((_b = (_a = intent.action) === null || _a === void 0 ? void 0 : _a.$) === null || _b === void 0 ? void 0 : _b["android:name"]) === "android.intent.action.VIEW" &&
            ((_c = intent.data) === null || _c === void 0 ? void 0 : _c.find((data) => { var _a; return ((_a = data.$) === null || _a === void 0 ? void 0 : _a["android:mimeType"]) === mimeType; }));
    }));
const queriesHasMimeType = (queries, mimeType) => !!queries.find((query) => queryHasMimeType(query, mimeType));
const addAndroidMimeTypes = (androidManifest, mimeTypes = "*/*") => {
    var _a, _b, _c, _d;
    const queries = [
        {
            ...(_a = androidManifest.manifest.queries) === null || _a === void 0 ? void 0 : _a[0],
            intent: [...(((_b = androidManifest.manifest.queries) === null || _b === void 0 ? void 0 : _b[0].intent) || [])],
        },
        ...(((_c = androidManifest.manifest.queries) === null || _c === void 0 ? void 0 : _c.slice(1)) || []),
    ];
    if (Array.isArray(mimeTypes)) {
        mimeTypes.forEach((mimeType) => {
            var _a;
            if (!queriesHasMimeType(queries, mimeType))
                (_a = queries[0].intent) === null || _a === void 0 ? void 0 : _a.push({
                    action: { $: { "android:name": "android.intent.action.VIEW" } },
                    data: [{ $: { "android:mimeType": mimeType } }],
                });
        });
    }
    else {
        const mimeType = mimeTypes;
        if (!queriesHasMimeType(queries, mimeType))
            (_d = queries[0].intent) === null || _d === void 0 ? void 0 : _d.push({
                action: { $: { "android:name": "android.intent.action.VIEW" } },
                data: [{ $: { "android:mimeType": mimeType } }],
            });
    }
    androidManifest.manifest.queries = queries;
    return androidManifest;
};
exports.default = (0, config_plugins_1.createRunOncePlugin)(withFileViewer, pkg.name, pkg.version);
