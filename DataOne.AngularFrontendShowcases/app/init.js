(function () {
    'use strict';

    ExecuteOrDelayUntilScriptLoaded(initializePage, "sp.js");

    function initializePage() {
        var meta = document.createElement('meta');
        meta.name = 'viewport';
        meta.content = 'width=device-width, initial-scale=1.0, target-densitydpi=device-dpi';
        document.head.appendChild(meta);
    }
})();