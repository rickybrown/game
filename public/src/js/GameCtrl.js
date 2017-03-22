app.controller('GameCtrl', function($timeout, $interval, Resource){
  var vm = this;
  vm.killList = [];
  vm.living = [];
  vm.timer = 30;
  vm.actions = []
  vm.playerScore = 0;
  vm.playerScore = 'Some'

  // start game (timer)
  vm.start = function(){
    sendKills();
    $interval(function(){
      vm.timer--;
    }, 1000, 31).then(function(){
      alert('game over!');
      vm.gameOver = true;
      vm.timer = 30;
    });
  }

  // tasks clicked/targeted for kill
  vm.kill = function(task){
    move(task, vm.haywire, vm.killList);
  }

  // send list of kill targets
  function sendKills(){
    $timeout(function(){
      if(vm.killList.length > 0){
        var list = {ids:vm.killList}
        Resource.save('tasks', 'delete', list).then(function(killed){
          vm.living = vm.killList.slice(0)
          vm.killList = [];
      });}
      if(vm.haywire.length < 30) queryTasks();
      if(!vm.gameOver) sendKills();
    }, 3000);
  }

  // check for new tasks
  // function queryTasks(){
  //   console.log('checking for new tasks')
  //   Resource.query('apps/availability/game/tasks').then(function(data){
  //     console.log(data);
  //     data.tasks.forEach(function(task){
  //       if((task.state === 'TASK_RUNNING') &&
  //         (vm.living.indexOf(task.id) < 0) &&
  //         (vm.haywire.indexOf(task.id) < 0)) {
  //         vm.living.shift();
  //         vm.haywire.push(task.id);
  //       }
  //     });
  //   });
  // }

  // function to move items/tasks between arrays
  function move(item, source, target){
    index = source.indexOf(item);
    source.splice(index, 1);
    target.push(item);
  }

});
