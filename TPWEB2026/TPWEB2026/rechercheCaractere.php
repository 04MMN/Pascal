<?php
$mystring = $_POST['chaine'];
$findme   = $_POST['trouve'];
$pos = strpos($mystring, $findme);
include("rechercheCaractere.html");

if ($pos === false) {
    echo "La chaine '$findme' ne se trouve pas dans la chaine '$mystring'";
} else {
    echo "La chaine '$findme' a ete trouvee dans la chaine '$mystring'";
?>
<br/>
<?php
    echo " et la premiere occurrence est a la position $pos";
}

//Détails sur la chaine
echo "\n";
?>
<br/>
<?php
echo "Longueur de la chaine ".strlen($mystring);

print_r(
array_count_values(str_split($mystring)) 
); 
?> 