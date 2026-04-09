<?php
$lg=$_GET['log'];
$pd=$_GET['pwd'];
$date=getdate();
include("appelPHP3.html");
?>
<html>
<body>
<br/>
<table align=center>
<tr><td><b> Information sur la requête </b></td></tr>
<tr><td> <?php echo("Prix HTVA : ".$lg); ?> </td></tr>
<tr><td> <?php echo("TVA : ".$pd."%"); ?></td></tr>
<tr><td><?php echo("Prix TTC : ".($lg+(($lg*$pd)/100))); ?> </td></tr>
<tr><td> <b> Information sur l'hôte </b></td></tr>
<tr><td><?php echo($_SERVER["HTTP_HOST"]." : ");echo($_SERVER["REMOTE_ADDR"]." ".gethostbyname($_SERVER["REMOTE_ADDR"])); ?> </td></tr>
<tr><td> <b> Information sur le serveur </b></td></tr>
<tr><td><?php echo("Protocole : ".$_SERVER["SERVER_PROTOCOL"]); ?> </td></tr>
<tr><td><?php echo("Heure : ".$date["hours"]." : ".$date["minutes"]." : ".$date["seconds"]); ?> </td></tr>
<tr><td><?php echo("Date : ".$date["wday"]." : ".$date["mon"]." : ".$date["year"]); ?> </td></tr>
</table>
</body>
</html>