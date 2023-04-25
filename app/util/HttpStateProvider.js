Ext.define('Thot.util.HttpStateProvider', {
    extend: 'Ext.state.Provider',
    requires: ['Ext.state.Provider', 'Ext.Ajax'],
    alias: 'util.HttpProvider',
    config: {
        //userId: null,
        userLogin: null,
        url: null,
        stateRestoredCallback: null
    },
    constructor: function (config) {
        var me = this,
            callback = me.getStateRestoredCallback();
        //me.state = [];
        //if (!config.userId) {
        if (!config.userLogin) {
            throw 'Thot.util.HttpStateProvider: Missing userLogin';
        }

        if (!config.url) {
            throw 'Thot.util.HttpStateProvider: Missing url';
        }

        this.initConfig(config);

        /*
        var sGridKey ='';

        for (var sForm in config.gridsState) {
            for (var sGrid in config.gridsState[sForm]) {
                sGridKey=sForm+'-'+sGrid;
                //me.state[sGridKey] = Ext.decode(config.gridsState[sForm][sGrid]);
            }
        }
        */
        me.state = config.gridsState;

        if (callback) {
            callback();
        }

        //me.restoreState();
        me.callParent(arguments);
    },
    set: function (name, value) {
        var me = this;

        if (typeof value == 'undefined' || value === null) {
            me.clear(name);
            return;
        }

        me.saveStateForKey(name, value);
        me.callParent(arguments);
    },
    /*
    get: function (name, value) {
        var me = this;
        if (me.state[name]) {
        }
        else {
            value = [];
        }
        me.callParent(name,value);
    },
    */
    // private
    /**
     * @author : edblv
     * date   :
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Charge les status de grid dans la base
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    restoreState: function () {
        var me = this,
            callback = me.getStateRestoredCallback();

        //App.app.log('---- restore state');
        Ext.Ajax.request({
            url: me.getUrl(),
            method: 'GET',
            params: {
                appName: Thot.app.appConfig.name,
                action: 'restorestate',
                //iduser: me.getUserId()
                login: me.getUserLogin()
            },
            success: function (response, options) {
                var oResponse = Ext.decode(response.responseText);
                var sGridKey = '';

                for (var sForm in oResponse.state) {
                    for (var sGrid in oResponse.state[sForm]) {
                        sGridKey = sForm + '-' + sGrid;
                        me.state[sGridKey] = Ext.decode(oResponse.state[sForm][sGrid]);
                    }
                }

                if (callback) {
                    callback();
                }
            },
            failure: function () {
                if (callback) {
                    callback();
                }
            }
        });
    },
    // private
    clear: function (name) {
        var me = this;

        me.clearStateForKey(name);
        me.callParent(arguments);
    },
    // private
    saveStateForKey: function (sKey, aValues) {
        var me = this;
        var aKey = sKey.split('-');
        var oKey = {
            form: aKey[0],
            name: aKey[1]
        };

        Ext.Ajax.request({
            url: me.getUrl(),
            method: 'POST',
            params: {
                appName: Thot.app.appConfig.name,
                action: 'gridsavestate',
                //iduser: me.getUserId(),
                login: me.getUserLogin(),
                gridkey: Ext.encode(oKey),
                value: Ext.encode(aValues) //	me.encodeValue(value)
            },
            failure: function () {}
        });
    },
    // private
    clearStateForKey: function (key) {
        var me = this;

        Ext.Ajax.request({
            url: me.getUrl(),
            method: 'DELETE',
            params: {
                appName: Thot.app.appConfig.name,
                //userId: me.getUserId(),
                login: me.getUserLogin(),
                key: key
            },
            failure: function () {}
        });
    }
});