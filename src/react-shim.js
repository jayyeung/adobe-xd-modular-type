// Temporary Shim for React needed for Adobe XD
// Taken from https://github.com/AdobeXD/plugin-samples/blob/master/ui-hello-react/src/react-shim.js

if (window.setTimeout == null) {
    window.setTimeout = function(fn){ fn() };
}

if (window.clearTimeout == null) {
    window.clearTimeout = function(){};
}

//  this is a temporary shim for the latest versions of react.
if (window.cancelAnimationFrame == null) {
    window.cancelAnimationFrame = function() {};
}
if (window.requestAnimationFrame == null) {
    window.requestAnimationFrame = function() {
        console.log("requestAnimationFrame is not supported yet");
    }
}
if (window.HTMLIFrameElement == null) {
    window.HTMLIFrameElement = class HTMLIFrameElement {};
}