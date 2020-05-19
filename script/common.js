function createHeaderAndNav() {
    // Build the header
    var header = document.createElement('header');
    var h1 = document.createElement('h1');

    h1.innerText = 'Brothers in Arms';
    header.appendChild(h1);

    // Build the nav
    var nav = document.createElement('nav');
    var ul = document.createElement('ul');

    ul.appendChild(makeNavListItem('index.html', 'Home'));
    ul.appendChild(makeNavListItem('timeline.html', 'Timeline'));
    ul.appendChild(makeNavListItem('main_characters.html', 'Main Characters'));
    ul.appendChild(makeNavListItem('side_characters.html', 'Side Characters'));
    ul.appendChild(makeNavListItem('high_court.html', 'The High Court'));
    ul.appendChild(makeNavListItem('organizations.html', 'Organizations'));
    ul.appendChild(makeNavListItem('regions.html', 'Regions'));
    ul.appendChild(makeNavListItem('locations.html', 'Locations'));
    ul.appendChild(makeNavListItem('races.html', 'Races'));
    ul.appendChild(makeNavListItem('creatures.html', 'Creatures'));
    ul.appendChild(makeNavListItem('items.html', 'Items'));
    ul.appendChild(makeNavListItem('maps.html', 'Maps'));

    nav.appendChild(ul);
    header.appendChild(nav);

    // Add the header and nav to the DOM
    var me = document.currentScript;
    me.parentNode.insertBefore(header, me);
}

function createFooter() {
    var footer = document.createElement('footer');
    footer.innerHTML = '';

    var me = document.currentScript;
    me.parentNode.insertBefore(footer, me);
}

/**
 * 
 * @param {string} link
 * @param {string} title
 * @returns {Node}
 */
function makeNavListItem(link, title) {
    var li = document.createElement('li');
    var a = document.createElement('a');

    a.innerText = title;
    a.setAttribute('href', link);

    li.appendChild(a);

    return li;
}

/**
 * 
 * @param {string} name
 * @param {string} defVal
 * @returns {string}
 */
function getURLParam(name, defVal) {
    name += '=';

    var url = window.location.href;
    var params = url.substring(url.indexOf('?') + 1).split('&');
    for (var p in params) {
        if (params[p].startsWith(name)) {
            return params[p].substring(name.length);
        }
    }

    return defVal;
}

/**
 * 
 * @param {string} elementType
 * @param {string} text
 * @param {number} indent
 * @returns {Promise<Node>}
 */
async function makeTextElement(elementType, text, indent) {
    var el = document.createElement(elementType);
    el.style.paddingLeft = (indent * 20) + 'px';
    
    var reg = /\[link:\s*([^,]+),\s*([^,]+)\]/g
    var m;
    while ((m = reg.exec(text)) !== null) {
        var pat = m[0]
        var file = m[1];
        var id = m[2];

        text = await fetchData(file, data => text.replace(pat, `<a href="./${file}.html?id=${id}">${data[id].name}</a>`));
    }

    el.innerHTML = text;

    return el;
}

/**
 * 
 * @param {string} content
 * @param {Function} call
 */
function initContent(content, call) {
    var main = document.createElement('main');
    var ul = document.createElement('ul');
    var div = document.createElement('div');
    div.setAttribute('id', 'content')

    fetch(`./resources/data/${content}.json`)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            var i = getURLParam('id', Object.keys(data)[0]);
            call(div, data[i]);

            for (var j in data) {
                var node = makeNavListItem(`${content}.html?id=${j}`, data[j].name);

                if (i == j) {
                    node.setAttribute('class', 'selected');
                }

                ul.appendChild(node);
            }
        });

    main.appendChild(ul);
    main.appendChild(div);

    var me = document.currentScript;
    me.parentNode.insertBefore(main, me);
}

async function fetchData(name, func) {
    return fetch(`./resources/data/${name}.json`).then(response => response.json()).then(func);
}