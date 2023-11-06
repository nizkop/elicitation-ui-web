import { Injectable } from "@angular/core";
import * as RecordRTC from "recordrtc";
import { DataStorageService } from "./data.storage.service";

@Injectable({
    providedIn: "root",
})
export class RecordingService {
    private screenRecorder: RecordRTC | null = null;
    private audioRecorder: RecordRTC | null = null;
    private screenStream: MediaStream | null = null;
    private audioStream: MediaStream | null = null;

    constructor(private dataStorageService: DataStorageService) {}

    async startRecording() {
        try {
            // Bildschirmaufnahme starten
            this.screenStream = await navigator.mediaDevices.getDisplayMedia({
                video: true,
            });
            this.screenRecorder = new RecordRTC(this.screenStream, {
                type: "video",
            });
            this.screenRecorder.startRecording();

            // Audioaufnahme starten
            this.audioStream = await navigator.mediaDevices.getUserMedia({
                audio: true,
            });
            this.audioRecorder = new RecordRTC(this.audioStream, {
                type: "audio",
            });
            this.audioRecorder.startRecording();
        } catch (error) {
            console.error("Fehler beim Starten der Aufnahmen", error);
        }
    }

    async stopRecording(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (this.screenRecorder && this.audioRecorder) {
                this.screenRecorder.stopRecording(() => {
                    const videoBlob = this.screenRecorder!.getBlob();
                    if (videoBlob.size > 0) {
                        this.dataStorageService.saveData(`22_ScreenRecording.webm`, videoBlob);
                        this.audioRecorder!.stopRecording(() => {
                            const audioBlob = this.audioRecorder!.getBlob();
                            if (audioBlob.size > 0) {
                                this.dataStorageService.saveData(`23_AudioRecording.webm`, audioBlob);
                                this.stopMediaTracks(this.screenStream);
                                this.stopMediaTracks(this.audioStream);
                                resolve();
                            } else {
                                console.error("Audio Blob is empty or not generated properly.");
                                reject(new Error("Audio Blob is empty or not generated properly."));
                            }
                        });
                    } else {
                        console.error("Video Blob is empty or not generated properly.");
                        reject(new Error("Video Blob is empty or not generated properly."));
                    }
                });
            } else {
                reject(new Error("Recorder nicht initialisiert"));
            }
        });
    }

    private stopMediaTracks(stream: MediaStream | null) {
        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
        }
    }
}
