/**
 * Created by Justin on 6/14/2017.
 */
'use strict';

angular.module('app')
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
		
		
		this.deleteIngredient = function(ingredient){
			console.log("The ingredient has been deleted!");
			
			//Will need to communicate with database eventually in here!!
		};
		
		this.deleteRecipe = function(callback, id){
			$http.delete("/api/recipes/"+id)
				.then(callback);
		};
		
		
		this.getRecipeCategory = function(callback, category){
			$http.get('/api/recipes?category='+category)
				.then(callback);
		};
		
		this.getRecipe = function(callback, id){
			$http.get("/api/recipes/"+id)
				.then(callback);
		};
		
		this.putRecipe = function(callback, url, data){
			console.log("right before put request....");
			console.log(url);
			console.log(data);
			$http.put(url, data)
				.then(callback);
		}
		
	});