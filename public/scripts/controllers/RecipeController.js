/**
 * Created by Justin on 6/14/2017.
 */
'use strict';
angular.module('app')
.controller('RecipesController', function($scope, dataService, $location, sharedDataService){
	
	$scope.handleClick = function(path){
		$location.path('/'+path);
	};
	
	
	
	
	$scope.detectChange = function(){
		//If category is null ie. select all, get all recipes again.
		if($scope.currentCategory == null){
			dataService.getRecipes(function(response){
				//console.log(response.data);
				$scope.isRecipes =true;
				$scope.recipes = response.data;
			});
			return;
		}
		//Here we know it is an option selected, so get only recipes in that category
		dataService.getRecipeCategory(function(response){
			//console.log(response.data);
			$scope.recipes = response.data;
			$scope.recipes.length === 0 ? $scope.isRecipes = false : $scope.isRecipes = true;
			//console.log("hit the detect change function");
			//console.log($scope.isRecipes);
		}, $scope.currentCategory.name)
	};
	
	dataService.getCategories(function(response){
		//console.log(response.data);
		$scope.categories = response.data;
	});
	
	
	//Need to refactor this, it is repeating....
	dataService.getRecipes(function(response){
		//console.log(response.data);
		$scope.isRecipes =true;
		$scope.recipes = response.data;
		$scope.recipes.length === 0 ? $scope.isRecipes = false : $scope.isRecipes = true;
	});
	
	$scope.deleteRecipe = function(id, index){
		dataService.deleteRecipe(function(){
			//console.log("The recipe was deleted");
			//This line removes recipe from the view. Only if sucessfully removed from Db!
			$scope.recipes.splice(index, 1);
			$scope.recipes.length === 0 ? $scope.isRecipes = false : $scope.isRecipes = true;
			return;
		},id);
	}	
});