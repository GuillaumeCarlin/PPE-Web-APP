Ext.define('Thot.view.act.alt.CmpActCardModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.act-alt-cmpactcard',

    requires: [
        'Ext.data.Store',
        'Ext.data.proxy.Memory'
    ],

    stores: {
        activitiesS: {
            model: 'Thot.model.act.ActivitieM',
            data: [{
                    act_id: 1,
                    act_date_debut: '2020-04-10 10:10:10',
                    odf_code: 123001,
                    pst_libelle: 'un test',
                    usr_nomprenom_realise: 'John Doe',
                    pdt_code: 'le produit',
                    org_libelle: 'Cth',
                    rsc_image: '_undefined.png'
                },
                {
                    act_id: 2,
                    act_date_debut: '2020-04-10 10:10:10',
                    odf_code: 123002,
                    pst_libelle: 'deux test',
                    usr_nomprenom_realise: 'John Doe',
                    pdt_code: 'le produit 2',
                    org_libelle: 'Plasma-fv',
                    rsc_image: '_undefined.png'
                }, {
                    act_id: 3,
                    act_date_debut: '2020-04-10 10:10:10',
                    odf_code: 123003,
                    pst_libelle: 'trois test',
                    usr_nomprenom_realise: 'John Doe',
                    pdt_code: 'le produit 3',
                    org_libelle: 'Cth',
                    rsc_image: '_undefined.png'
                },
                {
                    act_id: 4,
                    act_date_debut: '2020-04-10 10:10:10',
                    odf_code: 123004,
                    pst_libelle: 'deux test',
                    usr_nomprenom_realise: 'John Doe',
                    pdt_code: 'le produit 2',
                    org_libelle: 'Cth',
                    rsc_image: '_undefined.png'
                }, {
                    act_id: 5,
                    act_date_debut: '2020-04-10 10:10:10',
                    odf_code: 123005,
                    pst_libelle: 'trois test',
                    usr_nomprenom_realise: 'John Doe',
                    pdt_code: 'le produit 3',
                    org_libelle: 'Cth',
                    rsc_image: '_undefined.png'
                },
                {
                    act_id: 6,
                    act_date_debut: '2020-04-10 10:10:10',
                    odf_code: 123006,
                    pst_libelle: 'deux test',
                    usr_nomprenom_realise: 'John Doe',
                    pdt_code: 'le produit 2',
                    org_libelle: 'Cth',
                    rsc_image: '_undefined.png'
                }, {
                    act_id: 7,
                    act_date_debut: '2020-04-10 10:10:10',
                    odf_code: 123007,
                    pst_libelle: 'trois test',
                    usr_nomprenom_realise: 'John Doe',
                    pdt_code: 'le produit 3',
                    org_libelle: 'Cth',
                    rsc_image: '_undefined.png'
                },
                {
                    act_id: 8,
                    act_date_debut: '2020-04-10 10:10:10',
                    odf_code: 123008,
                    pst_libelle: 'deux test',
                    usr_nomprenom_realise: 'John Doe',
                    pdt_code: 'le produit 2',
                    org_libelle: 'Cth',
                    rsc_image: '_undefined.png'
                }, {
                    act_id: 9,
                    act_date_debut: '2020-04-10 10:10:10',
                    odf_code: 123009,
                    pst_libelle: 'trois test',
                    usr_nomprenom_realise: 'John Doe',
                    pdt_code: 'le produit 3',
                    org_libelle: 'Cth',
                    rsc_image: '_undefined.png'
                },
                {
                    act_id: 10,
                    act_date_debut: '2020-04-10 10:10:10',
                    odf_code: 123010,
                    pst_libelle: 'deux test',
                    usr_nomprenom_realise: 'John Doe',
                    pdt_code: 'le produit 2',
                    org_libelle: 'Cth',
                    rsc_image: '_undefined.png'
                }, {
                    act_id: 11,
                    act_date_debut: '2020-04-10 10:10:10',
                    odf_code: 123011,
                    pst_libelle: 'trois test',
                    usr_nomprenom_realise: 'John Doe',
                    pdt_code: 'le produit 3',
                    org_libelle: 'Cth',
                    rsc_image: '_undefined.png'
                }
            ]
        }
    },
    Proxy: {
        type: 'memory'
    }
});