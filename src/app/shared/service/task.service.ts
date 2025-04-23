import { Injectable } from "@angular/core";
import { Task } from "../model/task";
import { Group } from "../model/group.enum";
import { Language } from "../model/language.enum";
import {splitTasks, tasks_definition} from "./tasks_definiton";

@Injectable({
    providedIn: "root",
})
export class TaskService {
    loadedTasks: Task[] = [];
    chosenLanguage: Language = Language.ENGLISH;

    public initData(language: Language): Task[] {
        this.chosenLanguage = language;
        console.log("Chosen Language: ", this.chosenLanguage);
        const loadedTasks: Task[] = [];
        let id = 1;
        const resets = 0;
        let tasks = [];

        const {germanTasks, englishTasks} = splitTasks(tasks_definition);
        if (this.chosenLanguage == Language.GERMAN) {
            tasks = germanTasks;
        } else {
            tasks = englishTasks;
        }

        for (const task of tasks) {
            loadedTasks.push(new Task(id, task.title, task.description, task.group, resets, this.chosenLanguage));
            id++;
        }

        return this.randomiseByGroup(loadedTasks);
    }

    public randomiseByGroup(tasks: Task[]): Task[] {
        const groupP: Task[] = tasks.filter((task) => task.group === Group.P);
        const groupA: Task[] = tasks.filter((task) => task.group === Group.A);
        const groupB: Task[] = tasks.filter((task) => task.group === Group.B);
        const groupC: Task[] = tasks.filter((task) => task.group === Group.C);

        const shuffleArray = (array: Task[]) => {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
        };

        shuffleArray(groupP);
        shuffleArray(groupA);
        shuffleArray(groupB);
        shuffleArray(groupC);

        const shuffledList: Task[] = groupP.concat(groupA, groupB, groupC);

        shuffledList.forEach((task, index) => {
            task.set_task_number(index+1);
        });
        console.log("Loaded Tasks: ", shuffledList);
        this.loadedTasks = shuffledList;

        return shuffledList;
    }
}
