/**
 * Created by Justin on 6/14/2017.
 */
(function() {
	'use strict';
	
	angular.module('app')
		.service('dataService', function ($http) {
			
			this.getCategories = function (callback) {
				$http.get('http://localhost:5000/api/categories')
					.then(callback)
			};
			
			this.getRecipes = function (callback) {
				$http.get('http://localhost:5000/api/recipes')
					.then(callback)
			};
			
			this.getFoodItems = function (callback) {
				$http.get('http://localhost:5000/api/fooditems')
					.then(callback)
			};
			
			
			this.deleteIngredient = function (ingredient) {
				console.log("The ingredient has been deleted!");
				
			};
			
			this.deleteRecipe = function (callback, id) {
				$http.delete("/api/recipes/" + id)
					.then(callback);
			};
			
			
			this.getRecipeCategory = function (callback, category) {
				$http.get('/api/recipes?category=' + category)
					.then(callback);
			};
			
			this.getRecipe = function (callback, id) {
				$http.get("/api/recipes/" + id)
					.then(callback);
			};
			
			this.putRecipe = function (callback, url, data) {
				$http.put(url, data)
					.then(callback);
			};
			
			this.postRecipe = function (callback, url, data) {
				$http.post(url, data)
					.then(callback);
			};
			
		});
})();