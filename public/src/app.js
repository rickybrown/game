angular.module('app', ['ui.router', 'ngTouch', 'angular.filter']);

var app = angular.module('app');

app.run(function($rootScope, $state){
  $rootScope.api = '/api/';
  $rootScope.marathon = 'http://172.16.0.5/service/marathon/v2';
  $rootScope.view = 'game';
  document.addEventListener('onclick',function(e){
  	e.preventDefault();
  });
  document.addEventListener('onmousedown',function(e){
  	e.preventDefault();
  });
  document.addEventListener('onmouseup',function(e){
  	e.preventDefault();
  });
  document.addEventListener('ontouchstart',function(e){
  	e.preventDefault();
  });
  document.addEventListener('ontouchend',function(e){
  	e.preventDefault();
  });
  document.addEventListener('ontouchmove',function(e){
  	e.preventDefault();
  });
});
