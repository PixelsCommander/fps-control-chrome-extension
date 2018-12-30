let dropFrames = 0;
let maxFPS = 0;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.type) {
        case 'getPopupState':
            chrome.runtime.sendMessage({
                type: 'setPopupState',
                value: {
                    dropFrames: dropFrames,
                    maxFPS: maxFPS,
                }
            });
            break;
        case 'dropFrames':
            processDropFrames(message.value);
            break;
        case 'limitFPS':
            processLimitFPS(message.value);
            break;
        default:
            break;
    }
});

function processDropFrames(percentage) {
    dropFrames = percentage || 0;

    if (!percentage) {
        var elt = document.createElement("script");
        elt.innerHTML = `window.disableDropFPS();`;
        document.head.appendChild(elt);
    } else {
        var elt = document.createElement("script");
        elt.innerHTML = ` window.setSkipProcent(${percentage}) ;window.enableVirtualRAF();`;
        document.head.appendChild(elt);
    }
}

function processLimitFPS(maxFPSArg) {
    maxFPS = maxFPSArg || 0;

    if (!maxFPS) {
        var elt = document.createElement("script");
        elt.innerHTML = `window.disableLimitFPS();`;
        document.head.appendChild(elt);
    } else {
        var elt = document.createElement("script");
        elt.innerHTML = `window.setFPSLimit(${maxFPS}) ; window.enableVirtualRAF();`;
        document.head.appendChild(elt);
    }
}

var scriptContent = `
window.skipProcent = ${dropFrames};
window.maxFPS = ${maxFPS};
window.frameDelay = 0;

var rafs = 0;

var raf = window.requestAnimationFrame;
var nextRAFTime = Date.now();

var mockedRaf = (callback) => {
    var skip = Math.random() < window.skipProcent || Date.now() < nextRAFTime;
    
    if (skip) {
        skippingRaf(callback);
    } else {
        nextRAFTime = Date.now() + window.frameDelay;
        raf(callback);
    }

    return rafs++;
}

function skippingRaf(func) {
    raf(() => {
        window.requestAnimationFrame(func);
    })
}

window.setFPSLimit = function(v) {
    window.frameDelay = 1000 / v;
    window.maxFPS = v;
}

window.setSkipProcent = function(v) {
    window.skipProcent = v; 
}

window.enableVirtualRAF = function enableDropFPS() {
    window.requestAnimationFrame = mockedRaf;
}

window.disableVirtualRAF = function enableDropFPS() {
    window.requestAnimationFrame = raf;
}

window.disableDropFPS = function disableDropFPS() {
    window.skipProcent = 0;
}

window.disableLimitFPS = function disableLimitFPS() {
    window.maxFPS = 0;
}
`;

var elt = document.createElement("script");
elt.innerHTML = scriptContent;
document.head.appendChild(elt);