/**
 * @author  Hervé Valot
 * @date    20190424
 * @description script de validation des quantités saisies sur les formulaires de fin ou suspension d'activité
 * @version 20190424    HVT, correction du mécanisme (ré-écriture complète)
 *
 */
var oValid = {
    controller: {},
    valid: function (aFields, aArgs) {
        var oMe = this;
        var sAction = aArgs[0]; // contient l'action demandée (stop, suspend, autre...)
        var iTotQtyOP = parseFloat(aFields.totalQty.value, 10) + parseFloat(aFields.qtyPrevOpe.value, 10); // quantité totale opération (somme déjà réalisé + déclaré)
        var bValid = true; // statut de validation, OK par défaut, on ajustera au fil des tests
        var bAnomalie = false, // indique la présence d'anomalies lors de la vérification des quantités
            bBloquant = false, // indique si l'anomalie est bloquante ou pas, utilisé pour sélectionné le mode de retour utilisateur (notification/message)
            sMessage = ''; // message d'anomalie

        // vérification quantités saisies
        if (aFields.totalQty.value == undefined || aFields.totalQty.value == '') {
            // aucune quantité saisie
            sMessage += '- Vous devez saisir des quantités.</br>';
            bAnomalie = true; // présence d'anomalie
            bBloquant = true; // l'absence de quantités est bloquant
        } else {
            for (let i = 0; i < aFields.quantity.value[0].joined[0].data.items.length; i++) {
                // vérification de chaque quantité fournie par l'opérateur
                // on vérifie si les quantités saisies sont acceptables, certains champs peuvent ne pas tolérer la présence de valeurs 0
                if (parseInt(aFields.quantity.value[0].joined[0].data.items[i].data.qtp_zeroestpermis) == 0 && parseInt(aFields.quantity.value[0].joined[0].data.items[i].data.qty) == 0) {
                    sMessage += '- la valeur des quantités ' + aFields.quantity.value[0].joined[0].data.items[i].data.qtp_libelle + ' doit être vide ou supérieure à 0. </br>';
                    bAnomalie = true; // présence d'anomalie
                    bBloquant = true; // la saisie de valeurs non tolérées dans les quantités est bloquant
                }
                // on vérifie si les valeurs requises sont fournies, la valeur doit répondre false à isNan(parseInt(la valeur))
                if (parseInt(aFields.quantity.value[0].joined[0].data.items[i].data.qtp_valeurrequise) == 1 && isNaN(parseInt(aFields.quantity.value[0].joined[0].data.items[i].data.qty))) {
                    sMessage += '- la valeur des quantités ' + aFields.quantity.value[0].joined[0].data.items[i].data.qtp_libelle + ' doit être renseignée. </br>';
                    bAnomalie = true; // présence d'anomalie
                    bBloquant = true; // la saisie de valeurs non tolérées dans les quantités est bloquant
                }
            }
            if (!bAnomalie) { // si le test précedent ne génère pas d'anomalie on peut continuer
                if (aFields.alt_code.value == 'REG') {
                    // si on est en mode réglage on ne vérifie que les quantités saisies par rapport au max accordé en réglage
                    // vérification de la quantité Réglage déclarée, ne doit pas être supérieure à la quantité réglage maxi allouée (en dur pour l'instant = 10)
                    if (sAction == 'Stop') { // action STOP, on va terminer l'opération
                        sMessage += '- Impossible de terminer une activité sous aléa réglage</br>- Vous devez d\'abord terminer l\'aléa';
                        bAnomalie = true; // présence d'anomalie
                        bBloquant = true; // le dépassement de la quantité de réglage est bloquant
                    } else {
                        if (parseFloat(aFields.totalQty.value, 10) > 10) {
                            sMessage += '- La quantité de réglage est supérieure à la limite accordée (10)</br>';
                            bAnomalie = true; // présence d'anomalie
                            bBloquant = true; // le dépassement de la quantité de réglage est bloquant
                        }
                    }
                } else { // sinon on est en mode production
                    if (sAction !== 'NoQuantityCheck') { // le mode NoQuantityCheck est utilisé par les activités NON PLANIFIEES, sinon on vérifie les quantités
                        // vérification du NPTR MAX
                        if (parseFloat(aFields.totalQty.value, 10) > parseFloat(aFields.expectedMax.value, 10)) {
                            sMessage += '- La quantité de l\'activité est supérieure au NPTR MAXI (Nombre de Pièces Théoriquement Réalisable)</br>';
                            bAnomalie = true; // présence d'anomalie
                            bBloquant = false; // le dépassement du NPTR est non bloquant si confirmé par l'opérateur
                        }
                        // vérification du NPTR MIN
                        if (parseFloat(aFields.totalQty.value, 10) < parseFloat(aFields.expectedMin.value, 10)) {
                            sMessage += '- La quantité de l\'activité est inférieure au NPTR mini  (Nombre de Pièces Théoriquement Réalisable)</br>';
                            bAnomalie = true; // présence d'anomalie
                            bBloquant = false; // la non atteinte du NPTR est non bloquant si confirmé par l'opérateur
                        }
                        // vérification de la quantité totale OP (somme de Qté déjà déclarée + Qté déclarée sur activité), ne doit pas dépasser la quantité OF avec tolérance maxi
                        if (iTotQtyOP > parseFloat(aFields.ofQtyMax.value, 10)) {
                            sMessage += '- La quantité totale (' + iTotQtyOP + ') ne peut pas être supérieure à la quantité attendue MAXI (' + parseFloat(aFields.ofQtyMax.value, 10) + ')</br>';
                            bAnomalie = true; // présence d'anomalie
                            bBloquant = true; // le non respect des quantités de l'of est bloquant
                        }
                        // si l'opérateur a demandé à terminer l'opération il faut vérifier la quantité OF mini
                        if (sAction == 'Stop') { // action STOP, on va terminer l'opération
                            if (iTotQtyOP < parseFloat(aFields.ofQtyMin.value, 10)) {
                                sMessage += '- La quantité totale (' + iTotQtyOP + ') ne peut pas être inférieure à la quantité attendue mini (' + parseFloat(aFields.ofQtyMin.value, 10) + ')</br>';
                                bAnomalie = true; // présence d'anomalie
                                bBloquant = true; // le non respect des quantités de l'of est bloquant
                            }
                        }
                    }
                }
            }
        }
        // réaction suite aux vérifications sur les quantités saisies
        if (bAnomalie) { // il y a des anomalies detéctées
            if (bBloquant) { // les anomalies sont bloquantes, on va afficher une notification
                var oMsg = Thot.app.MessageInfo();
                oMsg.init(5000);
                oMsg.msg('error', sMessage);
                bValid = false;
            } else { // les anomalies peuvent être forcées par l'opérateur, on affiche un message à confirmer
                bValid = false;
                Ext.MessageBox.show({
                    title: 'Alerte',
                    msg: sMessage + '</br> Forcer la validation ?',
                    buttons: Ext.MessageBox.YESNO,
                    buttonText: {
                        yes: 'Oui, valider cette quantité',
                        no: 'Non, corriger'
                    },
                    fn: oMe._valid,
                    caller: oMe
                });
            }
        } else { // tout est ok
            bValid = true;
        }
        oMe.form.fireEvent('validForm', bValid);
        return;

    },
    _valid: function (sValue, sNull) {
        var oObj = arguments[2];
        var oCtr = oObj.caller;

        // validation du message en cas d'écart aux règles mais possible de forcer
        if (sValue == 'yes') {
            oCtr.form.fireEvent('validForm', true);
        }
    }
};