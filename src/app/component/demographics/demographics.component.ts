import { Component, OnInit } from "@angular/core";
import { Language } from "../../shared/model/language.enum";
import { Router } from "@angular/router";
import { TaskService } from "../../shared/service/task.service";
import { DataStorageService } from "../../shared/service/data.storage.service";
import { MessageService } from "../../shared/service/message.service";

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
        private taskService: TaskService,
        private dataStorageService: DataStorageService,
        private messageService: MessageService,
    ) {}

    ngOnInit(): void {
        this.language = this.taskService.chosenLanguage;
    }

    //TODO: Refactor
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

        this.dataStorageService.saveData(
            `21_demographics.json`,
            new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }),
        );
    }

    clickPreviousPage() {
        this.router.navigate(["/questionnaire/18"]);
    }

    clickNextPage() {
        if (this.checkFormCompletion()) {
            this.saveData();
            this.router.navigate(["/acknowledgement"]);
        } else {
            this.messageService.notCompletedForm(this.language);
        }
    }
}
