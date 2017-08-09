/**
 * Index.html uses this script to generate content.
 **/

function getLogoImg(framework) {
	const imgMap = {
		React: '<img src="static/img/react-logo.png" class="img-rounded" alt="React Logo" width="120" height="100">',	
		Vue: '<img src="static/img/vue-logo.png" class="img-rounded" alt="Vue Logo" width="120" height="100">',	
		Angular: '<img src="static/img/angular-logo.png" class="img-rounded" alt="Angular Logo" width="120" height="100">',	
		Ember: '<img src="static/img/ember-logo.png" class="img-rounded" alt="Ember Logo" width="120" height="100"',
	};
	return imgMap[framework];
}

function getDataHTML(url, elementId) {
	return fetch(url).then((resp) => {
		return resp.json();
	}).then((data) => {
		elementTitle = elementId.split('-')[0]
		document.getElementById(elementId).innerHTML = '<th scope="row">' + elementTitle + '.js' + getLogoImg(elementTitle) + '</th>';
		document.getElementById(elementId).innerHTML += '<td>' + data.watchers.toLocaleString() + '</td>';
		document.getElementById(elementId).innerHTML += '<td>' + data.open_issues.toLocaleString() + '</td>';
		document.getElementById(elementId).innerHTML += '<td>' + data.forks.toLocaleString() + '</td>';
		return {
			data: {
				name: elementTitle,
				watchers: data.watchers,
				open_issues_percentage: data.open_issues / data.watchers,
				forks: data.forks,
			}
		}
	});
};

function getNameOfMax(objects, criteria, findLeast) {
	let max = 0;
	let name = '';
	for (let object of objects) {
		if (object['data'][criteria] > max) {
			name = object['data']['name']
			max = object['data'][criteria]
		}
	}
	return name
}

function getNameOfMin(objects, criteria, findLeast) {
	let min = Number.MAX_SAFE_INTEGER;
	let name = '';
	for (let object of objects) {
		if (object['data'][criteria] < min) {
			name = object['data']['name']
			min = object['data'][criteria]
		}
	}
	return name
}

function setMainPage() {
	var now = new Date();
	document.getElementById('date').innerHTML = 'Last Updated: ' + now;

	let promises = [];
	promises.push(getDataHTML('https://api.github.com/repos/facebook/react', 'React-data'));
	promises.push(getDataHTML('https://api.github.com/repos/angular/angular.js', 'Angular-data'));
	promises.push(getDataHTML('https://api.github.com/repos/emberjs/ember.js', 'Ember-data'));
	promises.push(getDataHTML('https://api.github.com/repos/vuejs/vue', 'Vue-data'));
	Promise.all(promises)
		.then((data) => {
			// Get most watched.
			let mostWatchedName = getNameOfMax(data, 'watchers');
			let highStabilityName = getNameOfMin(data, 'open_issues_percentage');
			let mostActiveName = getNameOfMax(data, 'forks');
			document.getElementById('mostWatched').innerHTML = '<b>Most Watched, High Visibility: </b>' +mostWatchedName + getLogoImg(mostWatchedName);
			document.getElementById('highStability').innerHTML = '<b>Least Issues, High Stability: </b>' +highStabilityName + getLogoImg(highStabilityName);	
			document.getElementById('mostActive').innerHTML = '<b>Most Active Development, High Potential: </b>' +mostActiveName + getLogoImg(mostActiveName);	
		})
		.catch((err) => {
			console.log(err);
			document.getElementById('error').innerHTML = err;
		});
}

setMainPage();
setInterval(setMainPage, 5000);