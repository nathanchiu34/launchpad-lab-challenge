/**
 * Index.html uses this script to generate content.
 **/
function getLogoImg(framework, height, width) {
	height = height || 90;
	width = width || 110;
	let imgElement = document.createElement("img");
	const imgMap = {
		React: "static/img/react-logo.png",	
		Vue: "static/img/vue-logo.png",	
		Angular: "static/img/angular-logo.png",	
		Ember: "static/img/ember-logo.png",
	};
	imgElement.setAttribute('src', imgMap[framework]);
	imgElement.setAttribute('width', width);
	imgElement.setAttribute('height', height);
	imgElement.setAttribute('alt', 'JS-Logo');

	return imgElement;
}

function getDataHTML(url, elementId) {
	return fetch(url).then((resp) => {
		return resp.json();
	}).then((data) => {
		elementTitle = elementId.split('-')[0]
		document.getElementById(elementId).innerHTML = '<th scope="row">' + elementTitle + '.js' + '</th>';
		document.getElementById(elementId).appendChild(getLogoImg(elementTitle));
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
			name = object['data']['name'];
			min = object['data'][criteria];
		}
	}
	return name;
}

/**
 * Pick a framework after aggregating metrics
 * We average the ranking of each js library and returning the top.
 */
function pickWinner(objects) {
	// Make copies of Arrays.
	let watcherRankings = objects.slice();
	let stabilityRankings = objects.slice();
	let activeRankings = objects.slice();

	// Sort the arrays based on metrics.
	watcherRankings.sort((a, b) => a.data.watchers - b.data.watchers );
	stabilityRankings.sort((a, b) => b.data.open_issues_percentage - a.data.open_issues_percentage);
	activeRankings.sort((a, b) => a.data.forks - b.data.forks);
	
	watcherRankings = watcherRankings.map((js) => js.data.name);
	stabilityRankings = stabilityRankings.map((js) => js.data.name);
	activeRankings = activeRankings.map((js) => js.data.name);

	let rankings = [watcherRankings, stabilityRankings, activeRankings];
	let reactRanking = {name: 'React', rank: rankingHelper('React', rankings)};
	let angularRanking = {name: 'Angular', rank: rankingHelper('Angular', rankings)};
	let emberRanking = {name: 'Ember', rank: rankingHelper('Ember', rankings)};
	let vueRanking = {name: 'Vue', rank: rankingHelper('Vue', rankings)};
	let aggregateRankings = [reactRanking, angularRanking, emberRanking, vueRanking];

	aggregateRankings.sort((a, b) => b.rank - a.rank);
	return aggregateRankings;
}

function rankingHelper(name, arrays) {
	let aggregateRanking = 0;
	for (let array of arrays) {
		aggregateRanking += array.indexOf(name);
	} 
	return aggregateRanking / arrays.length;
}


function setMainPage() {
	let now = new Date();
	document.getElementById('date').innerHTML = 'Last Updated: ' + now.toLocaleString();

	let promises = [];
	promises.push(getDataHTML('https://api.github.com/repos/facebook/react', 'React-data'));
	promises.push(getDataHTML('https://api.github.com/repos/angular/angular.js', 'Angular-data'));
	promises.push(getDataHTML('https://api.github.com/repos/emberjs/ember.js', 'Ember-data'));
	promises.push(getDataHTML('https://api.github.com/repos/vuejs/vue', 'Vue-data'));
	Promise.all(promises)
		.then((data) => {
			let mostWatchedName = getNameOfMax(data, 'watchers');
			let highStabilityName = getNameOfMin(data, 'open_issues_percentage');
			let mostActiveName = getNameOfMax(data, 'forks');
			document.getElementById('mostWatched').innerHTML = '<b>Most Watched, High Visibility: </b>' + mostWatchedName;
			document.getElementById('mostWatched').appendChild(getLogoImg(mostWatchedName, 50, 60));
			document.getElementById('highStability').innerHTML = '<b>Least Issue Percentage (Issue/Follower), High Stability: </b>' + highStabilityName;
			document.getElementById('highStability').appendChild(getLogoImg(highStabilityName, 50, 60));	
			document.getElementById('mostActive').innerHTML = '<b>Most Active Development, High Potential: </b>' + mostActiveName; 
			document.getElementById('mostActive').appendChild(getLogoImg(mostActiveName, 50, 60));	
			let rankings = pickWinner(data);
			document.getElementById('winner').innerHTML = '<b><span style="background-color: #FFFF00">Overall Winner:</span></b> ' + rankings[0].name;
			document.getElementById('winner').appendChild(getLogoImg(rankings[0].name, 50, 60));
			document.getElementById('runnerUp').innerHTML = '<b>Runner Up:</b> ' + rankings[1].name;
			document.getElementById('runnerUp').appendChild(getLogoImg(rankings[1].name, 50, 60));
		})
		.catch((err) => {
			console.log(err);
			document.getElementById('error').innerHTML = err;
		});
}

setMainPage();
setInterval(setMainPage, 5000);