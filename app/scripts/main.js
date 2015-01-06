(function(){
'use strict';
	angular.module('WalletApp', ['firebase'])
		.controller('WalletCtrl', ['$scope', '$firebase', function($scope, $firebase) {
			
			// connect to firebase
			var db = new Firebase('https://wallet-app.firebaseio.com/');

			// sync it with the server as pass results as an array
			var sync = $firebase(db);
			$scope.Movements = sync.$asArray();

			// if is an addition to the wallet run this function that adds a row to the table
			$scope.Add = function() {
				$scope.Movements.$add({amount: $scope.amount, timestamp: Date.now()});
			};

			// if subtract use this function
			$scope.Subtract = function() {
				$scope.Movements.$add({amount: -$scope.amount, timestamp: Date.now()});
			};

		}]);

})();



