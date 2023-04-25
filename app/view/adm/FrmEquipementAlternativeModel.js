Ext.define('Thot.view.adm.FrmEquipementAlternativeModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.adm-frmequipementalternative',

    // 2019-03-12 13:02:03 HVT : l'objet JSON data contient les textes à afficher sur l'interface utilisateur
    data: {
        name: 'Gestion des paramètres équipement',
        fieldsetTitle: 'Equipement',
        rscinterne: {
            libelle: 'Ressource interne',
            description: 'Les ressources internes sont disponibles en fonction de leur paramétrage défini ici.'
        },
        rscexterne: {
            libelle: 'Ressource externe',
            description: 'Non gérées'
        },
        eqpimmateriel: {
            libelle: 'Immatériel',
            limiter: {
                libelle: 'Limiter',
                description: 'Un équipement immatériel avec limitation d\'utilisation ne pourra pas être utilisé au delà du nombre d\'instances maxi défini. Sans limitation l\'utilisation est infinie',
                instances: {
                    libelle: 'Instances maxi'
                }
            }
        },
        eqpphysique: {
            libelle: 'Physique',
            eqpstandard: {
                libelle: 'Standard',
                description: 'Cet équipement ne peut être utilisé que par un seul opérateur à la fois et pour la réalisation d\'une seule opération.'
            },
            transfertmarquage: {
                libelle: 'Marquage',
                description: 'Cet équipement dispose d\'une imprimante MARKEM. en cochant cette option il recevra automatiquement les messages d\'impression'
            },
            transfertspc: {
                libelle: 'Production pièces finies',
                description: 'Cet équipement réalise des pièces finies. en cochant cette option les informations d\'activité seront transmises au SPC'
            },
            autocount: {
                libelle: 'Compteur',
                description: 'Cet équipement dispose d\'un système de comptage automatique.'
            },

            eqpautre: {
                libelle: 'autre',
                description: '',
                eqpautonome: {
                    libelle: 'Autonôme',
                    description: 'Cet équipement peut être utilisé simultanément avec d\'autres équipements du même type par un seul opérateur, chaque équipement réalisant une seule opération différente de celles réalisées sur les autres équipements.'
                },
                eqpmultipostes: {
                    libelle: 'Multipostes',
                    description: 'Cet équipement ne peut être utilisé que par un seul opérateur pour la réalisation de plusieurs opérations différentes simultanément.'
                },
                collaboratif: {
                    libelle: 'Collaboratif',
                    description: 'Cet équipement peut être utilisé par plusieurs opérateurs pour la réalisation des mêmes opérations.'
                }
            }
        }
    }
});