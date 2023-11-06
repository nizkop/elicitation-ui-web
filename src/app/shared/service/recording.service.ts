import { EventEmitter, Injectable } from "@angular/core";
import { DataStorageService } from "./data.storage.service";
import { MessageService } from "./message.service";

@Injectable({
    providedIn: "root",
})
export class RecordingService {
    private mediaRecorder: MediaRecorder | null = null;
    private screenStream: MediaStream | null = null;
    private audioStream: MediaStream | null = null;
    private notSupported: boolean = false;

    private recordingStopped = new EventEmitter<void>();

    constructor(
        private dataStorageService: DataStorageService,
        private messageService: MessageService,
    ) {}

    async startRecording() {
        try {
            this.screenStream = await navigator.mediaDevices.getDisplayMedia({
                video: true,
            });
            this.audioStream = await navigator.mediaDevices.getUserMedia({
                audio: true,
            });
            // Combine the audio and screen streams
            let tracks = [...this.screenStream.getVideoTracks(), ...this.audioStream.getAudioTracks()];
            let combinedStream = new MediaStream(tracks);

            this.mediaRecorder = new MediaRecorder(combinedStream);
            let chunks: BlobPart[] = [];

            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunks.push(event.data);
                }
            };

            this.mediaRecorder.onstop = async () => {
                const blob = new Blob(chunks, { type: "video/webm" });
                chunks = []; // Clear the chunks array
                this.dataStorageService.saveData("22_recording.webm", blob);
                this.stopMediaTracks(this.screenStream);
                this.stopMediaTracks(this.audioStream);
                this.recordingStopped.emit();
            };

            this.mediaRecorder.start();
        } catch (error) {
            console.error("Fehler beim Starten der Aufnahmen", error);
            this.notSupported = true;
            this.messageService.recordingNotSupported();
        }
    }

    async stopRecording(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (this.mediaRecorder && !this.notSupported) {
                this.mediaRecorder.stop(); // This will trigger the onstop event
                resolve();
            } else {
                reject(new Error("Recorder nicht initialisiert oder nicht unterstützt"));
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

    public recordingNotSupported(): boolean {
        return this.notSupported;
    }

    public getRecordingStoppedEvent(): EventEmitter<void> {
        return this.recordingStopped;
    }
}
