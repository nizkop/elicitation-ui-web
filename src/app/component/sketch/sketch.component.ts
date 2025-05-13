import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { TaskService } from "../../shared/service/task.service";
import { Task } from "../../shared/model/task";
import { Language } from "../../shared/model/language.enum";
import { ActivatedRoute } from "@angular/router";
import { DataStorageService } from "../../shared/service/data.storage.service";
import { MessageService } from "../../shared/service/message.service";

@Component({
    selector: "app-sketch",
    templateUrl: "./sketch.component.html",
    styleUrls: ["./sketch.component.scss"],
})
export class SketchComponent implements OnInit {
    @ViewChild("backgroundImage") backgroundImage!: ElementRef;
    @ViewChild("drawingCanvas", { static: false }) drawingCanvas!: ElementRef;
    

    backgroundImageUrl = '';
    backgroundImageUrlSheet2 = ''; // New background for Sheet 2
    //backgroundImageUrlSheet3 = "./assets/background_3.png"; // New background for Sheet 3

    sheetDrawings: { [sheet: string]: Array<Array<{ x: number; y: number }>> } = {
        sheet1: [],
        sheet2: [],
        //sheet3: [],
    };
    currentSheet: string = 'sheet1';
    
    private lastSavedDrawings: { [sheet: string]: any[] } = {
        sheet1: [],
        sheet2: []
      };
    private saveInterval: any = null;
    private screenshotCounter: number = 1;
    private screenshotInProgress: boolean = false;
    private screenshotQueue: Array<{sheetName: string, fileName: string, timestamp: number, resolve: Function, reject: Function}> = [];
    private isSkipTransitionScreenshot = false;
    currentBackgroundImage = this.backgroundImageUrl; // Initially set to Sheet1 background
    // Add properties to component class
    private previousSheetDrawings: { [sheetName: string]: any[] } = {};
    private transitionCounter: { [sheetName: string]: number } = {}; // Track number of transitions
    canvas: HTMLCanvasElement | null = null;
    context: CanvasRenderingContext2D | null = null;
    drawing = false;

    capturedLines: Array<Array<{ x: number; y: number }>> = [];
    currentLine: { x: number; y: number }[] = [];
    language: Language | undefined;

    tasks: Task[] | undefined;
    currentTask: Task | undefined;

    protected readonly Language = Language;

    constructor(
        private taskService: TaskService,
        private route: ActivatedRoute,
        private dataStorageService: DataStorageService,
        private messageService: MessageService,
    ) {
         this.language = this.taskService.chosenLanguage
         this.backgroundImageUrl = `./assets/${this.language === Language.GERMAN ? 'DE' : 'EN'}/Spreadsheet.png`;
         this.backgroundImageUrlSheet2 = `./assets/${this.language === Language.GERMAN ? 'EN' : 'EN'}/Spreadsheet.png`; // fallback for Sheet 2
         this.currentBackgroundImage = this.backgroundImageUrl;// Update
    }


    private sheetOriginalDimensions: { [key: string]: { width: number, height: number } } = {
        'sheet1': { width: 1440 , height: 415 },
        'sheet2': { width: 1440 , height: 415 }
      };
      





      async changeBackground(sheet: string) {
        // First save the current sheet's drawings if we're changing sheets
        if (this.currentSheet !== sheet) {
          // Save current sheet state before changing
          this.persistAllDrawings();
        }
      
        // Skip if trying to change to the current sheet
        if (this.currentSheet === sheet) {
          console.log(`Already on ${sheet}, no change needed`);
          return;
        }
      
        // First check if we need to take a screenshot of the current sheet before changing
        // Skip screenshot logic if the skip flag is set
        if (!this.isSkipTransitionScreenshot && this.currentSheet) {
          const currentDrawings = this.sheetDrawings[this.currentSheet] || [];
          const previousDrawings = this.previousSheetDrawings[this.currentSheet] || [];
          
          // Check if drawings have changed since last transition
          const hasChanged = this.haveDrawingsChanged(currentDrawings, previousDrawings);
          
          if (hasChanged && this.currentTask) {
            // Initialize or increment the transition counter for this sheet
            if (!this.transitionCounter[this.currentSheet]) {
              this.transitionCounter[this.currentSheet] = 1;
            } else {
              this.transitionCounter[this.currentSheet]++;
            }
            
            // Generate a descriptive filename with transition counter
            const fromSheet = this.currentSheet;
            const toSheet = sheet;
            const transitionCount = this.transitionCounter[this.currentSheet];
            const fileName = `Task_${this.currentTask.id}_${fromSheet}_to_${toSheet}_Change_${transitionCount}`;
            
            // Take and save the screenshot of current sheet before changing
            await this.saveSheetScreenshot(this.currentSheet, fileName);
            
            // Update previous drawings state for the current sheet (create a deep copy)
            this.previousSheetDrawings[this.currentSheet] = JSON.parse(JSON.stringify(currentDrawings));
            
            console.log(`Saved transition screenshot #${transitionCount} from ${fromSheet} to ${toSheet}`);
          }
        }
        
        // Now proceed with the sheet changing logic with explicit canvas dimension handling
        if (sheet === 'sheet1') {
          this.currentBackgroundImage = this.backgroundImageUrl; // Sheet 1
          
          // Set canvas dimensions explicitly for sheet1
          if (this.canvas) {
            this.currentBackgroundImage = this.backgroundImageUrl; // reset for dimensions?
            this.canvas.width = this.sheetOriginalDimensions['sheet1'].width;
            this.canvas.height = this.sheetOriginalDimensions['sheet1'].height;
            console.log(`Set canvas dimensions for sheet1: ${this.canvas.width}x${this.canvas.height}`);
          }
        } else if (sheet === 'sheet2') {
          this.currentBackgroundImage = this.backgroundImageUrlSheet2; // Sheet 2
          
          // Set canvas dimensions explicitly for sheet2
          if (this.canvas) {
            this.canvas.width = this.sheetOriginalDimensions['sheet2'].width;
            this.canvas.height = this.sheetOriginalDimensions['sheet2'].height;
            console.log(`Set canvas dimensions for sheet2: ${this.canvas.width}x${this.canvas.height}`);
          }
        }
      
        // Store old sheet for logging
        const oldSheet = this.currentSheet;
        
        // Update the current sheet
        this.currentSheet = sheet; 
        
        // Load saved drawings for the current sheet
        this.capturedLines = this.sheetDrawings[this.currentSheet] || [];
      
        // Wait for the next tick to ensure the background image has updated
        setTimeout(() => {
          this.onImageLoad(); // Trigger background image load and redraw saved sketch
        }, 0);
        
        // Save the current sheet in the task data for reference
        if (this.currentTask) {
          // Convert the string sheet name to a number
          const sheetNumber = parseInt(sheet.replace('sheet', ''), 10);
          this.currentTask.currentSheet = sheetNumber; // This should now be a number
        }
        
        // Log the change for debugging
        console.log(`Changed from ${oldSheet} to ${sheet} with background: ${this.currentBackgroundImage}`);
      }

 




    // Helper method to compare drawings arrays
    private haveDrawingsChanged(current: any[], previous: any[]): boolean {
    // Quick length check first
    if (current.length !== previous.length) {
        return true;
    }
    
    // Compare each line's points
    for (let i = 0; i < current.length; i++) {
        const currentLine = current[i];
        const previousLine = previous[i];
        
        // Check if the lines have the same number of points
        if (currentLine.length !== previousLine.length) {
            return true;
        }
        
        // Compare each point in the line
        for (let j = 0; j < currentLine.length; j++) {
            if (currentLine[j].x !== previousLine[j].x || 
                currentLine[j].y !== previousLine[j].y) {
                return true;
            }
        }
    }
    
    // No differences found
    return false;
}




// Method to initialize the previous drawings state
private initializePreviousDrawings() {
    // Deep copy the initial state of all sheets
    Object.keys(this.sheetDrawings).forEach(sheet => {
        this.previousSheetDrawings[sheet] = JSON.parse(
            JSON.stringify(this.sheetDrawings[sheet] || [])
        );
        // Initialize transition counters
        this.transitionCounter[sheet] = 0;
    });
}   


private formatTimestamp(timestamp: number): string {
    const date = new Date(timestamp);
    
    // Format: YYYYMMDD_HHMMSS_ms
    // Example: 20240325_142530_123 (for March 25, 2024, 2:25:30 PM, 123 milliseconds)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // +1 because months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const milliseconds = String(date.getMilliseconds()).padStart(3, '0');
    
    return `${year}${month}${day}_${hours}${minutes}${seconds}_${milliseconds}`;
  }
    
    
  ngOnInit() {
    
    this.capturedLines = [];
    this.tasks = this.taskService.loadedTasks;
    const taskNumber = +this.route.snapshot.params["taskNumber"];
    this.currentTask = this.tasks?.find((task) => task.taskNumber === taskNumber);
  
    if (this.currentTask) {
      console.log("Current Task: ", this.currentTask.id);
      // Initialize background Image for sheet 2:
      this.backgroundImageUrlSheet2 = `./assets/${this.language === Language.GERMAN ? 'DE' : 'EN'}/${this.currentTask?.picture_file_name}`;
        //  TODO so far no security, if picture not there

      this.currentTask.startTimeWatching = new Date();
      
      // Initialize the sheet drawings if not already done
      this.sheetDrawings = this.sheetDrawings || {};
      this.initializePreviousDrawings();
    } else {
      this.messageService.taskNotFound();
    }

    
    // Initialize the sheetDrawings object if it doesn't exist
    if (!this.sheetDrawings) {
      this.sheetDrawings = {
        sheet1: [],
        sheet2: []
      };
    }
    
    // Try to load previously saved drawings from storage if available
    this.tryLoadSavedDrawings();
    
    // Setup automatic backup every 10 seconds
    this.saveInterval = setInterval(() => {
      this.backupAllDrawings();
    }, 10000);
    
    // Setup page unload handler
    window.addEventListener('beforeunload', () => {
      this.persistAllDrawings();
    });
  }
  
  // New method to try loading saved drawings
  private tryLoadSavedDrawings(): void {

    console.log("Would attempt to load saved drawings here if implemented");
  }

    

    onImageLoad() {
        this.canvas = this.drawingCanvas.nativeElement;
        this.context = this.canvas!.getContext("2d");
        
        if (this.context && this.canvas && this.backgroundImage) {
            // Get the displayed dimensions from the DOM element
            const displayedWidth = this.backgroundImage.nativeElement.clientWidth;
            const displayedHeight = this.backgroundImage.nativeElement.clientHeight;
            
            // Set the canvas dimensions to match the displayed dimensions
            this.canvas.width = displayedWidth;
            this.canvas.height = displayedHeight;

            // TODO entfernt:
            // this.sheetDrawDimensions[this.currentSheet] = { width: displayedWidth, height: displayedHeight };

            this.context.strokeStyle = "blue";
            this.context.lineWidth = 2;
            
            this.drawOnCanvas(); // Redraw the saved sketch for the current sheet
        }
    }

    onMouseDown(event: MouseEvent | Touch) {
        this.currentTask!.endTimeWatching = new Date();
        this.currentTask!.timeWatching =
            this.currentTask!.endTimeWatching.getTime() - this.currentTask!.startTimeWatching.getTime();
        this.currentTask!.startTimeDrawing = new Date();

        if (this.context && this.canvas) {
            this.drawing = true;
            const x =
                "offsetX" in event
                    ? (event as MouseEvent).offsetX
                    : (event as Touch).clientX - this.canvas.getBoundingClientRect().left;
            const y =
                "offsetY" in event
                    ? (event as MouseEvent).offsetY
                    : (event as Touch).clientY - this.canvas.getBoundingClientRect().top;
            this.context.beginPath();
            this.context.moveTo(x, y);
        }
    }

    onMouseMove(event: MouseEvent | Touch) {
        if (this.drawing && this.canvas) {
            const x =
                "offsetX" in event
                    ? (event as MouseEvent).offsetX
                    : (event as Touch).clientX - this.canvas.getBoundingClientRect().left;
            const y =
                "offsetY" in event
                    ? (event as MouseEvent).offsetY
                    : (event as Touch).clientY - this.canvas.getBoundingClientRect().top;
            const point = { x, y };
            this.currentLine.push(point);
            this.drawOnCanvas();
        }
    }

    drawOnCanvas() {
        if (this.context) {
            this.context.clearRect(0, 0, this.canvas!.width, this.canvas!.height);
            for (const line of this.capturedLines) {
                if (line.length > 1) {
                    this.context.beginPath();
                    this.context.moveTo(line[0].x, line[0].y);
                    for (let i = 1; i < line.length; i++) {
                        this.context.lineTo(line[i].x, line[i].y);
                    }
                    this.context.stroke();
                }
            }
            // Zeichnen der aktuellen Linie (live)
            if (this.currentLine.length > 1) {
                this.context.beginPath();
                this.context.moveTo(this.currentLine[0].x, this.currentLine[0].y);
                for (let i = 1; i < this.currentLine.length; i++) {
                    this.context.lineTo(this.currentLine[i].x, this.currentLine[i].y);
                }
                this.context.stroke();
            }
        }
    }

    onMouseUp() {
        if (this.drawing) {
          this.drawing = false;
          this.capturedLines.push(this.currentLine);
          this.sheetDrawings[this.currentSheet] = [...this.capturedLines];
          this.currentLine = [];
          
          // Save immediately after any drawing change
          this.persistAllDrawings();
        }
      }
    
    

    saveSkip(fileName: string) {
        this.dataStorageService.saveData(
            `${fileName}.json`,
            new Blob([JSON.stringify({ skipped: true }, null, 2)], { type: "application/json" }),
        );
    }



    private createStandardFileName(prefix: string = 'Task'): string {
        if (!this.currentTask) return `${prefix}_unknown`;
        
        const info = this.currentTask.id ?? 'unknown';
        // const stepNumber = this.currentTask.stepNumber ?? 0;
        
        return `${prefix}_${info}`;
    }






    saveTask(additionalData: any = null) {
        if (!this.currentTask) return;
        
        // Update timestamps and duration
        this.currentTask.endTimeDrawing = new Date();
        this.currentTask.timeDrawing = this.currentTask.endTimeDrawing.getTime() - this.currentTask.startTimeDrawing.getTime();
        
        // Keep track of which sheet is active
        const sheetNumber = parseInt(this.currentSheet.replace('sheet', ''), 10);
        this.currentTask.currentSheet = sheetNumber;
        
        // Create consistent filename
        const fileName = this.createStandardFileName();
        
        // Prepare task details WITHOUT including the fileName in the JSON content
        const taskDetails = {
          taskId: this.currentTask.id,
          // picture: this.currentTask.picture_file_name,
          // taskNumber: this.currentTask.taskNumber,
          userId: new Date().toISOString(),
          screenId: `${this.currentTask.taskNumber}_screen_${this.currentTask.id}`,
          currentSheet: this.currentSheet,
          taskData: this.currentTask,
          ...(additionalData || {}) // Merge any additional data if provided
        };
        
        // Save task details to JSON WITHOUT including fileName in the content
        const jsonBlob = new Blob([JSON.stringify(taskDetails, null, 2)], { type: "application/json" });
        this.dataStorageService.saveData(`${fileName}.json`, jsonBlob);
        
        // Save screenshots for all sheets
        this.saveAllSheetScreenshots(fileName);
      }
    




      private async saveSheetScreenshot(sheetName: string, fileName: string): Promise<void> {
        console.log(`Screenshot requested for ${sheetName} with fileName: ${fileName}`);
        console.trace(); // This will print the call stack
        
        // Generate a timestamp right now for this screenshot request
        // This ensures each screenshot gets its own unique timestamp
        const timestamp = new Date().getTime();
        const formattedTime = this.formatTimestamp(timestamp);
        console.log(`Generated timestamp for screenshot: ${formattedTime}`);
        
        return new Promise<void>((resolve, reject) => {
            // Add this request to the queue with its unique timestamp
            this.screenshotQueue.push({
                sheetName, 
                fileName, 
                timestamp,  // Store the timestamp with the request
                resolve, 
                reject
            });
            
            console.log(`Added screenshot request to queue with timestamp: ${formattedTime}`);
            
            // Process the queue if not already in progress
            if (!this.screenshotInProgress) {
                this.processScreenshotQueue();
            }
        });
    }
    
    // TODO entfernt:
    // private sheetDrawDimensions: { [key: string]: { width: number, height: number } } = {
    //     sheet1: { width: 1440, height: 415 }, // als Initialwert, wird gleich überschrieben
    //     sheet2: { width: 1440, height: 415 }
    // };
    private async processScreenshotQueue(): Promise<void> {
        // If already processing or queue is empty, return
        if (this.screenshotInProgress || this.screenshotQueue.length === 0) {
            return;
        }
    
        // Set flag to indicate processing
        this.screenshotInProgress = true;
    
        // Get the next item from the queue
        const nextItem = this.screenshotQueue.shift();
        
        if (!nextItem) {
            this.screenshotInProgress = false;
            return;
        }
    
        // Destructure the item properties
        const sheetName = nextItem.sheetName;
        const fileName = nextItem.fileName;
        const timestamp = nextItem.timestamp;
        const resolve = nextItem.resolve;
        const reject = nextItem.reject;
    
        try {
            if (!this.canvas || !this.context) {
                console.error('Canvas or context not available');
                reject(new Error('Canvas not initialized'));
                this.screenshotInProgress = false;
                this.processScreenshotQueue(); // Process next item
                return;
            }
    
            // Format the timestamp in a readable way
            const formattedTimestamp = this.formatTimestamp(timestamp);
    
            // Log the request we're about to process
            console.log(`Processing screenshot request for ${sheetName} with filename ${fileName} (Time: ${formattedTimestamp})`);
    
            // Clean the filename
            const baseFileName: string = fileName.replace(/_sheet\d+$/, ''); 
            const sheetNumber: string = sheetName.replace('sheet', '');
            
            // Use the formatted timestamp in the filename
            // Format: T20240325_142530_123_Task_1_sheet1.png
            const cleanFileName: string = `T${formattedTimestamp}_${baseFileName}_sheet${sheetNumber}.png`;
    
            console.log(`Generating screenshot with timestamp ${formattedTimestamp} for ${sheetName}, saving as: ${cleanFileName}`);
            
            // Create a temporary canvas for capturing the screenshot
            const tempCanvas: HTMLCanvasElement = document.createElement("canvas");
            const tempContext: CanvasRenderingContext2D | null = tempCanvas.getContext("2d");
            if (!tempContext) {
                console.error('Could not create temporary canvas context');
                reject(new Error('Temporary canvas context creation failed'));
                this.screenshotInProgress = false;
                this.processScreenshotQueue(); // Process next item
                return;
            }
    
            // Set fixed dimensions for the output screenshot based on the original dimensions for this sheet
            const originalDimensions = this.sheetOriginalDimensions[sheetName];
            const targetWidth = originalDimensions.width;
            const targetHeight = originalDimensions.height;
            console.log("vorher:", tempCanvas.width, tempCanvas.height);
            tempCanvas.width = targetWidth;
            tempCanvas.height = targetHeight;
    
            // Determine the correct background image based on sheet name
            const backgroundImageUrl: string = sheetName === "sheet1" 
                ? this.backgroundImageUrl
                : this.backgroundImageUrlSheet2;
    
            const image: HTMLImageElement = new Image();
            image.crossOrigin = "anonymous";
            image.src = backgroundImageUrl;
    
            image.onload = () => {
                try {
                    // Draw the background image to fill the canvas exactly
                    tempContext.drawImage(image, 0, 0, tempCanvas.width, tempCanvas.height);

                    // Use the original dimensions for scaling calculations, not the current canvas dimensions
                    // TODO added:
                    const originalWidth = originalDimensions.width;
                    const originalHeight = originalDimensions.height;
                    
                    // Calculate scaling based on original dimensions
                    const scaleX = targetWidth / originalWidth;
                    const scaleY = targetHeight / originalHeight;

                    // TODO entfernt:
                    // const drawDims = this.sheetDrawDimensions[sheetName] || { width: targetWidth, height: targetHeight };
                    // const scaleX = targetWidth / drawDims.width;
                    // const scaleY = targetHeight / drawDims.height;
                    
                    console.log(`Using fixed scaling for ${sheetName}: X=${scaleX.toFixed(3)}, Y=${scaleY.toFixed(3)}`);
                    console.log(`Original dimensions: ${originalWidth}x${originalHeight}`);
                    console.log(`Target dimensions: ${targetWidth}x${targetHeight}`);
                    
                    // Draw the lines with proper scaling
                    tempContext.strokeStyle = "blue";
                    tempContext.lineWidth = 2;
                    
                    // Get the drawings for the current sheet
                    const sheetDrawings = this.sheetDrawings[sheetName] || [];
                    console.log(`Drawing ${sheetDrawings.length} lines for ${sheetName}`);
                    
                    // Apply our transformation to each drawing point
                    for (const line of sheetDrawings) {
                        if (line.length > 1) {
                            tempContext.beginPath();
                            const offset_x_for_tablet = 1.095;
                            // 1.15 zu weit rechts#
                            // 0.75 zu weit links
                            // 1 zu links
                            // 1.05 zu links
                            // 1.1 etwas zu weit rechts
                            // 1.08 zu weit rechts
                            // 1.07 zu weit links!
                            // 1.079 zu weit links!
                            // 1.09 zu weit links
                            const offset_y_for_tablet = 1.095;
                            // 0.75 zu schmal & zu hoch
                            // 0.5 zu hoch
                            // 1.5 zu tief
                            // 1 etw. zu hoch?

                            // Transform the first point
                            const startX: number = line[0].x * scaleX*offset_x_for_tablet;// TODO : const startX: number = line[0].x //* scaleX;
                            const startY: number = line[0].y * scaleY*offset_y_for_tablet;// TODO : const startY: number = line[0].y //* scaleY;
                            // alert(`*1.08 (x) -> startX: ${startX}, *1.08 (y) startY: ${startY}`);
                            // Tablet: 539.194..., 74.771... = nach o
                            // +10 = nach s
                            // + 100 (y) -> 170 = nach o
                            // + 50 x = 468, +5 y = 100 --> Faktor
                            tempContext.moveTo(startX, startY);

                            // Transform all subsequent points
                            for (let i = 1; i < line.length; i++) {
                                const pointX: number = line[i].x * scaleX*offset_x_for_tablet;
                                const pointY: number = line[i].y * scaleY*offset_y_for_tablet;
                                tempContext.lineTo(pointX, pointY);
                            }

                            tempContext.stroke();
                        }
                    }

                    // Convert to Blob and save as PNG
                    tempCanvas.toBlob((blob) => {
                        if (blob) {
                            this.dataStorageService.saveData(cleanFileName, blob);
                            console.log(`Screenshot with timestamp ${formattedTimestamp} saved successfully: ${cleanFileName}`);
                            
                            // Resolve the promise for this screenshot
                            resolve();
                            
                            // Clean up
                            tempCanvas.remove();
                            
                            // Clear the flag and process the next item
                            this.screenshotInProgress = false;
                            this.processScreenshotQueue();
                        } else {
                            console.error('Failed to create blob for screenshot');
                            reject(new Error('Blob creation failed'));
                            
                            // Clean up
                            tempCanvas.remove();
                            
                            // Clear the flag and process the next item
                            this.screenshotInProgress = false;
                            this.processScreenshotQueue();
                        }
                    }, 'image/png');
                } catch (error) {
                    console.error('Error in screenshot generation:', error);
                    reject(error);
                    
                    // Clean up
                    tempCanvas.remove();
                    
                    // Clear the flag and process the next item
                    this.screenshotInProgress = false;
                    this.processScreenshotQueue();
                }
            };
    
            image.onerror = () => {
                console.error(`Failed to load background image for ${sheetName}:`, backgroundImageUrl);
                reject(new Error('Image loading failed'));
                
                // Clean up
                tempCanvas.remove();
                
                // Clear the flag and process the next item
                this.screenshotInProgress = false;
                this.processScreenshotQueue();
            };
        } catch (error) {
            console.error('Unexpected error in processScreenshotQueue:', error);
            reject(error);
            
            // Clear the flag and process the next item
            this.screenshotInProgress = false;
            this.processScreenshotQueue();
        }
    }


    // Backup function to save drawings due to SKipTask mishandling
    public saveDrawingsOnly(): void {
        console.log("Save Drawings Only: Starting...");
        
        try {
          // Get the current drawing data for both sheets
          const drawingData = {
            sheet1: this.sheetDrawings['sheet1'] || [],
            sheet2: this.sheetDrawings['sheet2'] || []
          };
          
          // Create JSON blob
          const jsonBlob = new Blob(
            [JSON.stringify(drawingData, null, 2)], 
            { type: "application/json" }
          );
          
          // Save to the main file
          this.dataStorageService.saveData("All_Sheet_Drawings.json", jsonBlob);
          
          // Also save a timestamped backup
          const timestamp = new Date().getTime();
          this.dataStorageService.saveData(`All_Sheet_Drawings_${timestamp}.json`, jsonBlob);
          
          console.log("Save Drawings Only: Saved successfully");
        } catch (error) {
          console.error("Save Drawings Only: Error saving drawings", error);
          
          // A simpler save approach as backup
          try {
            const simpleBlob = new Blob(
              [JSON.stringify({
                sheet1: this.sheetDrawings['sheet1'] || [],
                sheet2: this.sheetDrawings['sheet2'] || []
              })], 
              { type: "application/json" }
            );
            
            this.dataStorageService.saveData("All_Sheet_Drawings_Backup.json", simpleBlob);
            console.log("Save Drawings Only: Saved backup file");
          } catch (e) {
            console.error("Save Drawings Only: Failed to save backup", e);
          }
        }
      }




    async saveDrawing(customFileName?: string) {
        console.log(`saveDrawing called with customFileName: ${customFileName || 'none'}`);
        const baseFileName = (customFileName || this.createStandardFileName('Drawing')).replace(/\.json$/, '');
        
        if (this.canvas && this.context) {
            try {
                // Creating composite data for all sheets
                const allSheetData = {
                    sheet1: this.sheetDrawings['sheet1'] || [],
                    sheet2: this.sheetDrawings['sheet2'] || []
                };
    
                // Save the data of all sheets with a fixed name - This is critical for later analysis
                console.log('Saving All_Sheet_Drawings.json file with combined drawing data');
                this.dataStorageService.saveData(
                    `All_Sheet_Drawings.json`,
                    new Blob([JSON.stringify(allSheetData, null, 2)], { type: "application/json" })
                );
    
                
                if (customFileName) {
                    console.log(`Taking screenshots for custom drawing save: ${baseFileName}`);
                    await this.saveAllSheetScreenshots(baseFileName);
                } else {
                    console.log('Skipping screenshots in saveDrawing as no custom filename was provided');
                }
                
                console.log('Drawing data saved successfully');
            } catch (error) {
                console.error('Error saving drawings:', error);
                // Even if there's an error, try one more time to save the JSON file
                try {
                    const allSheetData = {
                        sheet1: this.sheetDrawings['sheet1'] || [],
                        sheet2: this.sheetDrawings['sheet2'] || []
                    };
                    this.dataStorageService.saveData(
                        `All_Sheet_Drawings_recovery.json`,
                        new Blob([JSON.stringify(allSheetData, null, 2)], { type: "application/json" })
                    );
                    console.log('Recovery drawing data file saved due to error in main save');
                } catch (recoveryError) {
                    console.error('Could not save recovery drawing data:', recoveryError);
                }
            }
        } else {
            console.error('Canvas or context not available for saving drawings');
        }
    }


    ngOnDestroy() {
        // Clear the interval
        if (this.saveInterval) {
          clearInterval(this.saveInterval);
        }
        
        // Final save on component destruction
        this.persistAllDrawings();
        
        // Remove event listener
        window.removeEventListener('beforeunload', () => {
          this.persistAllDrawings();
        });
      }
      
      
      persistAllDrawings(): boolean {
        console.log("Persisting ALL drawings to storage");
        
        try {
          // Create a deep copy of drawings data for all sheets
          const allDrawings = {
            sheet1: JSON.parse(JSON.stringify(this.sheetDrawings['sheet1'] || [])),
            sheet2: JSON.parse(JSON.stringify(this.sheetDrawings['sheet2'] || []))
          };
          
          // Log what we're saving
          console.log(`Saving: sheet1=${allDrawings.sheet1.length} lines, sheet2=${allDrawings.sheet2.length} lines`);
          
          // Check if there's anything to save
          const totalLines = allDrawings.sheet1.length + allDrawings.sheet2.length;
          if (totalLines === 0) {
            console.log("No drawing data to save");
            return false;
          }
          
          // See if anything has changed since last save
          const lastTotalLines = this.lastSavedDrawings['sheet1'].length + this.lastSavedDrawings['sheet2'].length;
          if (totalLines === lastTotalLines) {
            // Check if the data is identical (basic check)
            const jsonCurrent = JSON.stringify(allDrawings);
            const jsonLast = JSON.stringify(this.lastSavedDrawings);
            if (jsonCurrent === jsonLast) {
              console.log("Drawing data unchanged since last save, skipping");
              return true; // No need to save again
            }
          }
          
          // Create timestamp for backup filename
          const timestamp = new Date().getTime();
          
          // Add metadata to the saved data
          const saveData = {
            timestamp: timestamp,
            sheets: {
              ...allDrawings
            }
          };
          
          // Create and save the file
          const jsonBlob = new Blob(
            [JSON.stringify(saveData, null, 2)],
            { type: "application/json" }
          );
          
          // Save to main file
          this.dataStorageService.saveData("All_Sheet_Drawings.json", jsonBlob);
          
          // Save timestamped backup every 5 minutes
          if (timestamp % 300000 < 10000) { // Roughly every 5 minutes
            this.dataStorageService.saveData(`All_Sheet_Drawings_${timestamp}.json`, jsonBlob);
          }
          
          // Update last saved state
          this.lastSavedDrawings = {
            sheet1: allDrawings.sheet1,
            sheet2: allDrawings.sheet2
          };
          
          console.log("All drawings saved successfully");
          return true;
        } catch (error) {
          console.error("Error persisting drawings:", error);
          
          // Attempt emergency backup with minimal approach
          try {
            const minimalData = {
              sheet1: this.sheetDrawings['sheet1'] || [],
              sheet2: this.sheetDrawings['sheet2'] || []
            };
            
            const emergencyBlob = new Blob(
              [JSON.stringify(minimalData)],
              { type: "application/json" }
            );
            
            this.dataStorageService.saveData("Emergency_Drawings_Backup.json", emergencyBlob);
            console.log("Emergency backup created");
          } catch (e) {
            console.error("Even emergency backup failed:", e);
          }
          
          return false;
        }
      }
      
      
      backupAllDrawings(): void {
        try {
          const allDrawings = {
            sheet1: this.sheetDrawings['sheet1'] || [],
            sheet2: this.sheetDrawings['sheet2'] || []
          };
          
          // Only create backup if there's data
          if (allDrawings.sheet1.length > 0 || allDrawings.sheet2.length > 0) {
            const timestamp = new Date().getTime();
            const backupBlob = new Blob(
              [JSON.stringify(allDrawings)],
              { type: "application/json" }
            );
            
            this.dataStorageService.saveData("Auto_Backup_Drawings.json", backupBlob);
          }
        } catch (error) {
          console.error("Auto backup failed:", error);
        }
      }
      





    forceSaveAllDrawings(): boolean {
        console.log("FORCE SAVE: Creating All_Sheet_Drawings.json");
        
        return this.persistAllDrawings();
      }


async saveAllSheetScreenshots(baseFileName: string) {
    try {
        // Use Promise.all to save screenshots concurrently
        await Promise.all([
            this.saveSheetScreenshot('sheet1', baseFileName),
            this.saveSheetScreenshot('sheet2', baseFileName)
        ]);
        
        console.log('All screenshots saved successfully');
    } catch (error) {
        console.error('Error saving screenshots:', error);
    }
}


    drawLinesOnCanvas(saveContext: CanvasRenderingContext2D) {
        // Zeichnen Sie die Linien auf das Bild
        for (const line of this.capturedLines) {
            saveContext.beginPath();
            saveContext.moveTo(line[0].x, line[0].y);
            for (let i = 1; i < line.length; i++) {
                saveContext.lineTo(line[i].x, line[i].y);
            }
            saveContext.strokeStyle = this.context!.strokeStyle as string;
            saveContext.lineWidth = this.context!.lineWidth;
            saveContext.stroke();
        }
    }

    get hasDescription(): boolean {
      return typeof this.currentTask?.description === 'string' && this.currentTask.description.length > 0;
    }
    
    async resetDrawing() {
        console.log("Reset drawings for current sheet...");
        
        // First, get a reference to the current drawings and check if they exist
        const currentDrawings = this.sheetDrawings[this.currentSheet] || [];
        
        // Check if there are drawings to reset (avoid taking screenshots if nothing to reset)
        if (currentDrawings.length > 0 && this.currentTask) {
            // Generate a descriptive filename for the screenshot that includes the task number
            const info = this.currentTask.id || "unknown";
            const fileName = `Task_${info}_Reset_Current_Sheet_${this.currentSheet}`;
            
            // Take a screenshot of the current sheet before resetting
            console.log(`Taking screenshot before resetting ${this.currentSheet} for task ${info}`);
            await this.saveSheetScreenshot(this.currentSheet, fileName);
            
            // Update previous drawings state to empty since we're about to clear them
            this.previousSheetDrawings[this.currentSheet] = JSON.parse(JSON.stringify(currentDrawings));
        } else {
            console.log(`No drawings to reset on ${this.currentSheet} or no current task`);
        }
        
        // Increment the resets counter for the current task
        if (this.currentTask) {
            this.currentTask.resets = this.currentTask.resets + 1;
            this.currentTask.startTimeWatching = new Date();
        }
        
        // Clear the current sheet's drawing
        this.capturedLines = []; 
        this.sheetDrawings[this.currentSheet] = [];
        
        // Redraw the canvas (which will now be clear)
        this.drawOnCanvas();
        
        console.log(`Reset completed for ${this.currentSheet}`);
    }
    
    async resetAllDrawings() {
        console.log("Reset all drawings for all sheets...");
        
        // Set the flag to skip transition screenshots
        this.isSkipTransitionScreenshot = true;
        
        try {
            // Store the current sheet before resetting
            const currentSheetBeforeReset = this.currentSheet;
            
            // Define the sheets we need to reset
            const sheets = ['sheet1', 'sheet2'];

            // First, take screenshots of all sheets that have drawings before resetting
            for (const sheet of sheets) {
                // Check if the sheet has any drawings
                const sheetDrawings = this.sheetDrawings[sheet] || [];
                
                if (sheetDrawings.length > 0) {
                    // We need to switch to this sheet to take a proper screenshot
                    await this.changeBackground(sheet);
                    
                    // Generate filename for the screenshot with task number
                    const fileName = `Task_${this.currentTask?.id}_Reset_All_Sheets_${sheet}`;
                    
                    // Take screenshot of this sheet
                    console.log(`Taking screenshot before resetting ${sheet} for task ${this.currentTask?.id}`);
                    await this.saveSheetScreenshot(sheet, fileName);
                    
                    // Save current drawings as previous state
                    this.previousSheetDrawings[sheet] = JSON.parse(JSON.stringify(sheetDrawings));
                } else {
                    console.log(`No drawings to reset on ${sheet}`);
                }
            }
            
            // Now reset all drawings for each sheet
            for (const sheet of sheets) {
                // Clear the saved drawings for this sheet
                this.sheetDrawings[sheet] = [];
                console.log(`${sheet} drawings cleared.`);
            }
            
            // If we're on one of the sheets that was just reset, clear the current lines
            this.capturedLines = [];
            
            // Restore the original sheet view
            await this.changeBackground(currentSheetBeforeReset);
            
            // Redraw the canvas (which will now be clear for the current sheet)
            this.drawOnCanvas();
            
            console.log(`All sheets have been reset successfully for task ${this.currentTask?.id}.`);
        } finally {
            // Reset the flag when done, even if there was an error
            this.isSkipTransitionScreenshot = false;
        }
    }    
    
    
    

    /**
     * Tablet Section
     */

    onTouchStart(event: TouchEvent) {
        event.preventDefault(); // Verhindert das Scrollen der Seite bei Touch-Events
        const touch = event.touches[0];
        this.onMouseDown(touch);
    }

    onTouchMove(event: TouchEvent) {
        event.preventDefault();
        const touch = event.touches[0];
        this.onMouseMove(touch);
    }

    onTouchEnd(event: TouchEvent) {
        event.preventDefault();
        this.onMouseUp();
    }
}
