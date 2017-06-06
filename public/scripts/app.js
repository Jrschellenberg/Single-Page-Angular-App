angular.module("app", ['ngRoute'])
	.controller('RecipesController', function($scope, dataService, $location){
				
		/*
		Used to change the route Path.
		 */
		$scope.addRecipe = function( ){
			$location.path('/add');
		};
		
		$scope.detectChange = function(){
			//console.log("detected Change");
			console.log($scope.recipes.category);
			$scope.recipes.catetory = false;
			
		};
		
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
	.controller('RecipeDetailController', function($scope, $location){
		console.log("hit the Recipe Detail Controller?");
		/*
		 Used to change the route Path.
		 */
		$scope.returnHome = function(){
			$location.path('/');
		};
		
		
		
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