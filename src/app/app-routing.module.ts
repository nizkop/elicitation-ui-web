import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TaskComponent } from "./component/task/task.component";
import { PlaygroundComponent } from "./component/playground/playground.component";
import { WelcomeComponent } from "./component/welcome/welcome.component";
import { DemographicsComponent } from "./component/demographics/demographics.component";
import { AcknowledgementComponent } from "./component/acknowledgement/acknowledgement.component";
import { QuestionnaireComponent } from "./component/questionnaire/questionnaire.component";

const routes: Routes = [
    //TODO: Redirect to login only if user is loggedOut
    { path: "", redirectTo: "welcome", pathMatch: "full" },
    { path: "welcome", component: WelcomeComponent },
    { path: "playground/:taskNumber", component: PlaygroundComponent },
    { path: "task/:taskNumber", component: TaskComponent },
    { path: "questionnaire/:taskNumber", component: QuestionnaireComponent },
    { path: "demographics", component: DemographicsComponent },
    { path: "acknowledgement", component: AcknowledgementComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule],
})
export class AppRoutingModule {}
