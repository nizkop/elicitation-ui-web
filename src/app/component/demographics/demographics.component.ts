import { Component, OnInit } from "@angular/core";
import { Language } from "../../shared/model/language.enum";
import { Router } from "@angular/router";
import { FileService } from "../../shared/service/file.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { TaskService } from "../../shared/service/task.service";

@Component({
    selector: "app-demographics",
    templateUrl: "./demographics.component.html",
    styleUrls: ["./demographics.component.scss"],
})
export class DemographicsComponent implements OnInit {
    language: Language = Language.ENGLISH;

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
        private taskService: TaskService,
    ) {}

    ngOnInit(): void {
        this.language = this.taskService.chosenLanguage;
    }

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
            this.router.navigate(["/acknowledgement"]);
        } else {
            if (this.language === Language.GERMAN) {
                this.snackBar.open("Bitte füllen Sie alle Felder aus", "Okay", {
                    duration: 3000,
                });
            } else {
                this.snackBar.open("Please fill in all fields", "Okay", {
                    duration: 3000,
                });
            }
        }
    }

    clickPreviousPage() {
        this.router.navigate(["/questionnaire/18"]);
    }

    clickNextPage() {
        this.saveData();
    }
}
