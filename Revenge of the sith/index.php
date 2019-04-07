<!DOCTYPE html>

<html>

<head>
  <title>Hello!</title>
  <style>form{
      display:block;
      text-align:center;
  }
</style>
</head>

<body>

<form action="index.php" method="post">
    Type in a word and click submit- then the program will look over every line in the RotS script, and let you read every one. <br>
    <?php echo (isset($_POST['bug'])) ? "<input name=\"bug\" value=\"" . $_POST['bug'] . "\"/>" : "<input name=\"bug\">";?>
    <input type="submit">
</form>

<?php
   if (isset($_POST["bug"]))
    {
        $input = strtolower($_POST['bug']);
        $bug = "(" . strtolower($input) ."|". strtoupper($input)."|" . strtoupper(substr($input,0,1)) . strtolower(substr($input,1,strlen($input))) .")";
        $book = file_get_contents("search.txt");
        $regex = '/([:\s\' ,"\-A-Za-z]+)\W'.$bug.'\W([:\s\' ,"\-A-Za-z]+)?(\.|\?|!)/';
        //echo $regex;;
        preg_match_all($regex,$book,$lines);
        foreach($lines[0] as $line)
        {
            echo $line ."<br>";
        }
        if (empty($lines[0]))
        {
            echo "Beleive it or not, $input never appears in Revenge of the Sith. How uncivilized.";
        }
    }


?>

</body>
</html>