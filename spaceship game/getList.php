<?php
	$f = fopen("leaders.txt",'r');
	$arr = [];
	while ($line = fgets($f))
	{
		if (trim($line) == "")
			continue;
		$name = substr($line,0,strpos($line,":"));
		if (strpos($name,'('))
		{
			$numeral = substr($name,strpos($name,'(')+1,1);
			$name = str_replace("($numeral)","",$name);
		}
		$time = (int)substr($line,strpos($line,":")+1);
		$m = (int)($time/60);
		$s = $time % 60;
		if ($s < 10)
			$s = "0" . $s;
		$time = $m . ":" . $s;
		$arr[] = $name . " survived " . $time;
	}
	fclose($f);
	echo json_encode($arr);
?>