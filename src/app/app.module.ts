import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './home/home.component';
import { RouterModule } from '@angular/router';
import { MenuBarComponent } from './menu-bar/menu-bar.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { HelpComponent } from './help/help.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SafePipe } from 'src/environments/selfPipe';
import { OverlayModule } from '@angular/cdk/overlay';
import { ProgressSpinnerComponent } from './progress-spinner/progress-spinner.component';
import { IframeGeneratorComponent } from './iframe-generator/iframe-generator.component';
import { CreditsComponent } from './credits/credits.component';
import { PlatformModule } from '@angular/cdk/platform';
import { MatTooltipModule } from '@angular/material/tooltip';
import { environment } from "../environments/environment";
import { AngularFireModule } from "@angular/fire/compat";
import { AngularFireAuthModule } from "@angular/fire/compat/auth";
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { DevelopComponent } from './develop/develop.component';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { SchedaPersonaggioComponent } from './scheda-pg/scheda-personaggio/scheda-personaggio.component';
import { ModaleSkillsComponent } from './scheda-pg/modale-skills/modale-skills.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ModaleChiericoComponent } from './scheda-pg/modale-chierico/modale-chierico.component';
import { ModalePaladinoComponent } from './scheda-pg/modale-paladino/modale-paladino.component';
import { FinishWizardComponent } from './scheda-pg/finish-wizard/finish-wizard.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HomeViewComponent } from './home-view/home-view.component';
import { InfoSkillsComponent } from './scheda-pg/info-skills/info-skills.component';
import { PasswordStrenghtMeterComponent } from './password-strenght-meter/password-strenght-meter.component';
import { TemplateStatSkillsComponent } from './scheda-pg/template-stat-skills/template-stat-skills.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { BachecaComponent } from './impagina-bacheca/bacheca/bacheca/bacheca.component';
import { MacroComponent } from './macro/macro/macro.component';
import { MacroListComponent } from './macro/macro-list/macro-list.component';
import { MacroInsertEditComponent } from './macro/macro-insert-edit/macro-insert-edit.component';
import { MatTableModule } from '@angular/material/table';
import { MacroMultiInsertComponent } from './macro/macro-multi-insert/macro-multi-insert.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AppInitializerService } from './service/appInitializer.service';
import { ShareLinkComponent } from './share-link/share-link.component';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { NewsComponent } from './news/news.component';
import { AdminComponent } from './admin-components/admin/admin.component';
import { TicketsComponent } from './admin-components/tickets/tickets.component';
import { UtentiComponent } from './admin-components/utenti/utenti.component';
import { FlussoDatiComponent } from './admin-components/flusso-dati/flusso-dati.component';
import { AggiungiNewsComponent } from './admin-components/aggiungi-news/aggiungi-news.component';
import { TimestampToDatePipe } from './utils/timestamp-to-date.pipe';
import { RoleGuard } from './service/roleGuard';
import { NgChartsModule } from 'ng2-charts';
import { FooterComponent } from './footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MenuBarComponent,
    HelpComponent,
    SafePipe,
    ProgressSpinnerComponent,
    IframeGeneratorComponent,
    CreditsComponent,
    FooterComponent,
    DevelopComponent,
    SchedaPersonaggioComponent,
    ModaleSkillsComponent,
    ModaleChiericoComponent,
    ModalePaladinoComponent,
    FinishWizardComponent,
    HomeViewComponent,
    InfoSkillsComponent,
    PasswordStrenghtMeterComponent,
    TemplateStatSkillsComponent,
    BachecaComponent,
    MacroComponent,
    MacroListComponent,
    MacroInsertEditComponent,
    MacroMultiInsertComponent,
    ShareLinkComponent,
    NewsComponent,
    AdminComponent,
    TicketsComponent,
    UtentiComponent,
    FlussoDatiComponent,
    AggiungiNewsComponent,
    TimestampToDatePipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSlideToggleModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatIconModule,
    MatToolbarModule,
    MatSidenavModule,
    MatDividerModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    OverlayModule,
    PlatformModule,
    MatTooltipModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    FormsModule,
    MatSelectModule,
    MatInputModule,
    MatCheckboxModule,
    MatCardModule,
    MatDialogModule,
    MatExpansionModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatStepperModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    HttpClientModule,
    ClipboardModule,
    BrowserAnimationsModule,
    NgChartsModule
  ],
  providers: [
    SafePipe,
    MatDialog,
    HttpClient,
    AppInitializerService,
    {
      provide: APP_INITIALIZER,
      useFactory: (appInitializer: AppInitializerService) => () => appInitializer.initializeApp(),
      deps: [AppInitializerService],
      multi: true
    },
    RoleGuard
  ],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class AppModule { }
