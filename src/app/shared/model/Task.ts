import {group} from "@angular/animations";

export class Task {
  title: string;
  description: string;
  group: string;

  constructor(title: string, description: string, group: string) {
    this.title = title;
    this.description = description;
    this.group = group;
  }
}
