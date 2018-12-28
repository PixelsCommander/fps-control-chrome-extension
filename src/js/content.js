chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.type) {
        case 'dropFrames':
            processDropFrames(message.value);
            sendResponse(message);
            break;
    }
});

function processDropFrames(percentage) {
    if (!percentage) {
        var elt = document.createElement("script");
        elt.innerHTML = `window.disableDropFPS(); alert(dropFrames page);`;
        document.head.appendChild(elt);
    } else {
        var elt = document.createElement("script");
        elt.innerHTML = `window.skipProcent = ${percentage}; window.enableDropFPS();`;
        document.head.appendChild(elt);
    }
}

var scriptContent = `
window.skipProcent = 0.9;
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