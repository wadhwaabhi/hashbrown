(function() {
	'use strict';

	var app = angular.module('hashapp', [
		'ngCookies',
		'ngRoute'
	]);

	app.config(['$routeProvider', function($routeProvider) {
		$routeProvider
			.when('/home', {
				templateUrl: 'home/home.html',
				controller: 'HomeController'
			})
			.when('/', {
				templateUrl: 'login/login.html',
				controller: 'LoginController'
			})
			.otherwise({
				redirectTo: 'index.html'
			});
		}
	]);

	// app.run(run);


	// run.$inject = ['$rootScope', '$location', '$cookies', '$http'];
	// function run($rootScope, $location, $cookies, $http) {

	// }

})();