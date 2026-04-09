<html>
<head>
<title> Fichier d’appel </title>
</head>
<body>
<marquee behavior="alternate">TP PHP Programmation Orientee Objets</marquee>
<?php
class ville
{
public $nom;
public $depart;
public function getinfo()
{
$texte="La ville de $this->nom est dans le departement : $this->depart <br />";
return $texte;
}
}
//Création d'objets
$ville1 = new ville();
$ville1->nom="Nantes";
$ville1->depart="Loire Atlantique";
$ville2 = new ville();
$ville2->nom="Lyon";
$ville2->depart="Rhone";
echo $ville1->getinfo();
echo $ville2->getinfo();
?>

</body>
</html>
