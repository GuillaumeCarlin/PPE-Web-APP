Ext.define('Thot.store.usr.UsersMngtS', {
    extend: 'Ext.data.Store',
    model: 'Thot.model.usr.UsersM',
    alias: 'store.usersmngt',
    autoLoad: false,

    groupField :'sab_libelle',
    proxy: {
        type: 'ajax',
        url: 'server/usr/Users.php?action=LstUsers',
        method: "POST",
        actionMethods: {read: 'POST'},
        reader: {
            type: 'json',
            rootProperty: 'liste',
            idProperty: 'usr_id',
            totalProperty: 'NbreTotal'
        }
    }
});
