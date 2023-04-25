Ext.define('Thot.store.usr.UsersProdS', {
    extend: 'Ext.data.Store',
    model: 'Thot.model.usr.UsersM',
    alias: 'store.usersprod',
    autoLoad: false,

    groupField: 'sab_libelle',
    proxy: {
        type: 'ajax',
        url: 'server/usr/Users.php?action=LstUsersForActivity',
        method: "POST",
        actionMethods: {
            read: 'POST'
        },
        reader: {
            type: 'json',
            rootProperty: 'liste',
            idProperty: 'usr_id',
            totalProperty: 'NbreTotal'
        }
    },
    sorters: [{
        property: 'usr_nom',
        direction: 'ASC'
    }]
});