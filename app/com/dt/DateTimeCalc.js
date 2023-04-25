Ext.define('Thot.com.dt.DateTimeCalc', {
    singleton: true,

    /**
     * @author  Hervé Valot
     * @version 20190301
     * @param {*} totalSeconds
     * @description converti des secondes passées en paramètres en hh:mm:ss
     */
    convertSecToHMS: function (totalSeconds) {

        var hours = Math.floor(totalSeconds / 3600);
        var minutes = Math.floor((totalSeconds - (hours * 3600)) / 60);
        var seconds = totalSeconds - (hours * 3600) - (minutes * 60);

        // arrondir les secondes
        seconds = Math.round(seconds * 100) / 100

        var result = (hours < 10 ? "0" + hours : hours);
        result += ":" + (minutes < 10 ? "0" + minutes : minutes);
        result += ":" + (seconds < 10 ? "0" + seconds : seconds);
        return result;
    },
    /**
     * @function    convertHMSToSec
     * @author      Hervé Valot
     * @version     20190301
     * @param {*} hhmmss
     * @description retourne le nombre de secondes à partir d'une heure au format hh:mm:ss
     */
    convertHMSToSec: function (hhmmss) {
        var times = hhmmss.split(":");
        times.reverse();
        var x = times.length,
            y = 0,
            z;
        for (var i = 0; i < x; i++) {
            z = times[i] * Math.pow(60, i);
            y += z;
        }
        return (y);
    }
})