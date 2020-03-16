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
    ul.appendChild(makeNavListItem('main_characters.html', 'Main Characters'));
    ul.appendChild(makeNavListItem('side_characters.html', 'Side Characters'));
    ul.appendChild(makeNavListItem('high_court.html', 'The High Court'));
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
 * @returns {Node}
 */
function makeTextElement(elementType, text, indent) {
    var el = document.createElement(elementType);
    el.style.paddingLeft = (indent * 20) + 'px';
    el.innerText += text;

    return el;
}

/**
 * 
 * @param {Node} container
 * @param {JSON} json
 */
function personInfo(container, json) {
    const add = function (a, b, c) { return container.appendChild(makeTextElement(a, b, c)) };

    if (json.lname) {
        add('h2', `${json.name} (${json.lname.join(", ")})`, 1);
    } else {
        add('h2', json.name, 1);
    }

    if (json.desc) {
        add('p', json.desc, 3);
    }

    if (json.titles) {
        add('h3', 'Titles', 2);
        add('p', json.titles.join(', '), 3);
    }

    if (json.orgs) {
        add('h3', 'Affiliations', 2);
        add('p', json.orgs.join(', '), 3);
    }

    if (json.cultivation) {
        add('h3', 'Cultivation', 2);

        if (json.cultivation.essences) {
            add('h4', 'Essences', 3);
            for (var i in json.cultivation.essences) {
                add('h5', json.cultivation.essences[i].name, 4);
                add('p', json.cultivation.essences[i].desc, 5);
            }
        }
        if (json.cultivation.abilities) {
            add('h4', 'Abilities', 3);
            for (var i in json.cultivation.abilities) {
                add('h5', json.cultivation.abilities[i].name, 4);
                add('p', json.cultivation.abilities[i].desc, 5);
            }
        }
        if (json.cultivation.combinations) {
            add('h4', 'Combinations', 3);
            for (var i in json.cultivation.combinations) {
                add('h5', json.cultivation.combinations[i].name, 4);
                add('p', json.cultivation.combinations[i].desc, 5);
            }
        }
        if (json.cultivation.truth) {
            add('h4', 'Truth: ' + json.cultivation.truth.name, 3);
            add('p', json.cultivation.truth.desc, 4);
        }
    }
}

/**
 * 
 * @param {Node} container
 * @param {JSON} json
 */
function locationInfo(container, json) {
    const add = function (a, b, c) { return container.appendChild(makeTextElement(a, b, c)) };
    add('h2', json.name, 1);

    if (json.desc) {
        add('p', json.desc, 3);
    }

    if (json.factions) {
        add('h3', 'Factions', 2);

        for (var i in json.factions) {
            add('h4', json.factions[i].name, 3);
            add('p', json.factions[i].desc, 4);
        }
    }
}

/**
 * 
 * @param {Node} container
 * @param {JSON} json
 */
function itemInfo(container, json) {
    const add = function (a, b, c) { return container.appendChild(makeTextElement(a, b, c)) };
    add('h2', json.name, 1);
    
    if (json.desc) {
        add('p', json.desc, 3);
    }

    if (json.loc) {
        add('h3', 'Location', 2);
        add('p', json.loc, 3);
    }

    if (json.owner) {
        add('h3', 'Owner', 2);
        add('p', json.owner, 3);
    }
}

function image(container, json) {
    container.appendChild(makeTextElement('h2', json.name, 1));
    var img = document.createElement('img');
    img.src = json.path;
    container.appendChild(img);
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