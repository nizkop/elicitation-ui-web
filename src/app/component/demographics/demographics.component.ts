import { Component } from "@angular/core";
import { Language } from "../../shared/model/language.enum";
import { Router } from "@angular/router";

@Component({
    selector: "app-demographics",
    templateUrl: "./demographics.component.html",
    styleUrls: ["./demographics.component.scss"],
})
export class DemographicsComponent {
    language: Language = Language.GERMAN;

    protected readonly Language = Language;

    age: string = "";
    gender: string = "";
    leftHandedOrRightHanded: string = "";
    ownATablet: boolean = false;
    useTablet: string = "";
    usePencil: boolean = false;
    useSpreadsheets: boolean = false;
    anyExperience: boolean = false;
    useSpreadsheetsMultiTouch: boolean = false;

    constructor(private router: Router) {}

    checkFormCompletion(): boolean {
        if (this.gender === "" || this.age === "" || this.leftHandedOrRightHanded === "") {
            return false;
        }
        if (this.ownATablet && this.useTablet === "") {
            return false;
        }
        return true;
    }

    saveData(): void {
        if (this.checkFormCompletion()) {
            const data = {
                gender: this.gender,
                age: this.age,
                leftHandedOrRightHanded: this.leftHandedOrRightHanded,
                ownATablet: this.ownATablet,
                useTablet: this.useTablet,
                usePencil: this.usePencil,
                useSpreadsheets: this.useSpreadsheets,
                anyExperience: this.anyExperience,
                useSpreadsheetsMultiTouch: this.useSpreadsheetsMultiTouch,
            };

            // JSON schön formatieren
            const formattedJson = JSON.stringify(data, null, 2);

            // JSON in einen Blob umwandeln
            const jsonData = new Blob([formattedJson], { type: "application/json" });

            // Erstellen Sie einen Blob und verknüpfen Sie ihn mit einem Download-Link
            const blob = new Blob([jsonData], { type: "application/json" });
            const downloadLink = document.createElement("a");
            downloadLink.href = URL.createObjectURL(blob);
            downloadLink.download = "demographics.json";

            // JSON herunterladen
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        } else {
            // Zeigen Sie eine Fehlermeldung an oder tun Sie etwas anderes, wenn das Formular nicht vollständig ist.
        }
    }

    clickPreviousPage() {
        this.router.navigate(["/task/18"]);
    }
    clickNextPage() {
        this.saveData();
        //this.router.navigate(["/acknowledgement"]);
    }
}
