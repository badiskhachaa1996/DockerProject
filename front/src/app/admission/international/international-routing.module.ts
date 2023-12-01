import { RouterModule, Routes } from "@angular/router";
import { NgModule } from '@angular/core';
import { SourcingComponent } from "./sourcing/sourcing.component";
import { AuthGuardService } from "src/app/dev-components/guards/auth-guard";
import { OrientationComponent } from "./orientation/orientation.component";
import { AdmissionIntComponent } from "./admission-int/admission-int.component";
import { ConsulaireComponent } from "./consulaire/consulaire.component";
import { PaiementsComponent } from "./paiements/paiements.component";
import { TeamsIntComponent } from "src/app/international/teams-int/teams-int.component";
import { MemberIntComponent } from "src/app/international/teams-int/member-int/member-int.component";
import { PovPartenaireAlternantsComponent } from "./pov-partenaire-alternants/pov-partenaire-alternants.component";
import { AjoutAlternantPartenaireComponent } from "./pov-partenaire-alternants/ajout-alternant-partenaire/ajout-alternant-partenaire.component";
import { PovPartenaireListProspectsComponent } from "./pov-partenaire-list-prospects/pov-partenaire-list-prospects.component";
import { GenDocLettreAcceptationComponent } from "src/app/international/generation-doc/gen-doc-lettre-acceptation/gen-doc-lettre-acceptation.component";
import { GenDocDerogationComponent } from "src/app/international/generation-doc/gen-doc-derogation/gen-doc-derogation.component";
import { GenDocPaiementAcompteComponent } from "src/app/international/generation-doc/gen-doc-paiement-acompte/gen-doc-paiement-acompte.component";
import { GenDocPaiementPreinscriptionAcompteComponent } from "src/app/international/generation-doc/gen-doc-paiement-preinscription-acompte/gen-doc-paiement-preinscription-acompte.component";
import { GenDocPaiementPreinscriptionComponent } from "src/app/international/generation-doc/gen-doc-paiement-preinscription/gen-doc-paiement-preinscription.component";
import { PaiementComponent } from "src/app/international/generation-doc/paiement/paiement.component";
import { GenDocPreinscriptionComponent } from "src/app/international/generation-doc/gen-doc-preinscription/gen-doc-preinscription.component";
import { GenDocInscriptionComponent } from "src/app/international/generation-doc/gen-doc-inscription/gen-doc-inscription.component";
import { GenerationDocComponent } from "src/app/international/generation-doc/generation-doc.component";
import { ActualiteComponent } from "src/app/international/actualite/actualite.component";
import { ListProspectsComponent } from "./list-prospects/list-prospects.component";
import { BrandsListComponent } from "src/app/international/support-marketing/brands-list/brands-list.component";
import { PerformanceComponent } from "src/app/international/dashboard-int/performance/performance.component";
import { DashboardIntComponent } from "src/app/international/dashboard-int/dashboard-int.component";
const routes: Routes = [
    {
        path: 'sourcing',
        component: SourcingComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: 'orientation',
        component: OrientationComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: 'admission',
        component: AdmissionIntComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: 'consulaire',
        component: ConsulaireComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: 'paiement',
        component: PaiementsComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: 'teams',
        component: TeamsIntComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: 'member',
        component: MemberIntComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: 'alternants',
        component: PovPartenaireAlternantsComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: 'partenaire/ajout-alternant/:code_commercial',
        component: AjoutAlternantPartenaireComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: 'partenaire/alternants/:id',
        component: PovPartenaireAlternantsComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: 'partenaire/:id',
        component: PovPartenaireListProspectsComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: 'dashboard',
        component: DashboardIntComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: 'dashboard/performance',
        component: PerformanceComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: 'brands/:id',
        component: BrandsListComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: 'brands',
        component: BrandsListComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: 'prospects',
        component: ListProspectsComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: 'actualite/:type',
        component: ActualiteComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: 'actualite',
        component: ActualiteComponent,
        canActivate: [AuthGuardService],
    },
    /* Generation Documents */
    {
        path: 'generation-documents',
        component: GenerationDocComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: 'generation-documents/inscription/:ecole/:prospect_id/:formation/:rentree',
        component: GenDocInscriptionComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: 'generation-documents/preinscription/:ecole/:prospect_id/:formation/:rentree',
        component: GenDocPreinscriptionComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: 'generation-documents/paiement/:ecole/:prospect_id/:formation/:rentree',
        component: PaiementComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: 'generation-documents/paiement-preinscription/:ecole/:prospect_id/:formation/:rentree',
        component: GenDocPaiementPreinscriptionComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: 'generation-documents/paiement-preinscription-acompte/:ecole/:prospect_id/:formation/:rentree',
        component: GenDocPaiementPreinscriptionAcompteComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: 'generation-documents/paiement-acompte/:ecole/:prospect_id/:formation/:rentree',
        component: GenDocPaiementAcompteComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: 'generation-documents/derogation/:ecole/:prospect_id/:formation/:rentree',
        component: GenDocDerogationComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: 'generation-documents/lettre-acceptation/:ecole/:prospect_id/:formation/:rentree',
        component: GenDocLettreAcceptationComponent,
        canActivate: [AuthGuardService],
    },
]
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class InternationalRoutingModule { }