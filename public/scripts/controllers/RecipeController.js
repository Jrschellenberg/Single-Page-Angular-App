/**
 * Created by Justin on 6/14/2017.
 */
'use strict';
angular.module('app')
.controller('RecipesController', function($scope, dataService, $location){
	/*
	 * function used with loading the recipes Page. Initializes $scope.recipes with all available recipes.
	 */
	$scope.onLoad = function(){
		$scope.getRecipes();
	};
	
	/*
	 * Function used to handle clicks and pass to the Router Config.js
	 */
	$scope.handleClick = function(path){
		$location.path('/'+path);
	};
		
	/*
	 * A function used to detect changes in the category selected
	 */
	$scope.detectChange = function(){
		//If category is null ie. select all, get all recipes again.
		if($scope.currentCategory == null){
			$scope.getRecipes();
			return;
		}
		//Here we know it is an option selected, so get only recipes in that category
		$scope.getRecipeCategory();
	};
	
	/*
	function used to delete recipe from the database
	@param: index - the location of where the recipe is in the modal variable in the view
	@param id - the id string of the recipe, used to pass to dataservice deleteRecipe call.
	 */
	$scope.deleteRecipe = function(id, index){
		dataService.deleteRecipe(function(){
			//This line removes recipe from the view. Only if sucessfully removed from Db!
			$scope.recipes.splice(index, 1);
			$scope.recipes.length === 0 ? $scope.isRecipes = false : $scope.isRecipes = true;
			return;
		},id);
	};
	
	/*
	function used to get the recipes
	 */
	$scope.getRecipes = function(){
		dataService.getRecipes(function(response){
			$scope.recipes = response.data;
			//If there is no recipes in this category, set isRecipes to false(to display no recipe msg), otherwise, set it as true
			$scope.recipes.length === 0 ? $scope.isRecipes = false : $scope.isRecipes = true;
		});
	};
	
	/*
	function used to get the currently selected recipe category.
	 */
	$scope.getRecipeCategory = function(){
		dataService.getRecipeCategory(function(response){
			$scope.recipes = response.data;
			//If there is no recipes in this category, set isRecipes to false(to display no recipe msg), otherwise, set it as true
			$scope.recipes.length === 0 ? $scope.isRecipes = false : $scope.isRecipes = true;
		}, $scope.currentCategory.name)
	};
	/*
	Uses services to get the categories available
	 */
	dataService.getCategories(function(response){
		$scope.categories = response.data;
	});
	
});