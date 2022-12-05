import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { CreditsComponent } from './credits/credits.component';
import { DevelopComponent } from './develop/develop.component';
import { HelpComponent } from './help/help.component';
import { HomeComponent } from './home/home.component';
import { SchedaPersonaggioComponent } from './scheda-personaggio/scheda-personaggio.component';

const routes: Routes = [

  {path: "test",  component: AppComponent},
  {path: "help",  component: HelpComponent},
  {path: "credits",  component: CreditsComponent},
  {path: "develop",  component: DevelopComponent},
  {path: "schedaPersonaggio",  component: SchedaPersonaggioComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
