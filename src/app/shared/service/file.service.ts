import { Injectable } from "@angular/core";
import { Task } from "../model/task";
import { Group } from "../model/group.enum";
import { Language } from "../model/language.enum";

@Injectable({
    providedIn: "root",
})
export class FileService {
    public saveJsonFile(data: any, fileName: string) {
        const formattedJson = JSON.stringify(data, null, 2);
        const jsonData = new Blob([formattedJson], { type: "application/json" });

        const blob = new Blob([jsonData], { type: "application/json" });
        const downloadLink = document.createElement("a");
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = fileName;

        // Download JSON
        //TODO: Replace with other functionality
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }

    public saveImageFile(canvas: HTMLCanvasElement, fileName: string) {
        const dataUrl = canvas.toDataURL("image/png");
        const a = document.createElement("a");
        a.href = dataUrl;
        a.download = `${fileName}.png`;

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
}
