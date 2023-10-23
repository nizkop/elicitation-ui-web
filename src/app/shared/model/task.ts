import {Time} from "@angular/common";

export class Task {
    id: number;
    title: string;
    description: string;
    group: string;
    resets: number;

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
                group: string,
               resets: number) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.group = group;
        this.resets = resets;
    }
}
