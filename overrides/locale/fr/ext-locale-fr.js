/**
 * Auteur   : Hervé Valot
 * Date     : 20/09/2016
 * Objet    : Override des traductions
 *
permet de compléter les traductions manquantes ou erronées
éventuellement de les adapter si nécessaire

 pour trouver la syntaxe de l'override, on peut parcourir les fichiers js ici :
 ext/build/classis/locale
 ext/classic/locale/overrides/fr

 pour trouver les libellés non traduits (cas de Ext.grid.feature.Grouping)
 on peut aller chercher la définition dans :
 ext/build/ext-all.js
 (en charchant le libellé anglais affiché par défaut)
 */
Ext.define("Ext.locale.fr.grid.GroupingFeature", {
    override: 'Ext.grid.feature.Grouping',
    emptyGroupText: '(Aucun)',
    groupByText: 'Grouper par cette colonne',
    showGroupsText: 'Afficher les groupes',
    expandTip: 'Clic pour étendre. CTRL/clic pour étendre et réduire les autres groupes',
    collapseTip: 'Clic pour réduire. CTRL/clic pour réduire les autres groupes'
});
//traduction du plugin grid.filter
Ext.define("Ext.locale.fr.grid.filters.Filters", {
    override: "Ext.grid.filters.Filters",
    menuFilterText: "Filtres"
});
Ext.define("Ext.locale.fr.grid.filters.filter.Boolean", {
    override: "Ext.grid.filters.filter.Boolean",
    yesText: "Oui",
    noText: "Non"
});
Ext.define("Ext.locale.fr.grid.filters.filter.Date", {
    override: "Ext.grid.filters.filter.Date",
    fields: {
        lt: {
            text: "Avant"
        },
        gt: {
            text: "Aprés"
        },
        eq: {
            text: "Le"
        }
    },
    dateFormat: null
});
Ext.define("Ext.locale.fr.grid.filters.filter.List", {
    override: "Ext.grid.filters.filter.List",
    loadingText: "Chargement ..."
});
Ext.define("Ext.locale.fr.grid.filters.filter.Number", {
    override: "Ext.grid.filters.filter.Number",
    emptyText: "Entrer la valeur ..."
});
Ext.define("Ext.locale.fr.grid.filters.filter.String", {
    override: "Ext.grid.filters.filter.String",
    emptyText: "Entrer le texte ..."
});