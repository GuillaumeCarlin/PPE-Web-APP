Ext.define('Thot.store.msg.MessageListS', {
    extend: 'Ext.data.Store',
    model: 'Thot.model.msg.MessageListM',
    alias: 'store.messagelist',
    autoLoad: false,
    proxy: {
        type: 'ajax',
        url: 'server/msg/Message.php?action=LstNotes',
        method: "POST",
        actionMethods: {
            read: 'POST'
        },
        reader: {
            type: 'json',
            rootProperty: 'liste',
            idProperty: 'msg_id',
            totalProperty: 'NbreTotal'
        },
    },
});
