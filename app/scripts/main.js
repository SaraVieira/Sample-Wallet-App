(function(){
'use strict';
	angular.module('WalletApp', ['firebase'])
		.controller('WalletCtrl', ['$scope', '$firebase', function($scope, $firebase) {

			if(!localStorage.getItem('username')) {
				$('#modal').modal();
			}
			
			$scope.SaveUsername = function() {
				localStorage.setItem('username', $scope.Username);
				console.log($scope.Username);
				$('#modal').modal('hide');
			};

			$scope.Username = localStorage.getItem('username');

			
			// connect to firebase
			var db = new Firebase('https://wallet-app.firebaseio.com/' + $scope.Username);
			// sync it with the server as pass results as an array
			var sync = $firebase(db);
			$scope.Movements = sync.$asArray();

			db.on("value", function(snapshot) {
				$scope.Total = 0;
				var AllAmounts = snapshot.val();
				snapshot.forEach(function(childSnapshot) {
					  var key = childSnapshot.val();
					  $scope.Total += key.amount;
				});
			}, function (errorObject) {
			  console.log("The read failed: " + errorObject.code);
			});

			// if is an addition to the wallet run this function that adds a row to the table
			$scope.Add = function() {
				$scope.Movements.$add({amount: $scope.amount, timestamp: Date.now()});
				$scope.amount = "";
			};

			// if subtract use this function
			$scope.Subtract = function() {
				var current = $scope.Total + -$scope.amount;
				$scope.negative = false;
				if( current >= 0) {
					$scope.Movements.$add({amount: -$scope.amount, timestamp: Date.now()});
				} else {
					jQuery('.add-amount').addClass('has-error');
					jQuery( '.add-amount.has-error').keydown(function() {
					 	$(this).removeClass('has-error');
					});
                           
				}
				$scope.amount = "";
			};
		}]);

})();



