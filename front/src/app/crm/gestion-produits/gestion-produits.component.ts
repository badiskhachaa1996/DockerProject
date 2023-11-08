import {Component, OnInit} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {MessageService} from 'primeng/api';
import {MemberCRM} from 'src/app/models/memberCRM';
import {AuthService} from 'src/app/services/auth.service';
import {TeamsCrmService} from 'src/app/services/crm/teams-crm.service';
import {environment} from 'src/environments/environment';
import {ProduitCRM} from "../../models/produitCRM";
import {GestionProduitsService} from "./gestion-produits.service";

@Component({
    selector: 'app-member-crm',
    templateUrl: './gestion-produits.component.html',
    styleUrls: ['./gestion-produits.component.scss']
})
export class GestionProduitsComponent implements OnInit {

    products: ProduitCRM[] = [];
    selectedProduit: ProduitCRM;
    teamsList = [];
    userList = []

    constructor(private ProduitsService: GestionProduitsService, private MessageService: MessageService, private UserService: AuthService) {
    }

    ngOnInit(): void {
        this.ProduitsService.GetAllProduit().subscribe(data => {
            this.products = data
        })
        this.ProduitsService.GetAllProduit().subscribe(data => {
            data.forEach(f => {
                this.teamsList.push({label: f.name, value: f._id})
            })
        })
        this.UserService.getAll().subscribe(users => {
            //Imagine tu dois charger toute la DB .........
            users.forEach(user => {
                if (user)
                    this.userList.push({label: `${user.firstname} ${user.lastname} | ${user.type}`, value: user._id})
            })
        })
    }

    updateForm: FormGroup = new FormGroup({
        _id: new FormControl('', Validators.required),
        name: new FormControl('', Validators.required),
        description: new FormControl('', Validators.required),
    })

    initUpdate(etudiant: MemberCRM) {
        this.selectedProduit = etudiant
        this.updateForm.patchValue({...etudiant, team_id: etudiant.team_id._id})
    }

    onUpdate() {
        this.ProduitsService.UpdateProduit({...this.updateForm.value}).subscribe(data => {
            this.products.splice(this.products.indexOf(this.selectedProduit), 1, data)
            this.selectedProduit = null
            this.updateForm.reset()
            this.MessageService.add({
                severity: "success",
                summary: `Mis à jour du membre ${data._id} ${data.name} avec succès`
            })
        })
    }

    createForm: FormGroup = new FormGroup({
        _id: new FormControl(''),
        nom: new FormControl('', Validators.required),
        description: new FormControl('', Validators.required),
    })

    newProduct = false

    initCreate() {
        this.newProduct = true
    }

    onCreate() {
        this.generateID()
        this.ProduitsService.CreateProdut({...this.createForm.value}).subscribe(data => {
            this.products.push(data)
            this.newProduct = null
            this.createForm.reset()
            this.MessageService.add({severity: "success", summary: `Ajout d'un nouveau membre avec succès`})
        })
    }

    delete(member: MemberCRM) {
        if (confirm("Êtes-vous sûr de vouloir supprimer ce membre de l'équipe ?"))
            this.ProduitsService.DeleteProduit(member.user_id._id).subscribe(data => {
                this.products.splice(this.products.indexOf(member), 1)
                this.MessageService.add({severity: "success", summary: `Suppression du membre avec succès`})
            })
    }

    scrollToTop() {
        var scrollDuration = 250;
        var scrollStep = -window.scrollY / (scrollDuration / 15);

        var scrollInterval = setInterval(function () {
            if (window.scrollY > 120) {
                window.scrollBy(0, scrollStep);
            } else {
                clearInterval(scrollInterval);
            }
        }, 15);
    }

    generateID() {
        this.userList.forEach(element => {
            if (element.value == this.createForm.value.user_id) {
                this.teamsList.forEach(elementTeam => {
                    if (elementTeam.value == this.createForm.value.team_id) {
                        let ID = elementTeam.label.substring(0, 2)
                        ID = ID + element.label.substring(0, 1)
                        ID = ID + element.label.substring(element.label.indexOf(' ') + 1, element.label.indexOf(' ') + 2)
                        ID = ID + this.pad(Math.floor(Math.random() * (9998)).toString())
                        ID = ID.toUpperCase();
                        console.log(ID)
                        this.createForm.patchValue({custom_id: ID})
                    }
                })

            }
        })

    }

    pad(number: string) {
        while (number.length < 4)
            number = `0${number}`
        return number
    }


}
