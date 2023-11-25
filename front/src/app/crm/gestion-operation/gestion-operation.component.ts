import { Component, OnInit } from '@angular/core';
import {ProduitCRM} from "../../models/produitCRM";
import {AuthService} from "../../services/auth.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {GestionOperationService} from "./gestion-operation.service";
import {MessageService} from 'primeng/api';
import {OperationCRM} from "../../models/operationCRM";

@Component({
  selector: 'app-gestion-operation',
  templateUrl: './gestion-operation.component.html',
  styleUrls: ['./gestion-operation.component.scss']
})
export class GestionOperationComponent implements OnInit {
    operations: OperationCRM[] = [];
    selectedOperation: OperationCRM;


    constructor(private OperationService: GestionOperationService, private MessageService: MessageService, private UserService: AuthService) {
    }

    ngOnInit(): void {
        this.OperationService.GetAllOperation().subscribe(data => {
            this.operations = data
        })

    }

    updateForm: FormGroup = new FormGroup({
        _id: new FormControl(''),
        nom: new FormControl('', Validators.required),
        description: new FormControl('', Validators.required),
    })

    initUpdate(product: ProduitCRM) {
        this.selectedOperation = product
        this.updateForm.patchValue({...product})
    }

    onUpdate() {
        this.OperationService.UpdateOperation({...this.updateForm.value}).subscribe(data => {
            this.operations.splice(this.operations.indexOf(this.selectedOperation), 1, data)
            this.selectedOperation = null
            this.updateForm.reset()
            this.MessageService.add({
                severity: "success",
                summary: `Mis à jour de l'opération  ${data.nom} avec succès`
            })
        })
    }

    createForm: FormGroup = new FormGroup({
        _id: new FormControl(''),
        nom: new FormControl('', Validators.required),
        description: new FormControl('', Validators.required),
    })

    newOperation = false

    initCreate() {
        this.newOperation = true
    }

    onCreate() {
        this.generateID()
        this.OperationService.CreateOperation({...this.createForm.value}).subscribe(data => {
            this.operations.push(data)
            this.newOperation = null
            this.createForm.reset()
            this.MessageService.add({severity: "success", summary: `Ajout d'une opération avec succès`})
        })
    }

    delete(product: ProduitCRM) {
        if (confirm("Êtes-vous sûr de vouloir supprimer cette opération ?"))
                this.OperationService.DeleteOperation(product._id).subscribe(data => {
                this.operations.splice(this.operations.indexOf(product), 1)
                this.MessageService.add({severity: "success", summary: `Suppression de l'opération avec succès`})
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
