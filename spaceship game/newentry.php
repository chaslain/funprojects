<?php
	$file = fopen('leaders.txt','r');
	$newName = $_POST['name'];
	$newEntry = $_POST['entry'];
	setcookie('name',$newName);

	$array = [];
	while ($line = fgets($file))
	{
		$line = trim($line);
		$name = substr($line,0,strpos($line,":"));
		$time = substr($line,strpos($line,":")+1);
		$array[$name]=$time;

	}
	fclose($file);
	if (!isset($array[$newName]))
		$array[$newName]=$newEntry;
	else
	{
		$added = false;
		$i = 1;
		while ($added == false)
		{
			if (!isset($array[$newName . "($i)"]))
			{
				$array[$newName . "($i)"] = $newEntry;
				$added = true;
			}
			$i++;
		}
	}
	arsort($array);
	if (sizeof($array) > 5)
		array_splice($array,6);
	$file = fopen("leaders.txt",'w');
	foreach ($array as $key=>$val)
	{
		$line = $key . ":" . $val . "\n";
		if (trim($line) != "")
		fwrite($file,$line);
	}
	fclose($file);

?>