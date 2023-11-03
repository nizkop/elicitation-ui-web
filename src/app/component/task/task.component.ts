import { Component, OnInit, ViewChild } from "@angular/core";
import { TaskService } from "../../shared/service/task.service";
import { Task } from "../../shared/model/task";
import { Language } from "../../shared/model/language.enum";
import { ActivatedRoute, Router } from "@angular/router";
import { SketchComponent } from "../sketch/sketch.component";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Group } from "../../shared/model/group.enum";

@Component({
    selector: "app-task",
    templateUrl: "./task.component.html",
    styleUrls: ["./task.component.scss"],
})
export class TaskComponent implements OnInit {
    @ViewChild(SketchComponent) private sketchComponent!: SketchComponent;

    currentTask: Task | undefined;

    protected readonly Language = Language;
    protected readonly Group = Group;

    constructor(
        private taskService: TaskService,
        private route: ActivatedRoute,
        private router: Router,
        private snackBar: MatSnackBar,
    ) {}

    ngOnInit() {
        const taskNumber = +this.route.snapshot.params["taskNumber"];
        this.currentTask = this.taskService.loadedTasks?.find((task) => task.taskNumber === taskNumber);

        if (this.currentTask) {
            console.log("Current Task: ", this.currentTask.id);
        } else {
            console.log("Task not found");
        }
    }

    clickPreviousPage() {
        if (this.currentTask!.taskNumber === 2) {
            this.router.navigate(["/questionnaire/" + (this.currentTask!.taskNumber - 1).toString()]);
        } else {
            this.router.navigate(["/welcome"]);
        }
    }

    clickExitStudy() {
        this.router.navigate(["/demographics"]);
    }

    clickResetPage() {
        this.sketchComponent.saveTask(
            `${this.currentTask?.taskNumber}_task_detail${this.currentTask?.id}_resets${this.currentTask?.resets}`,
        );
        this.sketchComponent.saveDrawing(
            `${this.currentTask?.taskNumber}_drawing_task${this.currentTask?.id}_resets${this.currentTask?.resets}`,
        );
        this.currentTask!.resets = this.currentTask!.resets + 1;
    }

    clickNextPage() {
        if (this.sketchComponent.capturedLines.length == 0) {
            if (this.currentTask?.language === Language.GERMAN) {
                this.snackBar.open("Die Seite wurde noch nicht bearbeitet", "Okay", {
                    duration: 3000,
                });
            } else {
                this.snackBar.open("This page has not been edited yet", "Okay", {
                    duration: 3000,
                });
            }
            return;
        }
        //TODO: reset is not correctly saved in task_detail
        this.sketchComponent.saveTask(
            `${this.currentTask?.taskNumber}_task_detail${this.currentTask?.id}_resets${this.currentTask?.resets}`,
        );
        this.sketchComponent.saveDrawing(
            `${this.currentTask?.taskNumber}_drawing_task${this.currentTask?.id}_resets${this.currentTask?.resets}`,
        );
        this.router.navigate(["/questionnaire/" + this.currentTask!.taskNumber.toString()]);
    }
}
