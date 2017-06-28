/**
 * Created by Justin on 6/14/2017.
 */
(function() {
	'use strict';
	
	angular.module('app')
		
	//Service used to handle if view is readonly or not.
		.service('sharedDataService', function () {
			var isReadOnly = false;
			this.setReadOnly = function (set) {
				isReadOnly = set;
			};
			
			this.getReadOnly = function () {
				return isReadOnly;
			}
		});
})();