/*
* author: R. Vega
* date: May 5-9. 2018
* purpose: Takes the user submitted input and calls the swapi
*          API which will search for the inputted string. If a match
*          is found, the character info for the input is displayed on the
*          web page.
* notes:
*/
function characterFind(charName) {

	if(charName.match(/[a-z]/i)) {
		
		clearInfo();//clear the character output info each time a new character string is submitted
	
		document.getElementById("errorAlert").classList.add("errorDiv"); //if the error message is visible, hide it
		
		var url = 'https://swapi.co/api/people/?search=' + charName;
		
		var req = new XMLHttpRequest();
		req.open('GET', url, true);
		req.setRequestHeader('Accept', 'application/json');
		req.send();
		req.onreadystatechange = getResponse;
		
		function getResponse(e) {
			if( (req.readyState == 4) && (req.status == 200) ) {
				var response = JSON.parse(req.responseText);
				
				if(response.results.length > 0) {
					document.getElementById("c_name").innerHTML = response.results[0].name;
					document.getElementById("c_gender").innerHTML += response.results[0].gender;
					document.getElementById("c_height").innerHTML += response.results[0].height;
					document.getElementById("c_mass").innerHTML += response.results[0].mass;
					document.getElementById("c_hair").innerHTML += response.results[0].hair_color;
					document.getElementById("c_skin").innerHTML += response.results[0].skin_color;
					document.getElementById("c_eye").innerHTML += response.results[0].eye_color;
					
					findFilms(response.results[0].films);
					findHomeWorld(response.results[0].homeworld);
				} else {
					document.getElementById("errorAlert").classList.remove("errorDiv");
					document.getElementById("warningMessage").innerHTML = 'Character was not found. Please check the spelling of the input';
				}
			}
			
			document.getElementById("character_st").value = '';//clear the input each time
		}
	
	} else {
		document.getElementById("errorAlert").classList.remove("errorDiv");
		document.getElementById("warningMessage").innerHTML = 'Input cannot be empty';
	}
}

/*
* author: R. Vega
* date: May 5-9. 2018
* purpose: Find all the films the character has appeared in, display just 
*          the name and release date. Perform only one API call for all films 
*          instead one by one for each film listed. Map the array based on url
*          to make searching easier when pulling the required data from the 
*          films array. 
* notes:
*/
function findFilms(films) {
	var mp = new Map();
	var req = new XMLHttpRequest();
	req.open('GET', 'https://swapi.co/api/films/', true);
	req.setRequestHeader('Accept', 'application/json');
	req.send();
	req.onreadystatechange = getHomeResponse;
	
	function getHomeResponse(e) {
		if( (req.readyState == 4) && (req.status == 200) ) {
			var response = JSON.parse(req.responseText);
		
			for(var i = 0; i < response.results.length; i++) {
				mp.set(response.results[i].url, response.results[i]);
			}
			
			films.sort();
			
			for(var k = 0; k < films.length; k++) {
				var film = mp.get(films[k]);
				var tbl = document.getElementById("filmListings").getElementsByTagName("tbody")[0];
				var row = tbl.insertRow(tbl.rows.length);
				var fname = row.insertCell(0);
				var release = row.insertCell(1);
				
				var rel = new Date(film.release_date);
				
				fname.innerHTML = film.title;
				release.innerHTML = rel.getMonth() + '/' + rel.getDay() + '/' + rel.getFullYear(); 
			}
		}
	}
}

/*
* author: R. Vega
* date: May 5-9. 2018
* purpose: The home world is listed separately from the character info and requires
*          a single API call to get the worlds name.
* notes:
*/
function findHomeWorld(home) {

	var req = new XMLHttpRequest();
	req.open('GET', home, true);
	req.setRequestHeader('Accept', 'application/json');
	req.send();
	req.onreadystatechange = getHomeResponse;
	
	function getHomeResponse(e) {
		if( (req.readyState == 4) && (req.status == 200) ) {
			var response = JSON.parse(req.responseText);
			document.getElementById("c_homeworld").innerHTML = 'Home World: ' + response.name;
		}
	}
}

/*
* author: R. Vega
* date: May 5-9. 2018
* purpose: Clears the page output when a new character is entered.
* notes:
*/
function clearInfo() {
	document.getElementById("c_name").innerHTML = '';
	document.getElementById("c_homeworld").innerHTML = '';
	document.getElementById("c_gender").innerHTML = 'Gender: ';
	document.getElementById("c_height").innerHTML = 'Height (cm):';
	document.getElementById("c_mass").innerHTML = 'Mass (kg): ';
	document.getElementById("c_hair").innerHTML = 'Hair Color: ';
	document.getElementById("c_skin").innerHTML = 'Skin Color: ';
	document.getElementById("c_eye").innerHTML = 'Eye Color: ';
	
	var fresh_tbody = document.createElement("tbody");
	var old_tbody = document.getElementById("filmListings").getElementsByTagName("tbody")[0];
	old_tbody.parentNode.replaceChild(fresh_tbody, old_tbody);
}