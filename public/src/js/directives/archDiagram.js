app.directive('archDiagram',function(){
	return {
		restrict:'E',
		templateUrl:'views/partials/arch-diagram.html',
		scope:{
			actions:'='
		},
		controller:function($scope, $timeout, Resource){
			var allTasks = [];
			var killList = [];
			$scope.tasks = [];

	    function init(){
				Resource.query('apps/availability/game/tasks').then(function(data){
					data.tasks.forEach(function(task){
						$scope.tasks.push(task.id);
					});
				});
		  }

			$scope.killTask = function($event, task){
				$scope[task] = true;
				console.log($scope[task])
				var ele = angular.element($event.currentTarget.classList)[1];
				var els = document.getElementsByClassName(ele);
				[].forEach.call(els, function(el) {
					el.classList.add('die')
					$timeout(function(){
						el.classList.remove('die');
						$scope.tasks.push($scope.tasks.shift());
						$scope[task] = false;
			    }, 10000);
				});
			}

			init();
		}
	}
})
