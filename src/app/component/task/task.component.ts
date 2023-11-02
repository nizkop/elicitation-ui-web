import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { TaskService } from "../../shared/service/task.service";
import { Task } from "../../shared/model/task";
import { Language } from "../../shared/model/language.enum";
import { ActivatedRoute, Router } from "@angular/router";
import { SketchComponent } from "../sketch/sketch.component";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
    selector: "app-task",
    templateUrl: "./task.component.html",
    styleUrls: ["./task.component.scss"],
})
export class TaskComponent implements OnInit {
    @ViewChild(SketchComponent) private sketchComponent!: SketchComponent;

    tasks: Task[] | undefined;
    currentTask: Task | undefined;

    protected readonly Language = Language;

    constructor(
        private taskService: TaskService,
        private route: ActivatedRoute,
        private router: Router,
        private snackBar: MatSnackBar,
    ) {}

    ngOnInit() {
        //TODO: capturedLines is already defined in Task Model -> update Model with the same id
        this.tasks = this.taskService.initData(Language.GERMAN);
        const taskNumber = +this.route.snapshot.params["taskNumber"];
        this.currentTask = this.tasks?.find((task) => task.taskNumber === taskNumber);

        if (this.currentTask) {
            console.log(this.currentTask);
        } else {
            console.log("Aufgabe nicht gefunden");
        }
    }

    clickPreviousPage() {
        if (this.currentTask!.taskNumber === 3) {
            //TODO: Add router for questionnaire
            this.router.navigate(["/playground/" + (this.currentTask!.taskNumber - 1).toString()]);
        } else {
            this.router.navigate(["/task/" + (this.currentTask!.taskNumber - 1).toString()]);
        }
    }
    clickResetPage() {
        //TODO: save the current sketch and increment reset variable
        this.sketchComponent.resetDrawing();
    }
    clickNextPage() {
        if (this.sketchComponent.capturedLines.length == 0) {
            //TODO: English message
            this.snackBar.open("Die Seite wurde noch nicht bearbeitet", "Okay", {
                duration: 3000,
            });
            return;
        }
        this.sketchComponent.saveDrawing();
        if (this.currentTask!.taskNumber === this.tasks?.length) {
            this.router.navigate(["/demographics"]);
        } else {
            this.router.navigate(["/task/" + (this.currentTask!.taskNumber + 1).toString()]);
        }
    }
}
