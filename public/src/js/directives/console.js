app.directive('console',function(){
	return {
		restrict:'E',
		templateUrl:'views/partials/console.html',
		scope:{
			actions:'=',
			view:'='
		},
		controller:function($scope, $rootScope, $filter, Resource){
			$rootScope.$on('updateScores',getScores);
			var inactive, active;
			getScores();
			inactive = {
				class1: 'console7',
				class2: 'console72',
				class3: 'console8'
			}
			active = {
				class1: 'console72',
				class2: 'console7',
				class3: 'console73'
			}
			$scope.diagram = inactive
			$scope.game = active

			$scope.toggleView = function(view){
				$rootScope.view = view;
				if(view === 'diagram'){
					$scope.diagram = active
					$scope.game = inactive
				} else if(view === 'game'){
					$scope.diagram = inactive
					$scope.game = active
				}
			};

			$scope.today = $filter('date')(new Date(), 'EEEE, MMM d');
			$scope.scores = [];
			function getScores(){
				Resource.query('scores').then(function(scores){
					scores.map(function(score){
		        score.updatedAt = $filter('date')(score.updatedAt, 'EEEE, MMM d');
		        return;
		      })//.filter(function(score) {return score.updatedAt == $scope.today})
					$scope.scores = scores.filter(function(score){
						return score.updatedAt === $scope.today;
					})
				});
			};

			console.log($scope.scores)
		}
	}
});
