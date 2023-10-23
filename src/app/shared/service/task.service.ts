import {Injectable} from '@angular/core';
import {Task} from "../model/task";

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  loadedTasks!: Task[];

  public initData(language: string): Task[] {
    if (language === "ger") {
      this.loadedTasks = this.initDataGerman();
    }
    else {
      this.loadedTasks = this.initDataEnglish();
    }
    console.log("Loaded Tasks: ", this.loadedTasks);
    return this.loadedTasks;

  }

  public initDataGerman() {

    //TODO: make for loop, to iterate through id++, title[], description[], group[], reset=0
    this.loadedTasks = [
      new Task(0, "Wert ändern", "Tragen Sie den Wert 100 in die Zelle F9 ein.", "P", 0),
      new Task(1, "Wert löschen", "Löschen Sie den Inhalt der Zelle E8.", "P", 0),
      new Task(2, "Werte löschen", "Löschen Sie die Inhalte der Zellen J7-J11.", "A", 0),
      new Task(3, "Zwei Werte addieren", "Berechnen Sie die Summe der Zellen I8 und J8 in Zelle K8.", "A", 0),
      new Task(4, "Spalte einfügen", "Fügen Sie eine neue Spalte zwischen den Spalten B und C ein.", "A", 0),
      new Task(5, "Spalte entfernen", "Entfernen Sie die gesamte Spalte B aus der Tabelle.", "A", 0),
      new Task(6, "Zellen verschieben", "Verschieben Sie die Zellen A15-C15 nach H3.", "A", 0),
      new Task(7, "Mehrere Werte addieren", "Berechnen Sie die Summe der Zellen E7-E11 in Zelle E13.", "B", 0),
      new Task(8, "Werte formatieren", "Formatieren Sie die Werte in den Zellen C7-C11 als Euro-Beträge mit zwei Nachkommastellen.", "B", 0),
      new Task(9, "Zellen umrahmen", "Fügen Sie einen einfachen Rahmen um die Zellen A15-C15 hinzu.", "B", 0),
      new Task(10, "Formatierung übertragen", "Übertragen Sie die Formatierung der Zelle A13 auf die Zellen F13-J13.", "B", 0),
      new Task(11, "Tortendiagramm erstellen", "Erstellen Sie ein Tortendiagramm aus den Werten der Zellen E8-J8.", "B", 0),
      new Task(12, "Balkendiagramm erstellen", "Erstellen Sie ein Balkendiagramm aus den Werten der Zellen C7-C11.", "B", 0),
      new Task(13, "Serie fortführen", "Führen Sie die Serie von Werten in Zeile 6 bis zur Zelle M6 fort.", "B", 0),
      new Task(14, "Werte transponieren", "Transponieren Sie die Namen in Zellen A7-A11 nach Zeile 17 (d.h. übertragen Sie die in Spalte A untereinander stehenden Namen nebeneinander stehend in Zeile 17).", "B", 0),
      new Task(15, "Daten sortieren", "Sortieren Sie die Daten in den Zeilen 7-11 alphabetisch nach den Mitarbeiternamen in Spalte A.", "C", 0),
      new Task(16, "Mehrere Summen bilden", "Berechnen Sie für jeden Monat die Summe aller Mitarbeiterstunden in den Zellen E13-J13.", "C", 0),
      new Task(17, "Formel konstruieren", "Berechnen Sie für jeden Mitarbeiter den Brutto-Stundensatz in Spalte D, indem Sie die Arbeitgeberkostenpauschale aus Zelle C15 auf den Netto-Stundensatz in Spalte C aufschlagen.", "C", 0),
      new Task(18, "Bedingte Formatierung", "Definieren Sie eine bedingte Formatierungsregel für Zelle E13, sodass Werte über 400 in rot dargestellt werden, andere hingegen in grün.", "C", 0),
      new Task(19, "Werte multiplizieren", "Berechnen Sie die Gesamtkosten für Mitarbeiter Smith in Zelle L7, indem Sie seine Gesamtstunden über alle Monate in Zeile 7 addieren und mit seinem Netto-Stundensatz in Zelle C7 multiplizieren.", "C", 0),
    ];
    return this.randomiseByGroup(this.loadedTasks);
  }

  public initDataEnglish() {

    //TODO: insert english text
    this.loadedTasks = [
      new Task(0, "Wert ändern", "Tragen Sie den Wert 100 in die Zelle F9 ein.", "P", 0),
      new Task(1, "Wert löschen", "Löschen Sie den Inhalt der Zelle E8.", "P", 0),
      new Task(2, "Werte löschen", "Löschen Sie die Inhalte der Zellen J7-J11.", "A", 0),
      new Task(3, "Zwei Werte addieren", "Berechnen Sie die Summe der Zellen I8 und J8 in Zelle K8.", "A", 0),
      new Task(4, "Spalte einfügen", "Fügen Sie eine neue Spalte zwischen den Spalten B und C ein.", "A", 0),
      new Task(5, "Spalte entfernen", "Entfernen Sie die gesamte Spalte B aus der Tabelle.", "A", 0),
      new Task(6, "Zellen verschieben", "Verschieben Sie die Zellen A15-C15 nach H3.", "A", 0),
      new Task(7, "Mehrere Werte addieren", "Berechnen Sie die Summe der Zellen E7-E11 in Zelle E13.", "B", 0),
      new Task(8, "Werte formatieren", "Formatieren Sie die Werte in den Zellen C7-C11 als Euro-Beträge mit zwei Nachkommastellen.", "B", 0),
      new Task(9, "Zellen umrahmen", "Fügen Sie einen einfachen Rahmen um die Zellen A15-C15 hinzu.", "B", 0),
      new Task(10, "Formatierung übertragen", "Übertragen Sie die Formatierung der Zelle A13 auf die Zellen F13-J13.", "B", 0),
      new Task(11, "Tortendiagramm erstellen", "Erstellen Sie ein Tortendiagramm aus den Werten der Zellen E8-J8.", "B", 0),
      new Task(12, "Balkendiagramm erstellen", "Erstellen Sie ein Balkendiagramm aus den Werten der Zellen C7-C11.", "B", 0),
      new Task(13, "Serie fortführen", "Führen Sie die Serie von Werten in Zeile 6 bis zur Zelle M6 fort.", "B", 0),
      new Task(14, "Werte transponieren", "Transponieren Sie die Namen in Zellen A7-A11 nach Zeile 17 (d.h. übertragen Sie die in Spalte A untereinander stehenden Namen nebeneinander stehend in Zeile 17).", "B", 0),
      new Task(15, "Daten sortieren", "Sortieren Sie die Daten in den Zeilen 7-11 alphabetisch nach den Mitarbeiternamen in Spalte A.", "C", 0),
      new Task(16, "Mehrere Summen bilden", "Berechnen Sie für jeden Monat die Summe aller Mitarbeiterstunden in den Zellen E13-J13.", "C", 0),
      new Task(17, "Formel konstruieren", "Berechnen Sie für jeden Mitarbeiter den Brutto-Stundensatz in Spalte D, indem Sie die Arbeitgeberkostenpauschale aus Zelle C15 auf den Netto-Stundensatz in Spalte C aufschlagen.", "C", 0),
      new Task(18, "Bedingte Formatierung", "Definieren Sie eine bedingte Formatierungsregel für Zelle E13, sodass Werte über 400 in rot dargestellt werden, andere hingegen in grün.", "C", 0),
      new Task(19, "Werte multiplizieren", "Berechnen Sie die Gesamtkosten für Mitarbeiter Smith in Zelle L7, indem Sie seine Gesamtstunden über alle Monate in Zeile 7 addieren und mit seinem Netto-Stundensatz in Zelle C7 multiplizieren.", "C", 0),
    ];
    return this.randomiseByGroup(this.loadedTasks);
  }

  public randomiseByGroup(tasks: Task[]): Task[] {
    const groupP: Task[] = tasks.filter(task => task.group === 'P');
    const groupA: Task[] = tasks.filter(task => task.group === 'A');
    const groupB: Task[] = tasks.filter(task => task.group === 'B');
    const groupC: Task[] = tasks.filter(task => task.group === 'C');

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

    return groupP.concat(groupA, groupB, groupC);
  }
}
