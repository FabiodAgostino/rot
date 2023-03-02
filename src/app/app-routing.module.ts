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

const routes: Routes = [

  {path: "test",  component: AppComponent},
  {path: "help",  component: HelpComponent},
  {path: "credits",  component: CreditsComponent},
  {path: "develop",  component: DevelopComponent},
  {path: "schedaPersonaggio",  component: SchedaPersonaggioComponent},
  {path: "bacheca",  component: BachecaComponent},
  {path: "macro",  component: MacroComponent},
  {path: "",  component: HomeViewComponent},



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
