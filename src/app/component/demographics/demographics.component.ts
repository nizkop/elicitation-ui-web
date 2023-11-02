import { Component } from "@angular/core";
import { Language } from "../../shared/model/language.enum";
import { Router } from "@angular/router";
import { FileService } from "../../shared/service/file.service";
import { MatSnackBar } from "@angular/material/snack-bar";

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

    constructor(
        private router: Router,
        private fileService: FileService,
        private snackBar: MatSnackBar,
    ) {}

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

            this.fileService.saveJsonFile(data, `21_demographics.json`);
        } else {
            this.snackBar.open("Bitte füllen Sie alle Felder aus", "Okay", {
                duration: 3000,
            });
        }
    }

    clickPreviousPage() {
        this.router.navigate(["/questionnaire/18"]);
    }

    clickNextPage() {
        this.saveData();
        this.router.navigate(["/acknowledgement"]);
    }
}
