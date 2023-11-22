    import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ConfirmEventType, ConfirmationService } from 'primeng/api';
    import { AuthService } from 'src/app/services/auth.service';
    import { DemandeRemboursementService } from 'src/app/services/demande-remboursement.service';
    import { MessageService } from 'primeng/api';
    import { saveAs as importedSaveAs } from "file-saver";


    @Component({
      selector: 'app-dossier-remboursement',
      templateUrl: './dossier-remboursement.component.html',
      styleUrls: ['./dossier-remboursement.component.scss']
    })
    export class DossierRemboursementComponent implements OnInit {

      @Input() user
      @Input() demande
      @Output() demandeUpdated = new EventEmitter();

      docList = [
        {
          nom: 'RIB',
          slug: 'rib',
          doc: null,
          added_on: new Date(),
          added_by: null,
          doc_number: null
    
        },
        {
          nom: 'Attestation de Paiement',
          slug: 'attestation_payement',
          doc: null,
          added_on: new Date(),
          added_by: null,
          doc_number: null,
        },
        {
          nom: "Document d'inscription",
          slug: 'document_inscription',
          doc: null,
          added_on: new Date(),
          added_by: null,
          doc_number: null,
        },
        {
          nom: 'Preuve de Paiement',
          slug: 'preuve_payement',
          doc: null,
          added_on: new Date(),
          added_by: null,
          doc_number: null,
        },
        {
          nom: 'Notification de refus (ou autre justificatif)',
          slug: 'autres_doc',
          doc: null,
          added_on: new Date(),

          added_by: null,
          doc_number: null,
        }
      ]


      constructor(private demandeService: DemandeRemboursementService , private messageService: MessageService, private userService: AuthService) { }
 
      ngOnInit(): void {
        for (let key in this.demande.docs) {
          this.initDocs(key, this.demande.docs[key])
        }
        
      }

      deleteDoc(doc) {
        this.demandeService.deleteDoc(this.demande._id , doc.slug).subscribe(
          (response) => {
            let docName = this.demande.docs[doc.slug].nom
            doc.added_by = null
            this.demande.docs[doc.slug]= null
            this.updateDemande(doc.slug, docName)
          },
          (error) => {
            const errorMessage = error.error ? error.error.message : 'Erreur lors de la suppresion du Document';
            let docName = this.demande.docs[doc.slug].nom
            this.demande.docs[doc.slug]= null
            this.updateDemande(doc.slug, docName)
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: errorMessage
            });
          }
        );    

      }


      onUpload(file: any, doc:string ) {
        this.uploadDoc(file, doc, this.demande._id)
      }



      initDocs(slug, doc) {
        const index = this.docList.findIndex((doc) => doc.slug === slug);
        if (index !== -1) {
          console.log(index)
          const updatedDoc = { ...this.docList[index], ...doc };
          this.docList[index] = updatedDoc;
        } else {
          console.error(`Document with slug "${slug}" not found.`);
        }
        if (this.docList[index].added_by) {
          this.getDocOwner(index, this.docList[index].added_by) 
        }
        
        console.log(this.docList[index] )

      }



  uploadDoc(doc, docType, id) {
    let formData = new FormData();
    console.log(doc)
    console.log(docType)
    console.log(id)
    formData.append('id', id);
    formData.append('docname', docType.slug);
    formData.append('file', doc);

    console.log(formData)
    this.demandeService.postDoc(formData)
              .then((response) => {

                this.demande.docs[docType.slug] = {
                  added_on: new Date(),
                  added_by: this.user,
                  doc_number: docType.slug[0].toUpperCase() + '-' + Math.floor(Math.random() * Date.now()).toString()
                }
                this.updateDemande(docType.slug, docType.nom)

              })
              .catch((error) => {
                console.error('Upload error', error);

              });
    }

  // Updating la demande de Remboursement


  updateDemande(slug, docName){
    this.demandeService.updateRemboursement(this.demande).subscribe(
      (response) => {
        this.messageService.add({ severity: "success", summary: 'Document '+" " + docName +" "+ 'Ajouté avec Succés' })
        this.updateDocList(slug, response)
      },
      (error) => {
        const errorMessage = error.error ? error.error.message : 'Erreur lors de la mise à jour de la demande';
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: errorMessage
        });
      }
    );
  }

  // Updating the Visualization

  updateDocList(doc, demande) {
    let index = this.docList.findIndex(document => document.slug === doc);
    this.docList[index].added_on =  demande.docs[doc] ? demande.docs[doc].added_on : null
    demande.docs[doc] ? this.getDocOwner(index, demande.docs[doc].added_by) : null
    this.docList[index].doc = demande.docs[doc] ? this.docList[index].doc : null
    this.docList[index].doc_number = demande.docs[doc] ? demande.docs[doc].doc_number : null
  }


  // Download the Document

  downloadDoc(slug) {
    this.demandeService.downloadDoc(this.demande._id,slug).then((data: any) => {
      const byteArray = new Uint8Array(atob(data.file).split('').map(char => char.charCodeAt(0)));
      importedSaveAs(new Blob([byteArray], { type: data.documentType }), slug + '.pdf')
    })
  }

  
  getDocOwner(index, id) {
    if (id) {
      this.userService.getPopulate(id).subscribe(u => {
        this.docList[index].added_by =  u.firstname + ' ' + u.lastname
      })
    } else {
      this.docList[index].added_by = 'Annonyme'
    }

  }

}
