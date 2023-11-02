import { Injectable } from "@angular/core";
import { Task } from "../model/task";
import { Group } from "../model/group.enum";
import { Language } from "../model/language.enum";

@Injectable({
    providedIn: "root",
})
export class TaskService {
    loadedTasks: Task[] = [];
    chosenLanguage: Language = Language.ENGLISH;

    germanTasks = [
        { title: "Wert ändern", description: "Tragen Sie den Wert 100 in die Zelle F9 ein.", group: Group.P },
        { title: "Wert löschen", description: "Löschen Sie den Inhalt der Zelle E8.", group: Group.P },
        { title: "Werte löschen", description: "Löschen Sie die Inhalte der Zellen J7-J11.", group: Group.A },
        {
            title: "Zwei Werte addieren",
            description: "Berechnen Sie die Summe der Zellen I8 und J8 in Zelle K8.",
            group: Group.A,
        },
        {
            title: "Spalte einfügen",
            description: "Fügen Sie eine neue Spalte zwischen den Spalten B und C ein.",
            group: Group.A,
        },
        {
            title: "Spalte entfernen",
            description: "Entfernen Sie die gesamte Spalte B aus der Tabelle.",
            group: Group.A,
        },
        { title: "Zellen verschieben", description: "Verschieben Sie die Zellen A15-C15 nach H3.", group: Group.A },
        {
            title: "Mehrere Werte addieren",
            description: "Berechnen Sie die Summe der Zellen E7-E11 in Zelle E13.",
            group: Group.B,
        },
        {
            title: "Werte formatieren",
            description: "Formatieren Sie die Werte in den Zellen C7-C11 als Euro-Beträge mit zwei Nachkommastellen.",
            group: Group.B,
        },
        {
            title: "Zellen umrahmen",
            description: "Fügen Sie einen einfachen Rahmen um die Zellen A15-C15 hinzu.",
            group: Group.B,
        },
        {
            title: "Formatierung übertragen",
            description: "Übertragen Sie die Formatierung der Zelle A13 auf die Zellen E13-J13.",
            group: Group.B,
        },
        {
            title: "Tortendiagramm erstellen",
            description: "Erstellen Sie ein Tortendiagramm aus den Werten der Zellen E8-J8.",
            group: Group.B,
        },
        {
            title: "Balkendiagramm erstellen",
            description: "Erstellen Sie ein Balkendiagramm aus den Werten der Zellen C7-C11.",
            group: Group.B,
        },
        {
            title: "Serie fortführen",
            description: "Führen Sie die Serie von Werten in Zeile 6 (E6-J6) bis zur Zelle M6 fort.",
            group: Group.B,
        },
        {
            title: "Werte transponieren",
            description:
                "Transponieren Sie die Namen in Zellen A7-A11 nach Zeile 17 (d.h. übertragen Sie die in Spalte A untereinander stehenden Namen nebeneinander stehend in Zeile 17).",
            group: Group.B,
        },
        {
            title: "Daten sortieren",
            description:
                "Sortieren Sie die Daten in den Zeilen 7-11 alphabetisch nach den Mitarbeiternamen in Spalte A.",
            group: Group.C,
        },
        {
            title: "Mehrere Summen bilden",
            description: "Berechnen Sie für jeden Monat die Summe aller Mitarbeiterstunden in den Zellen E13-J13.",
            group: Group.C,
        },
        {
            title: "Formel konstruieren",
            description:
                "Berechnen Sie für jeden Mitarbeiter den Brutto-Stundensatz in Spalte D, indem Sie die Arbeitgeberkostenpauschale aus Zelle C15 auf den Netto-Stundensatz in Spalte C aufschlagen.",
            group: Group.C,
        },
        {
            title: "Bedingte Formatierung",
            description:
                "Definieren Sie eine bedingte Formatierungsregel für Zelle E13, sodass Werte über 400 in rot dargestellt werden, andere hingegen in grün.",
            group: Group.C,
        },
        {
            title: "Werte multiplizieren",
            description:
                "Berechnen Sie die Gesamtkosten für Mitarbeiter Smith in Zelle L7, indem Sie seine Gesamtstunden über alle Monate in Zeile 7 addieren und mit seinem Netto-Stundensatz in Zelle C7 multiplizieren.",
            group: Group.C,
        },
    ];

    englishTasks = [
        { title: "Change value", description: "Enter the value 100 into cell F9.", group: Group.P },
        { title: "Delete value", description: "Delete the contents of cell E8.", group: Group.P },
        { title: "Delete values", description: "Delete the contents of cells J7-J11.", group: Group.A },
        {
            title: "Add two values",
            description: "Calculate the sum of cells I8 and J8 in cell K8.",
            group: Group.A,
        },
        { title: "Insert column", description: "Insert a new column between columns B and C.", group: Group.A },
        { title: "Remove column", description: "Remove the whole column B from the table.", group: Group.A },
        { title: "Move cells", description: "Move cells A15-C15 to H3.", group: Group.A },
        {
            title: "Add multiple values",
            description: "Calculate the sum of cells E7-E11 in cell E13.",
            group: Group.B,
        },
        {
            title: "Format values",
            description: "Format the values in cells C7-C11 as Dollar amounts with two decimal places.",
            group: Group.B,
        },
        { title: "Frame cell", description: "Add a single frame around cells A15-C15.", group: Group.B },
        {
            title: "Transfer formatting",
            description: "Transfer the formatting of cell A13 to cells E13-J13.",
            group: Group.B,
        },
        {
            title: "Create pie chart",
            description: "Create a pie chart from the values in cells E8-J8.",
            group: Group.B,
        },
        {
            title: "Create bar chart",
            description: "Create a bar chart from the value in cells C7-C11.",
            group: Group.B,
        },
        {
            title: "Continue series",
            description: "Continue the series of values in row 6 (E6-J6) up to cell M6.",
            group: Group.B,
        },
        {
            title: "Transpose values",
            description: "Transpose the names in cells A7-A11 to row 17.",
            group: Group.B,
        },
        {
            title: "Sort data",
            description: "Sort the data in rows 7-11 alphabetically by the employee names in column A.",
            group: Group.C,
        },
        {
            title: "Calculate multiple sums",
            description: "For each month, calculate the sum of all employees' hours in cells E13-J13.",
            group: Group.C,
        },
        {
            title: "Construct formula",
            description:
                "For each employee, calculate the gross hourly rate in column D by factoring the overhead cost percentage from cell C15 into the net hourly rate in column C.",
            group: Group.C,
        },
        {
            title: "Conditional formatting",
            description: "Define a conditional formatting rule for cell E13.",
            group: Group.C,
        },
        {
            title: "Multiply values",
            description: "Calculate the total salary of employee Smith in cell L7.",
            group: Group.C,
        },
    ];

    public initData(language: Language): Task[] {
        this.chosenLanguage = language;
        console.log("Chosen Language: ", this.chosenLanguage);
        const loadedTasks: Task[] = [];
        let id = 1;
        const resets = 0;
        let tasks = [];

        if (this.chosenLanguage == Language.GERMAN) {
            tasks = this.germanTasks;
        } else {
            tasks = this.englishTasks;
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
            task.taskNumber = index + 1;
        });
        console.log("Loaded Tasks: ", shuffledList);
        this.loadedTasks = shuffledList;

        return shuffledList;
    }
}
