Ext.define('theme-thot.form.field.Base', {
    override: 'Ext.form.field.Base',
    // forcer l'alignement des labels à droite
    labelAlign: 'right',
    // force le poids de la police à 600 (juste avant le gras
    labelStyle: 'font-weight: 600',
    // modification du séparateur entre le label et le champ
    labelSeparator: ' :',
    // message d'erreur, affichage icone à droite du champ
    msgTarget: 'side'
});