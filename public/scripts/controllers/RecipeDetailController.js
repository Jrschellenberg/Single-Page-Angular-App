/**
 * Created by Justin on 6/14/2017.
 */
'use strict';

angular.module('app')
.controller('RecipeDetailController', function($scope, $location, dataService, sharedDataService, $routeParams){
	//Function used with ng-click to change Route Path to Index.
	$scope.returnHome = function(){
		sharedDataService.setReadOnly(false);
		$location.path('/');
	};
	
	/*
	Function used when the page loads to determine how to render the page given certain parameters
	 */
	$scope.onLoad = function(){
		sharedDataService.setReadOnly(false);		
		//Do this if it is not in edit or add mode
		if($routeParams.view === "view-recipe"){
			sharedDataService.setReadOnly(true);
		}
		$scope.isReadOnly = sharedDataService.getReadOnly(); //Setting if readOnly or not.
		
		//do this if it is edit mode or viewing recipe mode.
		if($routeParams.view === "edit-recipe" || $routeParams.view ==="view-recipe"){
			//Extracting the string from the end of the url using last index of / as reference.
			var param = $location.path();
			var recipeId = param.substring(param.lastIndexOf('/')+1, param.length);
			$scope.initializeScopeRecipe(true, recipeId);
		}
		//do this when add mode.
		else if($routeParams.view ==="add-recipe"){
			$scope.initializeScopeRecipe(false, null);
		}
		else{
			console.log("We hit an ERROR!!!");
			console.log($routeParams.view);
			
			//handle error here.
		}
	};
	
	$scope.deleteIngredient = function(ingredient, index){
		$scope.recipeIngredients.splice(index, 1);
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
	
	
	$scope.initializeModelValues = function(currentRecipe){
		$scope.recipeName = currentRecipe.name;
		$scope.recipeDescription = currentRecipe.description;
		$scope.categorySelected = currentRecipe.category;
		//console.log($scope.categorySelected);
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
		//console.log($scope.recipeIngredients);
	};
	
	$scope.initializeScopeRecipe = function(isEdit, recipeId){
		if(isEdit){
			console.log("Should be in the edit");
			dataService.getRecipe(function(response){
				$scope.recipeEditing = response.data;
			
				$scope.initializeModelValues($scope.recipeEditing); 	//Need this in here because of asynchronous calls, has to be in the promise
			},recipeId);
		}
		else{
			console.log("we are in the add");
			$scope.recipeEditing = $scope.recipeTemplate();
			$scope.initializeModelValues($scope.recipeEditing);
			
		}
		$scope.isEdit = isEdit;
		//$scope.initializeModelValues($scope.recipeEditing);
		
	};
	
	$scope.recipeTemplate = function(){
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
		return recipe;
	};
	
	
	
	$scope.saveRecipe = function(){
		var data = {
			name: $scope.recipeName,
			description: $scope.recipeDescription,
			category: $scope.categorySelected,
			prepTime: $scope.recipePrepTime,
			cookTime: $scope.recipeCookTime,
			ingredients: $scope.recipeIngredients,
			steps: $scope.recipeSteps
			
		};
		data = JSON.stringify(data);
		
		
		var url = $scope.isEdit ? '/api/recipes/'+$routeParams.id : '/api/recipes';

		if($scope.isEdit) {
			dataService.putRecipe(function (response) {
				console.log("got into promise of put method");
				console.log(response.data);
				$scope.returnHome();
			}, url, data);
		}
		else{
			dataService.postRecipe(function(response){
				console.log("got into promise of hte POST method");
				$scope.returnHome();
			}, url, data);
		}
			
	};
	
	
	
		
	
	dataService.getFoodItems(function(response){
		$scope.foodItems =[];
		for(var i=0; i<response.data.length; i++){
			$scope.foodItems[i] = response.data[i].name;
		}
		//$scope.foodItems = response.data;
	});
	
	dataService.getCategories(function(response){
		//console.log(response.data);
		$scope.categories = [];
		for(var i=0; i<response.data.length; i++){
			$scope.categories[i] = response.data[i].name;
		}
		//$scope.categories = response.data;
		console.log($scope.categories);
	});
	

	
});