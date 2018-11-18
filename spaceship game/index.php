<?php

	if(!isset($_COOKIE['name']))
		$name = "NONE_YET_PROVIDED";
	else
		$name = $_COOKIE['name'];
	echo "<script>var name='$name';</script>";
?>
<!doctype html>
<html>
	<head>
		<title>Asteroids</title>
		<meta charset="UTF-8"/>
		<style>
			canvas{
				margin:0; 
				display:block;
				margin:auto;
				position:relative;
			}
			#time{
				font-size:48px;
				position:absolute;
				display:block;
				top:25%;
			}
			#leaders{
				font-size:24px;
				position:absolute;
				display:block;
				top:25%;
				max-width:20%;
				margin:0;
				right:0;
			}
			#list{
				display:block;
				font-size:20px;
				margin:0;
			}
		</style>
		<audio id="swoosh" src="swoosh.mp3"></audio>
	</head>
	<body style="margin:0"> 
	 <canvas id="canvas"></canvas>
	 <div id="time">0:00</div>
	 <div id="leaders">Top Players:<div id="list"></div></div>
	 <script src="animate.js?v=2"></script>
	 <script src="player.js"></script>
	 <script src="asteroid.js"></script>
	 <script src="script.js"></script>
	</body>
</html>