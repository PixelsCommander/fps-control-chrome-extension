let dropFrames = 0;

function alertV(s) {
    var elt = document.createElement("script");
    elt.innerHTML = `alert('${s}')`;
    document.head.appendChild(elt);
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.type) {
        case 'getPopupState':
            sendResponse({
                type: 'setPopupState',
                value: {
                    dropFrames: dropFrames,
                }
            });

            chrome.runtime.sendMessage({
                type: 'setPopupState',
                value: {
                    dropFrames: dropFrames,
                }
            });

            break;
        case 'dropFrames':
            processDropFrames(message.value);
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
        elt.innerHTML = `window.skipProcent = ${percentage}; window.enableDropFPS();`;
        document.head.appendChild(elt);
    }
}

var scriptContent = `
window.skipProcent = ${dropFrames};
var rafs = 0;

var raf = window.requestAnimationFrame;

var mockedRaf = (callback) => {
    var skip = Math.random() < window.skipProcent;

    if (skip) {
        skippingRaf(callback);
    } else {
        raf(callback);
    }

    return rafs++;
}

function skippingRaf(func) {
    raf(() => {
        window.requestAnimationFrame(func);
    })
}

window.enableDropFPS = function enableDropFPS() {
    window.requestAnimationFrame = mockedRaf;
}

window.disableDropFPS = function disableDropFPS() {
    window.requestAnimationFrame = raf;
}
`;

var elt = document.createElement("script");
elt.innerHTML = scriptContent;
document.head.appendChild(elt);