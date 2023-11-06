import { Component, OnInit } from "@angular/core";
import { Language } from "../../shared/model/language.enum";
import { Router } from "@angular/router";
import { TaskService } from "../../shared/service/task.service";
import { DataStorageService } from "../../shared/service/data.storage.service";
import { RecordingService } from "../../shared/service/recording.service";

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
        private recordingService: RecordingService,
    ) {}

    async ngOnInit() {
        try {
            await this.recordingService.stopRecording();

            this.language = this.taskService.chosenLanguage;
            const randomId = Math.floor(Math.random() * 1000000).toString();
            const fileName = this.language === Language.GERMAN ? `GERMAN_${randomId}` : `ENGLISH_${randomId}`;
            this.dataStorageService.downloadAllData(fileName);
        } catch (error) {
            console.error("Fehler beim Stoppen der Aufnahme", error);
        }
    }

    clickRestart() {
        this.router.navigate(["/welcome"]);
    }
}
