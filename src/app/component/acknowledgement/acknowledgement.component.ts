import { Component } from "@angular/core";
import { Language } from "../../shared/model/language.enum";
import { Router } from "@angular/router";

@Component({
    selector: "app-acknowledgement",
    templateUrl: "./acknowledgement.component.html",
    styleUrls: ["./acknowledgement.component.scss"],
})
export class AcknowledgementComponent {
    language: Language = Language.GERMAN;

    protected readonly Language = Language;

    constructor(private router: Router) {}

    clickRestart() {
        this.router.navigate(["/welcome"]);
    }
}
