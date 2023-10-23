import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TaskComponent } from './component/task/task.component';
import { WelcomeComponent } from './component/welcome/welcome.component';
import { PlaygroundComponent } from './component/playground/playground.component';
import { QuestionnaireComponent } from './component/questionnaire/questionnaire.component';
import { AcknowledgementComponent } from './component/acknowledgement/acknowledgement.component';
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatGridListModule} from "@angular/material/grid-list";

@NgModule({
  declarations: [
    AppComponent,
    TaskComponent,
    WelcomeComponent,
    PlaygroundComponent,
    QuestionnaireComponent,
    AcknowledgementComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NoopAnimationsModule,
    MatButtonModule,
    MatIconModule,
    MatGridListModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
