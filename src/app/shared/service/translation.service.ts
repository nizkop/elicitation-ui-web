import {Injectable} from "@angular/core";
import {Language} from "../model/language.enum";
import {english_texts, german_texts, icelandic_texts} from "../../../assets/texts";

@Injectable({
    providedIn: "root",
})
export class TranslationService {
     private translations: Record<string, string> = {};
     chosenLanguage: Language = Language.ENGLISH;


    constructor(
    ) {
        console.log("construct TranslationService")
         this.translations = english_texts;
    }

    set_language(language:Language){
        if(language == this.chosenLanguage){
            return;
        }
         this.chosenLanguage = language;
        // getting corresponding texts:
        if(this.chosenLanguage == Language.GERMAN){
            this.translations = german_texts
        }else{
            if(this.chosenLanguage == Language.ICELANDIC){
                this.translations = icelandic_texts
            }else{
            this.translations = english_texts
            }
        }
        console.log('Translations set:', this.translations);
    }

    get availableLanguages(): string[] {
        const languageValues: string[] = Object.keys(Language)
          .filter(key => isNaN(Number(key))) // Nur echte Keys, nicht numerische Rückverweise
          .map(key => Language[key as keyof typeof Language]);
        console.log("available", languageValues)
        return languageValues;
    }

    get getOtherLanguages(): string[] {
       return Object.keys(Language)
          .filter(key => isNaN(Number(key)))
          .map(key => Language[key as keyof typeof Language])
          .filter(lang => lang !== this.chosenLanguage);
    }

    translate(key: string): string {
        console.log("TRANSLATE", this.translations);

        const value = this.translations[key];
        if (value === undefined) {
            console.log(`[Translation misssing] Key: "${key}" in language: ${this.chosenLanguage}`);
            // alert(`[Translation missing] Key: "${key}" in language: ${this.chosenLanguage}`);
            return '';
        }
        return value;
    }

}
