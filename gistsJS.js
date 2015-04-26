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

function clearGistDivs() {
  var gistDivs = document.getElementById('gists');
  while (gistDivs.firstChild) {
    gistDivs.removeChild(gistDivs.firstChild);
  }
}

function removeFavs() {
  var favLen = favorites.length;
  var len = originalGistList.length;
  for (var i = 0; i < favLen; i++) {
    for (var j = 0; j < len; j++ ) {
      if (favorites[i].id === originalGistList[j].id) {
        originalGistList.splice(j, 1);
        return;
      }
    }
  }
}

function fetchGists() {

  var pages = document.getElementsByName('num-of-pages')[0].value;
  if (pages < 1 || pages > 5) {
    alert("Enter number of pages to display: 1 - 5")
    return;
  }

  clearGistDivs();

  function firstRequest() {
  	var req = new XMLHttpRequest();
  	if (!req) {
  		throw 'Unable to get request.';
  	}

    var display = pages * 30;

  	var url = 'https://api.github.com/gists/public?page=1&per_page=' + display;
  	req.onreadystatechange = function() {
  		if(this.readyState === 4) {
  			originalGistList = JSON.parse(this.responseText);
        var len = originalGistList.length;
        var favLen = favorites.length;
        for (var i = 0; i < len; i++) {
          for (var j = 0; j < favLen; j++ ) {
            if (originalGistList[i].id === favorites[j].id) {
              console.log('match');
            }
            else {
              gistHTML(document.getElementById('gists'), originalGistList[i], '+');
            }
          }
          if (favLen === 0) {
            gistHTML(document.getElementById('gists'), originalGistList[i], '+');
          }
        }
      }
  	};
  	req.open('GET', url);
  	req.send();
  }

  // function secondRequest() {
  //   var req = new XMLHttpRequest();
  //   if (!req) {
  //     throw 'Unable to get request.';
  //   }
  //   var url = 'https://api.github.com/gists/public?page=2&per_page=100';
  //   req.onreadystatechange = function() {
  //     if(this.readyState === 4) {
  //       secondGistList = JSON.parse(this.responseText);
  //       for (var i = 0; i < 50; i++) {
  //         gistHTML(document.getElementById('gists'), originalGistList[i], '+');
  //       }
  //     }
  //   };
  //   req.open('GET', url);
  //   req.send();
  // }

  firstRequest();
  //secondRequest();
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
