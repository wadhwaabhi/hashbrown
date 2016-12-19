(function() {
	'use strict';

	var app = angular.module('hashapp');

	app.factory('UsersService', UsersService);

	UsersService.$inject = ['$http', '$rootScope'];

	function UsersService($http, $rootScope) {
		var service = {};
		const baseURL = 'http://858a5dae.ngrok.io';
		

		service.baseURL = baseURL;
		service.getByID = getByID;


		function getByID() {
			return $http.get(baseURL + '/api/users?userid=' + $rootScope.currentUser.userid, {
			    headers: {
			        "Authorization": $rootScope.currentUser.token
			    }
			});
		}

		return service;
	}
})();