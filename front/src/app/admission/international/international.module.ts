import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from "primeng/table";
import { ToastModule } from "primeng/toast";
import { MultiSelectModule } from "primeng/multiselect";
import { DropdownModule } from "primeng/dropdown";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FileUploadModule } from "primeng/fileupload";
import { DialogModule } from "primeng/dialog";
import { TabViewModule } from "primeng/tabview";
import { CalendarModule } from "primeng/calendar";
import { SelectButtonModule } from "primeng/selectbutton";
import { InternationalRoutingModule } from './international-routing.module';
import { AdmissionIntComponent } from './admission-int/admission-int.component';
import { ConsulaireComponent } from './consulaire/consulaire.component';
import { ListProspectsComponent } from './list-prospects/list-prospects.component';
import { OrientationComponent } from './orientation/orientation.component';
import { PaiementsComponent } from './paiements/paiements.component';
import { PovPartenaireAlternantsComponent } from './pov-partenaire-alternants/pov-partenaire-alternants.component';
import { PovPartenaireListProspectsComponent } from './pov-partenaire-list-prospects/pov-partenaire-list-prospects.component';
import { SourcingComponent } from './sourcing/sourcing.component';
import { AjoutAlternantPartenaireComponent } from './pov-partenaire-alternants/ajout-alternant-partenaire/ajout-alternant-partenaire.component';
import { MemberIntComponent } from 'src/app/international/teams-int/member-int/member-int.component';
import { TeamsIntComponent } from 'src/app/international/teams-int/teams-int.component';
import { GenDocLettreAcceptationComponent } from 'src/app/international/generation-doc/gen-doc-lettre-acceptation/gen-doc-lettre-acceptation.component';
import { GenDocDerogationComponent } from 'src/app/international/generation-doc/gen-doc-derogation/gen-doc-derogation.component';
import { GenDocPaiementAcompteComponent } from 'src/app/international/generation-doc/gen-doc-paiement-acompte/gen-doc-paiement-acompte.component';
import { GenDocPaiementPreinscriptionAcompteComponent } from 'src/app/international/generation-doc/gen-doc-paiement-preinscription-acompte/gen-doc-paiement-preinscription-acompte.component';
import { GenDocPaiementPreinscriptionComponent } from 'src/app/international/generation-doc/gen-doc-paiement-preinscription/gen-doc-paiement-preinscription.component';
import { PaiementComponent } from 'src/app/international/generation-doc/paiement/paiement.component';
import { GenDocPreinscriptionComponent } from 'src/app/international/generation-doc/gen-doc-preinscription/gen-doc-preinscription.component';
import { GenDocInscriptionComponent } from 'src/app/international/generation-doc/gen-doc-inscription/gen-doc-inscription.component';
import { GenerationDocComponent } from 'src/app/international/generation-doc/generation-doc.component';
import { ActualiteComponent } from 'src/app/international/actualite/actualite.component';
import { BrandsListComponent } from 'src/app/international/support-marketing/brands-list/brands-list.component';
import { PerformanceComponent } from 'src/app/international/dashboard-int/performance/performance.component';
import { DashboardIntComponent } from 'src/app/international/dashboard-int/dashboard-int.component';
import { SidebarModule } from 'primeng/sidebar';
import { TimelineModule } from 'primeng/timeline';
import { ChartModule } from 'primeng/chart';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TooltipModule } from 'primeng/tooltip';
@NgModule({
    declarations: [
        AdmissionIntComponent,
        ConsulaireComponent,
        ListProspectsComponent,
        OrientationComponent,
        PaiementsComponent,
        PovPartenaireAlternantsComponent,
        PovPartenaireListProspectsComponent,
        SourcingComponent,
        AjoutAlternantPartenaireComponent,
        MemberIntComponent,
        TeamsIntComponent,
        GenDocLettreAcceptationComponent,
        GenDocDerogationComponent,
        GenDocPaiementAcompteComponent,
        GenDocPaiementPreinscriptionAcompteComponent,
        GenDocPaiementPreinscriptionComponent,
        PaiementComponent,
        GenDocPreinscriptionComponent,
        GenDocInscriptionComponent,
        GenerationDocComponent,
        ActualiteComponent,
        BrandsListComponent,
        PerformanceComponent,
        DashboardIntComponent
    ],
    imports: [
        CommonModule,
        InternationalRoutingModule,
        TableModule,
        ToastModule,
        MultiSelectModule,
        DropdownModule,
        ReactiveFormsModule,
        FileUploadModule,
        FormsModule,
        DialogModule,
        TabViewModule,
        CalendarModule,
        SelectButtonModule,
        SidebarModule,
        TimelineModule,
        ChartModule,
        ButtonModule,
        SkeletonModule,
        InputTextModule,
        InputTextareaModule,
        TooltipModule,
    ]
})
export class InternationalModule { }
