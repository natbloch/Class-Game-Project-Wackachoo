var Whakachoo = function() {

	var _this = this;
	// game data
	this.pikas = []; // all pikas objects array	
	this.totalPikas = 10; // total pikas on screen
	this.gamePoints = 0; // current game points
	this.gameTimer = null; // game timer object
	this.duration = null; // int seconds
	// dom obj reference
	this.field = document.getElementById('field'); // field dom obj
	this.timer = null; // game timer dom obj
	this.points = null; // game point dom obj
	this.btn = null; // game control dom obj	
	// sounds
	this.s_hit = new Audio("sound/plop.wav");; // hammer hit
	this.s_ouch = new Audio("sound/pika.wav"); // pika hit
	this.s_game = new Audio("sound/gamesound.mp3"); // game running
	

	
	// ---- init procedure
	
	// 1. init board by adding pikas
	var pikaPos = this.calcPikasPos();
	for(var i=0;i<pikaPos.length;i++) {
		this.pikas[i] = new Pika(pikaPos[i]);
		this.field.appendChild(this.pikas[i].getDomObj());
	}
	
	// 2. add button
	this.btn = document.createElement('button');
	this.btn.innerHTML = 'Start Game';
	this.btn.addEventListener("click",function() {
		if(_this.gameTimer) {
			_this.endGame();
		}
		else {
			_this.startGame();
		}
	});
	this.field.appendChild(this.btn);
	
	// 3. score + game time
	this.points = document.createElement('p');
	this.points.className = 'points';
	this.points.innerHTML = '0';
	this.timer = document.createElement('p');
	this.timer.className = 'timer';
	this.timer.innerHTML = '0';
	var t = document.createElement('div');
	t.className = 'scoreboard';
	t.appendChild(this.timer);
	t.appendChild(this.points);
	this.field.appendChild(t);

	// 4. register whack event
	document.addEventListener('whack', function (e) {
		console.log('whack triggered, points = ' + e.detail);
		_this.s_ouch.currentTime=0;
		_this.s_ouch.play();
		_this.gamePoints += e.detail;
		_this.showGamePoints();
	}, false);	
	
	// 5. set hammer mouse+cursor event
	this.field.addEventListener('mousedown',function() {
		console.log('thump');
		_this.s_hit.currentTime=0;
		_this.s_hit.play();
		_this.field.className = 'md';		
	});
	this.field.addEventListener('mouseup',function() {
		_this.field.className = '';
	});
}

Whakachoo.prototype = {
	
	startGame: function() {		
		// run sounds
		this.s_game.currentTime=0;
		this.s_game.play();
		// reset pikas position
		var pikaPos = this.calcPikasPos();
		for(var i=0;i<this.pikas.length;i++) {
			this.pikas[i].setPikaPos(pikaPos[i]);
			this.pikas[i].setPikaAction({t:'',p:null}); // reset action
		}
		// reset game button, points, duration, time elements
		this.gamePoints = 0;
		this.showGamePoints();		
		this.duration = 20;
		this.timer.innerHTML = this.duration;		
		this.btn.innerHTML = 'Stop Game';			
		// run game time, heartbeat
		var _this = this;
		this.gameTimer = setInterval(function () {
			_this.timer.innerHTML = _this.duration;
			// count back and test for end
			if (--_this.duration < 0) {
				clearInterval(_this.gameTimer);
				_this.gameTimer = null;
			}
		}, 1000);
		this.gameBeat();			
	},
	endGame: function() {
		this.s_game.pause();
		this.duration = 0;
		this.btn.innerHTML = 'Start Game';
	},	
	gameBeat: function() {
		if(this.duration>0) {
			for(var i=0;i<this.pikas.length;i++) {			
				this.pikas[i].setPikaAction(this.getActionParams());
			}		
			var _this = this;
			setTimeout(function(){ 
				_this.gameBeat();
			},2500);
		}
		else {			
			this.endGame();
		}
	},
	showGamePoints: function() {
		this.points.innerHTML = this.gamePoints;		
	},

	// manage pika helpers	
	
	getRandomInt: function(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	},
	
	calcPikasPos: function() {
		var pikaPos = [];
		var haveoverlaps; // flag
		var newPos; // newly created position
		for(var i=0;i<this.totalPikas;i++) { 
			//console.log('------------- setting pika #',i);			
			haveoverlaps = true;  
			while(haveoverlaps) { 
				newPos = {
					x:this.getRandomInt(20,680),
					y:this.getRandomInt(80,390)
				}			
				//console.log('------> testing ',newPos,'?');				
				haveoverlaps = false;
				for (var oi=0;oi<pikaPos.length && !haveoverlaps;oi++) {
					//console.log('checking newPos ', oi , '=',pikaPos[oi]);
					//console.log('x diff: ',Math.abs(pikaPos[oi].x-newPos.x),' y diff:',Math.abs(pikaPos[oi].y-newPos.y));					
					haveoverlaps = (Math.abs(pikaPos[oi].x-newPos.x)<105) && (Math.abs(pikaPos[oi].y-newPos.y)<105);
					//console.log('haveoverlaps=',haveoverlaps);
				}
			}
			pikaPos[i] = newPos;  
			//console.log('setting: now: ',this.pikaPos);
		}	
		return pikaPos;		
		//console.log('final: ',this.pikaPos);
	},
	
	getActionParams: function() {
		var r = this.getRandomInt(1,3);
		return {
			't' : 's'+r,
			'p' : r*2			
		}
	}	
	
}

