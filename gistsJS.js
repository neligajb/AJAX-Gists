var originalGistList = [];
var favorites = null;

function findByID(gistID) {
	len = originalGistList.length;
	for (i = 0; i < len; i++) {
		if (originalGistList[i].id === gistID) {
			return originalGistList[i];
		}
	}
	throw 'Gist not found.';
}

function gistHTML(parent_div, gist, icon) {
	var gistDiv = document.createElement('div');
	gistDiv.setAttribute('id', 'gist-div');

	var fbutton = document.createElement('button');
	fbutton.innerHTML = icon;
	fbutton.setAttribute('id', gist.id);
	fbutton.onclick = function() {
		var gistID = this.getAttribute('id');
		if (icon === '+') {
			var selectedGist = findByID(gistID);
			addFavoriteGist(selectedGist);
		}
		else if (icon === '-') {
			removeFavoriteGist(gistID);
		}
	}

	var desc = document.createElement('p');
	var link = document.createElement('a');

	link.setAttribute('href', gist.url);
	link.setAttribute('title', 'gist link');
	link.innerHTML = gist.url;

	var br = document.createElement('br');

	desc.innerText = gist.description;

	if (desc.innerText === '' || desc.innerText === null) {
		desc.innerText = 'No description.'
	}

	gistDiv.appendChild(fbutton);
	gistDiv.appendChild(desc);
	gistDiv.appendChild(br);
	gistDiv.appendChild(link);

	parent_div.appendChild(gistDiv);
}

function addFavoriteGist(favGist) {
	favorites.push(favGist);
	localStorage.setItem('userFavorites', JSON.stringify(favorites));
	gistHTML(document.getElementById('fav-gists'), favGist, '-');
}

function removeFavoriteGist(gistID) {
	for (var i = 0; i < favorites.length; i++) {
		if (favorites[i].id === gistID) {
			favorites.splice(i, 1);
		}
	}
	var thisParent = document.getElementById('fav-gists')
	var idStr = gistID;
	var child = document.getElementById(idStr).parentNode;
	thisParent.removeChild(child);

	localStorage.removeItem('userFavorites');
	localStorage.setItem('userFavorites', JSON.stringify(favorites));
}

function fetchGists() {
	var req = new XMLHttpRequest;
	if (!req) {
		throw 'Unable to get request.';
	}
	var pages = document.getElementsByName('num-of-pages')[0].value;
	pages = Math.floor(pages);
	if (pages < 0 || (typeof pages != 'number')) {
		pages = 1;
	}
	else if (pages > 5) {
		pages = 5;
	}
	var url = 'https://api.github.com/gists/public?page=' + pages + '&per_page=30';
	req.onreadystatechange = function() {
		if(this.readyState === 4) {
			originalGistList = JSON.parse(this.responseText);
			var len = originalGistList.length;
			for (var i = 0; i < len; i++) {
				gistHTML(document.getElementById('gists'), originalGistList[i], '+');
			}
		}
	};
	req.open('GET', url);
	req.send();
}

window.onload = function() {
	var favsStr = localStorage.getItem('userFavorites');
	if(favsStr === null) {
		favorites = [];
		localStorage.setItem('userFavorites', JSON.stringify(favorites));
	}
	else {
		favorites = JSON.parse(favsStr);
		len = favorites.length;
		for (i = 0; i < len; i++) {
			gistHTML(document.getElementById('fav-gists'), favorites[i], '-');
		}
	}
}
