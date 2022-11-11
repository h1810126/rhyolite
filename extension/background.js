importScripts("./utils/util.js");

// Shortcut Command Listener
chrome.commands.onCommand.addListener(function (command) {
    switch (command) {
        case 'Jump to Home':
            jumpToHome();
            break;
        default:
            console.log(`Command ${command} not found`);
    }
});


// when a new window is created, create tab to go with it
chrome.windows.onCreated.addListener((window) => {
    createPinnedTab(window.id);
});


// Create tab for all windows
chrome.windows.getAll((windows) => {
    for (window of windows) {

        // Delete existing (but dead) extension tabs
        chrome.tabs.query({windowId: window.id}, (tabs) => {
            for (const tab of tabs) {
                if (!tab.url.includes(chrome.runtime.id)) continue;

                // Unpin and remove the dead tab
                chrome.tabs.update(tab.id, {pinned: false}, (tab) => chrome.tabs.remove(tab.id));
            }
        })

        // Create the tab to go with it
        createPinnedTab(window.id);
    }
});

chrome.tabs.onAttached.addListener(a, info => createPinnedTab(info.newWindowId));
chrome.tabs.onAttached.addListener(console.log);