<?php
$chif=$_POST['chiffre'];
include("parite.html");

$chif=(integer)$chif;
if(empty($chif))
{
?>
<table align=center>
<tr><td><center><b> <?php echo("Enter un chiffre d'abord"); ?></b></center></td></tr>
 </table>
<?php
}
else
{
 if($chif % 2==0) 
 {
  ?>
   <table align=center>
   <tr><td><center><b> <?php echo($chif." est paire"); ?></b></center></td></tr>
   </table>
   <?php
 }
 else
 {
   ?>
   <table align=center>
   <tr><td><center><b> <?php echo($chif." est impaire"); ?></b></center></td></tr>
   </table>
   <?php
 }
}
?>
