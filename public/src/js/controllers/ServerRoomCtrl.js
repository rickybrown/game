app.controller('ServerRoomCtrl', function($scope,$interval,Resource,$timeout){
	$scope.timeLeft = '10:00';
	var time = 10;
	var cntDwn = false;
	$scope.killList = [];
	$scope.living = [];
	$scope.actions = [];
	$scope.starting = [];
	$scope.welcome = true;
	$scope.gameOver = false;
	$scope.playerScore = 0;
	var playerDT = 0;
	$scope.playerDT = formatTime(playerDT);
	$scope.playerName = '';
	$scope.inputName = false;
	var board = document.querySelector('.server-room');
	var maxTop = board.offsetHeight*.5,
	maxLeft = board.offsetWidth*.9;
	var music = new Audio('build/assets/game-audio.wav');
	music.volume = .8;
	var killSending = 'first';
	var checkKills;
	var liveNum = 30;
	var dTimer;
	var DT = 0;
	$scope.resetTime = 0;


	$scope.play = function(){
		$scope.inputName = true;
		$scope.welcome = false;
	}

	$scope.start = function(player){
		if(!player || (player=='')) return;
		$scope.resetTime = 3;
		var beep = new Audio('build/assets/beep.mp3');
		beep.play();
		$interval(function(){
			var beep = new Audio('build/assets/beep.mp3');
    	$scope.resetTime--;
    	if($scope.resetTime)beep.play();
    }, 1000, 3).then(function(){
    	$scope.gameOver = false;
			$scope.playerName = player;
			Resource.save('scores', 'create', {name:player})
			.then(function(data){
				$scope.inputName = false;
				music.play();
				startTimer();
				addAction('Game start!');
				var startingPos = document.querySelectorAll('.startingInstance');
				for(i=29;i>=0;i--){
					var task = $scope.starting.pop();
					var pos = startingPos[i].getBoundingClientRect();
					task.style.top = (pos.top-(window.innerHeight*.15))+'px';
					task.style.left = (pos.left-(window.innerWidth*.3))+'px';
					$scope.living.push(task);
				};
				$scope.living.forEach(function(task){
					startFlying(task);
				});
				checkKills = $interval(queryKilled,1000);
			}).catch(function(err){console.log(err)})
   		});
	};

	$scope.reset = function(){
		$scope.playerName = '';
		$scope.playerScore = 0;
		$scope.player = '';
		playerDT = 0;
		$scope.playerDT = formatTime(playerDT);
		liveNum = 30;
		time = 10;
		$scope.timeLeft = formatTime(time);
		$scope.welcome = true;
		$scope.gameOver = false;
	}

	$scope.kill = function(el,task,idx){
		var hitSound = new Audio('build/assets/hit4.mp3');
		hitSound.volume = .6;
		task.clicks += 1
		if(task.clicks < 3) {
			hitSound.play();
			addAction('keep hitting!');
			return;
		}
		if(!task.dying){
			task.dying = true;
			task.style.transition = '.5s ease-in';
			task.style.top = el.target.parentElement.offsetTop+'px';
			task.style.top = el.target.parentElement.offsetLeft+'px';
			task.class="falling";
			$timeout(function(){
				task.class = 'dead';
			},1500);
			$scope.killList.push(task.id);
			liveNum--
			if(!liveNum){
				dTimer = $interval(function(){
					DT += .01;
					$scope.playerDT = formatTime(DT);
				},10);
			}
			$interval.cancel(task.animation);
			$timeout(function(){
				task.style.top = (board.offsetHeight*.8) +'px';
			},100);
			hitSound.play();
			addAction('+1 instance killed!');
			$scope.playerScore ++;
			if(!killSending==='first'){
				sendKills(4000);
			}else{
				sendKills(2000);
			}
		}
	}

	$scope.getMargLeft = function(idx){
		if(idx<5){
			var offset = 3;
		}else if(idx<10){
			var offset = 0;
		}else if(idx<15){
			var offset = 3;
		}else if(idx<20){
			var offset = 0;
		}else if(idx<25){
			var offset = 3;
		}else if(idx<30){
			var offset = 0;
		}
		return offset+'vw';
	};

	queryTasks();

	function addAction(msg){
		$scope.actions.unshift(msg);
	}

	function startTimer(){
		var previousTime = Date.now();
		if(!cntDwn){
			cntDwn = $interval(function(){
				var currentTime = Date.now();
				var diff = (currentTime - previousTime)*.001;
				if(time>0){
					time = time-diff;
					$scope.timeLeft = formatTime(time);
					previousTime = currentTime;
				}else{
					$scope.timeLeft = '00:00';
					endGame();
				}
			},10);		
		}
	}

	function endGame(){
		$scope.gameOver = true;
		$interval.cancel(cntDwn);
		cntDwn = false;
		$scope.starting= [];
		$interval.cancel(dTimer);
		addAction('Game Over.');
		music.pause();
		music.currentTime = 0;
		$scope.killList = [];
		$interval.cancel(checkKills);
		$scope.living.forEach(function(task,i){
			if(task){
				$interval.cancel(task.animation);
				task.style.transition = '800ms linear';
				task.style.opacity = "0";
			}
		});
		document.body.style.pointerEvents = "none";
		$timeout(function(){
			queryTasks();
			document.body.style.pointerEvents = "auto";
			$scope.actions = [];
		},10000);
		Resource.save('scores', 'update', {
	      name:$scope.playerName,
	      score:$scope.playerScore,
	      time:$scope.playerDT
	    }).then(function(data){
	      $scope.$emit('updateScores', $scope.playerName);
	    });
	}

	function formatTime(int){
		var str = Math.abs(int).toFixed(2).toString().replace('.',':');
		if(int<10) str = '0'+str;
		return str;
	}

	function queryTasks(){
		Resource.query('apps/availability/game/tasks').then(function(data){
			if(data.tasks){
				data.tasks.forEach(function(task,i){
			      $scope.starting.push({
			      	id:task.id,clicks:0,style:{top:(Math.random()*maxTop)+'px',left:(Math.random()*maxLeft)+'px',transition:'2s linear'}
			      });
			  });
			 }
		});
	};

	function queryKilled(){
		Resource.query('apps/availability/game/tasks').then(function(data){
			if(data.tasks){
			  data.tasks.forEach(function(task,i){
			  var idx = IndexOfObjProp($scope.living, 'id', task.id);
				if(task.state === 'TASK_RUNNING' && idx === -1 && !$scope.gameOver) {
					$scope.starting.shift();
					var startingPos = document.querySelectorAll('.startingInstance');
					var pos = startingPos[startingPos.length-1].getBoundingClientRect();
					$scope.living.push({
						clicks:0,
						id:task.id,
						style:{
							top:(pos.top-(window.innerHeight*.15))+'px',
							left:(pos.left-(window.innerWidth*.3))+'px',
							transition:'2s linear'
						}
			      	});
			      	$interval.cancel(dTimer);
			      	liveNum ++;
					startFlying($scope.living[$scope.living.length-1]);
					addAction('New instance online!');
			    }
			  });
			};
		});
	};

	function sendKills(time){
		killSending = $timeout(function(){
			if($scope.killList.length > 0){
		        var list = {ids:$scope.killList}
		        Resource.save('tasks', 'delete', list).then(function(killed){
					$scope.killList.forEach(function(task){
						if($scope.starting.indexOf(task)===-1){
							$scope.starting.push(task);
						};
					});
		      	});
	    	}
	        killSending = false;
		},time);
  	};

 	function resetPositions() {
        var count = 0;
        for (var index in $scope.starting) {
            var mole = $scope.starting[index];
            var y = ($scope.board_height - 210) - Math.floor(index / columns) * $scope.mole_size_y;
            var x = index % columns * $scope.mole_size_x + ($scope.board_width / 2 - 100);
            mole.desired_y = y;
            mole.desired_x = x;
            mole.reseeding_x = false;
            mole.reseeding_y = false;
            count++;
            mole.origin_x = x;
            mole.origin_y = y;
        }
    };

	function move(item, source, target,idx){
		index = idx||source.indexOf(item);
		source.splice(index, 1);
		target.push(item);
	};

	function IndexOfObjProp(arr, prop, value) {
    for(var i = 0, len = arr.length; i < len; i++) {
      if (arr[i][prop] === value) return i;
    }
    return -1;
	}

	function startFlying(task){
		task.class = 'flying';
		var timing = Math.floor(Math.random()*3000);
		if(timing<800){timing = 800};
		task.style.transition = timing+'ms linear';
		$timeout(function(){
			task.style.top = (Math.random()*maxTop)+'px';
			task.style.left = (Math.random()*maxLeft)+'px';
		},200);
		task.animation = $interval(function(){
			task.style.top = (Math.random()*maxTop)+'px';
			task.style.left = (Math.random()*maxLeft)+'px';
		},timing);
	}

});
