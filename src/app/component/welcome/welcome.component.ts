import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Task } from "../../shared/model/task";
import { TaskService } from "../../shared/service/task.service";
import { Language } from "../../shared/model/language.enum";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
    selector: "app-welcome",
    templateUrl: "./welcome.component.html",
    styleUrls: ["./welcome.component.scss"],
})
export class WelcomeComponent implements OnInit {
    chosenLanguage: Language = Language.ENGLISH;
    tasks: Task[] | undefined;
    //TODO: Audio und ScreenRecording

    protected readonly Language = Language;

    constructor(
        private router: Router,
        private taskService: TaskService,
    ) {}

    ngOnInit(): void {
        this.updateTasks();
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
        this.router.navigate([`playground/1`]);
    }

    updateTasks() {
        this.tasks = this.taskService.initData(this.chosenLanguage);
    }
}
