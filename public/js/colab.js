  	  var coLab = angular.module('coLab', ['firebase', 'sauce']);
  	  coLab.config(function ($routeProvider) {
  			$routeProvider
    		.when('/:lid',
      		{
        		controller : 'coLabCtrl',
        		templateUrl : '/partials/content.tpl.html'
      		})
    		.otherwise({ redirectTo: '/' });
  		});


  	  function coLabCtrl($scope, angularFire, z_, $routeParams, $location){

  	  	var fB = new Firebase("https://lbd.firebaseIO.com/coLab");
		$scope.host = $location.host();
  	  	$scope.itemTop = 5;
  	  	$scope.boards = {}
  	  	var promise = angularFire(fB, $scope, "boards");
	         promise.then(function() {
	         if($scope.board){
	         	  $scope.loadBoard();
	         }
	      });


        $scope.loadBoard = function loadBoard(){
          return z_._('/sauce',arguments,$scope);
        }
  	$scope.addItem = function addItem(){
  	  return z_._('/sauce',arguments,$scope);
  	}
  	$scope.clearBoard = function clearBoard(){
          return z_._('/sauce',arguments,$scope);
        }
  	$scope.vote = function vote(){
          return z_._('/sauce',arguments,$scope);                
        }

  	var lid = $routeParams.lid;
  	  if(lid){
  	    $scope.board = lid;
  	    $scope.boardName = lid;
  	  }
  }
