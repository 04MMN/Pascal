<?php
$nom = $_GET['nom'];
$prenom = $_GET['prenom'];
$address = $_GET['address'];
$ville = $_GET['ville'];
$cp = $_GET['cp'];

$immat1 = $_GET['immat1'];

$couleur1 = $_GET['couleur1'];

//$date_v1 = $_GET['date_v'];

$modele1 = $_GET['modele1'];

$MySql_Host="localhost"; 
$MySql_User="root"; 
$MySql_Passw="Ndao2004"; 
$bdd="exo";


?>
<meta charset="utf-8"><?php

@mysql_connect($MySql_Host, $MySql_User, $MySql_Passw) or die("erreur de connexion au serveur");
@mysql_select_db($bdd) or die("erreur de connexion a la base de donnees"); 

$dater1=getdate();
$datesaisie=$dater1["year"]."/".$dater1["month"]."/".$dater1["mday"];
$query1 = "INSERT into proprietaire values('', '$nom', '$prenom', '$address', '$ville', '$cp')"; 
$result1 = mysql_query($query1); 

$query2 = "SELECT idpers from proprietaire order by idpers desc limit 1"; 
$result2 = mysql_query($query2); 
$row2 = mysql_fetch_row($result2);
$idpersonne=$row2[0];


$query3 = "INSERT into voiture values('$immat1', '$couleur1', '$datesaisie', '$modele1')"; 
$result3 = mysql_query($query3); 


$query4 = "INSERT into possede values('$idpersonne', '$immat1', '$datesaisie')"; 
$result4 = mysql_query($query4);



$query = "SELECT * FROM proprietaire,possede,modele,voiture where proprietaire.idpers=possede.idpers and possede.immat=voiture.immat and voiture.idmodele=modele.idmodele"; 
$result = mysql_query($query); 
// Recuperation des resultats 
while($row = mysql_fetch_row($result)){ 
	 
  echo $row[1]." | ".$row[2]." | ".$row[3]." | ".$row[4]." | ".$row[5]." | ".$row[7]." | ".$row[8]." | ".$row[10]." | ".$row[11]."<br>";           	
           	           }
// Déconnexion de la base de données
 mysql_close();
?>