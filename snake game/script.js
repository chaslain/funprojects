var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

canvas.width = 640;
canvas.height = 640;
var player = new block(320,320,"#FFF");
player.tailLength = 4;
player.direction = 0;
player.keymove = false;
var x = parseInt((Math.random()*20))*32;
var y = parseInt((Math.random()*20))*32;
var apple = new block(x,y,"#FF0000");
var score = 0;
player.calc = function(){
	//move the player
	if (!player.keymove)
	{
		switch(player.direction){
			case 1:
				player.x-=32;
				break;
			case 2:
				player.y-=32;
				break;
			case 3:
				player.x+=32;
				break;
			case 4:
				player.y+=32;
				break;
			default:
				return;
		}
	}
	else
		player.keymove=false;
	checkCollision();
		//player spawns new tail
	tail.push(new block(player.x,player.y,"#FFF"));
	if (tail.length > player.tailLength)
		tail.shift();
	
}
function checkCollision(){

	//player hits wall, player is dead.
	if (player.x < 0 || player.x == 640 || player.y < 0 || player.y == 640)
	{
		restart();
	}
	//player hits tail, player is dead.
	for (var i = 0; i < tail.length; i++)
	{
		var tail_ = tail[i];
		if (tail_.x == player.x && tail_.y == player.y)
		{
			restart();
		}
	}
	//player collects apple
	if (player.x == apple.x && player.y == apple.y)
	{
		player.tailLength++;
		var needs_place = true;
		while (needs_place)
		{
			var x = parseInt((Math.random()*20))*32;
			var y = parseInt((Math.random()*20))*32;
			var col = false;
			for (var i = 0; i < tail.length; i++)
			{
				if (tail[i].x == x && tail[i].y == y)
					col = true;;
			}
			if (!col)
				needs_place = false;
		}
		score++;
		document.getElementById("score").innerHTML = score;
		apple = new block(x,y,"#FF0000");
	}
}



document.addEventListener("keydown",key);
var tail = [];
function key(e){
	if (player.keymove)
		tail.push(new block(player.x,player.y,"#FFF"));
	console.log(player);
	switch(e.keyCode)
	{
		case 37:
			if (player.direction != 3 && player.direction != 1)
			{
				player.direction=1;//left
				player.x-=32;
				player.keymove = true;
				checkCollision();
			}
			break;
		case 38:
			if (player.direction != 4 && player.direction != 2)
			{
				player.direction=2;//up
				player.y-=32;
				player.keymove = true;
				checkCollision();
			}
			break;
		case 39:
			if (player.direction != 1 && player.direction != 3)
			{
				player.direction=3;//right
				player.x+=32;
				player.keymove = true;
				checkCollision();
			}
			break;
		case 40:
			if (player.direction != 2 && player.direction != 4)
			{
				player.direction=4;//down
				player.y+=32;
				player.keymove = true;
				checkCollision();
			}
	}
}

setInterval(interval,100);
function interval(){
	
	//calc phase
	player.calc();
	//draw phase
	ctx.clearRect(0,0,640,640);
	ctx.fillStyle="#000000";
	ctx.fillRect(0,0,640,640);
	player.draw();
	for (var i = 0; i < tail.length; i++)
	{
		tail[i].draw();
	}
	apple.draw();
}
function block(x,y,color){
	this.x = x;
	this.y = y;
	this.color = color;
	this.draw = function(){
		ctx.fillStyle=color;
		ctx.fillRect(this.x,this.y,32,32);
	}
}
function restart(){
	player.x = 320;
	player.y = 320;
	tail = [];
	player.direction=0;
	player.tailLength = 4;
	var x = parseInt(Math.random()*19)*32;
	var y = parseInt(Math.random()*19)*32;
	apple = new block(x,y,"#FF0000");
	score = 0;
}