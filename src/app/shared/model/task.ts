import {Time} from "@angular/common";
import {Group} from "./group.enum";
import {Language} from "./language.enum";

export class Task {
    taskNumber!: number;
    id: number;
    title: string;
    description: string;
    group: Group;
    resets: number;
    language: Language;

    //Captured during runtime
    capturedLines: Array<Array<{ x: number; y: number }>> = [];
    startTimeWatching!: Time;
    endTimeWatching!: Time;
    startTimeDrawing!: Time;
    endTimeDrawing!: Time;

    //TODO: save userId as the folder name

    constructor(id: number,
                title: string,
                description: string,
                group: Group,
                resets: number,
                language: Language) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.group = group;
        this.resets = resets;
        this.language = language;
    }
}
