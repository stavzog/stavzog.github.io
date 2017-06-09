var dinosaur;
var scl = 20;
var gravity;
var obstacle;
var score = 0;
var booster;
var coins = 0;
var slow;


function setup() {
	createCanvas(600,600);
	dinosaur = new Dinosaur(0,height/2);
	//frameRate(10)
	gravity = createVector(0,0.2)
	obstacle = createVector(280,height/2);
	booster = createVector(floor(random(width-80)),300);
	slow = createVector(floor(random(width-80)),300);
}	

function newLocation() {
	//obstacle = createVector(0,height/2);
	booster = createVector(floor(random(width-80)),300);
	slow = createVector(floor(random(width-80)),300);
}	


function keyPressed() {
	if(key === ' ') {
		setInterval(dinosaur.jump(), 1000);
	} else if(keyCode === SHIFT) {
		var cheater = prompt('Write cheats:');
		switch(cheater) {
			case '0239':
				score += 30;
				break;
			case "0450":
				dinosaur.slowness = 0;
		}
	}
}



function draw() {
	background(51);
	translate(300-dinosaur.pos.x ,300-dinosaur.pos.y)
	stroke(0);
	dinosaur.update();
	dinosaur.show(); 
	dinosaur.applyForce(gravity);
	fill(255,255,102);
	rect(booster.x,booster.y,20,20)
	fill(255);
	rect(slow.x,slow.y,20,20)
	fill(255,0,100);
	stroke(255,0,100);
	rect(obstacle.x,obstacle.y,20,20);
	fill(255,0,100);
	if(dinosaur.hits(obstacle)) {
		dinosaur.xspeed = 0;
	 	dinosaur.goTo(obstacle.x - 22,height/2);
	 	alert('score: ' + score + '\n coins:' + coins)
	 	dinosaur.reload()

	 } else if(dinosaur.hits(booster)) {
		booster.y = height;
		booster.x = width;
		coins++
	} else if(dinosaur.hits(slow)) {
		slow.y = height;
		slow.x = width;
		dinosaur.slowness = 1;
		setTimeout(function() {dinosaur.slowness = 0},3000);
	}

	

}

function Dinosaur(x,y) {
	this.pos = createVector(x,y);
	this.xspeed = 3;
	this.yspeed = 0;
	this.vel = createVector(0,0);
	this.acc = createVector(0,0);
	this.shown = true;
	this.slowness = 0;

	this.update = function() {
		this.pos.x = this.pos.x + this.xspeed - this.slowness ;
		this.pos.y += this.yspeed;
		if(this.pos.x > width-20) {
			this.pos.x = 0
			newLocation();
		}
		score++
		this.pos.y = constrain(this.pos.y,0,height - 20)
		this.vel.add(this.acc);
		this.pos.add(this.vel);
		this.acc.mult(0)
		if(this.pos.y < 250) {
			gravity = createVector(0,0.2);
			
		} else if(this.pos.y > 300) {
			gravity = constrain(gravity,0,height)
			this.xspeed = 3;
			this.pos.y = 300;
		} else if(this.pos.y > 259) {
			this.shown = true;
		} else if(this.pos.y < 320) {
			this.shown = false
		}

	}
	this.show = function() {
		fill(0,255,0);
		rect(this.pos.x,this.pos.y,scl,scl)
	}
	this.applyForce = function(force) {
		this.acc.add(force);
	}
	this.jump = function() {
		if(this.shown === true) {
			this.vel = createVector(0,-3);
			this.xspeed = 2;
		}
	}
	this.hits = function(item) {
		var d = dist(this.pos.x,this.pos.y,item.x,item.y);
		if(d < 20) {
			return true;
		} else if(item === booster) {
			if(d < 20) {

				return true
			}
		} else {
			return false
		}
	}
	this.goTo = function(x,y) {
		this.pos.x = x;
		this.pos.y = y
	}
	this.wait = function() {
		//...
	}
	this.reload = function() {
		location.reload();
	}
}