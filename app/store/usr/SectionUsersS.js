Ext.define('Thot.store.usr.SectionUsersS', {
    extend: 'Ext.data.Store',
    model: 'Thot.model.usr.UsersM',
    alias: 'store.sectionusers',
    autoLoad: false,
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
