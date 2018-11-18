var canvas = document.getElementById("canvas");
var c = canvas.getContext("2d");

canvas.height=window.innerHeight;
canvas.width=window.innerWidth;
var mousedown = false;
var allCircles = [];
var introduced = 0;
setInterval(interval,16);//60 FPS
var mouse_x=0, mouse_y=0;
var grower = null;
window.addEventListener("resize",adjustCanvasSize);
canvas.addEventListener("mousemove",(e)=>{
	mouse_x = e.pageX;
	mouse_y = e.pageY;
});
canvas.addEventListener("touchmove",(e)=>{

	mouse_x = e.touches[0].pageX;
	mouse_y = e.touches[0].pageY;
	e.preventDefault();
});
canvas.addEventListener("mousedown",mouseDown);
canvas.addEventListener("touchstart",touchDown);
canvas.addEventListener("mouseup",mouseUp);
canvas.addEventListener("mouseleave",mouseUp);
canvas.addEventListener("touchend",mouseUp);

function setGrower(cir){
	grower=cir;
}
function mouseUp(){
	if (grower==null)
		return;

	allCircles.push(new Circle(grower.x,grower.y,grower.width));
	grower.gone=true;
	grower = null;
}
function mouseDown(){
	grower = new Circle(mouse_x,mouse_y,10);
	
}
function touchDown(e){
	mouse_x = e.touches[0].pageX;
	mouse_y = e.touches[0].pageY;
	grower = new Circle(mouse_x,mouse_y,40);
}
function adjustCanvasSize(){
	can.width = window.innerWidth;
	can.height = window.innerHeight;
}



function letmouseup(){
	mousedown = false;
	if (allCircles.length > 0)
		allCircles[growingCircle].mature=true;
}

function interval(){//what happens every frame.

	
	for (var i = 0; i < allCircles.length; i++)
	{
		if (allCircles[i] == null)
			continue;
		if (allCircles[i].dead == true)
			delete allCircles[i];
	}
	c.clearRect(0,0,window.innerWidth,window.innerHeight);
	for (var i = 0; i < allCircles.length; i++)
	{
		if (allCircles[i] != null)
		{
			if (allCircles[i].dead == true)
			{
				var f = 3;
				//delete allCircles[i];
			}
			allCircles[i].update();
		}
	}
	if (grower != null)
	{
		grower.draw();
		grower.inflate();
		grower.x = mouse_x;
		grower.y = mouse_y;
	}
}
function Circle(x,y,width=10){
	this.x = x;
	this.y = y;
	this.width = width;
	this.yvel=0;
	this.xvel=1;
	this.mature = true;
	this.maxVelocity = 10;
	this.dead=false;
	this.id = 0;
	this.inflate=function(){
		this.width+=1;
	}
	this.update=function(){
		this.move();
		this.draw();
		if (this.width < 1)
			this.dead=true;
	}
	this.draw=function(){
		var c = document.getElementById('canvas').getContext('2d');
		c.beginPath();
		c.arc(this.x,this.y,this.width,0,Math.PI*2);
		c.lineWidth = 5;
		c.stroke();
		c.fillStyle = "#FFFFFF";
		c.fill();
	}
	this.move=function(){
		var c = document.getElementById('canvas').getContext('2d');
		if (this.mature)
		{
			this.y+=this.yvel;
			this.x+=this.xvel;
			this.yvel+=0.15;
		}
		else
		{
			this.x = mouse_x;
			this.y = mouse_y;
		}
		if (this.y > window.innerHeight && !this.dead)
		{
			allCircles[this.id]=null;
			this.dead=true;
			var amountOfChildren = (Math.random()*2)+2;
			if (this.width >= 8)
			{
				for (var i = 0; i < amountOfChildren; i++)
				{
					var xvel = (Math.random()-0.5)*10;
					var yvel = (Math.random()*(-20));
					var circ = new Circle(this.x,this.y-this.width/2,this.width/amountOfChildren)
					circ.xvel = xvel;
					circ.yvel = yvel;
					allCircles.push(circ);
				}
				delete this;
			}
		}
		if (this.x > window.innerWidth || this.x < 0)
		{
			this.xvel = -this.xvel;
		}
		
	}
}