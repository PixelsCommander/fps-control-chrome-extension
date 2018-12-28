import '../css/popup.css';

window.addEventListener('DOMContentLoaded', function () {
    var dropFramesSelect = document.getElementById('dropframes');

    chrome.runtime.onMessage.addListener((message) => {
        switch (message.type) {
            case "dropFrames":
                dropFramesSelect.value=message.value.toString();
                break;
        }
    });

    function sendDropFrames(e) {
        var dropPecentage = parseFloat(e.target.value);

        var message = {
            type:"dropFrames",
            value: dropPecentage,
        };

        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, message);
        });
    };

    dropFramesSelect.addEventListener('change', sendDropFrames);
});

