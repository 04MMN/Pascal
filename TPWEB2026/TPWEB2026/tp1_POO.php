<html>
<head>
<title> Fichier d’appel </title>
</head>
<body>
<marquee behavior="alternate">TP PHP Programmation Orientée Objets</marquee>
<?php
class client {
var $nom; var $ville; var $naiss;

function age() {
$jour = getdate(); $an=$jour["year"]; $age = $an - $this->naiss;
echo "Elle a $age ans cette annee <br />" ;}}

$client1 = new client() ;

$client1 -> nom = "Rose DASYLVA" ; $client1-> naiss = "1980" ; $client1->ville = "Mbadakhoune" ;

echo "le nom du client1 est ", $client1->nom, "<br />" ;
echo "la ville de la cliente est ", $client1-> ville, "<br />" ;
echo "la cliente est nee en ", $client1->naiss, "<br />" ;

$client1->age() ;
?>

</body>
</html>
