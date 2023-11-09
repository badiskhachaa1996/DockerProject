import { Component, Input, OnInit ,Output , EventEmitter} from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-commentaire-section',
  templateUrl: './commentaire-section.component.html',
  styleUrls: ['./commentaire-section.component.scss']
})
export class CommentaireSectionComponent implements OnInit {


  @Input() userName
  @Input() demande
  @Output() saveDemande:EventEmitter<any> = new EventEmitter<any>();


  commentaires=[
    {
      note:'',
      created_by:'',
      created_on: new Date(),
      isUpdating : false

    }
  ]


  constructor(private authServise : AuthService) {  }

  ngOnInit(): void {
    if(this.demande && this.demande.comments) {
    this.commentaires=this.demande?.comments
  }
} 
  updateKeyDates(commentaire){
    commentaire.isUpdating=true 

   }
   saveKeyDates(commentaire){
     // save data 
    this.demande.comments = this.commentaires
    this.updateDemande(this.demande)
    commentaire.isUpdating=false
   }
   deleteCommentaire(comment) {
    const index = this.commentaires.findIndex(c => c === comment);
         if (index !== -1) {
        this.commentaires.splice(index, 1);
    } 
    this.demande.comments = this.commentaires
    this.updateDemande(this.demande)
  }
  addComment() {
    this.commentaires.push(
      {
        note:'',
        created_by: this.userName,
        created_on: new Date(), 
        isUpdating : true
      }
    )
  }

  updateDemande(demande) {
    const data = {
      demande: demande,
      message: 'Commentaires mis à jours'
    }
    this.saveDemande.emit(data)
  }
  
}
