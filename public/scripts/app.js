angular.module("app", ['ngRoute'])
	.controller('RecipesController', function($scope, dataService, $location){
				
		//function used to change route path to /add.
		$scope.addRecipe = function( ){
			$location.path('/add');
		};
		$scope.editRecipe = function(path){
			//console.log("got into the edit recipe function");
			//console.log("path is" +path);
			
			//console.log(result[0]);
			//dataService.setRecipeData(result[0]);
			$location.path('/edit/'+path);
		};
		
		
		
		
		$scope.detectChange = function(){
			//console.log("detected Change");
			//console.log($scope.currentCategory.name);
			
			//Loops through comparing the recipes to the categories to check if any recipe exist in that category.
			for(var i=0; i<$scope.recipes.length; i++){
				if($scope.currentCategory.name === $scope.recipes[i].category) {
					//If finds one, sets isRecipes to true and returns
					$scope.isRecipes = true;
					return;
				}
			}
			//If these lines hit. No recipes matching category found, can set to false and return;
			$scope.isRecipes = false;
			return;
		};
		
		dataService.getCategories(function(response){
			//console.log(response.data);
			$scope.categories = response.data;
		});
		
		dataService.getRecipes(function(response){
			//console.log(response.data);
			$scope.isRecipes =true;
			$scope.recipes = response.data;
		});
		
		
		
		
	})
	.controller('RecipeDetailController', function($scope, $location, dataService){
		//console.log("hit the Recipe Detail Controller?");

		//Function used to change Route Path to Index.
		$scope.returnHome = function(){
			$location.path('/');
		};
		
		$scope.onLoad = function(){
			var param = $location.path();
			if(param.search("/add")===-1){
				
				console.log("we are in the edit");
				dataService.getRecipes(function(response){
					$scope.isEdit = true;
					$scope.recipeEditing = response.data;
					var recipeId = param.substring(param.lastIndexOf('/')+1, param.length);
					var result = $scope.recipeEditing.filter(function(obj){
						return obj._id == recipeId;
					});
					$scope.recipeEditing = result[0];

					//$scope.currentFoodItem = $scope.recipeEditing.ingredients[0].foodItem;
					console.log($scope.recipeEditing);
				});
				//When editing is true;
				
			}
			else{
				$scope.isEdit = false;
				console.log("we are in the add");
				
			}
			
		};
		
		
		dataService.getCategories(function(response){
			//console.log(response.data);
			$scope.categories = response.data;
		});
		
		dataService.getFoodItems(function(response){
			$scope.foodItems = response.data;
		});
		
		

		
		
		
		
		
		
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
		
		this.getFoodItems = function(callback){
			$http.get('http://localhost:5000/api/fooditems')
				.then(callback)
		};
		
	});