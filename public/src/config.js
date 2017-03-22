app.config(function($sceProvider, $httpProvider, $locationProvider , $stateProvider, $urlRouterProvider){
  // prevent browsers(IE) from caching $http responses
  if (!$httpProvider.defaults.headers.get) {
    $httpProvider.defaults.headers.get = {
      'Cache-Control':'no-cache',
      'Pragma':'no-cache'
    };
  };

  $sceProvider.enabled(false);
  $locationProvider.html5Mode(false).hashPrefix('!');

  $stateProvider
  .state('game', {
    url:'/',
    templateUrl: 'views/game.html',
    controller: 'GameCtrl',
    controllerAs:'vm'
  })
  .state('scores', {
    url:'/scores',
    templateUrl: 'views/scores.html',
    controller: 'ScoresCtrl'
  })

  // catchall route
  $urlRouterProvider.otherwise('/');
});
