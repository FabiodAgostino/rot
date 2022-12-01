import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './home/home.component';
import { RouterModule } from '@angular/router';
import { MenuBarComponent } from './menu-bar/menu-bar.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatNativeDateModule } from '@angular/material/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatButtonModule} from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { HelpComponent } from './help/help.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { SafePipe } from 'src/environments/selfPipe';
import { OverlayModule } from '@angular/cdk/overlay';
import { ProgressSpinnerComponent } from './progress-spinner/progress-spinner.component';
import { IframeGeneratorComponent } from './iframe-generator/iframe-generator.component';
import { CreditsComponent } from './credits/credits.component';
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
    MatProgressSpinnerModule,

  ],
  providers: [SafePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
