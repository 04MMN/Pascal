<html>
<head>
<title>Fonction de lecture de tableaux multidimensionnels</title>
</head>
<body>
<h1>Fonction de lecture de tableaux multidimensionnels<h1>
<?php
//Définition de la fonction
function tabmulti($tab,$bord)
{
echo "<table border=\"$bord\" width=\"100%\"><tbody>";
foreach($tab as $cle=>$tab2)
{
echo "<tr><th>$cle</th> ";
foreach($tab2 as $ind=>$val)
{
echo "<td>$val </td>";
}
echo "</tr>";
}
echo "</tbody> </table>";
}
//Définition des tableaux
$tab1 =
array("Senegal"=>array("Dakar","Thiès","St Louis","Ziguinchor","Tamba"),"France"=>array("Paris","Lyon","Marseille","Nantes","Lille"),
"Allemagne"=>array("Berlin","Hambourg","Hanovre","Munich","Cologne"),"Espagne"=>array("Madrid","Bilbao","Grenade","Barcelone","Séville"));
//Appel de la fonction
tabmulti($tab1,1);
?>
</body>
</html>