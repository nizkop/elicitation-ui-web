import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {Task} from "../../shared/model/task";
import {TaskService} from "../../shared/service/task.service";
import {Language} from "../../shared/model/language.enum";
import {DataStorageService} from "../../shared/service/data.storage.service";
import {RecordingService} from "../../shared/service/recording.service";
import {TranslationService} from "../../shared/service/translation.service";

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
        public TranslationService: TranslationService
    ) {
        this.TranslationService.set_language(this.chosenLanguage)
    }

    ngOnInit(): void {
        this.updateTasks();
        this.dataStorageService.clearData();
        this.recordingService.startRecording();
        this.TranslationService.set_language(Language.ENGLISH);
        console.log("ngOnInit welcome:", this.TranslationService.chosenLanguage);
    }

    translator(key: string): string {
        console.log("translator functio accessed")
        return this.TranslationService.translate("welcome_"+key);
    }

    clickChangeLanguageNew(new_language:string){
        console.log("clickChange:", new_language);
        if( new_language == "GERMAN"){
             this.chosenLanguage = Language.GERMAN;
        } else{
            if(new_language == "ICELANDIC"){
                 this.chosenLanguage = Language.ICELANDIC;
            }else{
                 this.chosenLanguage = Language.ENGLISH;
            }
        }
        this.TranslationService.set_language(this.chosenLanguage);
        this.updateTasks();
    }
    clickChangeLanguage() {
        console.log("clickChangeLanguage")
        if (this.chosenLanguage === Language.GERMAN) {
            this.chosenLanguage = Language.ENGLISH;
        } else {
            this.chosenLanguage = Language.GERMAN;
        }
        this.TranslationService.set_language(this.chosenLanguage);
        this.updateTasks();
    }

    clickNextPage() {
        this.router.navigate([`task/1`]);
    }

    updateTasks() {
        this.tasks = this.taskService.initData(this.chosenLanguage);
    }
}
