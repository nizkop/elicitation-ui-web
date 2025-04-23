import {Group} from "../model/group.enum";


export const tasks_definition = [
  {
    german_title: "Wert ändern",
    english_title: "Change value",
    german_description: "Tragen Sie den Wert 100 in die Zelle F9 ein.",
    english_description: "Enter the value 100 into cell F9.",
    group: Group.P
  },
  {
    german_title: "Wert löschen",
    english_title: "Delete value",
    german_description: "Löschen Sie den Inhalt der Zelle E8.",
    english_description: "Delete the contents of cell E8.",
    group: Group.P
  },
  {
    german_title: "Werte löschen",
    english_title: "Delete values",
    german_description: "Löschen Sie die Inhalte der Zellen J7-J11.",
    english_description: "Delete the contents of cells J7-J11.",
    group: Group.A
  },
  {
    german_title: "Zwei Werte addieren",
    english_title: "Add two values",
    german_description: "Berechnen Sie die Summe der Zellen I8 und J8 in Zelle K8.",
    english_description: "Calculate the sum of cells I8 and J8 in cell K8.",
    group: Group.A
  },
  {
    german_title: "Spalte einfügen",
    english_title: "Insert column",
    german_description: "Fügen Sie eine neue Spalte zwischen den Spalten B und C ein.",
    english_description: "Insert a new column between columns B and C.",
    group: Group.A
  },
  {
    german_title: "Spalte entfernen",
    english_title: "Remove column",
    german_description: "Entfernen Sie die gesamte Spalte B aus der Tabelle.",
    english_description: "Remove the whole column B from the table.",
    group: Group.A
  },
  {
    german_title: "Zellen verschieben",
    english_title: "Move cells",
    german_description: "Verschieben Sie die Zellen A15-C15 nach H3.",
    english_description: "Move cells A15-C15 to H3.",
    group: Group.A
  },
  {
    german_title: "Mehrere Werte addieren",
    english_title: "Add multiple values",
    german_description: "Berechnen Sie die Summe der Zellen E7-E11 in Zelle E13.",
    english_description: "Calculate the sum of cells E7-E11 in cell E13.",
    group: Group.B
  },
  {
    german_title: "Werte formatieren",
    english_title: "Format values",
    german_description: "Formatieren Sie die Werte in den Zellen C7-C11 als Euro-Beträge mit zwei Nachkommastellen.",
    english_description: "Format the values in cells C7-C11 as Dollar amounts with two decimal places.",
    group: Group.B
  },
  {
    german_title: "Zellen umrahmen",
    english_title: "Frame cell",
    german_description: "Fügen Sie einen einfachen Rahmen um die Zellen A15-C15 hinzu.",
    english_description: "Add a single frame around cells A15-C15.",
    group: Group.B
  },
  {
    german_title: "Formatierung übertragen",
    english_title: "Transfer formatting",
    german_description: "Übertragen Sie die Formatierung der Zelle A13 auf die Zellen E13-J13.",
    english_description: "Transfer the formatting of cell A13 to cells E13-J13.",
    group: Group.B
  },

  {
    german_title: "Tortendiagramm erstellen",
    english_title: "Create pie chart",
    german_description: "Erstellen Sie ein Tortendiagramm aus den Werten der Zellen E8-J8.",
    english_description: "Create a pie chart from the values in cells E8-J8.",
    group: Group.B
  },
  {
    german_title: "Balkendiagramm erstellen",
    english_title: "Create bar chart",
    german_description: "Erstellen Sie ein Balkendiagramm aus den Werten der Zellen C7-C11.",
    english_description: "Create a bar chart from the value in cells C7-C11.",
    group: Group.B
  },
  {
    german_title: "Serie fortführen",
    english_title: "Continue series",
    german_description: "Führen Sie die Serie von Werten in Zeile 6 (E6-J6) bis zur Zelle M6 fort.",
    english_description: "Continue the series of values in row 6 (E6-J6) up to cell M6.",
    group: Group.B
  },
  {
    german_title: "Werte transponieren",
    english_title: "Transpose values",
      german_description: "Transponieren Sie die Namen in Zellen A7-A11 nach Zeile 17 (d.h. übertragen Sie die in Spalte A untereinander stehenden Namen nebeneinander stehend in Zeile 17).",
    english_description: "Transpose the names in cells A7-A11 to row 17.",
    group: Group.B
  },
  {
    german_title: "Daten sortieren",
    english_title: "Sort data",
    german_description: "Sortieren Sie die Daten in den Zeilen 7-11 alphabetisch nach den Mitarbeiternamen in Spalte A.",
    english_description: "Sort the data in rows 7-11 alphabetically by the employee names in column A.",
    group: Group.C
  },

  {
    german_title: "Mehrere Summen bilden",
    english_title: "Calculate multiple sums",
    german_description: "Berechnen Sie für jeden Monat die Summe aller Mitarbeiterstunden in den Zellen E13-J13.",
    english_description: "For each month, calculate the sum of all employees' hours in cells E13-J13.",
    group: Group.C
  },
  {
    german_title: "Formel konstruieren",
    english_title: "Construct formula",
    german_description: "Berechnen Sie für jeden Mitarbeiter den Brutto-Stundensatz in Spalte D, indem Sie die Arbeitgeberkostenpauschale aus Zelle C15 auf den Netto-Stundensatz in Spalte C aufschlagen.",
    english_description: "For each employee, calculate the gross hourly rate in column D by factoring the overhead cost percentage from cell C15 into the net hourly rate in column C.",
    group: Group.C
  },
  {
    german_title: "Bedingte Formatierung",
    english_title: "Conditional formatting",
    german_description: "Definieren Sie eine bedingte Formatierungsregel für die Zellen C7-11, so dass Werte über 200 in rot und andere in grün angezeigt werden.",
    english_description: "Define a conditional formatting rule for cells C7-11 so values greater than 200 are displayed in red but others in green.",
    group: Group.C
  },
  {
    german_title: "Werte multiplizieren",
    english_title: "Multiply values",
    german_description: "Berechnen Sie die Gesamtkosten für Mitarbeiter Smith in Zelle L7, indem Sie seine Gesamtstunden über alle Monate in Zeile 7 addieren und mit seinem Netto-Stundensatz in Zelle C7 multiplizieren.",
    english_description: "Calculate the total salary of employee Smith in cell L7.",
    group: Group.C
  }
];



export function splitTasks(combinedTasks: any[]): { germanTasks: any[], englishTasks: any[] } {
  const germanTasks = combinedTasks.map(task => ({
    title: task.german_title,
    description: task.german_description,
    group: task.group
  }));

  const englishTasks = combinedTasks.map(task => ({
    title: task.english_title,
    description: task.english_description,
    group: task.group
  }));

  return { germanTasks, englishTasks };
}



