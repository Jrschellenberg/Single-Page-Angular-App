/**
 * Created by Justin on 6/14/2017.
 */
'use strict';

angular.module('app')
.controller('RecipeDetailController', function($scope, $location, dataService, sharedDataService, $routeParams){
	//console.log("hit the Recipe Detail Controller?");
	
	//Function used with ng-click to change Route Path to Index.
	$scope.returnHome = function(){
		sharedDataService.setReadOnly(false);
		$location.path('/');
	};
	
	
	/*
	Function used when the page loads to determine how to render the page given certain parameters
	 */
	$scope.onLoad = function(){
		//console.log($routeParams.id);
		//console.log($routeParams.edit);

		
		/*
		 REaaaaaaaaaaally need to refactor this code. it's messy >.>
		 */
		
		//Do this if it is not in edit or add mode
		if($routeParams.view === "view-recipe"){
			sharedDataService.setReadOnly(true);
		}
		else{
			sharedDataService.setReadOnly(false);
		}
		$scope.isReadOnly = sharedDataService.getReadOnly();

		
		//do this if it is edit mode or viewing recipe mode.
		if($routeParams.view === "edit-recipe" || $routeParams.view ==="view-recipe"){
			var param = $location.path();
			var recipeId = param.substring(param.lastIndexOf('/')+1, param.length);
			
			dataService.getRecipe(function(response){
				$scope.isEdit = true;
				$scope.recipeEditing = response.data;
				
				$scope.initializeModelValues($scope.recipeEditing);
				
				
			},recipeId);
			
		}
		//do this when add mode.
		else if($routeParams.view ==="add-recipe"){
			$scope.isEdit = false;
			console.log("we are in the add");
			var recipe =
			{
				name: '',
				description: '',
				category: '',
				prepTime: null,
				cookTime: null,
				ingredients: [
					{
						foodItem: '',
						condition: '',
						amount: ''
					}
				],
				steps: [
					{
						description: ''
					}
				]
			};
			$scope.recipeEditing = recipe;
			//Need to instantiate a full array here!!!!! of the recipe object.....
			console.log($scope.recipeEditing);
		}
		else{
			console.log("We hit an ERROR!!!");
			
			//handle error here.
		}
	};
	
	
	$scope.initializeModelValues = function(currentRecipe){
		$scope.recipeName = currentRecipe.name;
		$scope.recipeDescription = currentRecipe.description;
		$scope.categorySelected = currentRecipe.category;
		console.log($scope.categorySelected);
		$scope.categorySelected = currentRecipe.category;
		$scope.recipeCookTime = currentRecipe.cookTime;
		$scope.recipePrepTime = currentRecipe.prepTime;
		$scope.recipeIngredients = [];
		//console.log("Right before the For loop...");
		for(var i=0; i<currentRecipe.ingredients.length; i++){
			var obj = {
				foodItem : currentRecipe.ingredients[i].foodItem,
				amount : currentRecipe.ingredients[i].amount,
				condition : currentRecipe.ingredients[i].condition
			};
			$scope.recipeIngredients.push(obj);
			//console.log("hitting this line of code?");
		}
		$scope.recipeSteps = [];
		
		for(var i=0; i<currentRecipe.steps.length; i++){
			var stepObj = {
				description : currentRecipe.steps[i].description
			};
			$scope.recipeSteps.push(stepObj);
		}
		
		console.log($scope.recipeIngredients);
		
	};
	
	dataService.getCategories(function(response){
		//console.log(response.data);
		$scope.categories = [];
		for(var i=0; i<response.data.length; i++){
			$scope.categories[i] = response.data[i].name;
		}
		//$scope.categories = response.data;
		console.log($scope.categories);
	});
	
	dataService.getFoodItems(function(response){
		$scope.foodItems =[];
		for(var i=0; i<response.data.length; i++){
			$scope.foodItems[i] = response.data[i].name;
		}
		//$scope.foodItems = response.data;
	});
	
	
	$scope.deleteIngredient = function(ingredient, index){
		//	dataService.deleteIngredient(ingredient);
		$scope.recipeIngredients.splice(index, 1);
		
		//console.log($scope.recipeEditing);
	};
	
	$scope.addIngredient = function(){
		var obj =
		{
			foodItem: '',
			condition: '',
			amount: ''
		};
		$scope.recipeIngredients.push(obj);
	};
	
	$scope.addStep = function() {
		var obj = { description: ''};
		$scope.recipeSteps.push(obj);
	};
	
	$scope.deleteStep = function(index){
		$scope.recipeSteps.splice(index, 1);
	};
	
	
	$scope.handleSaveRecipe = function(){
		$scope.isEdit ? $scope.saveEditRecipe() : $scope.saveAddedRecipe();
	};
	
	$scope.saveEditRecipe = function(){
		console.log('saving the edited recipe');
		console.log($scope.recipeName);
		console.log($scope.recipeDescription);
		console.log($scope.categorySelected);
		console.log($scope.recipePrepTime);
		console.log($scope.recipeCookTime);
		
		for(var i=0; i<$scope.recipeIngredients.length; i++){
			console.log($scope.recipeIngredients[i].foodItem);
			console.log($scope.recipeIngredients[i].amount);
			console.log($scope.recipeIngredients[i].condition);
		}
	};
	
	$scope.saveAddedRecipe = function(){
		console.log('saving the added recipe');
	};
	
	
});