import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { CreditsComponent } from './credits/credits.component';
import { DevelopComponent } from './develop/develop.component';
import { HelpComponent } from './help/help.component';
import { HomeViewComponent } from './home-view/home-view.component';
import { HomeComponent } from './home/home.component';
import { BachecaComponent } from './impagina-bacheca/bacheca/bacheca/bacheca.component';
import { MacroComponent } from './macro/macro/macro.component';
import { FinishWizardComponent } from './scheda-pg/finish-wizard/finish-wizard.component';
import { SchedaPersonaggioComponent } from './scheda-pg/scheda-personaggio/scheda-personaggio.component';
import { NewsComponent } from './news/news.component';
import { AdminComponent } from './admin-components/admin/admin.component';
import { TicketsComponent } from './admin-components/tickets/tickets.component';
import { FlussoDatiComponent } from './admin-components/flusso-dati/flusso-dati.component';
import { AggiungiNewsComponent } from './admin-components/aggiungi-news/aggiungi-news.component';
import { UtentiComponent } from './admin-components/utenti/utenti.component';
import { RoleGuard } from './service/roleGuard';
import { MonsterDexViewComponent } from './monster-dex/monster-dex-view/monster-dex-view.component';
import { MonsterDexTreeComponent } from './monster-dex/monster-dex-tree/monster-dex-tree.component';
import { StatisticheViewComponent } from './user-panel/statistiche/statistiche-view/statistiche-view.component';
import { RoleGuardUtente } from './service/roleGuardUtente';
import { ValidatoreViewComponent } from './user-panel/validatore/validatore-view/validatore-view.component';

const routes: Routes = [

  {path: "test",  component: AppComponent},
  {path: "help",  component: HelpComponent},
  {path: "credits",  component: CreditsComponent},
  {path: "develop",  component: DevelopComponent},
  {path: "schedaPersonaggio",  component: SchedaPersonaggioComponent},
  {path: "monsterDex",  component: MonsterDexViewComponent},
  {path: "bacheca",  component: BachecaComponent},
  {path: "macro",  component: MacroComponent},
  {path: "news",  component: NewsComponent},
  {path: "admin",  component: AdminComponent, canActivate: [RoleGuard] },
  {path: "statistiche-view",  component: StatisticheViewComponent, canActivate: [RoleGuardUtente]},
  {path: "validatore-view",  component: ValidatoreViewComponent, canActivate: [RoleGuardUtente]},
  {path: "tickets",  component: TicketsComponent, canActivate: [RoleGuard]},
  {path: "flussoDati",  component: FlussoDatiComponent, canActivate: [RoleGuard]},
  {path: "aggiungi-news",  component: AggiungiNewsComponent, canActivate: [RoleGuard]},
  {path: "utenti",  component: UtentiComponent, canActivate: [RoleGuard]},


  {path: "",  component: HomeViewComponent},




];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
