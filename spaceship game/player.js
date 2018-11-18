function Player(x,y){
	this.x = x;
	this.y = y;
	this.rot = 0;
	this.rotgoal = 0;
	this.xmomentum = 0;
	this.ymomentum = 0;
	this.maxXMomentum = 0;
	this.maxYMomentum = 0;
	var ratio = canvas.width/800;
	this.points = [
		[0,-25*ratio],
		[30*ratio,15*ratio],
		[25*ratio,25*ratio],
		[20*ratio,25*ratio],
		[20*ratio,15*ratio],
		[0,5*ratio],
		[-20*ratio,15*ratio],
		[-20*ratio,25*ratio],
		[-25*ratio,25*ratio],
		[-30*ratio,15*ratio]
		];
	this.draw = function(){
		var x = this.x,
		 y = this.y, rot=this.rot;
		ctx.save();
		ctx.translate(x,y);
		ctx.rotate((rot*Math.PI)/180);
		ctx.translate(-x,-y);
		ctx.strokeStyle = "#FFFFFF";
		ctx.beginPath();
		ctx.moveTo(x,y+this.points[0][1]);
		for (var i = 1; i < player.points.length; i++)
		{
			ctx.lineTo(x+player.points[i][0],y+player.points[i][1]);
		}
		ctx.lineTo(x,y+this.points[0][1]);
		ctx.stroke();
		ctx.restore();
	}
}