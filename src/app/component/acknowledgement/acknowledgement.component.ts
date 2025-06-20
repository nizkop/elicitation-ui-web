import { Component, OnInit } from "@angular/core";
import { Language } from "../../shared/model/language.enum";
import { Router } from "@angular/router";
import { TaskService } from "../../shared/service/task.service";
import { DataStorageService } from "../../shared/service/data.storage.service";
import { RecordingService } from "../../shared/service/recording.service";
import {TranslationService} from "../../shared/service/translation.service";

@Component({
    selector: "app-acknowledgement",
    templateUrl: "./acknowledgement.component.html",
    styleUrls: ["./acknowledgement.component.scss"],
})
export class AcknowledgementComponent implements OnInit {
    language: Language = this.taskService.chosenLanguage;

    protected readonly Language = Language;

    constructor(
        private router: Router,
        private taskService: TaskService,
        private dataStorageService: DataStorageService,
        private recordingService: RecordingService,
        public TranslationService: TranslationService
    ) {}

    async ngOnInit() {
        this.TranslationService.set_language(this.language);
        let fileName: string;
        const randomId = Math.floor(Math.random() * 1000000).toString();
        switch (this.language) {
          case Language.GERMAN:
            fileName = `GERMAN_${randomId}`;
            break;
          case Language.ICELANDIC:
            fileName = `ISLANDIC_${randomId}`;
            break;
          case Language.ENGLISH:
          default:
            fileName = `ENGLISH_${randomId}`;
            break;
        }
        try {
            if (this.recordingService.recordingNotSupported()) {
                this.dataStorageService.downloadAllData(fileName);
            } else {
                await this.recordingService.stopRecording();

                this.recordingService.getRecordingStoppedEvent().subscribe(async () => {
                    this.dataStorageService.downloadAllData(fileName);
                });
            }
        } catch (error) {
            console.error("Fehler beim Stoppen der Aufnahme", error);
        }
    }

    translator(key: string): string {
        return this.TranslationService.translate("acknowledgement_"+key);
    }

    clickRestart() {
        this.router.navigate(["/welcome"]);
    }
}
