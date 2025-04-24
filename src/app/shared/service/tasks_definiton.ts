import {Group} from "../model/group.enum";


export const tasks_definition = [
  {
    german_title: "Wert ändern",
    english_title: "Change value",
    german_description: "Tragen Sie den Wert 100 in die Zelle F9 ein.",
    german_hint: "Dateneintrag",
    english_hint: "Data Edit",
    english_description: "Enter the value 100 into cell F9.",
    group: Group.P
  },
  {
    german_title: "Wert löschen",
    english_title: "Delete value",
    german_description: "Löschen Sie den Inhalt der Zelle E8.",
    english_description: "Delete the contents of cell E8.",
    german_hint: "Dateneintrag",
    english_hint: "Data Edit",
    group: Group.P
  },
  {
    german_title: "Werte löschen",
    english_title: "Delete values",
    german_description: "Löschen Sie die Inhalte der Zellen J7-J11.",
    english_description: "Delete the contents of cells J7-J11.",
    german_hint: "Dateneintrag: etwas fehlt",
    english_hint: "Data Edit: Something is missing",
    group: Group.A
  },
  {
    german_title: "Zwei Werte addieren",
    english_title: "Add two values",
    german_description: "Berechnen Sie die Summe der Zellen I8 und J8 in Zelle K8.",
    english_description: "Calculate the sum of cells I8 and J8 in cell K8.",
    german_hint: "Dateneintrag",
    english_hint: "Calculation: K8=I8+J8\n What are the hours for Miller in May and Jun?",
    group: Group.A
  },
  {
    german_title: "Spalte einfügen",
    english_title: "Insert column",
    german_description: "Fügen Sie eine neue Spalte zwischen den Spalten B und C ein.",
    english_description: "Insert a new column between columns B and C.",
    german_hint: "",
    english_hint: "Structure Change: something new included",
    group: Group.A
  },
  {
    german_title: "Spalte entfernen",
    english_title: "Remove column",
    german_description: "Entfernen Sie die gesamte Spalte B aus der Tabelle.",
    english_description: "Remove the whole column B from the table.",
    german_hint: "",
    english_hint: "Structure Change: something is missing",
    group: Group.A
  },
  {
    german_title: "Zellen verschieben",
    english_title: "Move cells",
    german_description: "Verschieben Sie die Zellen A15-C15 nach H3.",
    english_description: "Move cells A15-C15 to H3.",
    german_hint: "",
    english_hint: "Structure Change: Changed location",
    group: Group.A
  },
  {
    german_title: "Mehrere Werte addieren",
    english_title: "Add multiple values",
    german_description: "Berechnen Sie die Summe der Zellen E7-E11 in Zelle E13.",
    english_description: "Calculate the sum of cells E7-E11 in cell E13.",
    german_hint: "",
    english_hint: "Calculation: E13 = SUM(E7:E11)",
    group: Group.B
  },
  {
    german_title: "Werte formatieren",
    english_title: "Format values",
    german_description: "Formatieren Sie die Werte in den Zellen C7-C11 als Euro-Beträge mit zwei Nachkommastellen.",
    english_description: "Format the values in cells C7-C11 as Dollar amounts with two decimal places.",
    german_hint: "",
    english_hint: "Formatting",
    group: Group.B
  },
  {
    german_title: "Zellen umrahmen",
    english_title: "Frame cell",
    german_description: "Fügen Sie einen einfachen Rahmen um die Zellen A15-C15 hinzu.",
    english_description: "Add a single frame around cells A15-C15.",
    german_hint: "",
    english_hint: "Formatting",
    group: Group.B
  },
  {
    german_title: "Formatierung übertragen",
    english_title: "Transfer formatting",
    german_description: "Übertragen Sie die Formatierung der Zelle A13 auf die Zellen E13-J13.",
    english_description: "Transfer the formatting of cell A13 to cells E13-J13.",
    german_hint: "",
    english_hint: "Formatting",
    group: Group.P
  },

  {
    german_title: "Tortendiagramm erstellen",
    english_title: "Create pie chart",
    german_description: "Erstellen Sie ein Tortendiagramm aus den Werten der Zellen E8-J8.",
    english_description: "Create a pie chart from the values in cells E8-J8.",
    german_hint: "",
    english_hint: "Visualization",
    group: Group.B
  },
  {
    german_title: "Balkendiagramm erstellen",
    english_title: "Create bar chart",
    german_description: "Erstellen Sie ein Balkendiagramm aus den Werten der Zellen C7-C11.",
    english_description: "Create a bar chart from the value in cells C7-C11.",
    german_hint: "",
    english_hint: "Visualization",
    group: Group.B
  },
  {
    german_title: "Serie fortführen",
    english_title: "Continue series",
    german_description: "Führen Sie die Serie von Werten in Zeile 6 (E6-J6) bis zur Zelle M6 fort.",
    english_description: "Continue the series of values in row 6 (E6-J6) up to cell M6.",
    german_hint: "",
    english_hint: "Structure Change",
    group: Group.B
  },
  {
    german_title: "Werte transponieren",
    english_title: "Transpose values",
      german_description: "Transponieren Sie die Namen in Zellen A7-A11 nach Zeile 17 (d.h. übertragen Sie die in Spalte A untereinander stehenden Namen nebeneinander stehend in Zeile 17).",
    english_description: "Transpose the names in cells A7-A11 to row 17.",
    german_hint: "",
    english_hint: "Structure Change: Data Edit in A17:E17",
    group: Group.B
  },
  {
    german_title: "Daten sortieren",
    english_title: "Sort data",
    german_description: "Sortieren Sie die Daten in den Zeilen 7-11 alphabetisch nach den Mitarbeiternamen in Spalte A.",
    english_description: "Sort the data in rows 7-11 alphabetically by the employee names in column A.",
    german_hint: "",
    english_hint: "Structure Change",
    group: Group.C
  },

  {
    german_title: "Mehrere Summen bilden",
    english_title: "Calculate multiple sums",
    german_description: "Berechnen Sie für jeden Monat die Summe aller Mitarbeiterstunden in den Zellen E13-J13.",
    english_description: "For each month, calculate the sum of all employees' hours in cells E13-J13.",
    german_hint: "",
    english_hint: "Calculation: Total hours/month\n E13=SUM(E7:E11)\n" +
        " F13=SUM(F7:F11)\n" +
        " G13=SUM(G7:G11)\n" +
        " H13=SUM(H7:H11)\n" +
        " I13=SUM(I7:I11)\n" +
        " J13=SUM(J7:J11)\n",
    group: Group.C
  },
  {
    german_title: "Formel konstruieren",
    english_title: "Construct formula",
    german_description: "Berechnen Sie für jeden Mitarbeiter den Brutto-Stundensatz in Spalte D, indem Sie die Arbeitgeberkostenpauschale aus Zelle C15 auf den Netto-Stundensatz in Spalte C aufschlagen.",
    english_description: "For each employee, calculate the gross hourly rate in column D by factoring the overhead cost percentage from cell C15 into the net hourly rate in column C.",
    german_hint: "",
    english_hint: "Calculation: \n" +
        " gross = net + overhead\n" +
        " D7=C7+C$15*C7\n" +
        " D8=C8+C$15*C8\n" +
        " D9=C9+C$15*C9\n" +
        " D10=C10+C$15*C10\n" +
        " D11=C11+C$15*C11",
    group: Group.C
  },
  {
    german_title: "Bedingte Formatierung",
    english_title: "Conditional formatting",
    german_description: "Definieren Sie eine bedingte Formatierungsregel für die Zellen C7-11, so dass Werte über 200 in rot und andere in grün angezeigt werden.",
    english_description: "Define a conditional formatting rule for cells C7-11 so values greater than 200 are displayed in red but others in green.",
    german_hint: "",
    english_hint: "Formatting: Bis zu welcher Nummer sind die Zahlen grün? Ab welcher sind sie rot?",
    group: Group.C
  },
  {
    german_title: "Werte multiplizieren",
    english_title: "Multiply values",
    german_description: "Berechnen Sie die Gesamtkosten für Mitarbeiter Smith in Zelle L7, indem Sie seine Gesamtstunden über alle Monate in Zeile 7 addieren und mit seinem Netto-Stundensatz in Zelle C7 multiplizieren.",
    english_description: "Calculate the total salary of employee Smith in cell L7.",
    german_hint: "",
    english_hint: "Calculation \n" +
        " total salary of employee Smith \n" +
        " L7=C7*(E7+F7+G7+H7+J7) \n" +
        "     =C7*SUM(E7:J7)",
    group: Group.C
  },
//   Ersatz-Tasks: TODO endgültige Auswahl
    {//A
        german_hint: "",
        english_hint: "Formatting",
        group: Group.D
    },
    {//B
        german_hint: "",
        english_hint: "Formatting",
        group: Group.D
    },
    {//C
        german_hint: "",
        english_hint: "Formatting",
        group: Group.D
    },
    {//D
        german_hint: "",
        english_hint: "IF(J7>=100, \"Expensive\", \"Ok\")",
        group: Group.D
    },
    {//E
        german_hint: "",
        english_hint: "Structure Change: Changed location",
        group: Group.D
    },
    {//F
        german_hint: "",
        english_hint: "123+69",
        group: Group.D
    },
];



export function splitTasks(combinedTasks: any[]): { germanTasks: any[], englishTasks: any[] } {
  const germanTasks = combinedTasks.map((task, index) => ({
    title: "",
    description: task.german_hint,
    group: task.group
  }));

  const englishTasks = combinedTasks.map((task, index) => ({
    title: "",
    description: task.english_hint,
    group: task.group
  }));

  return { germanTasks, englishTasks };
}



