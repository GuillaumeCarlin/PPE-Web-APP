Ext.define('Thot.overrides.Date', {
    override: 'Ext.Date',
    onlyDate: function (oDate) {
        var oNewDate = new Date(oDate.getFullYear(), oDate.getMonth(), oDate.getDate());
        var bEndDay = false;

        if (arguments.length > 1) {
            bEndDay = arguments[1];
        }

        if (bEndDay) {
            oNewDate.setHours(23);
            oNewDate.setMinutes(59);
            oNewDate.setSeconds(59);
        }

        return oNewDate;
    },
    millisecToTime: function (iMillisec) {
        var iSeconds = iMillisec / 1000;
        var iHours = Math.floor(iSeconds / 3600);
        var iMinutes = Math.floor((iSeconds - (iHours * 3600)) / 60);
        iSeconds = Math.floor(iSeconds - (iHours * 3600) - (iMinutes * 60));
        var oReturn = {
            hour: iHours,
            minute: iMinutes,
            second: iSeconds,
            time: '00:00:00',
            timeobj: new Date()
        };

        if (iHours < 10) {
            iHours = "0" + iHours;
        }
        if (iMinutes < 10) {
            iMinutes = "0" + iMinutes;
        }
        if (iSeconds < 10) {
            iSeconds = "0" + iSeconds;
        }
        oReturn.time = iHours + ':' + iMinutes + ':' + iSeconds;
        oReturn.timeobj.setHours(iHours);
        oReturn.timeobj.setMinutes(iMinutes);
        oReturn.timeobj.setSeconds(iSeconds);
        return oReturn;
    },
    /**
     * @author : edblv
     * date   : 17/11/16 10:15
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Convertie une heure en nbre de secondes
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    timeToSec: function (oTime) {
        var iHour = oTime.getHours() * 3600;
        var iMin = oTime.getMinutes() * 60;
        var iSec = oTime.getSeconds();
        return iHour + iMin + iSec;
    },

    /**
     * @author : edblv
     * date   : 10/10/14 13:25
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Arrondie une heure a n minutes près
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     * @argument {date} oDate Objet Date/heure
     * @argument {int} iRound Arrondie souhaité
     */
    roundMin: function (oDate, iRound) {
        var oReturnDate = Ext.Date.clearTime(oDate, true);
        var iMinutes = oDate.getMinutes();
        var iRoundMin = Math.round(iMinutes / iRound);

        oReturnDate.setHours(oDate.getHours());
        return Ext.Date.add(oReturnDate, Ext.Date.MINUTE, (iRoundMin * iRound));
    },
    /**
     * @author : edblv
     * date   : 16/10/14 10:37
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Retourne une heure au format HH:MM d'après un nombre de minutes
     *
     * @argument {int} iMin Nombre de minutes
     * @version 16/10/14 edblv RND#ND-ND.ND Création
     */
    minToTime: function (iMin) {
        var iHour = 0;
        var sHourMin = '';
        iHour = Math.floor(iMin / 60);
        iMin = iMin - (iHour * 60);

        if (iHour < 10) {
            sHourMin = '0';
        }

        sHourMin += iHour.toString() + ":";

        if (iMin < 10) {
            sHourMin += '0';
        }

        sHourMin += iMin.toString();
        return sHourMin;
    },
    /**
     * @author : edblv
     * @Description interprète une date par rapport à la date courante
     * - affiche uniquement l'heure si la date est celle du jour courant
     * - affiche [hier hh:mm] si la date est la veille de la date courante
     * - affiche [JJ hh:mm] si la date est antèrieure à la veille de la date courante
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     * @version 1.0.1 Hervé VALOT, correction du mode de calcul du nombre de jours entre deux dates
     * - javascript fait un calcul qui s'appuie sur le nombre de millisecondes entre deus dates/heure
     * le résultat est donc faussé si l'heure courante est inférieure à la partie heure de la date à vérifier
     * dans ce cas il manque un jour et le système renvoie par exemple hier si l'événement a eu lieu 2 jours avant
     * mais avec une heure supérieure à l'heure courante.
     * 
     */
    explicitDate: function (oDate) {
        const oNow = new Date();
        var sDate = '',
            bWithTime = true,
            iDayDiff = 0;

        // calcul du nombre de jours entre la date fournie en paramètre et l'instant courant
        // utilisation de toDateString() pour passer la partie horaire à 0
        // toDateString renvoie une chaine de texte, on la transforme en type date par new Date(x)
        // pour pouvoir ensuite faire la soustraction des deux dates et obtenir le nombre de jours
        // on divise le résultat par (24 * 60 * 60 * 1000) pour obtenir le nombre de jours
        // le calcul étant réalisé en millisecondes il renvoie des millisecondes soit 86 400 000 ms pour 1 jour
        iDayDiff = (new Date(oNow.toDateString()) - new Date(oDate.toDateString())) / (1000 * 60 * 60 * 24);

        if (arguments.length > 1) {
            bWithTime = arguments[1];
        }

        if (iDayDiff < 1) {
            if (oDate.getDate() !== oNow.getDate()) {
                iDayDiff = 1;
            }
        }

        switch (iDayDiff) {
            case 0:
                //---- Aujourd'hui
                sDate = Ext.Date.format(oDate, 'H:i');
                break;

            case 1:
                //---- Hier
                sDate = 'Hier ' + Ext.Date.format(oDate, 'H:i');
                break;

            default:
                sDate = this.frenchDay(oDate, true) + (bWithTime ? Ext.Date.format(oDate, ' d/m/Y H:i') : Ext.Date.format(oDate, ' d/m/Y'));
                break;
        }

        return sDate;
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
    frenchDay: function (oDate) {
        var aFrDays = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
        var sDay = aFrDays[oDate.getDay()];

        if (arguments.length > 1) {
            if (arguments[1]) {
                sDay = sDay.substr(0, 3);
            }
        }
        return sDay;
    },
    /**
     * @author : edblv
     * date   : 30/03/15 14:51
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Retourne la date correspondant au lundi de la semaine d'une date
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    monday: function (oDate) {
        var oMonday = oDate;

        if (oMonday.getDay() > 1) {
            oMonday = this.add(oMonday, this.DAY, 1 - (oMonday.getDay()));
        }

        return oMonday;
    },
    /**
     * @author : edblv
     * date   : 30/03/15 14:52
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Retourne la date correspondant au dimanche d'une date
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    sunday: function (oDate) {
        var oMonday = this.monday(oDate);

        return this.add(oMonday, this.DAY, 6);
    },
    /**
     * @author : edblv
     * date   : 18/10/16 13:24
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Convertie un objet date en chaîne SQL
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    toSql: function (oDate) {
        return Ext.Date.format(oDate, 'Ymd H:i:s');
    }
});