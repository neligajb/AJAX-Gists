var originalGistList = [];
var secondGistList = [];
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
  gistDiv.setAttribute('class', 'gist-div');

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
  };

  var desc = document.createElement('p');
  var link = document.createElement('a');

  link.setAttribute('href', gist.url);
  link.setAttribute('title', 'gist link');
  link.setAttribute('target', '_blank');
  link.innerHTML = gist.url;

  var br = document.createElement('br');

  desc.innerText = gist.description;

  if (desc.innerText === '' || desc.innerText === null) {
    desc.innerText = 'No description.';
  }

  gistDiv.appendChild(fbutton);
  gistDiv.appendChild(desc);
  gistDiv.appendChild(br);
  gistDiv.appendChild(link);

  parent_div.appendChild(gistDiv);
}

function addFavoriteGist(favGist) {
  var thisParent = document.getElementById('gists');
  var idStr = favGist.id;
  var child = document.getElementById(idStr).parentNode;
  thisParent.removeChild(child);

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
  var thisParent = document.getElementById('fav-gists');
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


function fetchGists() {
  originalGistList.length = 0;
  secondGistList.length = 0;


  var pages = document.getElementsByName('num-of-pages')[0].value;
  if (pages < 1 || pages > 5) {
    alert('Enter number of pages to display: 1 - 5');
    return;
  }

  clearGistDivs();

  function firstRequest() {
    var req = new XMLHttpRequest();
    if (!req) {
      throw 'Unable to get request.';
    }

    var display = pages * 30;
    var firstRequestDone = false;

    var url = 'https://api.github.com/gists/public?page=1&per_page=' + display;
    req.onreadystatechange = function() {
      if (this.readyState === 4) {
        originalGistList = JSON.parse(this.responseText);

      }
    };
    req.open('GET', url);
    req.send();
  }

  function secondRequest() {
    var req2 = new XMLHttpRequest();
    if (!req2) {
      throw 'Unable to get request.';
    }
    var url = 'https://api.github.com/gists/public?page=2&per_page=100';
    req2.onreadystatechange = function() {
      if (this.readyState === 4) {
        secondGistList = JSON.parse(this.responseText);

        processReturnData();
      }
    };
    req2.open('GET', url);
    req2.send();
  }

  firstRequest();
  secondRequest();
}

function getLanguages() {
  var languages = [];
  if (document.getElementsByName('javascript')[0].checked) {
    languages.push('.js');
  }
  if (document.getElementsByName('sql')[0].checked) {
    languages.push('.sql');
  }
  if (document.getElementsByName('json')[0].checked) {
    languages.push('.json');
  }
  if (document.getElementsByName('python')[0].checked) {
    languages.push('.py');
  }

  return languages;
}

function processReturnData() {
  var secondLen  = secondGistList.length;
  for (var i = 0; i < secondLen; i++) {
    originalGistList.push(secondGistList[i]);
  }

  var languages = getLanguages();

  var len = originalGistList.length;
  var favLen = favorites.length;

  for (var i = 0; i < len; i++) {
    var match = false;
    for (var j = 0; j < favLen; j++) {
      if (favorites[j].id === originalGistList[i].id) {
        console.log('match');
        match = true;
      }
    }
    if (languages.length === 0) {
      if (!match) {
        gistHTML(document.getElementById('gists'), originalGistList[i], '+');
      }
    }
    else {
      for (var i = 0; i < len; i++) {
        for (var property in originalGistList[i].files) {
          for (var j = 0; j < languages.length; j++) {
            if (property.includes(languages[j])) {
              if (!match) {
                gistHTML(document.getElementById('gists'), originalGistList[i], '+');
              }
            }
          }
        }
      }
    }
  }
}



window.onload = function() {
  var favsStr = localStorage.getItem('userFavorites');
  if (favsStr === null) {
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
};
