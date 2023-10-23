import {Time} from "@angular/common";

export class Questionnaire {
    id: number;
    question1: string;
    question2: string;

    //Captured during runtime
    answer1!: string;
    answer2!: string;
    startTime!: Time;
    endTime!: Time;

    constructor(id: number, question1: string, question2: string) {
        this.id = id;
        this.question1 = question1;
        this.question2 = question2;
    }
}
