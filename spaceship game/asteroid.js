function Asteroid(x,y,width){
	this.x = x;
	this.y = y;
	this.width = width;
	this.xspeed = 5*Math.random();
	this.yspeed = 5*Math.random();
	var numberOfSides = Math.random()*5+10;
	this.numberOfSides = numberOfSides;
	this.rot = 0;
	this.rotspeed = (Math.random()-0.5)/4;
	this.dead = false;
	this.side = 0;
	var points = [[]];

	var degreesPerSide = (Math.PI*2)/numberOfSides;
	for (var i = 0; i < numberOfSides; i++)
	{
		points[i]=[];
		var f = (Math.random()*(width/2)) +(width/2);
		var xcan = f*Math.cos(i*degreesPerSide);
		var ycan = f*Math.sin(i*degreesPerSide);
		points[i][0]=xcan;
		points[i][1]=ycan;

		
	
	}
	this.points = points;
	this.draw = function(){
		switch(this.side){
			case 0:
				if (this.x > canvas.width)
					this.dead=true;
				break;
			case 1:
				if (this.y > canvas.height)
					this.dead=true;
				break;
			case 2:
				if (this.x < 0)
					this.dead=true;
				break;
			case 3:
				if (this.y < 0)
					this.dead=true;
				break;
		}
		this.rot+=this.rotspeed;
		this.x+=this.xspeed;
		this.y+=this.yspeed;
		var x = this.x, y = this.y, rot = this.rot;
		ctx.save();
		ctx.strokeStyle="#FFFFFF";
		ctx.translate(x,y);
		ctx.rotate(rot);
		ctx.translate(-x,-y);
		ctx.beginPath();
		ctx.moveTo(x+points[0][0],y+points[0][1]);
		for (var i = 1; i < points.length; i++)
		{
			ctx.lineTo(x+points[i][0],y+points[i][1]);
		}
		ctx.lineTo(x+points[0][0],y+points[0][1]);
		ctx.fillStyle = "#FFFFFF";
		ctx.fill();
		ctx.stroke();
		ctx.restore();
		
		
	}
}