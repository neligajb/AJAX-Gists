var originalGistList = [];

function gistHTML(parent_div, gist) {
	var gistDiv = document.createElement('div');
	gistDiv.setAttribute('id', 'gist-div');

	var fbutton = document.createElement('button');
	fbutton.innerHTML = '+';
	fbutton.setAttribute("gistID", gist.id);
	fbutton.onclick = function() {
		var gistID = this.getAttribute("gistID");
		var toBeFavoredGist = findByID(gistID);
		addFavoriteGist(toBeFavoredGist);
	}

	var desc = document.createElement('p');
	var link = document.createElement('a');

	link.setAttribute('href', gist.url);
	link.setAttribute('title', 'gist link');
	link.innerHTML = gist.url;

	var br = document.createElement('br');

	desc.innerText = gist.description;

	gistDiv.appendChild(fbutton);
	gistDiv.appendChild(desc);
	gistDiv.appendChild(br);
	gistDiv.appendChild(link);

	parent_div.appendChild(gistDiv);
}

function addFavoriteGist(favGist) {

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
				gistHTML(document.getElementById('gists'), originalGistList[i]);
			}
		}
	};
	req.open('GET', url);
	req.send();
}

