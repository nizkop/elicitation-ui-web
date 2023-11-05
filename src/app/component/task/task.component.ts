import { Component, OnInit, ViewChild } from "@angular/core";
import { TaskService } from "../../shared/service/task.service";
import { Task } from "../../shared/model/task";
import { Language } from "../../shared/model/language.enum";
import { ActivatedRoute, Router } from "@angular/router";
import { SketchComponent } from "../sketch/sketch.component";
import { Group } from "../../shared/model/group.enum";
import { MessageService } from "../../shared/service/message.service";

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
        private messageService: MessageService,
    ) {}

    ngOnInit() {
        //TODO: Can be removed?
        const taskNumber = +this.route.snapshot.params["taskNumber"];
        this.currentTask = this.taskService.loadedTasks?.find((task) => task.taskNumber === taskNumber);

        if (this.currentTask) {
        } else {
            this.messageService.taskNotFound();
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
        this.saveData();
    }

    clickNextPage() {
        if (this.sketchComponent.capturedLines.length == 0) {
            this.messageService.notEditedPage(this.currentTask!.language);
        } else {
            this.saveData();
            this.router.navigate(["/questionnaire/" + this.currentTask!.taskNumber.toString()]);
        }
    }

    saveData() {
        this.sketchComponent.saveTask(
            `${this.currentTask?.taskNumber}_task_detail${this.currentTask?.id}_resets${this.currentTask?.resets}`,
        );
        this.sketchComponent.saveDrawing(
            `${this.currentTask?.taskNumber}_drawing_task${this.currentTask?.id}_resets${this.currentTask?.resets}`,
        );
    }
}
