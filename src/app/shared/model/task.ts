import { Group } from "./group.enum";
import { Language } from "./language.enum";

export class Task {
    taskNumber!: number;
    id: number;
    title: string;
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
        this.id = id;
        this.title = title;
        this.description = description;
        this.group = group;
        this.resets = resets;
        this.language = language;
        this.picture_file_name = picture_file_name;
    }

    public set_task_number(new_number: number){
        this.taskNumber = new_number;
        this.title = this.language === Language.GERMAN
            ? `Aufgabe ${new_number}`
            : `Task ${new_number}`; // TODO control? this.currentTask!.taskNumber.toString()
    }

    public get_information(){
        let baseName: string = "task" + this.id ;
        if (this.picture_file_name) {
            baseName += "picture" + this.picture_file_name.split(".")[0];
        }
        return baseName;
    }
}
