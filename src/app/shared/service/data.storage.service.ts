import { Injectable } from "@angular/core";
import { saveAs } from "file-saver";
import * as JSZip from "jszip";

@Injectable({
    providedIn: "root",
})
export class DataStorageService {
    private dataStore: { [key: string]: any } = {};

    public saveData(key: string, data: any): void {
        this.dataStore[key] = data;
        console.log(`Saved data for key: ${key}, size: ${data.size}`);
    }

    public clearData(): void {
        this.dataStore = {};
    }

    downloadAllData(fileName: string) {
        const zip = new JSZip();

        Object.keys(this.dataStore).forEach((key) => {
            zip.file(key, this.dataStore[key], { binary: true });
        });

        zip.generateAsync({ type: "blob" }).then((content) => {
            saveAs(content, `${fileName}_DATA.zip`);
        });
    }
}
