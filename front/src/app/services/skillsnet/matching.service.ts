import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CV } from 'src/app/models/CV';
import { Evenements } from 'src/app/models/Evenements';
import { Matching } from 'src/app/models/Matching';
import { environment } from 'src/environments/environment';
import jwt_decode from 'jwt-decode';
import { AuthService } from '../auth.service';
import { TicketService } from '../ticket.service';
import { SujetService } from '../sujet.service';
import { Sujet } from 'src/app/models/Sujet';
import { Ticket } from 'src/app/models/Ticket';
import { AnnonceService } from './annonce.service';
@Injectable({
  providedIn: 'root'
})
export class MatchingService {

  apiUrl = environment.origin + "matching/";
  constructor(private httpClient: HttpClient, private AuthService: AuthService, private TicketService: TicketService,
    private SujetService: SujetService, private AnnonceService: AnnonceService) { }
  create(tbObj: any) {
    let m: Matching = tbObj
    /*if (m && localStorage.getItem('token')) {
      let token: any = jwt_decode(localStorage.getItem('token'))
      this.AuthService.getPopulate(token.id).subscribe(user => {
        let sujet: Sujet;
        this.SujetService.getAllPopulate().subscribe(sujets => {
          sujets.forEach(s => { if (s.label == 'iMatch' && s.service_id.label == 'Commercial') sujet = s })
          if (user.type == 'Collaborateur') {
            this.TicketService.create(new Ticket(null, token.id, sujet._id, new Date(), null, 'En attente de traitement',
              null, null, null, false, `${user.firstname} ${user.lastname} a publié une nouvelle offre,${annonce.custom_id}`, false, null, null, null,
              null, null, null, null, null, null, null, null, null, null, null, 'Offre publié'
            ))
          } else if (user.type == 'CEO Entreprise' || user.type == 'Entreprise' || user.type == 'Tuteur')
            this.TicketService.create(new Ticket(null, token.id, sujet._id, new Date(), null, 'En attente de traitement',
              null, null, null, false, `L'entreprise ${annonce.entreprise_name} a publié une nouvelle offre,${annonce.custom_id}`, false, null, null, null,
              null, null, null, null, null, null, null, null, null, null, null, 'Offre publié'
            ))
        })
      })
    } else if (m) {
      if (m.offre_id) {
        this.AnnonceService.getAnnonce(m.offre_id).then(annonce => {
          this.SujetService.getAllPopulate().subscribe(sujets => {
            let sujet: Sujet;
            sujets.forEach(s => { if (s.label == 'iMatch' && s.service_id.label == 'Commercial') sujet = s })
            this.TicketService.create(new Ticket(null, null, sujet._id, new Date(), null, 'En attente de traitement',
              null, null, null, false, `L'entreprise ${annonce.entreprise_name} a publié une nouvelle offre,${annonce.custom_id}`, false, null, null, null,
              null, null, null, null, null, null, null, null, null, null, null, 'Offre publié'
            ))
          })
        })

      }
    }*/

    let url = this.apiUrl + 'create';

    return this.httpClient.post<Matching>(url, tbObj, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }) });
  }
  update(id: string, obj: any) {
    let url = this.apiUrl + 'update/' + id;
    return this.httpClient.put<Matching>(url, obj, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });

  }

  delete(id: string) {
    let url = this.apiUrl + 'delete/' + id;
    return this.httpClient.delete<Matching>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });

  }

  getByID(id: string) {
    let url = this.apiUrl + 'getByID/' + id;
    return this.httpClient.get<Matching>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
  getAll() {
    let url = this.apiUrl + 'getAll';
    return this.httpClient.get<Matching[]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  generateMatchingV1(offre_id: string) {
    let url = this.apiUrl + 'generateMatchingV1/' + offre_id;
    return this.httpClient.get<{ cv: CV, taux: number }[]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
  generateMatchingV1USERID(user_id: string) {
    let url = this.apiUrl + 'generateMatchingV1USERID/' + user_id;
    return this.httpClient.get<Matching[]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
  getAllByOffreID(offre_id: string) {
    let url = this.apiUrl + 'getAllByOffreID/' + offre_id;
    return this.httpClient.get<Matching[]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
  getAllByCVUSERID(user_id: string) {
    let url = this.apiUrl + 'getAllByCVUSERID/' + user_id;
    return this.httpClient.get<Matching[]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
  getMatchingByUserAndEntreprise(user_id: string, entreprise_id) {
    let url = this.apiUrl + 'getMatchingByUserAndEntreprise/' + user_id + "/" + entreprise_id;
    return this.httpClient.get<Matching[]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });

  }
}
