(function() {
	'use strict';

	var app = angular.module('hashapp');
	app.controller('LoginController', LoginController);

	LoginController.$inject = ['$scope', '$rootScope', '$http', '$location', 'UsersService'];

	function LoginController($scope, $rootScope, $http, $location, UsersService) {
		$rootScope.loggedIn = false;

		$scope.login = function() {				
			var url = 'http://858a5dae.ngrok.io/login';


			$http.post(url, $scope.user)
				.success(function(data) {
					$rootScope.loggedIn = true;
					$rootScope.currentUser = {
						userid: data.userid,
						token: data.token
					};

					$location.path('/home');
				});	

		};

	}




})();