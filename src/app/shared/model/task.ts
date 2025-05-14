import { Group } from "./group.enum";
import { Language } from "./language.enum";

export class Task {
    taskNumber!: number;
    id: string;
    // title: string;
    description: string;
    group: Group;
    resets: number;
    language: Language;
    picture_file_name: string;

    //Captured during runtime
    startTimeWatching!: Date;
    endTimeWatching!: Date;
    timeWatching!: number;
    startTimeDrawing!: Date;
    endTimeDrawing!: Date;
    timeDrawing!: number;
    stepNumber: number = 0;  // Initialize stepNumber to 0
    currentSheet: number = 1;

    constructor(id: number, title: string, description: string, group: Group, resets: number, language: Language, picture_file_name:string) {
        this.id = picture_file_name.replace(/^task_/i, '').replace(/\.png$/i, '');
        this.description = description;
        this.group = group;
        this.resets = resets;
        this.language = language;
        this.picture_file_name = picture_file_name;
    }

    public set_task_number(new_number: number){
        this.taskNumber = new_number;
        // this.title = this.language === Language.GERMAN
        //     ? `Aufgabe ${this.id}`
        //     : `Task ${this.id}`; // TODO control? this.currentTask!.taskNumber.toString()
    }

}
