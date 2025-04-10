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

    //Captured during runtime
    startTimeWatching!: Date;
    endTimeWatching!: Date;
    timeWatching!: number;
    startTimeDrawing!: Date;
    endTimeDrawing!: Date;
    timeDrawing!: number;
    stepNumber: number = 0;  // Initialize stepNumber to 0
    currentSheet: number = 1;

    constructor(id: number, title: string, description: string, group: Group, resets: number, language: Language) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.group = group;
        this.resets = resets;
        this.language = language;
    }
}
