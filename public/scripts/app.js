angular.module("app", ['ngRoute'])
	.controller('RecipesController', function($scope, dataService){
		dataService.getCategories(function(response){
			console.log(response.data);
			$scope.categories = response.data;

		});
		
		
	})
	.controller('RecipeDetailController', function($scope){
		
		
	})
	.service('dataService', function($http){
		this.getCategories = function(callback){
			$http.get('http://localhost:5000/api/categories')
				.then(callback)
		};
		
	});