import { Component, OnInit } from "@angular/core";
import { Language } from "../../shared/model/language.enum";
import { Router } from "@angular/router";
import { TaskService } from "../../shared/service/task.service";

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
    ) {}

    ngOnInit(): void {
        this.language = this.taskService.chosenLanguage;
    }

    clickRestart() {
        this.router.navigate(["/welcome"]);
    }
}
