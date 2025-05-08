import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Task } from "../../shared/model/task";
import { TaskService } from "../../shared/service/task.service";
import { Language } from "../../shared/model/language.enum";
import { DataStorageService } from "../../shared/service/data.storage.service";
import { MessageService } from "../../shared/service/message.service";

@Component({
    selector: "app-questionnaire",
    templateUrl: "./questionnaire.component.html",
    styleUrls: ["./questionnaire.component.scss"],
})
export class QuestionnaireComponent implements OnInit {
    currentTask: Task | undefined;

    question1_GERMAN = "Wie einfach ist dieses Szenario?";
    question1_ENGLISH = "How easy is this scenario?";
    // question2_GERMAN = "Wie zufrieden sind Sie mit Ihrem Kommando (Skizze und/oder Spracheingabe)?";
    // question2_ENGLISH = "How satisfied are you with your command (sketch and/or voice input)?";

    formQuestion1 = "";
    formQuestion2 = "";

    startTime: Date | undefined;

    protected readonly Language = Language;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private taskService: TaskService,
        private dataStorageService: DataStorageService,
        private messageService: MessageService,
    ) {}

    ngOnInit(): void {
        const taskNumber = +this.route.snapshot.params["taskNumber"];
        this.currentTask = this.taskService.loadedTasks?.find((task) => task.taskNumber === taskNumber);

        if (this.currentTask) {
            console.log("Current Task: ", this.currentTask.id);
        } else {
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

    saveData(): void {
        const questionnaireData = {
            id: this.currentTask?.id,
            picture: this.currentTask?.picture_file_name,
            question1: this.currentTask?.language === Language.GERMAN ? this.question1_GERMAN : this.question1_ENGLISH,
            answer1: this.formQuestion1,
            startTime: this.startTime,
            endTime: new Date(),
        };


        this.dataStorageService.saveData(
            `${this.currentTask?.taskNumber}_questionnaire_${this.currentTask?.get_information()}.json`,
            new Blob([JSON.stringify(questionnaireData, null, 2)], { type: "application/json" }),
        )
    }
}
