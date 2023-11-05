import { Component, OnInit } from "@angular/core";
import { Language } from "../../shared/model/language.enum";
import { Router } from "@angular/router";
import { TaskService } from "../../shared/service/task.service";
import { DataStorageService } from "../../shared/service/data.storage.service";

@Component({
    selector: "app-acknowledgement",
    templateUrl: "./acknowledgement.component.html",
    styleUrls: ["./acknowledgement.component.scss"],
})
export class AcknowledgementComponent implements OnInit {
    language: Language = Language.GERMAN;

    protected readonly Language = Language;

    constructor(
        private router: Router,
        private taskService: TaskService,
        private dataStorageService: DataStorageService,
    ) {}

    ngOnInit(): void {
        this.language = this.taskService.chosenLanguage;
        const randomId = Math.floor(Math.random() * 1000000).toString();
        if (this.language === Language.GERMAN) {
            this.dataStorageService.downloadAllData(`GERMAN_${randomId}`);
        } else {
            this.dataStorageService.downloadAllData(`ENGLISH_${randomId}`);
        }
    }

    clickRestart() {
        this.router.navigate(["/welcome"]);
    }
}
