angular.module("app", ['ngRoute'])
	.controller('RecipesController', function($scope, dataService){
		
		
		
		dataService.getCategories(function(response){
			//console.log(response.data);
			$scope.categories = response.data;
		});
		
		dataService.getRecipes(function(response){
			console.log(response.data);
			$scope.isRecipes =true;
			$scope.recipes = response.data;
		});
		
		
	})
	.controller('RecipeDetailController', function($scope){
		
		
	})
	.service('dataService', function($http){
		this.getCategories = function(callback){
			$http.get('http://localhost:5000/api/categories')
				.then(callback)
		};
		
		this.getRecipes = function(callback){
			$http.get('http://localhost:5000/api/recipes')
				.then(callback)
		};
		
	});