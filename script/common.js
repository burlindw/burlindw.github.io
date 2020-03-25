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
    
    var reg = /\[link:([^,]+),([^,]+)\]/g
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
 * @param {Node} container
 * @param {JSON} json
 */
async function personInfo(container, json) {
    const add = async function (a, b, c) { return await container.appendChild(await makeTextElement(a, b, c)) };

    if (json.lname) {
        await add('h2', `${json.name} (${json.lname.join(", ")})`, 1);
    } else {
        await add('h2', json.name, 1);
    }

    if (json.desc) {
        await add('p', json.desc, 3);
    }

    if (json.titles) {
        await add('h3', 'Titles', 2);
        await add('p', json.titles.join(', '), 3);
    }

    if (json.orgs) {
        await add('h3', 'Affiliations', 2);
        await add('p', json.orgs.join(', '), 3);
    }

    if (json.cultivation) {
        await add('h3', 'Cultivation', 2);

        if (json.cultivation.essences) {
            await add('h4', 'Essences', 3);
            for (var i in json.cultivation.essences) {
                await add('h5', json.cultivation.essences[i].name, 4);
                await add('p', json.cultivation.essences[i].desc, 5);
            }
        }
        if (json.cultivation.abilities) {
            await add('h4', 'Abilities', 3);
            for (var i in json.cultivation.abilities) {
                await add('h5', json.cultivation.abilities[i].name, 4);
                await add('p', `Gained from ${json.cultivation.abilities[i].from}`, 5);
                await add('p', json.cultivation.abilities[i].desc, 5);
            }
        }
        if (json.cultivation.combinations) {
            await add('h4', 'Combinations', 3);
            for (var i in json.cultivation.combinations) {
                await add('h5', json.cultivation.combinations[i].name, 4);
                await add('p', `Gained from ${json.cultivation.combinations[i].from}`, 5);
                await add('p', json.cultivation.combinations[i].desc, 5);
            }
        }
        if (json.cultivation.truth) {
            await add('h4', 'Truth: ' + json.cultivation.truth.name, 3);
            await add('p', json.cultivation.truth.desc, 4);
        }
    }
}

/**
 * 
 * @param {Node} container
 * @param {JSON} json
 */
async function locationInfo(container, json) {
    const add = async function (a, b, c) { return await container.appendChild(await makeTextElement(a, b, c)) };
    await add('h2', json.name, 1);

    if (json.desc) {
        await add('p', json.desc, 3);
    }

    if (json.factions) {
        await add('h3', 'Factions', 2);

        for (var i in json.factions) {
            await add('h4', json.factions[i].name, 3);
            await add('p', json.factions[i].desc, 4);
        }
    }
}

/**
 * 
 * @param {Node} container
 * @param {JSON} json
 */
async function itemInfo(container, json) {
    const add = async function (a, b, c) { return await container.appendChild(await makeTextElement(a, b, c)) };
    await add('h2', json.name, 1);
    
    if (json.desc) {
        await add('p', json.desc, 3);
    }

    if (json.loc) {
        await add('h3', 'Location', 2);
        await add('p', json.loc, 3);
    }

    if (json.owner) {
        await add('h3', 'Owner', 2);
        await add('p', json.owner, 3);
    }
}

/**
 * 
 * @param {Node} container
 * @param {JSON} json
 */
async function imageInfo(container, json) {
    container.appendChild(await makeTextElement('h2', json.name, 1));
    var img = document.createElement('img');
    img.src = json.path;
    container.appendChild(img);
}

/**
 * 
 * @param {Node} container
 * @param {JSON} json
 */
async function homeInfo(container, json) {
    container.appendChild(await makeTextElement('h2', json.title, 1));
    container.appendChild(await makeTextElement('p', json.desc, 2));
}

/**
 * 
 * @param {Node} container
 * @param {JSON} json
 */
async function orgInfo(container, json) {
    const add = async function (a, b, c) { return container.appendChild(await makeTextElement(a, b, c)) };

    await add('h2', json.name, 1);

    if (json.desc) {
        await add('p', json.desc, 3);
    }

    if (json.leaders) {
        await add('h3', 'Leaders', 2);
        await add('p', json.leaders.join(', '), 3);
    }

    if (json.locations) {
        await add('h3', 'Locations', 2);
        await add('p', json.locations.join(', '), 3);
    }
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