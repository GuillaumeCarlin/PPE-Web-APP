// Ext.define('Thot.overrides.String', {
// 		requires: 'Ext.String'
// 	},
// 	/**
// 	 * @author : edblv
// 	 * date   :
// 	 * @scrum : RND#ND-ND.ND
// 	 *
// 	 * #Description
// 	 * Retourne une la chaine avec la première lettre en majuscule
// 	 *
// 	 * @version JJMMAA edblv RND#ND-ND.ND Création
// 	 */
// 	Ext.String.capitalizeFirstLetter = function (sString) {
// 		var sLower = sString.toLowerCase();
// 		return sLower.substring(0, 1).toUpperCase() + sLower.substring(1);
// 	},
// 	/**
// 	 * @author : edblv
// 	 * date   :
// 	 * @scrum : RND#ND-ND.ND
// 	 *
// 	 * #Description
// 	 * Retourne les {iNum} premiers mots de la chaine
// 	 *
// 	 * @version JJMMAA edblv RND#ND-ND.ND Création
// 	 */
// 	Ext.String.firstWords = function (sString, iNum) {
// 		var aWords = sString.split(' ');
// 		var aNewWords = [];

// 		if (aWords.length > iNum) {
// 			aWords.splice(iNum);
// 		}

// 		return aWords.join(' ');
// 	},
// 	/**
// 	 * @author : edblv
// 	 * date   :
// 	 * @scrum : RND#ND-ND.ND
// 	 *
// 	 * #Description
// 	 *
// 	 *
// 	 * @version JJMMAA edblv RND#ND-ND.ND Création
// 	 */
// 	Ext.String.jocker = function (sString) {
// 		var iJockerPos = sString.indexOf('*');

// 		if (iJockerPos < 0) {
// 			sString = '*' + sString + '*';
// 		}

// 		return sString;
// 	},
// 	/**
// 	 * @author : edblv
// 	 * date   : 16/06/16 11:44
// 	 * @scrum : RND#ND-ND.ND
// 	 *
// 	 * #Description
// 	 * Complète une chaîne à gauche avec un caractère
// 	 *
// 	 * @version JJMMAA edblv RND#ND-ND.ND Création
// 	 * @param {string} sValue La chaîne à compléter
// 	 * @param {string} sPad Le caractère de remplissage
// 	 * @param {int} iLength Le nombre de caractère qu'on souhaite obtenir
// 	 *
// 	 * @example Ext.string.padLeft('65', '0', 4) retournera : '0065'
// 	 * @example Ext.string.padLeft('hhh !', 'o', 10) retournera : 'ooooohhh !'
// 	 */
// 	Ext.String.padLeft = function (sValue, sPad, iLength) {
// 		return (sValue.toString().length < iLength) ? this.padLeft(sPad + sValue, sPad, iLength) : sValue;
// 	},

// 	/**
// 	 * @author : edblv
// 	 * date   : 11/01/18 16:02
// 	 * @scrum : RND#ND-ND.ND
// 	 *
// 	 * #Description
// 	 * Retourne un nombre de seconde à partir d'une chaine qui peut contenir :
// 	 * xxJ HH:MM:SS
// 	 * oub bien HH:MM:SS
// 	 *
// 	 * @version JJMMAA edblv RND#ND-ND.ND Création
// 	 */
// 	Ext.String.toSeconds = function (sString) {
// 		var aDateTime = [];
// 		var iDays = 0;
// 		var sTime = '';
// 		var aTime = [];

// 		if (!sString) {
// 			return 0;
// 		}

// 		sString = sString.trim();
// 		aDateTime = sString.split(' ');

// 		if (aDateTime.length > 1) {
// 			//---- On est dans le cas 'xxJ HH:MM:SS
// 			iDays = parseInt(aDateTime[0].substring(0, aDateTime[0].indexOf("J")))
// 			sTime = aDateTime[1];
// 		} else {
// 			sTime = sString;
// 		}

// 		aTime = sTime.split(':');
// 		return (iDays * 86400) + (aTime[0] * 3600) + (aTime[1] * 60) + aTime[2];
// 	},
// 	/**
// 	 * @author : edblv
// 	 * date   : 16/06/16 11:23
// 	 * @scrum : RND#ND-ND.ND
// 	 *
// 	 * #Description
// 	 * Retourne un objet date à partir d'une chaîne
// 	 *
// 	 * @version JJMMAA edblv RND#ND-ND.ND Création
// 	 */
// 	Ext.String.toDate = function (sString) {
// 		var sDate = '';
// 		var sTime = '';
// 		var aDateTime = [];
// 		var aDate = [];
// 		var aTime = [];
// 		var oDate = new Date();
// 		var iMonth = parseInt(oDate.getMonth(), 10);
// 		iMonth++;
// 		var sMonth = this.padLeft(iMonth, '0', 2);

// 		if (!sString) {
// 			return new Date(aDate[0], aDate[1] - 1, aDate[2], 0, 0, 0);
// 		}

// 		aDateTime = sString.split(' ');

// 		//---- On vérifie qu'il y a bien quelque chose dans la chaîne
// 		//	sinon on renseigne ce qui manque
// 		sDate = (aDateTime.length < 1 ? oDate.getFullYear() + '/' + sMonth + '/' + oDate.getDate() : aDateTime[0]);
// 		sTime = (aDateTime.length < 2 ? this.padLeft(oDate.getHours(), '0', 2) + '/' + this.padLeft(oDate.getMinutes(), '0', 2) + '/' + this.padLeft(oDate.getSeconds(), '0', 2) : aDateTime[1]);

// 		//---- On voit s'il est possible de sortir une date avec ce qu'on a
// 		aDate = sDate.split('/');

// 		if (aDate.length < 3) {
// 			//---- On n'a pas 3 éléments (année, mois, jour)
// 			//	On va essayer avec un autre séparateur
// 			aDate = sDate.split('-');

// 			if (aDate.length < 3) {
// 				//---- Toujours pas
// 				aDate = [
// 					oDate.getFullYear(),
// 					iMonth,
// 					oDate.getDate()
// 				];
// 			}
// 		}

// 		aTime = sTime.split(':');
// 		aDate[0] = parseInt(aDate[0], 10);
// 		aDate[1] = parseInt(aDate[1], 10);
// 		aDate[2] = parseInt(aDate[2], 10);

// 		return new Date(aDate[0], aDate[1] - 1, aDate[2], aTime[0], aTime[1], aTime[2]);
// 	}
// );

Ext.define('Thot.overrides.String', {
    override: 'Ext.String',
    /**
     * @author : edblv
     * date   :
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Retourne une la chaine avec la première lettre en majuscule
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    capitalizeFirstLetter: function (sString) {
        var sLower = sString.toLowerCase();
        return sLower.substring(0, 1).toUpperCase() + sLower.substring(1);
    },
    /**
     * @author : edblv
     * date   :
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Retourne les {iNum} premiers mots de la chaine
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    firstWords: function (sString, iNum) {
        var aWords = sString.split(' ');
        var aNewWords = [];

        if (aWords.length > iNum) {
            aWords.splice(iNum);
        }

        return aWords.join(' ');
    },
    /**
     * @author : edblv
     * date   :
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     *
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    jocker: function (sString) {
        var iJockerPos = sString.indexOf('*');

        if (iJockerPos < 0) {
            sString = '*' + sString + '*';
        }

        return sString;
    },
    /**
     * @author : edblv
     * date   : 16/06/16 11:44
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Complète une chaîne à gauche avec un caractère
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     * @param {string} sValue La chaîne à compléter
     * @param {string} sPad Le caractère de remplissage
     * @param {int} iLength Le nombre de caractère qu'on souhaite obtenir
     *
     * @example Ext.string.padLeft('65', '0', 4) retournera : '0065'
     * @example Ext.string.padLeft('hhh !', 'o', 10) retournera : 'ooooohhh !'
     */
    padLeft: function (sValue, sPad, iLength) {
        return (sValue.toString().length < iLength) ? this.padLeft(sPad + sValue, sPad, iLength) : sValue;
    },

    /**
     * @author : edblv
     * date   : 11/01/18 16:02
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Retourne un nombre de seconde à partir d'une chaine qui peut contenir :
     * xxJ HH:MM:SS
     * oub bien HH:MM:SS
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    toSeconds: function (sString) {
        var aDateTime = [];
        var iDays = 0;
        var sTime = '';
        var aTime = [];

        if (!sString) {
            return 0;
        }

        sString = sString.trim();
        aDateTime = sString.split(' ');

        if (aDateTime.length > 1) {
            //---- On est dans le cas 'xxJ HH:MM:SS
            iDays = parseInt(aDateTime[0].substring(0, aDateTime[0].indexOf("J")))
            sTime = aDateTime[1];
        } else {
            sTime = sString;
        }

        aTime = sTime.split(':');
        return (iDays * 86400) + (aTime[0] * 3600) + (aTime[1] * 60) + aTime[2];
    },
    /**
     * @author : edblv
     * date   : 16/06/16 11:23
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Retourne un objet date à partir d'une chaîne
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    toDate: function (sString) {
        var sDate = '';
        var sTime = '';
        var aDateTime = [];
        var aDate = [];
        var aTime = [];
        var oDate = new Date();
        var iMonth = parseInt(oDate.getMonth(), 10);
        iMonth++;
        var sMonth = this.padLeft(iMonth, '0', 2);

        if (!sString) {
            return new Date(aDate[0], aDate[1] - 1, aDate[2], 0, 0, 0);
        }

        aDateTime = sString.split(' ');

        //---- On vérifie qu'il y a bien quelque chose dans la chaîne
        //	sinon on renseigne ce qui manque
        sDate = (aDateTime.length < 1 ? oDate.getFullYear() + '/' + sMonth + '/' + oDate.getDate() : aDateTime[0]);
        sTime = (aDateTime.length < 2 ? this.padLeft(oDate.getHours(), '0', 2) + '/' + this.padLeft(oDate.getMinutes(), '0', 2) + '/' + this.padLeft(oDate.getSeconds(), '0', 2) : aDateTime[1]);

        //---- On voit s'il est possible de sortir une date avec ce qu'on a
        aDate = sDate.split('/');

        if (aDate.length < 3) {
            //---- On n'a pas 3 éléments (année, mois, jour)
            //	On va essayer avec un autre séparateur
            aDate = sDate.split('-');

            if (aDate.length < 3) {
                //---- Toujours pas
                aDate = [
                    oDate.getFullYear(),
                    iMonth,
                    oDate.getDate()
                ];
            }
        }

        aTime = sTime.split(':');
        aDate[0] = parseInt(aDate[0], 10);
        aDate[1] = parseInt(aDate[1], 10);
        aDate[2] = parseInt(aDate[2], 10);

        return new Date(aDate[0], aDate[1] - 1, aDate[2], aTime[0], aTime[1], aTime[2]);
    }
});