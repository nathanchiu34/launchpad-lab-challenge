# LaunchPad Labs Challenge

LaunchPad Lab Challenge by Nathan Chiu

A simple table of different popular javascript client side libraries and metrics on 3 categories: watchers, open issues, and forks.
These 3 categories, in my opinion, show different strengths of these libraries.
A couple of objectives include the table updating these statistics without a page refresh as well as being able to see leading metrics when you want to choose a client side library.

Main Thought Process:
- Create Table -
Create a simple display of these different frameworks and metrics.
- Create a way to choose a framework -
Create simple criterion and use metrics to pick most suited framework. (Metrics are interpretable of course)
- Create a way to pick a 'winner'-
Aggregate the rankings of the three metrics, and pick the highest overall ranked js lib as the 'winner.'
- Updating done through ```setInterval``` function
Simple (perhaps inefficient) polling is done using javascript's ```setInterval``` function and querying the Github API every 5 seconds.

Technologies used:
- Javascript
- Bootstrap

Notes:
Things that out of scope for this challenge.
- Testing
- Visual Design
- Sortable tables