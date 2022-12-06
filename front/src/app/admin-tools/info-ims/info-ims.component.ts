import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-info-ims',
  templateUrl: './info-ims.component.html',
  styleUrls: ['./info-ims.component.scss']
})
export class InfoImsComponent implements OnInit {

  //Tableau de json qui decrit chaque tâches
  avancements: any[] = [
    {
      module: 'Ticketing',
      global: 100,
      todo: "x",
      details: [
        {
          tache: 'Gestion des tickets',
          date_liv: 'x',
          percent: 100
        },
        {
          tache: 'Suivi de mes tickets',
          date_liv: 'x',
          percent: 100
        },
        {
          tache: 'Gestion des services',
          date_liv: 'x',
          percent: 100
        },
      ]
    },
    {
      module: 'Pédagogie',
      global: 96,
      todo: "Rétouches fréquentes, voir le system de recherche de mission pour un étudiant, voir le système de génération de bulletins de notes",
      details: [
        {
          tache: 'Gestion des modules',
          detail: 'Ajout, listing, filtre sur la liste et modification',
          date_liv: 'x',
          percent: 100
        },
        {
          tache: 'Gestion des séances + Signature',
          detail: "Ajout de séances, affichage sur calendrier, possibilité pour les étudiants de voir l'emploi du temps de son groupe et de signer sa précence ou de justifier une absence et attribution de séance à un formateur",
          date_liv: 'x',
          percent: 100
        },
        {
          tache: 'Gestion des formateurs',
          detail: "Ajout de formateur, modification, voir le calendrier dur formateur et envoyer le calendrier au groupe d'étude",
          date_liv: 'x',
          percent: 100
        },
        {
          tache: "Gestion des étudiants en attente d'assignation",
          detail: "Permet au service pédagogique d'assigner un étudiant à un groupe d'étude et de suivre l'état de son dossier",
          date_liv: 'x',
          percent: 100
        },
        {
          tache: 'Gestion des étudiants',
          detail: "Ajout de nouveau étudiants, modification des informations personnelles des étudiants, ajout de cv étudiant, ajout de documents, modification de photo de profil, suivi assiduté, modifier l'état du dossier, desactiver le compte de l'étudiant",
          date_liv: 'Non determiné',
          percent: 90
        },
        {
          tache: 'Gestion des entreprises',
          detail: "Ajout, modification et listing",
          date_liv: 'x',
          percent: 100
        },
        {
          tache: 'Gestion des évaluations',
          detail: "Création d'évaluation pour un groupe <=> un module <=> un formateur <=> un semestre",
          date_liv: 'x',
          percent: 100
        },
        {
          tache: 'Gestion des bulletins de notes',
          detail: "Possibilité d'attribuer des notes et de generer un bulletin de note",
          date_liv: 'x',
          percent: 95
        },
        {
          tache: 'Gestion des devoirs',
          detail: "Création de nouveau devoirs et gestions",
          date_liv: 'x',
          percent: 80
        },
      ]
    },
    {
      module: 'Administration',
      global: 100,
      todo: "x",
      details: [
        {
          tache: 'Gestion des années-scolaires',
          detail: "Définition des années-scolaire et modification",
          date_liv: 'x',
          percent: 100
        },
        {
          tache: 'Gestion des écoles',
          detail: "Ajout d'école, listing des écoles, possibilité de voir les campus de l'école, possibilité d'ajouter des images à une école",
          date_liv: 'x',
          percent: 100
        },
        {
          tache: 'Gestion des campus',
          detail: "Ajout de campus <=> chaque campus est liée à une école, listing des campus, modification des campus",
          date_liv: 'x',
          percent: 100
        },
        {
          tache: 'Gestion des diplômes',
          detail: "Ajout de diplôme avec la possibilité d'y joindre des fichiers, listing des diplômes, modification des diplômes",
          date_liv: 'x',
          percent: 100
        },
        {
          tache: 'Gestion des groupes',
          detail: "Ajout de groupe <=> Chaque groupe doit être liée à un diplôme, listing des groupes, modification des groupes",
          date_liv: 'x',
          percent: 100
        },
        {
          tache: 'Gestion des agents',
          detail: "Création d'un agent avec attribution d'un rôle et d'un service, listing et modification",
          date_liv: 'x',
          percent: 100
        },
        {
          tache: 'Validation des inscrits',
          detail: "Donne la possibilité de valider des inscriptions avec la possibilité d'exporter cette liste",
          date_liv: 'x',
          percent: 100
        },
      ]
    },
    {
      module: 'Admission',
      global: 100,
      todo: "x",
      details: [
        {
          tache: 'Gestion des prospects',
          detail: "Liste des personnes ayant effectuer une demande d'admission, possibilité de formuler des demandes d'admissions depuis cet écran",
          date_liv: 'x',
          percent: 100
        },
        {
          tache: 'Gestion des participations à un évenement',
          detail: "Permet de lister les renseignements sur les personnes desirant participer à un évenement organisé",
          date_liv: 'x',
          percent: 100
        },
      ]
    },
    {
      module: 'Alternance',
      global: 55,
      todo: "Finir de renseigner les contrats d'alternances",
      details: [
        {
          tache: "Lister les contrats d'alternances",
          detail: "Ajout et listing des contrats d'alternances",
          date_liv: 'x',
          percent: 100
        },
        {
          tache: "Inserer les contrats d'alternances",
          detail: "renseigner tout les contrats d'alternances sur l'application",
          date_liv: 'x',
          percent: 10
        },
      ]
    },
    {
      module: 'Partenaires',
      global: 100,
      todo: "x",
      details: [
        {
          tache: 'Gestion des collaborateurs',
          detail: "Permet de voir la liste des collaborateurs, devoir les élèves et les prospects affiliés à un collaborateur ou de le supprimer",
          date_liv: 'x',
          percent: 100
        },
        {
          tache: 'gestion des partenaires',
          detail: "Permet de voir les informations sur les partenaires, la liste des collaborateurs, des élèves et des prospects affiliés à chaque partenaire, mais aussi de le supprimer",
          date_liv: 'x',
          percent: 100
        },
      ]
    },
    {
      module: 'Commerciale',
      global: 85,
      todo: "x",
      details: [
        {
          tache: 'Gestion des tuteurs',
          detail: "Création de tuteur <=> chaque tuteur est liée à une entreprise",
          date_liv: 'x',
          percent: 100
        },
        {
          tache: 'Gestion des équipes de conseillers',
          detail: "Permete de créer des équipes de consillers et d'assigner des responsables d'équipes",
          date_liv: 'Non determinée',
          percent: 70
        },
      ]
    },
    {
      module: 'Support',
      global: 100,
      todo: "x",
      details: [
        {
          tache: 'Etudants en attente de leur compte IMS',
          detail: "permet d'assigner des adresses mail estya aux étudiants qui n'ont pas d'accès IMS",
          date_liv: 'x',
          percent: 100
        },
      ]
    },
    {
      module: 'Booking',
      global: 100,
      todo: "x",
      details: [
        {
          tache: 'Logement',
          detail: "Presente les logements Eclats et permettre aux étudiants de faire des demandes de réservations, les étudiants peuvent emettre des demandes de reservation seul ou avec une personne desirée",
          date_liv: 'x',
          percent: 100
        },
        {
          tache: 'Gestion des reservations',
          detail: "Permettre d'accepter ou de refuser les demandes de reservations avec la possibilité d'exporter la liste des demandes validés",
          date_liv: 'x',
          percent: 100
        },
      ]
    },
    {
      module: 'SkillsNet',
      global: 100,
      todo: "Rétouches ...",
      details: [
        {
          tache: 'Mission',
          detail: "Possibilité d'ajouter des missions de les modifier et de verifier les cv",
          date_liv: 'x',
          percent: 100
        },
        {
          tache: 'Mes missions',
          detail: "Permettre de vois ses missions ajouté et de les modifier ou d'en ajouter",
          date_liv: 'x',
          percent: 100
        },
      ]
    },
    {
      module: 'RH',
      global: 100,
      todo: "En attente de test",
      details: [
        {
          tache: 'Module de gestion des ressources hummaines',
          detail: "Voir le compte rendu d'activité, voir les demandes de congés et les justificatifs d'abscences",
          date_liv: 'x',
          percent: 100
        },
        {
          tache: 'tableau de bord',
          detail: "Check in et check out, un compte rendu est demandé à chaque check out",
          date_liv: 'x',
          percent: 100
        },
        {
          tache: 'Page profil utilisateur',
          detail: "Permettre de faire des demandes de congés, voir les demandes de congés de mon service pour un responsable et permettre de les accepter ou de les refuser. Permettre de justifier ses absences",
          date_liv: '2022-05-23',
          percent: 100
        },
      ]
    },

  ];

  constructor() { }

  ngOnInit(): void {
  }

}
