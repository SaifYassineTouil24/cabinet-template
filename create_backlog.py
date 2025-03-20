
import pandas as pd

# Créer les données pour le fichier backlog avec les cas d'utilisation en français
data = {
    'Acteur': ['Médecin', 'Médecin', 'Médecin', 'Médecin', 'Médecin', 'Secrétaire', 'Secrétaire', 'Secrétaire', 'Administrateur'],
    'Use case': ['Visualiser fiche patient', 'Créer un nouveau patient', 'Planifier un rendez-vous', 'Consulter l\'historique des visites', 'Prescrire des médicaments', 'Enregistrer l\'arrivée d\'un patient', 'Gérer le calendrier', 'Gérer les paiements', 'Gérer les paramètres du système'],
    'User story': [
        'En tant que médecin je peux accéder à la fiche complète du patient pour consulter ses informations médicales',
        'En tant que médecin je peux créer un nouveau dossier patient pour enregistrer un nouveau patient dans le système',
        'En tant que médecin je peux planifier un rendez-vous pour un patient existant',
        'En tant que médecin je peux consulter l\'historique des visites d\'un patient pour suivre son évolution médicale',
        'En tant que médecin je peux prescrire des médicaments à un patient et imprimer l\'ordonnance',
        'En tant que secrétaire je peux enregistrer l\'arrivée d\'un patient et l\'ajouter à la salle d\'attente',
        'En tant que secrétaire je peux gérer le calendrier des rendez-vous pour optimiser l\'emploi du temps',
        'En tant que secrétaire je peux gérer les paiements et générer des factures pour les patients',
        'En tant qu\'administrateur je peux configurer les paramètres du système pour l\'adapter aux besoins de la clinique'
    ],
    'Etapes': [
        '1- Se connecter à l\'espace médecin\n2- Cliquez sur la barre de recherche\n3- Dans les filtres de rech remplir le CIN ou Nom ou Date de naissance\n4- Lister les résultats\n5- Cliquer sur le patient concerné\n6- Voir son profil avec les infos (nom, prénom, dateNaiss, Num tel) ...',
        '1- Se connecter à l\'espace médecin\n2- Cliquer sur "Ajouter un patient"\n3- Remplir le formulaire avec les informations du patient\n4- Enregistrer le nouveau dossier',
        '1- Se connecter à l\'espace médecin\n2- Rechercher le patient\n3- Cliquer sur "Planifier un rendez-vous"\n4- Sélectionner la date et l\'heure\n5- Indiquer le type de consultation\n6- Enregistrer le rendez-vous',
        '1- Se connecter à l\'espace médecin\n2- Rechercher le patient\n3- Accéder à sa fiche\n4- Consulter l\'onglet "Historique des visites"\n5- Filtrer par date si nécessaire',
        '1- Se connecter à l\'espace médecin\n2- Accéder à la fiche du patient\n3- Cliquer sur "Nouvelle prescription"\n4- Ajouter les médicaments et posologies\n5- Valider et imprimer l\'ordonnance',
        '1- Se connecter à l\'espace secrétaire\n2- Vérifier l\'identité du patient à l\'accueil\n3- Trouver son rendez-vous dans le système\n4- Marquer le patient comme "Présent"\n5- L\'ajouter à la liste d\'attente',
        '1- Se connecter à l\'espace secrétaire\n2- Accéder au calendrier\n3- Visualiser les rendez-vous du jour/semaine\n4- Ajouter, modifier ou annuler des rendez-vous selon les demandes',
        '1- Se connecter à l\'espace secrétaire\n2- Sélectionner le patient concerné\n3- Accéder à l\'onglet "Paiements"\n4- Créer une nouvelle facture\n5- Enregistrer le paiement et imprimer le reçu',
        '1- Se connecter en tant qu\'administrateur\n2- Accéder aux paramètres du système\n3- Configurer les horaires de la clinique, tarifs, informations de l\'établissement\n4- Gérer les comptes utilisateurs'
    ]
}

# Créer le DataFrame
df = pd.DataFrame(data)

# Sauvegarder dans un fichier Excel
df.to_excel('backlog.xlsx', index=False)

print("Fichier backlog.xlsx créé avec succès!")
