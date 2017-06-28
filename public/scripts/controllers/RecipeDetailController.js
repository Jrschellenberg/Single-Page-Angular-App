/**
 * Created by Justin on 6/14/2017.
 */
(function() {
	'use strict';
	
	angular.module('app')
		.controller('RecipeDetailController', function ($scope, $location, dataService, sharedDataService, $routeParams) {
			//Function used with ng-click to change Route Path to Index.
			$scope.returnHome = function () {
				sharedDataService.setReadOnly(false);
				$location.path('/');
			};
			/*
			 Function used when the page loads to determine how to render the page given certain parameters
			 */
			$scope.onLoad = function () {
				$scope.isRecipeValidated = true;
				sharedDataService.setReadOnly(false);
				//Do this if it is not in edit or add mode
				if ($routeParams.view === "view-recipe") {
					sharedDataService.setReadOnly(true);
				}
				$scope.isReadOnly = sharedDataService.getReadOnly(); //Setting if readOnly or not.
				
				//do this if it is edit mode or viewing recipe mode.
				if ($routeParams.view === "edit-recipe" || $routeParams.view === "view-recipe") {
					//Extracting the string from the end of the url using last index of / as reference.
					var param = $location.path();
					var recipeId = param.substring(param.lastIndexOf('/') + 1, param.length);
					$scope.initializeScopeRecipe(true, recipeId);
				}
				//do this when in add recipe mode.
				else if ($routeParams.view === "add-recipe") {
					$scope.initializeScopeRecipe(false, null);
				}
				else {
					console.log("We hit an ERROR!!!");
					console.log($routeParams.view);
					
					//handle errors here when wrong page loaded.
				}
			};
			
			/*
			 function used to remove ingredients from the recipeIngredients array
			 @param: index - the index at which to remove from the recipeIngredients array 
			 */
			$scope.deleteIngredient = function (index) {
				$scope.recipeIngredients.splice(index, 1);
			};
			
			/*
			 Function used to add an ingredients field to the view.
			 creates an object with the specified key names. then pushes it onto the $scope.recipeIngredients var
			 */
			$scope.addIngredient = function () {
				var obj =
				{
					foodItem: '',
					condition: '',
					amount: ''
				};
				$scope.recipeIngredients.push(obj);
			};
			//similar to addIngredients
			$scope.addStep = function () {
				var obj = {description: ''};
				$scope.recipeSteps.push(obj);
			};
			//similar to deleteIngredients
			$scope.deleteStep = function (index) {
				$scope.recipeSteps.splice(index, 1);
			};
			
			/*
			 function used to populate the modal binding values in view from the services get request.
			 */
			$scope.initializeModelValues = function (currentRecipe) {
				$scope.recipeName = currentRecipe.name;
				$scope.recipeDescription = currentRecipe.description;
				$scope.categorySelected = currentRecipe.category;
				$scope.categorySelected = currentRecipe.category;
				$scope.recipeCookTime = currentRecipe.cookTime;
				$scope.recipePrepTime = currentRecipe.prepTime;
				$scope.recipeIngredients = [];
				//populate the $scope.recipeIngredients variable
				for (var i = 0; i < currentRecipe.ingredients.length; i++) {
					var obj = {
						foodItem: currentRecipe.ingredients[i].foodItem,
						amount: currentRecipe.ingredients[i].amount,
						condition: currentRecipe.ingredients[i].condition
					};
					//push the current data onto $scope.recipeIngredients
					$scope.recipeIngredients.push(obj);
				}
				$scope.recipeSteps = [];
				//similar logic as above
				for (var i = 0; i < currentRecipe.steps.length; i++) {
					var stepObj = {
						description: currentRecipe.steps[i].description
					};
					$scope.recipeSteps.push(stepObj);
				}
			};
			
			/*
			 used to initialize $scope.recipeEditing variable (contains the information grabbed from database
			 @param isEdit: variable used to determine if the view is in edit mode or add mode
			 @param recipeId: variable used IF view is in edit mode, it will get the recipe using this id.
			 */
			$scope.initializeScopeRecipe = function (isEdit, recipeId) {
				if (isEdit) {
					//console.log("Should be in the edit");
					dataService.getRecipe(function (response) {
						$scope.recipeEditing = response.data;
						
						$scope.initializeModelValues($scope.recipeEditing); 	//Need this in here because of asynchronous calls, has to be in the promise
					}, recipeId);
				}
				else {
					//console.log("we are in the add");
					$scope.recipeEditing = $scope.recipeTemplate();
					$scope.initializeModelValues($scope.recipeEditing);
					
				}
				$scope.isEdit = isEdit;
			};
			
			/*
			 A function to populate the template for storing recipes.
			 */
			$scope.recipeTemplate = function () {
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
			
			
			/*
			 This function is used to do all form validation, will prevent submission if it fails
			 @param data: An object containing all of the current data entered into the fields.
			 If an error is hit, sets $scope.isRecipeValidated to equal false in sub function, preventing PUT, POST request.
			 */
			$scope.validateForm = function (data) {
				$scope.recipeValidationMessages = [];
				$scope.isRecipeValidated = true;
				//Loop over all of the items from data.
				for (var key in data) {
					if (data.hasOwnProperty(key)) {
						//Checking if value is null or empty				
						if (data[key] === null || data[key] === '') {
							validateComponent(key, "requires a value");
							continue;
						}
						//special case for if people add 'e' to the numeric field prepTime && cookTime
						else if ((key == 'prepTime' || key == 'cookTime') && data[key] == undefined) {
							validateComponent(key, "requires a numeric value");
							continue;
						}
						//checking if non text area fields have length > 30
						else if (key != 'description' && data[key].length > 30) {
							validateComponent(key, "value cannot exceed 30 characters in length");
							continue;
						}
						//checking if description ie text area has field > 150 characters
						else if (key == 'description' && data[key].length > 150) {
							validateComponent(key, "value cannot exceed 150 characters in length");
							continue;
						}
						//checking that prepTime and cookTime fields have value > than 0 ie no - numbers
						else if ((key == 'prepTime' || key == 'cookTime') && data[key] < 0) {
							validateComponent(key, "value must be greater than 0");
							continue;
						}
						//Code to check values of all the fields entered in the arrays ingredients and steps.
						if (data[key] instanceof Array) {
							//first loop to seperate ingredients array from steps array
							for (var i = 0; i < data[key].length; i++) {
								//looping over keys of each individual array
								for (var subKey in data[key][i]) {
									//finding only properties that matter to us
									if (data[key][i].hasOwnProperty(subKey)) {
										//checking if key is condition and if it is allow it to be blank. ie skip the second check
										if (subKey === "condition" && (data[key][i][subKey] === null || data[key][i][subKey] === '')) {
											continue;
										}
										//If the field is blank display error message
										else if (data[key][i][subKey] === null || data[key][i][subKey].length === 0) {
											validateComponent(key + capitalizeFirstLetter(subKey), "requires a value");
											continue;
										}
										//if field is not description and is less than 30 characters, display this message
										else if (subKey != 'description' && data[key][i][subKey].length > 30) {
											console.log(data[key][i][subKey].length);
											validateComponent(key + capitalizeFirstLetter(subKey), "value cannot exceed 30 characters in length");
											continue;
										}
										//if field is description and has field length > 150 display this message
										else if (subKey == 'description' && data[key][i][subKey].length > 150) {
											validateComponent(key + capitalizeFirstLetter(subKey), "value cannot exceed 150 characters in length");
											continue;
										}
									}
								}
							}
						}
					}
				}
				return $scope.isRecipeValidated;   //Return variable isRecipeValidated.
				
				/*
				 sub function used for handling when form validation fails
				 */
				function validateComponent(key, message) {
					key = stringPrettify(key);
					$scope.recipeValidationMessages.push(capitalizeFirstLetter(key) + " " + message);
					$scope.isRecipeValidated = false;
				};
				/*
				 function used in making keys user friendly to read
				 */
				function capitalizeFirstLetter(string) {
					return string.charAt(0).toUpperCase() + string.slice(1);
				};
				/*
				 function used to make the keys user friendly to read
				 */
				function stringPrettify(string) {
					//console.log(string);
					var strArray = string.split('');
					for (var i = 0; i < strArray.length; i++) {
						if (strArray[i] === strArray[i].toUpperCase()) {
							string = string.replace(strArray[i].toUpperCase(), " " + strArray[i]);
						}
					}
					return string;
				};
			};
			
			
			/*
			 logic used for saving a recipe.
			 */
			$scope.saveRecipe = function () {
				var data = {
					name: $scope.recipeName,
					description: $scope.recipeDescription,
					category: $scope.categorySelected,
					prepTime: $scope.recipePrepTime,
					cookTime: $scope.recipeCookTime,
					ingredients: $scope.recipeIngredients,
					steps: $scope.recipeSteps
				};
				//Calls the function to validate all of the forms data! if fails $scope.isRecipeValidated handles fail
				$scope.isRecipeValidated = $scope.validateForm(data);
				data = JSON.stringify(data);
				var url = $scope.isEdit ? '/api/recipes/' + $routeParams.id : '/api/recipes'; //build the url string based off if in edit or add mode
				
				//If $scope.validateForm fails discontinue the function execution
				if (!$scope.isRecipeValidated) {
					return;
				}
				//if form validation passed, handle submitting the request based off if in Edit mode or Add mode.
				if ($scope.isEdit) {
					dataService.putRecipe(function (response) {
						$scope.returnHome();
					}, url, data);
				}
				else {
					dataService.postRecipe(function (response) {
						$scope.returnHome();
					}, url, data);
				}
			};
			
			/*
			 dataService call to getFoodItems
			 */
			dataService.getFoodItems(function (response) {
				$scope.foodItems = [];
				for (var i = 0; i < response.data.length; i++) {
					$scope.foodItems[i] = response.data[i].name;
				}
				//$scope.foodItems = response.data;
			});
			
			/*
			 dataService call to get categories.
			 */
			dataService.getCategories(function (response) {
				$scope.categories = [];
				for (var i = 0; i < response.data.length; i++) {
					$scope.categories[i] = response.data[i].name;
				}
				//$scope.categories = response.data;
				//console.log($scope.categories);
			});
		});
})();