<?php
error_reporting(0);
$date2=getdate();
$datesaisie2=$date2["mday"]."/".$date2["month"]."/".$date2["year"];
setcookie("datelastvisite", $datesaisie2, time()+3600*365*24); 
session_destroy();
include("index.html");
?>