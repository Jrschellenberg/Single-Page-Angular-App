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
//		$scope.recipeValidationMessages = {};
		$scope.isRecipeValidated = true;
		
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
	
	
	
	//Use ng-messages?
	$scope.validateForm = function(data){
		
		$scope.recipeValidationMessages = [];
		$scope.isRecipeValidated = true;
				
		for(var key in data){
			if(data.hasOwnProperty(key)){
				
				console.log(data[key]);
				console.log(data[key].tagName);
				
				if(data[key] === null || data[key] === ''){
					validateComponent(key, "requires a value");
					continue;
				}
				else if(key !='description' && data[key].length > 30){
					validateComponent(key, "value cannot exceed 30 characters in length");
					continue;
				}
				else if(key == 'description' && data[key].length > 150){
					validateComponent(key, "value cannot exceed 150 characters in length");
					continue;
				}
				
				//put conditional check statements to array starting with most prioritized first, working down to least
				
				console.log(data[key] instanceof Array);
				
				if(data[key] instanceof Array){
					for(var i=0; i<data[key].length; i++){
						for(var subKey in data[key][i]){
							if(data[key][i].hasOwnProperty(subKey)){
								//put conditional check statements to array starting with most prioritized first, working down to least
								
								if(data[key][i][subKey] === null || data[key][i][subKey] === ''){
									validateComponent(subKey, "requires a value");
									continue;
								}
								else if(subKey !='description' && data[key][i][subKey].length > 30){
									validateComponent(subKey, "value cannot exceed 30 characters in length");
									continue;
								}
								else if(subKey == 'description' && data[key][i][subKey].length > 150){
									validateComponent(subKey, "value cannot exceed 150 characters in length");
									continue;
								}
								
								console.log(data[key][i][subKey]);
								
								console.log(data[key][i].length);
							}
						}
					}
					
					console.log(key + " is an array");
				}
				
			}
			
		
			
		}
		
		
		//Need a loop to iterate over all of the properties,
		
		//check if property is array 
			//if it is, loop over that array
		
		//check for min/max lengths first, set those messages
		
		//end checks are more priority, overwrite the older checks.
		
		
		return $scope.isRecipeValidated;
		
		function validateComponent(key, message){
			$scope.recipeValidationMessages.push(capitalizeFirstLetter(key) + " "+message);
			$scope.isRecipeValidated = false;
		};
		
		function capitalizeFirstLetter(string) {
			return string.charAt(0).toUpperCase() + string.slice(1);
		};
		
		
		
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
		
		
		$scope.isRecipeValidated = $scope.validateForm(data);
		
		data = JSON.stringify(data);
		
		
		var url = $scope.isEdit ? '/api/recipes/'+$routeParams.id : '/api/recipes';
		
		
		console.log($scope.isRecipeValidated);
		
		if(!$scope.isRecipeValidated){
			console.log("Got into recipe not validated if");
			//Break out of hte function, stop code block.
			return;
		}
		

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