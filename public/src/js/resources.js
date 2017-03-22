app.factory('Resource', function($http, $rootScope) {
  return {
    query: function(path){
      return $http.get($rootScope.api+path)
      .then(function(resp){
        if(resp.status == 200) return resp.data; return;
      }).catch(function(err){
        return err;
      })
    },
    get: function(path, param){
      return $http.get($rootScope.api+path+'/'+param)
      .then(function(resp){
        if(resp.status == 200) return resp.data; return;
      }).catch(function(err){
        return err
      });
    },
    save: function(path, param, body){
      return $http.post($rootScope.api+path+'/'+param, body)
      .then(function(resp){
        if(resp.status == 200) return resp.data; return;
      }).catch(function(err){
        return err;
      });
    },
    delete: function(path, param){
      return $http.delete($rootScope.api+path+'/'+param)
      .then(function(resp){
        if(resp.status == 200) return resp.data; return;
      }).catch(function(err){
        return err
      });
    }
  }
});


// $http.get($rootScope.api+'/apps/availability/game/tasks').then(function(tasks){
//   console.log(tasks)
// }).catch(function(err){
//   console.log(err)
// })
