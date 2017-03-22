app.controller('ScoresCtrl', function($scope, $filter, $window, Resource, orderByFilter){

  weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  function queryScores(){
    Resource.query('scores').then(function(scores){
      $scope.scores = scores
      $scope.scores.map(function(score){
        var updated = score.updatedAt
        score.date = $filter('date')(updated, 'EEEE, MMM d');
        score.day = $filter('date')(updated, 'EEEE');
        score.time = $filter('date')(updated, 'shortTime');
        return;
      });
      $scope.scores = orderByFilter($scope.scores, function(score) {
        return weekDays.indexOf(score.day);
      });
    });
  }

  $scope.delete = function(player, idx){
    if ($window.confirm('Are you sure you want to delete '+player.name+'\'s score?')) {
      Resource.delete('scores', player.id)
      .then(function(data){
        queryScores()
      });
    }
  }

  queryScores();
});
