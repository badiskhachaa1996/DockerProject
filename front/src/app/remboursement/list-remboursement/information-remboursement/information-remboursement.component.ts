import { Component, Input, OnInit , Output , EventEmitter} from '@angular/core';
import { MessageService } from 'primeng/api';
import { Demande } from 'src/app/models/Demande';
import { DemandeRemboursementService } from 'src/app/services/demande-remboursement.service';
import { environment } from 'src/environments/environment';
import { saveAs as importedSaveAs } from "file-saver";

@Component({
  selector: 'app-information-remboursement',
  templateUrl: './information-remboursement.component.html',
  styleUrls: ['./information-remboursement.component.scss']
})
export class InformationRemboursementComponent implements OnInit {
  @Input() demande
  @Output() saveDemande:EventEmitter<any> = new EventEmitter<any>();
  @Output()   currentDemande = new Demande;
infoRefunds=[{
  refund_date:'',
  refund_method:'choisir',
  montant:'',
  note:'',
  doc_number: '',
  isUpdating : false

}]
refundMethods = environment.paymentType
  constructor(private demandeService: DemandeRemboursementService, private messageService: MessageService) { }
  isUpdating=false

  docElement =
    {
      name: 'Ordre de virement',
      slug: 'ODV',
      doc: '',
   

    }

  ngOnInit(): void {


    
    if (this.demande && this.demande.refund ) {

    this.infoRefunds=[
      {
        refund_date : this.demande?.refund?.date,
        refund_method : this.demande?.refund?.method,
        montant : this.demande?.refund?.montant,
        note : this.demande?.refund?.note,
        doc_number : this.demande?.refund?.doc_number,
        isUpdating : false
      }
    ]
    }

  }
  updateKeyDates(){
    this.isUpdating = true 
   }
   saveKeyDates(infoRefund){


    this.demande.refund = {
      date : infoRefund.refund_date,
      method : infoRefund.refund_method,
      montant : infoRefund.montant,
      note : infoRefund.note,
      doc_number : infoRefund.doc_number
    }

    this.updateDemande(this.demande) 

    this.isUpdating=false
  
  }
  updateDemande(demande) {
    const data = {
      demande: demande,
      message: 'Informations de remboursement mis à jours'
    }
    this.saveDemande.emit(data)
  }

  onUpload(event: any) {
    let doc = event.target.files[0]
    if (doc) {
      const formData = new FormData();
      formData.append('id', this.demande._id)
      formData.append('docname', 'ordre_virement')
      formData.append('file', doc)
      this.demandeService.postDoc(formData)
      .then((response) => {
        
        this.infoRefunds[0].doc_number =  'OV-' + Math.floor(Math.random() * Date.now()).toString()
        this.demande.refund.doc_number = this.infoRefunds[0].doc_number
        this.updateDemande(this.demande)
        console.debug(this.infoRefunds)
        
      })
      .catch((error) => { console.error(error); this.messageService.add({ severity: 'error', summary: 'Document', detail: "Le document " + doc.name + " n'a pas pu être ajouté" }); });
    }
  }
  uploadDoc(doc) {
    console.log(doc);
  
    if (this.docElement[doc.slug]) {
      this.docElement[doc.slug] = doc;
    }
  
    const formData = new FormData();
    formData.append('file', doc);
  
    this.demandeService.postDoc(formData).then(
      (response) => {
        console.log('Document uploaded successfully:', response);
        this.currentDemande.docs[doc.slug] = {
          nom: doc.name,
        };
      },
      (error) => {
        console.error('Error uploading document:', error);
      }
    );
  }
  

  onFileChange(event: any) {
    console.log(event);

    const fileInput = event.target;
    if (fileInput.files && fileInput.files.length > 0) {
        const doc = fileInput.files[0];
        console.log(doc);
        this.uploadDoc(doc);
    }
}

downloadDoc(slug) {
  this.demandeService.downloadDoc(this.demande._id,slug).then((data: any) => {
    const byteArray = new Uint8Array(atob(data.file).split('').map(char => char.charCodeAt(0)));
    importedSaveAs(new Blob([byteArray], { type: data.documentType }), slug + '.pdf')
  })
}


}
