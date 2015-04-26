var originalGistList = [];
var favorites = null;

function findByID(gistID) {
	var len = originalGistList.length;
	for (var i = 0; i < len; i++) {
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

function clearDivs() {
	var thisParent = document.getElementById('gists');
	var childDivs = thisParent.getElementsByTagName('div');
	for (i = 0; i < childDivs.length; i++) {
		thisParent.removeChild(childDivs[i]);
	}
}

function fetchGists() {
	//clearDivs();
	var req = new XMLHttpRequest();
	if (!req) {
		throw 'Unable to get request.';
	}
	
	req.onreadystatechange = function() {
		if(this.readyState === 4) {
			originalGistList = JSON.parse(this.responseText);
	};
	req.open('GET', 'https://api.github.com/gists/public?page=1&per_page=100');
	req.send();

	var pages = document.getElementsByName('num-of-pages')[0].value;
	pages = Math.floor(pages);
	if (pages < 0 || (typeof pages != 'number')) {
		pages = 1;
	}
	else if (pages > 5) {
		pages = 5;
	}

	secondRequest();

	var display;
	if (pages === 1) {
		display = 30;
	}
	else if (pages === 2) {
		display = 60;
	}
	else if (pages === 3) {
		display = 90;
	}
	else if (pages === 4) {
		display = 120;
	}
	else if (pages === 5) {
		display = 150;
	}

	for (var i = 0; i < display; i++) {
		gistHTML(document.getElementById('gists'), originalGistList[i], '+');
	}
}

function secondRequest() {
	var secondGistList = [];
	var reqTwo = new XMLHttpRequest();
	if (!reqTwo) {
		throw 'Unable to get request.';
	}

	reqTwo.onreadystatechange = function() {
		if(this.readyState === 4) {
			secondGistList = JSON.parse(this.responseText);
		}
	};
	reqTwo.open('GET', 'https://api.github.com/gists/public?page=2&per_page=100');
	reqTwo.send();

	for (i = 0; i < 50; i++) {
		originalGistList.push(secondGistList[i]);
	}
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
