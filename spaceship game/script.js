var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var debugging = false;
canvas.width = window.innerWidth*.6;
canvas.height = window.innerHeight*.9;
var player = new Player(canvas.width/2, canvas.height/2 + 50);
player.draw();
var asteroids = [];
var amountOfAsteroids = 3;
var timer = 0;
var baseWidth = canvas.width/40;
window.addEventListener("keypress",(event)=>{
	if (event.key == 'l')
		debugging = true;
	if (event.key == 'c')
	{
		seeCollisions = !seeCollisions;
	}
	else if (debugging)
	{
		debugging = false;
		requestAnimationFrame(animate);
	}
}); 
newWave();
animate();
canvas.addEventListener("contextmenu",(event)=>{event.preventDefault();});
canvas.addEventListener("mousemove",mouse);
canvas.addEventListener("mousedown",mouseClick);
canvas.addEventListener("mouseup",mouseUnClick);

var mouse_x, mouse_y;
var time = 0;
var x = new XMLHttpRequest();
var sent = false;
var seeCollisions = false;

if (name == "NONE_YET_PROVIDED")
{
	name = prompt("What is your name? (For leaderboard purposes)","Cool Jets McGee");
}
x.open("GET","getList.php",true);
x.responseType = "json";
x.send(true);
x.onload = function(){
	var resp = x.response;
	var list = document.getElementById("list");
	for (var i = 0; i < resp.length; i++)
	{
		list.innerHTML += "<p>" + resp[i] + "</p>";
	}
};
function changeTime()
{
	time++;
	timer = 0;
	var seconds = time % 60;
	var minutes = parseInt(time/60);
	
	if (seconds < 10)
		seconds = "0" + seconds;
	document.getElementById("time").innerHTML = minutes + ":" + seconds;
}

function mouse(event){
	var rect = canvas.getBoundingClientRect();
	mouse_x = event.pageX - rect.left;
	mouse_y = event.pageY - rect.top;
}
function mouseClick(event){
	switch(event.which)
	{
		case 1:
			updown = true;
			break;
		case 3:
			downdown = true;
			break;
	}
	
}
function mouseUnClick(event){
	switch(event.which)
	{
		case 1:
			updown = false;
			break;
		case 3:
			downdown = false;
			break;
	}
}
function newWave(){
	for (var i = 0; i < amountOfAsteroids; i++)
	{	
		var width = baseWidth*Math.random()+25;
		var side = Math.floor(4*Math.random());
		
		var asteroid;
		switch(side){
			case 0://asteroid spawns to the left of the screen
				asteroid = new Asteroid(-width*2,Math.random()*canvas.height,width);
				var xspeed = Math.random()*4 + 2;
				var yspeed = Math.atan2(asteroid.y-canvas.width/2,asteroid.x-Math.random()*canvas.height/2+canvas.height/4);
				yspeed *= 180/Math.PI;
				yspeed = 4*Math.sin(yspeed);
				asteroid.xspeed = xspeed;
				asteroid.yspeed = yspeed;
				asteroid.side=0;
				break;
			case 1://asteroid spawns above
				asteroid = new Asteroid(Math.random()*canvas.width,-width*2,width);
				var xspeed = Math.atan(asteroid.y-Math.random()*canvas.height/2+canvas.height/4,asteroid.x-canvas.width);
				xspeed*=180/Math.PI;
				xspeed = 4*Math.cos(xspeed);
				var yspeed = Math.random()*4+2;
				asteroid.xspeed = xspeed;
				asteroid.yspeed = yspeed;
				asteroid.side=1;
				break;
			case 2://asteroid spawns to the right
				asteroid = new Asteroid(canvas.width+width*2,Math.random()*canvas.height,width);
				var xspeed = -Math.random()*4 - 2;
				var yspeed = Math.atan2(asteroid.y-canvas.width/2,asteroid.x-Math.random()*canvas.height/2+canvas.height/4);
				yspeed *= 180/Math.PI;
				yspeed = 4*Math.sin(yspeed);
				asteroid.xspeed = xspeed;
				asteroid.yspeed = yspeed;
				asteroid.side=2;
				break;
			case 3://asteroid spawns below
				asteroid = new Asteroid(Math.random()*canvas.width,canvas.height+width*2,width);
				var xspeed = Math.atan(asteroid.y-Math.random()*canvas.height/2+canvas.height/4,asteroid.x-canvas.width);
				xspeed*=180/Math.PI;
				xspeed = 4*Math.cos(xspeed);
				var yspeed = -Math.random()*4-2;
				asteroid.xspeed = xspeed;
				asteroid.yspeed = yspeed;
				asteroid.side=3;
				break;
			

		}
		asteroids.push(asteroid);
	}
	amountOfAsteroids*=1.15;
}
function toRad(x)
{
	return x*(Math.PI/180);
}
function toDeg(x)
{
	return x*(180/Math.PI);
}
function distanceToObject(point1,point2)
{
	return Math.sqrt(
		Math.pow(point2.y-point1.y,2)
		+Math.pow(point2.x-point1.x,2)
	);
}
function distanceToCenter(x,y) //x and y must be plugged in relative to the center of the object, such that the center of the object is 0,0
{
	x = Math.pow(x,2);
	y = Math.pow(y,2);
	return Math.sqrt(x+y);
}
function endGame(name,playerTime)
{
	var x = new XMLHttpRequest();
	x.open("POST","newentry.php");
	x.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	if (!seeCollisions)
		x.send("name="+name+"&entry="+playerTime);
	x.onload = ()=>{
			time = 0;
			timer = 0;
			amountOfAsteroids = 3;
			asteroids.splice(0,asteroids.length);
			player.x = canvas.width/2;
			player.y = canvas.width/2;
		setTimeout(()=>{sent=false;},500);
		};
	sent=true;
}
var updown = false, downdown = false;


