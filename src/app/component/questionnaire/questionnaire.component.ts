import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Task } from "../../shared/model/task";
import { TaskService } from "../../shared/service/task.service";
import { Language } from "../../shared/model/language.enum";
import { FileService } from "../../shared/service/file.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Group } from "../../shared/model/group.enum";

@Component({
    selector: "app-questionnaire",
    templateUrl: "./questionnaire.component.html",
    styleUrls: ["./questionnaire.component.scss"],
})
export class QuestionnaireComponent implements OnInit {
    currentTask: Task | undefined;

    question1_GERMAN = "Wie einfach kann man dieses Szenario sketchen?";
    question1_ENGLISH = "Wie einfach kann man dieses Szenario sketchen?";
    question2_GERMAN = "Wie zufrieden sind Sie mit Ihrem Sketch?";
    question2_ENGLISH = "Wie zufrieden sind Sie mit Ihrem Sketch?";

    formQuestion1 = "";
    formQuestion2 = "";

    startTime: Date | undefined;

    protected readonly Language = Language;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private taskService: TaskService,
        private fileService: FileService,
        private snackBar: MatSnackBar,
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
        return !(this.formQuestion1 === "" || this.formQuestion2 === "");
    }

    clickExitStudy() {
        this.router.navigate(["/demographics"]);
    }

    clickPreviousPage() {
        if (this.currentTask!.taskNumber === 3) {
            this.router.navigate(["/playground/" + (this.currentTask!.taskNumber - 1).toString()]);
        } else {
            this.router.navigate(["/task/" + (this.currentTask!.taskNumber - 1).toString()]);
        }
    }

    clickNextPage(): void {
        if (this.checkFormCompletion()) {
            const questionnaireData = {
                id: this.currentTask?.id,
                question1:
                    this.currentTask?.language === Language.GERMAN ? this.question1_GERMAN : this.question1_ENGLISH,
                question2:
                    this.currentTask?.language === Language.GERMAN ? this.question2_GERMAN : this.question2_ENGLISH,
                answer1: this.formQuestion1,
                answer2: this.formQuestion2,
                startTime: this.startTime,
                endTime: new Date(),
            };

            this.fileService.saveJsonFile(
                questionnaireData,
                `${this.currentTask?.taskNumber}_questionnaire_task${this.currentTask?.id}.json`,
            );

            if (this.currentTask?.taskNumber === this.taskService.loadedTasks.length) {
                this.router.navigate(["/demographics"]);
            } else {
                this.router.navigate(["/task/" + (this.currentTask!.taskNumber + 1).toString()]);
            }
        } else {
            if (this.currentTask?.language === Language.GERMAN) {
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
}
