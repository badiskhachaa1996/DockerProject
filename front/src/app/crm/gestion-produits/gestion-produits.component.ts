import {Component, OnInit} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {MessageService} from 'primeng/api';
import {AuthService} from 'src/app/services/auth.service';
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


    constructor(private ProduitsService: GestionProduitsService, private MessageService: MessageService, private UserService: AuthService) {
    }

    ngOnInit(): void {
        this.ProduitsService.GetAllProduit().subscribe(data => {
            this.products = data
        })

    }

    updateForm: FormGroup = new FormGroup({
        _id: new FormControl(''),
        nom: new FormControl('', Validators.required),
        description: new FormControl('', Validators.required),
    })

    initUpdate(product: ProduitCRM) {
        this.selectedProduit = product
        this.updateForm.patchValue({...product})
    }

    onUpdate() {
        this.ProduitsService.UpdateProduit({...this.updateForm.value}).subscribe(data => {
            this.products.splice(this.products.indexOf(this.selectedProduit), 1, data)
            this.selectedProduit = null
            this.updateForm.reset()
            this.MessageService.add({
                severity: "success",
                summary: `Mis à jour du produit  ${data.nom} avec succès`
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
            this.MessageService.add({severity: "success", summary: `Ajout d'un nouveau produit avec succès`})
        })
    }

    delete(product: ProduitCRM) {
        if (confirm("Êtes-vous sûr de vouloir supprimer ce membre de l'équipe ?"))
            this.ProduitsService.DeleteProduit(product._id).subscribe(data => {
                this.products.splice(this.products.indexOf(product), 1)
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
        let id = Math.floor(Math.random() * 90000) + 10000; // Cela garantit un nombre entre 10000 et 99999
        this.createForm.patchValue({_id: id.toString()});
        this.updateForm.patchValue({_id: id.toString()});
    }



}
