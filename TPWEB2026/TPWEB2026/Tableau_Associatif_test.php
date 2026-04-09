<html>
<head>
<title>Tableau associatifs</title>
</head>
<body>
<h1>Fonction de lecture de tableaux associatifs</h1>
<?php
$personne = array("Jean" => 1980, "Paul" => 1985, "Fatou" => 2002, "Demba" => 1993, "Saly" => 1984, "Marie" => 2005, "Lamine" => 1966);
foreach($personne as $sJJ => $nJJ) { 
echo "La personne ". $sJJ . " est née le " . $nJJ . "<br>"; } 

?>
</body>
</html>