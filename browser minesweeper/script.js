const gridWidth = 17;
const totalMines = 40;



const blockWidth = 64;

var hasMines = false;
var lost = false;
class block{
	constructor(x,y){
		this.x = x;
		this.y = y;
		this.isMine = false;
		this.adjacentMines = 0;
		this.covered = true;
		this.flagged = false;
		this.isBlown = false;
	}
	isThisAMine(){
		return this.isMine;
	}
	calculateAdjacentMines(){
		var count = 0;
		if (this.scan(-1,-1))
			count++;
		if (this.scan(0,-1))
			count++;
		if (this.scan(1,-1))
			count++;
		if (this.scan(1,0))
			count++;
		if (this.scan(1,1))
			count++;
		if (this.scan(0,1))
			count++;
		if (this.scan(-1,1))
			count++;
		if (this.scan(-1,0))
			count++;
		this.adjacentMines = count;
	}
	scan(xx,yy){
		
		var x = this.x/blockWidth;
		var y = this.y/blockWidth;
		
		var xxx = xx+x;
		var yyy = yy+y;
		
		if (allSquares[yyy] != undefined)
		{
			
			if (allSquares[yyy][xxx] != undefined)
			{
				if (allSquares[yyy][xxx].isMine)
					return true;
			}
		}
		return false;
	}
	uncoverAdjacent(){
		var x = this.x/blockWidth;
		var y = this.y/blockWidth;
		for (var i = -1; i < 2; i++)
		{
			for (var j = -1; j < 2; j++)
			{
				if (allSquares[y+i] != undefined)
				{
					if (allSquares[y+i][x+j])
					{
						if (allSquares[y+i][x+j].covered==true)
						{
							allSquares[y+i][x+j].covered=false;
							if (allSquares[y+i][x+j].adjacentMines == 0)
								allSquares[y+i][x+j].uncoverAdjacent();
						}
					}
				}
			}
		}
	}
	draw(){
		var x = this.x; var y = this.y;

		c.strokeStyle="black";
		c.strokeRect(x,y,blockWidth,blockWidth);
		
		c.fillStyle="#808080";

		if (!this.covered)
		{
			if (this.isMine)
			{
				if (this.isBlown)
				{
					c.fillStyle="red";
					c.fillRect(this.x+1,this.y+1,blockWidth-1,blockWidth-1);
				}
				if (!this.flagged)
				{
					//start drawing mine sprite
					c.fillStyle="#1a1a1a";
					c.beginPath();
					c.arc(this.x+(blockWidth/2),this.y+(blockWidth/2),(blockWidth*0.15),0,2*Math.PI);
					c.closePath();
					c.fill();
					c.fillRect(this.x+(blockWidth*0.25),this.y+(blockWidth*0.47),blockWidth*0.5,blockWidth*0.06);
					c.fillRect(this.x+(blockWidth*0.47),this.y+(blockWidth*0.25),blockWidth*0.06,blockWidth*0.5);
					//finish drawing mine sprite
				}
			}
			else
			{
				
				c.fillStyle="#808080";			
				c.fillRect(x+1,y+1,blockWidth-1,blockWidth-1);
				var fontsize = Math.floor(blockWidth * 0.48);
				c.font = fontsize + "px Impact";
				
				switch(this.adjacentMines)
				{
					case 1:
						c.fillStyle="blue";
						break;
					case 2:
						c.fillStyle="green";
						break;
					case 3:
						c.fillStyle="#AB0000";
						break;
					case 4:
						c.fillStyle="navy";
						break;
					case 5:
						c.fillStyle="#992a00";
						break;
					default:
						c.fillStyle="white";
						break;
				}
				if (this.adjacentMines > 0)
					c.fillText(this.adjacentMines,this.x+(blockWidth*0.39),this.y+(blockWidth*.65));
			}
		}
		else
		{
			
			c.fillStyle="#CFCFCF";
			c.fillRect(x+1,y+1,blockWidth-1,blockWidth-1);
			if (this.flagged)
			{
				//begin drawing flag//
				c.fillStyle="black";
				c.fillRect(this.x+(blockWidth*0.468),this.y+(blockWidth*0.312),(blockWidth*0.0625),(blockWidth*0.531));
				c.strokeStyle = "black";
				c.beginPath();
				c.moveTo(this.x+(blockWidth*0.531),this.y+(blockWidth*0.3125));
				c.lineTo(this.x+(blockWidth*0.9375),this.y+(blockWidth*0.46875));
				c.lineTo(this.x+(blockWidth*0.531),this.y+(blockWidth*0.625));
				c.fillStyle="blue";
				c.closePath();
				c.fill();
			}
		}
		
	}
	
}
function addMines(x,y){
	if (!hasMines)
	{
		hasMines = true;
		var mines = 0;
		while (mines<totalMines)
		{
			var left = Math.floor(Math.random()*gridWidth);
			var up = Math.floor(Math.random()*gridWidth);
			console.log(mines);
			if (allSquares[up][left].isMine==false)
			{
				if (left != x && up != y)
				{
					mines++;
					allSquares[up][left].isMine=true;
				}
			}
		}
		for (var i = 0; i < gridWidth*gridWidth; i++)
		{
			var n = numToCoord(i);
			allSquares[n.y][n.x].calculateAdjacentMines();
		}
	}
}
function checkWin(){
	var amountCovered = 0;
	for (var i = 0; i < gridWidth; i++)//y
	{
		for (var j = 0; j < gridWidth; j++)//x
		{
			if (allSquares[i][j].covered)
			{
				amountCovered++;
			}
		}
	}

	if (amountCovered == totalMines)
	{
		alert("you did a good job you mother heffer. refresh the page to try again");
	}
		
	
}
function numToCoord(z)
{
	var x = z % gridWidth;
	var y = Math.floor(z/gridWidth);
	return {x:x,y:y};
}
function updateFrame(){
	c.clearRect(0,0,c.width,c.height);
	for (var i = 0; i < gridWidth; i++)
	{
		for (var j = 0; j < gridWidth; j++)
		{
			allSquares[i][j].draw();
		}
	}
}
var s = document.getElementById("c");
s.addEventListener("click",(e)=>{
	if (!lost){
		
		var cc = s.getBoundingClientRect();
		var x = e.clientX - cc.left;
		var y = e.clientY - cc.top;
		x = Math.floor(x / blockWidth);
		y = Math.floor(y / blockWidth);
		allSquares[y][x].covered=false;
		allSquares[y][x].flagged=false;
		addMines(x,y);
		if (allSquares[y][x].adjacentMines == 0)
			allSquares[y][x].uncoverAdjacent();
		if (allSquares[y][x].isMine){
			lost = true;
			allSquares[y][x].isBlown=true;
			alert("oof. Here you go: F");
			for (var i = 0; i < gridWidth*gridWidth; i++){
				var z = numToCoord(i);
				allSquares[z.y][z.x].covered=false;
			}
			updateFrame();
		}
		
		updateFrame();
		if (!lost)
			checkWin();
	}
});
s.addEventListener("contextmenu",(e)=>{
	e.preventDefault();
	if (!lost)
	{
		var cc = s.getBoundingClientRect();
		var x = e.clientX - cc.left;
		var y = e.clientY - cc.top;
		x = Math.floor(x / blockWidth);
		y = Math.floor(y / blockWidth);
		allSquares[y][x].flagged=!allSquares[y][x].flagged;
		updateFrame();
	}
});
var c = s.getContext("2d");

s.width = blockWidth*gridWidth;
s.height = blockWidth*gridWidth;
allSquares = [];
for (var i = 0; i < gridWidth; i++)
{
	var row = [];
	for (var j = 0; j < gridWidth; j++)
	{
		row[j] = new block(j*blockWidth,i*blockWidth);
	}
	allSquares.push(row);
}

updateFrame();