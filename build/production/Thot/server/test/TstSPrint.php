<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
<meta http-equiv="content-type" content="text/html; charset=utf-8">
<meta name="generator" content="PSPad editor, www.pspad.com">
<title></title>
</head>
<body>
	<table>
		<tr>
			<td>SERVER_NAME</td>
			<td><?php echo $_SERVER['SERVER_NAME'];?></td>
		</tr>
		<tr>
			<td>SERVER_ADDR</td>
			<td><?php echo $_SERVER['SERVER_ADDR'];?></td>
		</tr>
		<tr>
			<td>
				Timestamp actuel<br>
				date du jour<br>
				Timestamp date du jour à minuit
			</td>
			<td>
				<?php echo time();?><br>
				<?php echo date("d")."/".date("m")."/".date("Y");?><br>
				<?php echo mktime(0,0,0);?>
			</td>
		</tr>
		<tr>
			<td>Modulo</td>
			<td>
				<p>1%2 : <?php echo 1%2;?></p>
				<p>2%2 : <?php echo 2%2;?></p>
				<p>3%2 : <?php echo 3%2;?></p>
				<p>4%2 : <?php echo 4%2;?></p>
				<p>5%2 : <?php echo 5%2;?></p>
				<p>17%2 : <?php echo 17%2;?></p>
				<p>18%2 : <?php echo 18%2;?></p>
			</td>
		</tr>
		<tr>
			<td>Sprintf</td>
			<td><?php echo sprintf("%02s","15");?></td>
		</tr>
		<tr>
			<td>Sprintf (remplissage à droite)</td>
			<td><?php echo sprintf("%04s","6");?></td>
		</tr>
		<tr>
			<td>htmlspecialchars_decode</td>
			<td><?php echo htmlspecialchars_decode("MURNE N&#176; 0180285692");?></td>
		</tr>
		<tr>
			<td>html_entity_decode</td>
			<td><?php echo html_entity_decode("MURNE N&#176; 0180285692");?></td>
		</tr>
		<tr>
			<td>htmlentities</td>
			<td>
				<?php
					$Valeur="Développement de l'interface du catalogue en ligne";
					$Valeur=htmlentities(mb_convert_encoding($Valeur, 'UTF-8'),ENT_QUOTES,"UTF-8");
					echo $Valeur;
				?>
			</td>
		</tr>
		<tr>
			<td>mb_convert_encoding</td>
			<td><?php echo mb_convert_encoding("José","UTF-8");?></td>
		</tr>
		<tr>
			<td>printf</td>
			<td>
				<?php
					$format = 'Le %2$s transporte %1$d singes'.
							'<br>Les %1$d singes sont sur le %2$s.';
					$num=2;
					$location="bateau";
					printf($format, $num, $location);
				?>
			</td>
		</tr>
		<tr>
			<td>str_pad</td>
			<td>
				<?php
					echo "--:".str_pad('Toto', 10," ").":--(".strlen(str_pad('Toto', 10," ")).")";
				?>
			</td>
		</tr>
		<tr>
			<td>serialize</td>
			<td style="border-left: 1px dotted navy;">
				<?php
					$aTest=array("DDICONSULT",5251,15,"Validation=ValideOk");
					echo "<p style='border-bottom: 1px dotted black;'>Serialize : ".serialize($aTest)."</p>";
					echo "<p style='border-bottom: 1px dotted black;'>Base64_encode Serialize : ".base64_encode(serialize($aTest))."</p>";
					echo "<p>gzcompress Serialize : ".gzcompress(serialize($aTest))."</p>";
				?>
			</td>
		</tr>
		<tr>
			<td>unserialize</td>
			<td style="border-left: 1px dotted navy; background-color: #FFEFD5;">
				<?php
					//
					//YTo0OntpOjA7czoxMDoiRERJQ09OU1VMVCI7aToxO2k6NTI1MTtpOjI7aToxNTtpOjM7czoxOToiVmFsaWRhdGlvbj1WYWxpZGVPayI7fQ==
					echo "<p style='border-bottom: 1px dotted black;'>unSerialize base64_decode ---: ".base64_decode("eJxTKk5NLkotUQIADIsCyw==")."</p>";
					echo "<p style='border-bottom: 1px dotted black;'>unSerialize base64_decode ---: ".var_dump(unserialize(base64_decode("eJxTKk5NLkotUQIADIsCyw==")))."</p>";
					$sCompresse=gzcompress(serialize($aTest));
					echo "<p>unserialize gzuncompress : ".unserialize(gzuncompress($sCompresse))."</p>";
				?>
			</td>
		</tr>
		<tr>
			<td>base64_encode(gzcompress(json_encode('thotdbuser')))</td>
			<td>
				<?php
					$sMotPasse='thotdbuser';
					$sMPEncode=base64_encode(gzcompress(json_encode($sMotPasse)));
					echo "<p>".$sMPEncode."</p>";
				?>
			</td>
		</tr>
		<tr>
			<td>json_decode(gzuncompress(base64_decode($sMPEncode)), true)</td>
			<td>
				<?php
					$sChaineEncodee="eJxTKk5NLkotUQIADIsCyw==";
					echo "<p>".json_decode(gzuncompress(base64_decode($sChaineEncodee)), true)."</p>";
				?>
			</td>
		</tr>
		<tr>
			<?php
				$aParam=array('idutilisateur'=>'203',
					'widget'=>'detailprojet',
					'param'=>array(
						'idenreg'=>6353
					)
				);
				$sParamEncode=json_encode($aParam);
			?>
			<td>base64_encode(<?php echo $sParamEncode?>)</td>
			<td>
				<?php
					$sParamB64=base64_encode($sParamEncode);
					echo "<p>".$sParamB64."</p>";
				?>
			</td>
		</tr>
		<tr>
			<?php
				$aParam=array(
					'widget'=>array("name"=>'listdevises')
				);
				$sParamEncode=json_encode($aParam);
			?>
			<td>base64_encode(<?php echo $sParamEncode?>)</td>
			<td>
				<?php
					$sParamB64=base64_encode($sParamEncode);
					echo "<p>".$sParamB64."</p>";
				?>
			</td>
		</tr>
		<tr>
			<td>JsOn encode</td>
			<td>
				<?php
					$aTest=array(125487);
					echo "<p>".json_encode(125487)."</p>";
				?>
			</td>
		</tr>
		<tr>
			<td>JsOn decode</td>
			<td>
				<?php
					echo "<p>".var_dump(json_decode(125487,true))."</p>";
				?>
			</td>
		</tr>
		<tr>
			<td>N° de semaine</td>
			<td>01/01/2005
				<?php
					echo date("W",  mktime(0, 0, 0, 1,8,2010));;
				?>
			</td>
		</tr>
	</table>
</body>
</html>
