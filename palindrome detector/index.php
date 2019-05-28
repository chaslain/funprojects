<?php
    //is it a palindrome?
    $s = "JesussuseJ";
    $string = preg_replace('/[,\. \-:?\'!]/','',$s);
    if (strlen($string)==1){echo "I guess, technically, TECHNICALLY, that $s is a palindrome.";}
    else{
    //replace special charcters
    $isPalindrome = false;

    for ($i=floor(strlen($string)/2)-1;$i<ceil(strlen($string)/2)+1;$i++)
    {
        $r='/\b';
        for ($j=0; $j<$i; $j++)
        {
            $r.='(\w)';
        }
        $r.='\w?';
        for ($j=$i ;$j>0; $j--)
        {
            $r.="\\$j";
        }
        $r .= '\b/i';
        if (preg_match($r,$string))
        {
            $isPalindrome = true;
        }

    }
   echo ($isPalindrome)?"$s is a palindrome!":"$s is not a palindrome.";}

?>
