import {Time} from "@angular/common";

export class Demographics {
    age: string;
    gender: string;
    leftHandedOrRightHanded: string;
    ownATablet: boolean;
    useTablet: string;
    usePencil: boolean;
    useSpreadsheets: boolean;
    anyExperience: boolean;
    useSpreadsheetsMultiTouch: boolean;


    constructor(age: string,
                gender: string,
                leftHandedOrRightHanded: string,
                ownATablet: boolean,
                useTablet: string,
                usePencil: boolean,
                useSpreadsheets: boolean,
                anyExperience: boolean,
                useSpreadsheetsMultiTouch: boolean) {
        this.age = age;
        this.gender = gender;
        this.leftHandedOrRightHanded = leftHandedOrRightHanded;
        this.ownATablet = ownATablet;
        this.useTablet = useTablet;
        this.usePencil = usePencil;
        this.useSpreadsheets = useSpreadsheets;
        this.anyExperience = anyExperience;
        this.useSpreadsheetsMultiTouch = useSpreadsheetsMultiTouch;
    }
}
