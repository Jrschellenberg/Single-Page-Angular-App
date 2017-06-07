angular.module("app", ['ngRoute'])
	.controller('RecipesController', function($scope, dataService, $location){
				
		//function used to change route path to /add.
		$scope.addRecipe = function( ){
			$location.path('/add');
		};
		$scope.editRecipe = function(path){
			//console.log("got into the edit recipe function");
			//console.log("path is" +path);
			$location.path('/edit/'+path);
		};
		
		
		
		
		$scope.detectChange = function(){
			//console.log("detected Change");
			console.log($scope.currentCategory.name);
			
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
	.controller('RecipeDetailController', function($scope, $location){
		//console.log("hit the Recipe Detail Controller?");

		//Function used to change Route Path to Index.
		$scope.returnHome = function(){
			$location.path('/');
		};
		
		$scope.onLoad = function(){
			$scope.isEdit = false;
			var param = $location.path();
			if(param.search("/add")===-1){
				console.log("we are in the edit");
				$scope.isEdit = true;
			}
			else{
				console.log("we are in the add");
				
			}
			
		}
		
		
		
		
		
		
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