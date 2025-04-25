import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Task } from "../../shared/model/task";
import { TaskService } from "../../shared/service/task.service";
import { Language } from "../../shared/model/language.enum";
import { DataStorageService } from "../../shared/service/data.storage.service";
import { RecordingService } from "../../shared/service/recording.service";

@Component({
    selector: "app-welcome",
    templateUrl: "./welcome.component.html",
    styleUrls: ["./welcome.component.scss"],
})
export class WelcomeComponent implements OnInit {
    chosenLanguage: Language = Language.ENGLISH;
    tasks: Task[] | undefined;
    showIntroPage = true;

    protected readonly Language = Language;

    constructor(
        private router: Router,
        private taskService: TaskService,
        private dataStorageService: DataStorageService,
        private recordingService: RecordingService,
    ) {}

    ngOnInit(): void {
        this.updateTasks();
        this.dataStorageService.clearData();
        this.recordingService.startRecording();
    }

    clickChangeLanguage() {
        if (this.chosenLanguage === Language.GERMAN) {
            this.chosenLanguage = Language.ENGLISH;
        } else {
            this.chosenLanguage = Language.GERMAN;
        }
        this.updateTasks();
    }

    clickNextPage() {
        this.router.navigate([`task/1`]);
    }

    updateTasks() {
        this.tasks = this.taskService.initData(this.chosenLanguage);
    }
}
