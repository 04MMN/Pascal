<?php
$nom=$_POST['nm'];
$prenom=$_POST['pr'];
$age=$_POST['age'];
$genre=$_POST['g'];
$adresse=$_POST['ad'];
$groupe_s=$_POST['gs'];
$rhesus=$_POST['rh'];

include('connection_base.php');

$tableau=[

"Prenom"=>$prenom,
"Nom"=>$nom,
"age"=>$age,
"genre"=>$genre,
"Adresse"=>$adresse,
"Groupe Sanguin"=>$groupe_s,
"Rhesus"=>$rhesus

];


?>
<table >
    <thead>
        <tr>
            <th >Recapitulatif</th>
        </tr>
    </thead>
    <tbody>
        <?php foreach ($tableau as $cle => $valeur): ?>
            <tr>
                <td ><strong><?php echo $cle; ?></strong></td>
                <td ><?php echo $valeur; ?></td>
            </tr>
        <?php endforeach; ?>
    </tbody>
</table>

<br>

<div>
    <form action="connection_base.php" method="POST" >
        <?php 
        
        foreach ($tableau as $cle => $valeur) {
            
        }
        ?>
        <button type="submit">OK</button>
    </form>

    <a href="formulaire.html">
        <button type="button" >Annuler</button>
    </a>
    <a href="liste.php">
        <button type="button" style="background-color: blue; color: white;">Lister personnes</button>
    </a>
</div>
