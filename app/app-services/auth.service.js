(function() {
	'use strict';

	var app = angular.module('hashapp');

	app.factory('AuthService', AuthService);

	AuthService.$inject = ['$http', '$rootScope', '$cookies', 'UsersService'];

	function AuthService($http, $rootScope, $cookies, UsersService) {
		var auth = {};

		auth.login = login;
		// auth.setCredentials = setCredentials;

		function login(user) {
			// $http.post(UsersService.baseURL, user)
			// 			.success(function(data) {
			// 				$rootScope.loggedIn = true;
			// 				$rootScope.currentUser = {
			// 					userid: data.userid,
			// 					token: data.token
			// 				};

			// 				$location.path('/home');
			// 			});
		}

		return auth;
	}
})();