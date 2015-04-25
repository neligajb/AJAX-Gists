var originalGistList = [];

function fetchGists() {
	var req = new XMLHttpRequest;
	if (!req) {
		throw 'Unable to get request.';
	}
	var pages = document.getElementsByName('num-of-pages')[0];
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
		}
	};
	req.open('GET', url);
	req.send();
}