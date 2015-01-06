(function(){
'use strict';
	var app = angular.module('WalletApp', ['firebase']);
		app.controller('WalletCtrl', ['$scope', '$firebase', function($scope, $firebase) {

			// Check for a username on localStorage
			if(!localStorage.getItem('username')) {
				// if not show modal so people can create one or continue with theirs
				$('#modal').modal();
			}
			
			// Save username function that saves the desired username to local storage and hides the modal
			$scope.SaveUsername = function() {
				localStorage.setItem('username', $scope.Username);
				console.log($scope.Username);
				$('#modal').modal('hide');
			};

			// Sets $scope.Username to whatever is in localStorage
			$scope.Username = localStorage.getItem('username');

			
			// connect to firebase and to users table
			var db = new Firebase('https://wallet-app.firebaseio.com/' + $scope.Username);
			
			// sync it with the server as pass results as an array
			var sync = $firebase(db);

			// get values as array
			$scope.Movements = sync.$asArray();

			// When a new value is added get a snapshot of table
			db.on('value', function(snapshot) {
				$scope.Total = 0;

				//for each child in selected table get the amount 
				//and add them to create a total
				snapshot.forEach(function(childSnapshot) {
					  var key = childSnapshot.val();
					  $scope.Total += key.amount;
				});
			}, function (errorObject) {
			  console.log('The read failed: ' + errorObject.code);
			});

			// if is an addition to the wallet run this function that 
			//adds a row to the table
			$scope.Add = function() {
				$scope.Movements.$add({amount: $scope.amount, timestamp: Date.now()});
				//reset input
				$scope.amount = '';
			};

			// if subtract use this function
			$scope.Subtract = function() {

				// current variable holds the value of the current money in the wallet
				// and adds the negative amount
				var current = $scope.Total + -$scope.amount;

				// if current is equal or bigger than 0 the user 
				// has a positive balance and we can continue
				if( current >= 0) {
					$scope.Movements.$add({amount: -$scope.amount, timestamp: Date.now()});
				} else {
					// the blance is negative so we show an error and add 
					// nopthing to the table
					jQuery('.add-amount').addClass('has-error');
					jQuery( '.add-amount.has-error').keydown(function() {
					 	$(this).removeClass('has-error');
					});
                           
				}
				//reset input
				$scope.amount = '';
			};
		}]);
	app.filter('reverse', function() {
	  return function(items) {
	    return items.slice().reverse();
	  };
	});
})();



