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

    takeScreenshot(fileName: string, stream: MediaStream): Promise<void> {
        return new Promise((resolve, reject) => {
            const videoTrack = stream.getVideoTracks()[0];
            const captureCanvas = document.createElement("canvas");
            const context = captureCanvas.getContext("2d");
            const video = document.createElement("video");

            video.srcObject = new MediaStream([videoTrack]);
            video.onloadedmetadata = () => {
                captureCanvas.width = video.videoWidth;
                captureCanvas.height = video.videoHeight;
                video
                    .play()
                    .then(() => {
                        context?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
                        captureCanvas.toBlob((blob) => {
                            if (blob) {
                                this.dataStorageService.saveData(fileName, blob);
                                resolve();
                            } else {
                                reject(new Error("Screenshot Blob konnte nicht erstellt werden."));
                            }
                        }, "image/png");
                        video.pause();
                    })
                    .catch((error) => {
                        console.error("Error playing video for screenshot", error);
                        reject(error);
                    });
            };
        });
    }

    public getScreenStream(): MediaStream | null {
        return this.screenStream;
    }
}
