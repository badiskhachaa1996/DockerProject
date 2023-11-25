import { Component, OnInit } from '@angular/core';
import {OperationCRM} from "../../models/operationCRM";
import {AuthService} from "../../services/auth.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ProduitCRM} from "../../models/produitCRM";
import {MessageService} from 'primeng/api';
import {GestionSourcesServices} from "./gestion-sources.services";
import {SourceCRM} from "../../models/sourceCRM";


@Component({
  selector: 'app-gestion-srources',
  templateUrl: './gestion-srources.component.html',
  styleUrls: ['./gestion-srources.component.scss']
})
export class GestionSrourcesComponent implements OnInit {
    sources: SourceCRM[] = [];
    selectedSource: SourceCRM;


    constructor(private ResourceService: GestionSourcesServices, private MessageService: MessageService, private UserService: AuthService) {
    }

    ngOnInit(): void {
        this.ResourceService.GetAllSource().subscribe(data => {
            this.sources = data
        })

    }

    updateForm: FormGroup = new FormGroup({
        _id: new FormControl(''),
        nom: new FormControl('', Validators.required)
    })

    initUpdate(product: ProduitCRM) {
        this.selectedSource = product
        this.updateForm.patchValue({...product})
    }

    onUpdate() {
        this.ResourceService.UpdateSource({...this.updateForm.value}).subscribe(data => {
            this.sources.splice(this.sources.indexOf(this.selectedSource), 1, data)
            this.selectedSource = null
            this.updateForm.reset()
            this.MessageService.add({
                severity: "success",
                summary: `Mis à jour de la source  ${data.nom} avec succès`
            })
        })
    }

    createForm: FormGroup = new FormGroup({
        _id: new FormControl(''),
        nom: new FormControl('', Validators.required),
    })

    newSource = false

    initCreate() {
        this.newSource = true
    }

    onCreate() {
        this.generateID()
        this.ResourceService.CreateSource({...this.createForm.value}).subscribe(data => {
            this.sources.push(data)
            this.newSource = null
            this.createForm.reset()
            this.MessageService.add({severity: "success", summary: `Ajout de source avec succès`})
        })
    }

    delete(product: ProduitCRM) {
        if (confirm("Êtes-vous sûr de vouloir supprimer cette opération ?"))
            this.ResourceService.DeleteSource(product._id).subscribe(data => {
                this.sources.splice(this.sources.indexOf(product), 1)
                this.MessageService.add({severity: "success", summary: `Suppression de l'operation avec succès`})
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
