// ==UserScript==
// @name         Max size warning
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  add `{<number>}` to the column name
// @author       nelsonec87
// @match        https://github.com/orgs/Automattic/projects/148
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Add styles
    const css = `
    .project-column.max-size {
       background-color: #d04437;
    }
    .project-column.max-size .js-column-card-count,
    .project-column.max-size .js-project-column-name,
    .project-column.max-size .js-details-target,
    .project-column.max-size .js-details-container .octicon-kebab-horizontal
    {
       color: white;
    }
    `;

    const cssNode = document.createElement("style");
    cssNode.type = "text/css";
    cssNode.appendChild(document.createTextNode(css));
    var head = document.getElementsByTagName("head")[0];
    head.appendChild(cssNode);

    // Check size
    const check = () =>{
        const columns = [].slice.call(document.getElementsByClassName('project-column'));

        columns.forEach(column => {
            try {
                const name = column.getElementsByClassName('js-project-column-name')[0].innerText;
                const maxExp = (/\{([0-9]+)\}/).exec(name);

                if (!maxExp) return;

                const countEl = column.getElementsByClassName('js-column-card-count')[0];
                const count = parseInt(countEl.innerText);
                const max = parseInt(maxExp[1])

                if (count > max) {
                    column.classList.add('max-size');
                } else {
                    column.classList.remove('max-size');
                }
            } catch (e) {}
        })
    };

    const observer = new MutationObserver(check);
    observer.observe(document, { childList: true, subtree: true });

    check();
})();