function animate(){
	var xx = player.x;
	var yy = player.y+35;
	var deg = Math.atan2((yy-mouse_y),(xx-mouse_x));
	deg*=180;
	deg/=Math.PI;
	deg+=270;
	deg%=360;
	timer++;
	if (timer == 60)
		changeTime();
		
	if (Math.abs(deg-player.rotgoal)>3)
		player.rotgoal = deg;
	
	var rot = player.rot+90, 
	rotraw = player.rot,
	rotgoal = player.rotgoal;

	rotraw %= 360;
	rotgoal %= 360;
	
	if (player.rot < 0) player.rot+=360;
	if (Math.abs(rotraw-rotgoal) > 3)
	{
		if (rotraw < rotgoal)
		{
			if (rotraw < 90 && rotgoal > 270)
				player.rot-=3;
			else
				player.rot+=3;
		}
		else
		{
			if (rotraw > 270 && rotgoal < 90)
				player.rot+=3;
			else
				player.rot-=3;
		}
	}

	player.maxXMomentum = Math.abs(5*Math.cos(rot*Math.PI/180));
	player.maxYMomentum = Math.abs(5*Math.sin(rot*Math.PI/180));
	if (!debugging)
		requestAnimationFrame(animate);
	if (updown)
	{
		if (Math.abs(player.xmomentum) < player.maxXMomentum)
			player.xmomentum-=0.1*Math.cos(rot*Math.PI/180);
		if (Math.abs(player.ymomentum) < player.maxYMomentum)
			player.ymomentum-=0.1*Math.sin(rot*Math.PI/180);
	}

	if (player.maxXMomentum < Math.abs(player.xmomentum))
	{
		if (player.xmomentum > 0)
			player.xmomentum -= 0.02;
		else
			player.xmomentum += 0.02;
	}
	if (player.maxYMomentum < Math.abs(player.ymomentum))
	{
		if (player.ymomentum > 0)
			player.ymomentum -= 0.02;
		else
			player.ymomentum += 0.02;
	}
	if (downdown && !updown)
	{
		if (player.xmomentum > 0)
			player.xmomentum-=0.05;
		if (player.ymomentum > 0)
			player.ymomentum-=0.05;
		if (player.xmomentum < 0)
			player.xmomentum+=0.05;
		if (player.ymomentum < 0)
			player.ymomentum+=0.05;
	}
	else if (!updown)
	{
		if (player.xmomentum > 0)
			player.xmomentum-=0.01;
		if (player.ymomentum > 0)
			player.ymomentum-=0.01;
		if (player.xmomentum < 0)
			player.xmomentum+=0.01;
		if (player.ymomentum < 0)
			player.ymomentum+=0.01;
	}

	if (asteroids.length == 0)
		newWave();

	if (player.x > canvas.width+50)
		endGame(name,time);
	if (player.y > canvas.height+50)
		endGame(name,time);
	if (player.x<-50)
		endGame(name,time);
	if (player.y<-50)
		endGame(name,time);
	
	ctx.clearRect(0,0,canvas.width,canvas.height);
	ctx.fillStyle = "#000";
	ctx.fillRect(0,0,canvas.width,canvas.height);
	
	player.x+=player.xmomentum;
	player.y+=player.ymomentum;

	player.draw();
	for (var i = 0; i < asteroids.length; i++)
	{
		if (asteroids[i] == undefined)
			continue;
		asteroids[i].draw();
		if (asteroids[i].dead)
		{
			asteroids.splice(i,1);
		}
	}

	for (var i = 0; i < player.points.length; i++)//loop through all points on the player's ship.
	{
		var ppx = player.points[i][0]; //x value of given point
		var ppy = player.points[i][1]; //y value of given point
		var angleToCenter = Math.atan2(ppy-0,ppx-0)+toRad(player.rot);//the angle from the point to where the ship is, plus the player's rotation.
		var dist = distanceToCenter(ppx,ppy);//the distance between where the point is and the center of the ship.
		var point_x = player.x + dist*Math.cos(angleToCenter);

		var point_y = player.y + dist*Math.sin(angleToCenter);
		
		if (seeCollisions)
		{
			ctx.fillStyle="red";
			ctx.fillRect(point_x-2.5,point_y-2.5,5,5)
		}
		for (var j = 0; j < asteroids.length; j++)//loop through all asteroids.
		{
			
			var cas = asteroids[j];

			if (distanceToObject({x:player.x,y:player.y},{x:cas.x,y:cas.y}) < cas.width + 80)
			{
				for (var k = 0; k < cas.points.length; k++)//loop through each side of an asteroid.
				{
					
					var point1, point2;
					if (k+1 < cas.points.length)
						var o = k+1;
					else
						var o = 0;
					var x1 = cas.points[k][0];//x relative to the center of the object
					var y1 = cas.points[k][1];//y relative to the center of the object
					
					var angle1 = Math.atan(y1/x1)+(cas.rot);//the first value is what it is normally, the second is the desired rotation.
					var dist = distanceToCenter(x1,y1);//the distance between where it is normally and the center of the asteroid.					
					if (x1 < 0)
						angle1 += Math.PI;

					xx1 = cas.x + dist*Math.cos(angle1);//y'
					yy1 = cas.y + dist*Math.sin(angle1);//x'
					point1 = {x:xx1,y:yy1};
					
					var x2 = cas.points[o][0];
					var y2 = cas.points[o][1];
					
					var angle2 = Math.atan(y2/x2)+(cas.rot);
					var dist2 = distanceToCenter(x2,y2);
					if (x2 < 0)
						angle2 += Math.PI;
					xx2 = cas.x + dist2*Math.cos(angle2);
					yy2 = cas.y + dist2*Math.sin(angle2);

					
					point2 = {x:xx2,y:yy2};
					
					
					var angleToNext = (Math.atan2(point2.y-point1.y,point2.x - point1.x));
					var xmodifier = Math.cos(angleToNext);
					var ymodifier = Math.sin(angleToNext);
					for (var l = 0; l < distanceToObject(point1,point2); l+=10)
					{
						var check_x = point1.x + xmodifier*l;
						var check_y = point1.y + ymodifier*l;
						if (seeCollisions)
						{
							ctx.fillStyle="red";
							ctx.fillRect(check_x-2.5,check_y-2.5,5,5);
						}
					
						if (distanceToObject(
							{x:point_x,y:point_y},
							{x:check_x,y:check_y}
						) < 5)
						{
							if (!sent)
							{
								endGame(name,time);
							}
						}
						else
						{
							document.getElementById("swoosh").play();
						}
					}
				}
			}
		}
	}
}

