module.exports = {
	globDirectory: 'build/',
	globPatterns: [
		'**/*.{json,png,svg,jpg,html,css,js,txt,gif,ttf,eot,woff}'
	],
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	],
	swDest: 'build/service-worker.js'
};