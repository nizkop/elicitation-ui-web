import { Component, OnInit, ViewChild } from "@angular/core";
import { TaskService } from "../../shared/service/task.service";
import { Task } from "../../shared/model/task";
import { Language } from "../../shared/model/language.enum";
import { ActivatedRoute, Router } from "@angular/router";
import { SketchComponent } from "../sketch/sketch.component";
import { Group } from "../../shared/model/group.enum";
import { MessageService } from "../../shared/service/message.service";
import { RecordingService } from "../../shared/service/recording.service";
import { DataStorageService } from "../../shared/service/data.storage.service";
import {tasks_definition} from "../../shared/service/tasks_definiton";


@Component({
    selector: "app-task",
    templateUrl: "./task.component.html",
    styleUrls: ["./task.component.scss"],
})
export class TaskComponent implements OnInit {
    @ViewChild(SketchComponent) private sketchComponent!: SketchComponent;

    currentTask: Task | undefined;

    protected readonly Language = Language;
    protected readonly Group = Group;

    
    constructor(
        private taskService: TaskService,
        private route: ActivatedRoute,
        private router: Router,
        private messageService: MessageService,
        private recordingService: RecordingService,
        private dataStorageService: DataStorageService
        
    ) {}

    ngOnInit() {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;

        this.route.params.subscribe((params) => {
            const taskNumber = +params["taskNumber"];
            this.currentTask = this.taskService.loadedTasks?.find((task) => task.taskNumber === taskNumber);

            if (this.currentTask) {
                console.log(`Loaded task ${taskNumber}`, this.currentTask);
            } else {
                this.messageService.taskNotFound();
            }
        });
    }

    async clickPreviousPage() {
        await this.saveData();
        if (this.currentTask!.taskNumber === 1) {
            this.messageService.alreadyFirstPage();
        } else {
            this.router.navigate(["/questionnaire/" + (this.currentTask!.taskNumber - 1).toString()]);
        }
    }

    async clickExitStudy() {
        console.log("Exit Study button clicked");
        
        try {
            // First, use the force save method to ensure drawings are saved
            let forceSuccess = false;
            if (this.sketchComponent) {
                forceSuccess = this.sketchComponent.forceSaveAllDrawings();
                console.log(`Force save ${forceSuccess ? 'succeeded' : 'failed'}`);
            }
            
            // Then do the regular save
            await this.saveData();
            console.log("Regular save completed");
            
            // Give a small delay to ensure file operations complete
            setTimeout(() => {
                // Make one final attempt if the force save failed
                if (!forceSuccess && this.sketchComponent) {
                    console.log("Making final attempt to save drawings");
                    this.sketchComponent.forceSaveAllDrawings();
                }
                
                console.log("Navigating to demographics page");
                this.router.navigate(["/demographics"]);
            }, 300);
        } catch (error) {
            console.error("Error during exit process:", error);
            
            // Even if there's an error, make one final save attempt
            if (this.sketchComponent) {
                console.log("Making emergency save attempt after error");
                this.sketchComponent.forceSaveAllDrawings();
            }
            
            // Still navigate to demographics to avoid blocking the user
            setTimeout(() => {
                this.router.navigate(["/demographics"]);
            }, 500);
        }
    }

    async clickResetPage() {
        console.log("Reset current sheet button clicked");
        
        if (this.sketchComponent) {
            await this.sketchComponent.resetDrawing();
            console.log("Reset function completed in SketchComponent");
        } else {
            console.error("SketchComponent is not available!");
        }
    }

    async clickResetAllSheets() {
        console.log("Reset All Sheets button clicked");
        
        if (this.sketchComponent) {
            await this.sketchComponent.resetAllDrawings();
            console.log("Reset function completed for all sheets");
        } else {
            console.error("SketchComponent is not available!");
        }
    }
    
    async clickNextPage() {
        await this.saveData();
        this.router.navigate(["/questionnaire/" + this.currentTask!.taskNumber.toString()]);
    }

    async clickSkipTask() {
        console.log("Skip task button clicked - Saving skip record");
        
        if (this.currentTask) {
            try {
                // First make sure drawings are saved
                if (this.sketchComponent) {
                    const saveResult = this.sketchComponent.forceSaveAllDrawings();
                    console.log(`Forced save of drawings: ${saveResult ? 'successful' : 'failed'}`);
                }
                
                // Create skip record data
                const skipData = {
                    taskId: this.currentTask.id,
                    picture: this.currentTask.picture_file_name,
                    taskNumber: this.currentTask.taskNumber,
                    action: "skipped",
                    timestamp: new Date().toISOString()
                };
                
                // Generate filename for the skip record
                const skipFileName = `Task_${this.currentTask.get_information()}_Skipped.json`;
                
                // Create blob for the JSON file
                const skipBlob = new Blob([JSON.stringify(skipData, null, 2)], { type: "application/json" });
                
                // Save using DataStorageService directly
                this.dataStorageService.saveData(skipFileName, skipBlob);
                
                console.log(`Skip record created: ${skipFileName}`);
            } catch (error) {
                console.error("Error creating skip record:", error);
            }
            
            // Short delay to ensure file operations complete
            await new Promise(resolve => setTimeout(resolve, 200));
            
            // Navigate to the next task
            const nextTaskNumber = this.currentTask.taskNumber + 1;
            if(nextTaskNumber <= tasks_definition.length){
                console.log(`Navigating to next task: ${nextTaskNumber}`);
                this.router.navigate(["/task/" + nextTaskNumber.toString()]);
            } else{
                this.router.navigate(["/demographics"]); // no new task available
            }
        } else {
            console.error("Cannot skip task: No current task found");
        }
    }

    async saveData() {
        console.log("Saving task data and screenshots");
        
        if (this.currentTask && this.sketchComponent) {
            try {
                // First handle recording service screenshot if available
                if (this.recordingService && !this.recordingService.recordingNotSupported()) {
                    const streamScreenshotName = `Task_${this.currentTask.get_information()}_sheet${this.currentTask.currentSheet}.png`;
                    await this.recordingService.takeScreenshot(
                        streamScreenshotName,
                        this.recordingService.getScreenStream()!
                    );
                    console.log(`Recording service screenshot saved: ${streamScreenshotName}`);
                }
                
                
                // This will update timestamps and take screenshots of all sheets
                this.sketchComponent.saveTask();
                
                
                console.log("Task data and screenshots saved successfully");
            } catch (error) {
                console.error("Error saving data:", error);
            }
            try {
                // This will update timestamps and take screenshots of all sheets
                this.sketchComponent.saveTask();


                console.log("Task data and screenshots saved successfully");
            } catch (error) {
                console.error("Error saving data:", error);
            }
        } else {
            console.warn("Cannot save data: no current task or sketch component");
        }

    }
}
