<!doctype html>
<html>
	<head>
		<style>
			#score
			{
				text-align:center;
				font-family:Arial;
			}
			#canvas
			{
				display:block;
				margin:auto;
				border:1px solid black;
			}
			#scores{
				position:absolute;
				background:white;
				width:30%;
			}
			.name{
				width:70%;
				display:inline-block;
			}
			.score{
				width:30%;
				text-align:right;
				display:inline-block;
			}
		</style>
	</head>
	<body>			
		<p id="score">0</p>
		<div id="scores"><?php
			$file = fopen("scores.txt",'r');
			while ($line = fgets($file))
			{
				$name = substr($line,0,strpos($line,":"));
				$score = substr($line,strpos($line,":")+1);
				echo "<p><span class=\"name\">Name: $name</span><span class=\"score\">Score: $score</span></p>";
			}
		?></div>
		<canvas id="canvas"></canvas>
		<script src="script.js"></script>
	</body>
</html>