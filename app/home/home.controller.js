(function() {
	'use strict';

	var app = angular.module('hashapp');

	app.controller('HomeController', HomeController);


	HomeController.$inject = ['$http', '$scope', '$rootScope', 'UsersService'];

	function HomeController($http, $scope, $rootScope, UsersService) {
		UsersService.getByID()
			.then(function(response) {
				$scope.userData = response.data[0];
			});

		console.log($scope.userData);
	}
})();