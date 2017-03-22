app.directive('serverRoom',function(){
	return {
		restrict:'E',
		templateUrl:'views/partials/server-room.html',
		scope:{
			actions:'='
		},
		controller:'ServerRoomCtrl'
	}
})