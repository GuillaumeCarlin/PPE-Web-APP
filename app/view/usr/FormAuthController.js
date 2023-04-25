Ext.define('Thot.view.usr.FormAuthController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.usr-formauth',
    /**
     * @author : edblv
     * date   : 21/06/16 09:11
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * AfterRender
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    onAfterRender: function () {
        var oMe = this;
        var oForm = this.getView();
        var oWin = oForm.up('window');
        oWin.returnValue = {
            login: '',
            prenom: '',
            nom: ''
        };
        oForm.validKey();
    },
    /**
     * @author : edblv
     * date   : 21/06/16 09:12
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Clic sur 'Valider'
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    onValidClick: function () {
        var oMe = this;
        var oForm = this.getView();
        var oWin = oForm.up('window');
        var oLogin = oForm.query('#login')[0];
        var oPasswd = oForm.query('#password')[0];

        if (oPasswd.getValue() == '') {
            return;
        }

        Ext.Ajax.request({
            url: 'server/usr/Users.php',
            params: {
                appName: Thot.app.appConfig.name,
                action: 'login',
                login: oLogin.getValue(),
                password: oPasswd.getValue()
            },
            success: function () {},
            failure: function () {},
            callback: function (opt, success, oResponse) {
                var oBack = Ext.decode(oResponse.responseText);

                if (oBack.success) {
                    oWin.returnValue = {
                        login: oLogin.getValue(),
                        prenom: oBack.liste[0].givenname,
                        nom: oBack.liste[0].sn
                    };
                    oMe.onCancelClick();
                } else {
                    var oMsg = Thot.app.MessageInfo();
                    oMsg.init(5000);
                    oMsg.msg('error', 'Login ou mot de passe invalide');
                }
            }
        });
    },
    /**
     * @author : edblv
     * date   : 21/06/16 09:12
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Clic sur 'Annuler'
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    onCancelClick: function () {
        var oMe = this;
        var oForm = this.getView();
        var oWin = oForm.up('window');
        oWin.close();

    }
});