    import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
    import { AuthService } from 'src/app/services/auth.service';
    import { DemandeRemboursementService } from 'src/app/services/demande-remboursement.service';
    import { MessageService } from 'src/app/services/message.service';


    @Component({
      selector: 'app-dossier-remboursement',
      templateUrl: './dossier-remboursement.component.html',
      styleUrls: ['./dossier-remboursement.component.scss']
    })
    export class DossierRemboursementComponent implements OnInit {

      @Input() user
      @Input() demande
      @Output() demandeUpdated = new EventEmitter();

    docInfos=[{
      rib :{
        nom:'RIB',
      added_on:new Date(),
      added_by:'',
      doc_number:'lien de télèchargement'
    
    }, 
        
    attestation_payement:
    {
      nom:'Attestation de Paiement',
      added_on:new Date(),
      added_by:'',
      doc_number:'lien de télèchargement'
    
    },
    preuve_payement:
    {
      nom:"Document d'inscription",
      added_on:new Date(),
      added_by:'',
      doc_number:'lien de télèchargement'
    
    }, 
    document_inscription:
    {
      nom:"Preuve de Paiement",
      added_on:new Date(),
      added_by:'',
      doc_number:'lien de télèchargement'
    
    }, 
    autres_doc:
    {
      nom:'Notification de refus (ou autre justificatif)',
      added_on:new Date(),
      added_by:'',
      doc_number:'lien de télèchargement'
    
    }, 

    }]


      constructor(private demandeService: DemandeRemboursementService , private messageService: MessageService ) { }

      ngOnInit(): void {
        this.docInfos=[this.demande.docs]
      }

      deleteDoc(doc) {
        this.demandeService.deleteDoc(this.demande._id , doc).subscribe(
          (response) => {
            this.demandeUpdated.emit();
            this.docInfos[0][doc] =null
            this.updateDoc();

          },
          (error) => {
            const errorMessage = error.error ? error.error.message : 'Erreur lors de la suppresion du Document';
            
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: errorMessage
            });
          }
        );    

      }
      rib: any;
      attestation_payement: any;
  document_inscription: any;
  preuve_payement: any;
  autres_doc: any;


      onUpload(event: any, doc:string ) {
        if (event.target.files.length > 0) {
          switch (doc) {
            case 'rib': {
              this.rib = event.target.files[0];
              break;
            }
            case "attestation_payement": {
              this.attestation_payement = event.target.files[0];
              break;
            }
            case "document_inscription": {
              this.document_inscription = event.target.files[0];
              break;
            }
            case 'preuve_payement': {
              this.preuve_payement = event.target.files[0];
              break;
            }
            case 'autres_doc': {
              this.autres_doc = event.target.files[0];
              break;
            }
            default: {
              break;
           }
          }
        }
      }



  updateDoc(){
    this.demande.docs=this.docInfos[0]
    console.log(this.demande)
  }

  uploadDoc(doc, docType, id) {
    let formData = new FormData();
    formData.append('id', id);
    formData.append('docname', docType);
    formData.append('file', doc);
  this.demandeService.postDoc(formData)
            .then((response) => {
              console.log('Upload successful', response);

            })
            .catch((error) => {
              console.error('Upload error', error);

            });
  }
 
  



  updateInfo(docSlug, docName) {
    this.docInfos[0][docSlug] = 
    {
      added_on: new Date(),
      nom: docName,
      added_by : this.user._id,
      doc_number : this.user.lastname[0].toUpperCase() + this.user.firstname[0].toUpperCase() + '-' + Math.floor(Math.random() * Date.now()).toString()
    }
  }
}
