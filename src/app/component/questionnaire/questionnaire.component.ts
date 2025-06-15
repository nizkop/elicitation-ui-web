import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Task } from "../../shared/model/task";
import { TaskService } from "../../shared/service/task.service";
import { Language } from "../../shared/model/language.enum";
import { DataStorageService } from "../../shared/service/data.storage.service";
import { MessageService } from "../../shared/service/message.service";
import {TranslationService} from "../../shared/service/translation.service";

@Component({
    selector: "app-questionnaire",
    templateUrl: "./questionnaire.component.html",
    styleUrls: ["./questionnaire.component.scss"],
})
export class QuestionnaireComponent implements OnInit {
    currentTask: Task | undefined;


    formQuestion1 = "";
    startTime: Date | undefined;

    protected readonly Language = Language;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private taskService: TaskService,
        private dataStorageService: DataStorageService,
        private messageService: MessageService,
        public TranslationService: TranslationService
    ) {}

    ngOnInit(): void {
        const taskNumber = +this.route.snapshot.params["taskNumber"];
        this.currentTask = this.taskService.loadedTasks?.find((task) => task.taskNumber === taskNumber);

        if (this.currentTask) {
            this.TranslationService.set_language(this.currentTask.language);
            console.log("Current Task: ", this.currentTask.id);
        } else {
            this.TranslationService.set_language(Language.ENGLISH);
            console.log("Task not found");
        }

        this.startTime = new Date();
    }

    checkFormCompletion(): boolean {
        return !(this.formQuestion1 === "");
    }

    clickExitStudy() {
        this.router.navigate(["/demographics"]);
    }

    clickPreviousPage() {
        this.router.navigate(["/task/" + this.currentTask!.taskNumber.toString()]);
    }

    clickNextPage(): void {
        if (this.checkFormCompletion()) {
            this.saveData();

            this.nextPage();
        } else {
            this.messageService.notCompletedForm(this.currentTask!.language);
        }
    }

    nextPage(): void {
        if (this.currentTask?.taskNumber === this.taskService.loadedTasks.length) {
            this.router.navigate(["/demographics"]);
        } else {
            this.router.navigate(["/task/" + (this.currentTask!.taskNumber + 1).toString()]);
        }
    }

    translator(key: string): string {
        return this.TranslationService.translate("task_"+key);
    }

    saveData(): void {
        const questionnaireData = {
            id: this.currentTask?.id,
            picture_file_name: this.currentTask?.picture_file_name,
            question1: this.translator("questionnaire_question1"),
            answer1: this.formQuestion1,
            startTime: this.startTime,
            endTime: new Date(),
        };

        this.dataStorageService.saveData(
            `questionnaire_task_${this.currentTask?.id}.json`,
            new Blob([JSON.stringify(questionnaireData, null, 2)], { type: "application/json" }),
        );
    }
}
