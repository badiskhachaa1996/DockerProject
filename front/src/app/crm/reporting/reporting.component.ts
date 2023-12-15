import { Component, OnInit } from '@angular/core';
import { LeadCRM } from 'src/app/models/LeadCRM';
import { LeadcrmService } from 'src/app/services/crm/leadcrm.service';
import { TeamsCrmService } from 'src/app/services/crm/teams-crm.service';






@Component({
  selector: 'app-reporting',
  templateUrl: './reporting.component.html',
  styleUrls: ['./reporting.component.scss']
})
export class ReportingComponent implements OnInit {
  activeIndex: number = 0; // Ajout pour gérer l'index de l'onglet actif
  generalData: any[]; 
  qualificationData: any[];
  contactData: any[];
  dates: Date[];

  leadsData: any[];
  leads: LeadCRM[];

  insertion : number = 0;
  attribue : number = 0;
  interesse: number = 0;
  qualifie: number = 0;
  paiement : number = 0;
  chiffre : number = 0;
  nonQualifie : number = 0;
  preQualfie : number = 0;
  joignable : number = 0;
  contacte : number = 0;
  nonContacte : number = 0;

  equipeFiltre=[{ label: 'Toutes les équipes', value: null }];
  membreFiltre=[{ label: 'Tous les membres', value: null }];
  selectedMemberId: any;
  

  constructor(private LCS: LeadcrmService,private TeamCRMService: TeamsCrmService,) { }

  ngOnInit(): void {
    this.initializeLeads().then(leads => {
      // Les leads sont initialisés, exécutez une autre fonction ici
      this.calculerInsertion();
      this.calculerContacte();
      this.calculerQualifie();
      this.calculerPreQualifie();
      this.calculerInterresse();
      this.calculerJoignable();
      this.calculerPaiement();
      this.calculerChiffre();
      this.calculerAttribue();
      this.reinitialiserFiltres()
    })
    this.calculerNonQualifie();
    
    this.generalData = [
      { insertion: 7, attribue: 0, interesse: 6, qualifie: 1, paiement: 3, chiffre: 800 },
    ];

    this.qualificationData = [
      
      { qualifie: 2, nonQualifie: 6, preQualifie: 1 },
    ];

    this.contactData = [
      { contacte: 5, joignable: 4 },
    ];
    this.TeamCRMService.TIgetAll().subscribe(equipes=>{
      equipes.forEach(equipe=>{
    this.equipeFiltre.push({ label: `${equipe.nom}`, value:equipe.nom })
      })
    })

    //this.TeamCRMService.MIgetAll().subscribe(membres=>{
     // membres.forEach(membre=>{
  //  this.membreFiltre.push({ label: `${membre.}`, value:membre.nom })
  //    })
   // })

    this.TeamCRMService.MIgetAll().subscribe(membres=>{
     membres.forEach(membre=>{
      console.log(membre)
        this.membreFiltre.push({ label: `${membre.user_id.firstname} ${membre.user_id.lastname} | ${membre.user_id?.type}`, value: membre.user_id._id })
     })
    })

  }


  //calculerNonQualifie(): void  {
    // this works !! so i ll keep using this service for the moment !!!
  //  this.LCS.getAllNonQualifies().subscribe(data => {
  
   //   this.nonQualifie= data.length;
      
   // })
 // }

 /*reinitialiserFiltres(): void {
  this.leadsSelected = [...this.leads]; // Copie la liste complète des leads 

  // Recalculer les statistiques avec tous les leads
  this.calculerPaiement();
      this.calculerChiffre();
      this.calculerInterresse();
      this.calculerJoignable();
      this.calculerContacte();
      this.calculerInterresse();
      this.calculerPreQualifie();
      this.calculerQualifie();
      this.calculerInsertion();
      this.calculerNonQualifie();
      this.calculerAttribue();
  // ... les autres appels de fonctions de calcul ...
}
  */
  
  calculerNonQualifie(): void  {
   
    //this.LCS.getAllQualifies().subscribe(data => { this does not work
  
      this.nonQualifie= this.filtrerParAttribut(this.leadsSelected,"decision_qualification","Non qualifié").length;
      
  
  }
  
  calculerQualifie(): void  {
   
    //this.LCS.getAllQualifies().subscribe(data => { this does not work
  
      this.qualifie= this.filtrerParAttribut(this.leadsSelected,"decision_qualification","Qualifié").length;
      
  
  }

  calculerInsertion(): void {
    this.insertion = this.leadsSelected.length;
  }
  /*calculerInsertion(): void {
    this.insertion = this.leadsSelected.filter(lead => 
      lead.created_by && lead.created_by._id).length;
  }*/
  calculerInterresse(): void  {
   
    //this.LCS.getAllQualifies().subscribe(data => { this does not work
  
      this.interesse= this.filtrerParAttribut(this.leadsSelected,"statut_dossier","Intéressé").length;
      
  }

  //calculerAttribut(): void  {
   
    // this.LCS.getAllPreQualifies().subscribe(data => { this does not work
   // this.attribue= this.filtrerParSubAttribut(this.leadsSelected,"affected_to_member","_id","").length; 
   // this.leadsSelected = this.leads.filter(lead => 
   //   lead.affected_to_member && lead.affected_to_member._id === event.value);
  //}

  calculerAttribue(): void {
    this.attribue = this.leadsSelected.filter(lead => 
      lead.affected_to_member && lead.affected_to_member._id).length;
  }
 /* calculerInsertion(): void {
    console.log(this)
    this.insertion = this.leads.filter(lead => lead.created_by==this.acteur).length;
    console.log(this.insertion)
  }*/
  

  calculerPreQualifie(): void  {
   
    // this.LCS.getAllPreQualifies().subscribe(data => { this does not work
    this.preQualfie= this.filtrerParAttribut(this.leadsSelected,"decision_qualification","Pré-qualifié").length; 
  
  }


    initializeLeads(): Promise<any> {
      console.log("Bonjour Badis");
      return new Promise((resolve, reject) => {
        this.LCS.getAll().subscribe(
          data => {
            this.leads = data;
            console.log(data);
            resolve(this.leads); // Résout la Promise avec les données
          },
          error => {
            console.error("Erreur lors de la récupération des leads:", error);
            reject(error); // Rejette la Promise en cas d'erreur
          }
        );
      });
    }
    
// this function filters list of leads by satut_dossier non contacté
    calculerNonContacte(): void  {
      this.nonContacte= this.filtrerParAttribut(this.leads,"statut_dossier","Non contacté").length;
    }
    // this function calculate number of items of list contacts[] for every lead

    calculerContacte(): void  {
      let contactCount : number = 0
      this.leadsSelected.forEach(lead => {
        if(lead.contacts.length > 0){
          contactCount+= lead.contacts.length;
        }

      })
      this.contacte= contactCount;
    }

  calculerJoignable(): void  {
      let contactCount : number = 0
      this.leadsSelected.forEach(lead => {
        if(lead.contacts.length > 0){
          lead.contacts.forEach(contact => {
            console.log(contact)
            if (contact["suite_contact"]==="Joignable") {
              contactCount+= 1 ;
            }
          })
        }
      })
      this.joignable= contactCount;
    }
    
    


    /*calculerInsertion(): void  {
      this.insertion= this.filtrerParAttribut(this.leadsSelected,"created_by","_id").length;
    } */
    

    calculerPaiement(): void  {
      let paiementCount : number = 0
      this.leadsSelected.forEach(lead => {
        if(lead.ventes.length > 0){

              paiementCount+= lead.ventes.length;
            
          }
      })
      this.paiement= paiementCount;
    }


    calculerChiffre(): void {
      let totalChiffre: number = 0;
      this.leadsSelected.forEach(lead => {
        if(lead.ventes && lead.ventes.length > 0){
          totalChiffre += lead.ventes.reduce((sum, vente) => {
            const montant = parseFloat(vente.montant_paye || "0");
            return sum + montant;
          }, 0);
        }
      });
      this.chiffre = totalChiffre;
    }

   

//fonction générique qui filtre par attribut 
    filtrerParAttribut(leads: LeadCRM[], attribut: string, valeur: any): any[] {
      let resultatsFiltres: LeadCRM[] = [];

      leads.forEach(lead => {
        if (lead[attribut] === valeur) {
          resultatsFiltres.push(lead);
        }
      });
  
      return resultatsFiltres;    
    }

    //fonction générique qui filtre par sous-attribut 
    filtrerParSubAttribut(leads: LeadCRM[], attribut: string, subAttribut: string, valeur: any): LeadCRM[] {
      let resultatsFiltres: LeadCRM[] = [];
    
      leads.forEach(lead => {
        if (lead[attribut] != null && lead[attribut][subAttribut] === valeur) {
          resultatsFiltres.push(lead);
        }
      });
    
      return resultatsFiltres;
    }



// filtre equipe 
    leadsSelected:LeadCRM[]=[]
    
    /*
    onFiltreEquipe(event){
this.leadsSelected=[];
      this.leads.forEach(lead=>{
if(lead.equipe===event.value){
  this.leadsSelected.push(lead);
}
      })
      console.log(this.leadsSelected);
      this.calculerPaiement();
      this.calculerChiffre();
      this.calculerInterresse();
      this.calculerJoignable();
      this.calculerContacte();
      this.calculerInterresse();
      this.calculerPreQualifie();
      this.calculerQualifie();
      this.calculerInsertion();
      this.calculerNonQualifie();
      this.calculerAttribue();
    }

    onFiltreMembre(event): void {
      this.leadsSelected = this.leads.filter(lead => 
        lead.affected_to_member && lead.affected_to_member._id === event.value);
    
      // Mettez à jour les statistiques avec les leads filtrés
      this.calculerPaiement();
      this.calculerChiffre();
      this.calculerInterresse();
      this.calculerJoignable();
      this.calculerContacte();
      this.calculerInterresse();
      this.calculerPreQualifie();
      this.calculerQualifie();
      this.calculerInsertion();
      this.calculerNonQualifie();
      this.calculerAttribue();
      // ... les autres appels de fonctions de calcul ...
    }
    */
    onFiltreDate(): void {
      if (this.dates && this.dates.length > 0) {
        let dateDebut, dateFin;
        if (this.dates.length === 1) {
          // Si une seule date est sélectionnée, utilisez-la pour le début et la fin
          dateDebut = this.dates[0];
          dateFin = this.dates[0];
        } else {
          // Si deux dates sont sélectionnées, utilisez la plage
          [dateDebut, dateFin] = this.dates;
        }
    
        this.leadsSelected = this.leads.filter(lead => {
          const dateLead = new Date(lead.date_creation);
          return dateLead >= dateDebut && dateLead <= dateFin;
        });
    
        // Mettez à jour les statistiques avec les leads filtrés
        this.calculerPaiement();
      this.calculerChiffre();
      this.calculerInterresse();
      this.calculerJoignable();
      this.calculerContacte();
      this.calculerInterresse();
      this.calculerPreQualifie();
      this.calculerQualifie();
      this.calculerInsertion();
      this.calculerNonQualifie();
      this.calculerAttribue();
        // ... les autres appels de fonctions de calcul ...
      }
    }
    

    onFiltreEquipe(event): void {
      if (event.value === null) { // Si "Toutes les équipes" est sélectionné
        this.reinitialiserFiltres();
      } else {
        this.leadsSelected = this.leads.filter(lead => lead.equipe === event.value);
        this.mettreAJourStatistiques();
      }
    }

   
    
    
    onFiltreMembre(event): void {

      this.leadsSelected = this.leads.filter(lead => 
        lead.affected_to_member && lead.affected_to_member._id === event.value|| 
        lead.created_by && lead.created_by._id === event.value)
    // Update statistics based on the selected member
    this.mettreAJourStatistiques();
  
}
    
    mettreAJourStatistiques(): void {
      this.calculerPaiement();
      this.calculerChiffre();
      this.calculerInterresse();
      this.calculerJoignable();
      this.calculerContacte();
      this.calculerInterresse();
      this.calculerPreQualifie();
      this.calculerQualifie();
      this.calculerInsertion();
      this.calculerNonQualifie();
      this.calculerAttribue();
      // ... les autres appels de fonctions de calcul ...
    }
    
    reinitialiserFiltres(): void {
      this.leadsSelected = [...this.leads]; // Copie la liste complète des leads
      this.mettreAJourStatistiques();
    }







}
