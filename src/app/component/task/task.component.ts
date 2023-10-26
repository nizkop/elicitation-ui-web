import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {TaskService} from "../../shared/service/task.service";
import {Task} from "../../shared/model/task";
import {Language} from "../../shared/model/language.enum";
import {ActivatedRoute} from "@angular/router";
import {Group} from "../../shared/model/group.enum";

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {
  @ViewChild('backgroundImage') backgroundImage!: ElementRef;
  @ViewChild('drawingCanvas', { static: false }) drawingCanvas!: ElementRef;

  backgroundImageUrl = './assets/Spreadsheet_DE.png';
  canvas: HTMLCanvasElement | null = null;
  context: CanvasRenderingContext2D | null = null;
  drawing = false;

  capturedLines: Array<Array<{ x: number; y: number }>> = [];
  currentLine: { x: number; y: number }[] = [];

  tasks: Task[] | undefined;
  currentTask: Task | undefined;

  protected readonly Language = Language;

  constructor(private taskService: TaskService, private route: ActivatedRoute) {}

  ngOnInit() {
      //TODO: capturedLines is already defined in Task Mode -> update Model with the same id
    this.capturedLines = [];
    this.tasks = this.taskService.initDataGerman();
      const taskNumber = +this.route.snapshot.params['taskNumber'];
      this.currentTask = this.tasks?.find(task => task.taskNumber === taskNumber);

      if (this.currentTask) {
          console.log(this.currentTask);
      } else {
          console.log('Aufgabe nicht gefunden');
      }
  }

  onImageLoad() {
      this.canvas = this.drawingCanvas.nativeElement;
    this.context = this.canvas!.getContext('2d');

    if (this.context && this.canvas) {
      this.canvas.width = this.backgroundImage.nativeElement.width;
      this.canvas.height = this.backgroundImage.nativeElement.height;

      this.context.strokeStyle = 'black';
      this.context.lineWidth = 2;
    }
  }

    onMouseDown(event: MouseEvent | Touch) {
        if (this.context && this.canvas) {
            this.drawing = true;
            const x = ('offsetX' in event) ? (event as MouseEvent).offsetX : (event as Touch).clientX - this.canvas.getBoundingClientRect().left;
            const y = ('offsetY' in event) ? (event as MouseEvent).offsetY : (event as Touch).clientY - this.canvas.getBoundingClientRect().top;
            this.context.beginPath();
            this.context.moveTo(x, y);
        }
    }

    onMouseMove(event: MouseEvent | Touch) {
        if (this.drawing && this.canvas) {
            const x = ('offsetX' in event) ? (event as MouseEvent).offsetX : (event as Touch).clientX - this.canvas.getBoundingClientRect().left;
            const y = ('offsetY' in event) ? (event as MouseEvent).offsetY : (event as Touch).clientY - this.canvas.getBoundingClientRect().top;
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
      this.currentLine = [];
    }
  }

    saveDrawing() {
        if (this.canvas && this.context) {
            const saveCanvas = document.createElement('canvas');
            const saveContext = saveCanvas.getContext('2d');
            if (saveContext) {
                saveCanvas.width = this.canvas.width;
                saveCanvas.height = this.canvas.height;
                for (const line of this.capturedLines) {
                    saveContext.beginPath();
                    saveContext.moveTo(line[0].x, line[0].y);
                    for (let i = 1; i < line.length; i++) {
                        saveContext.lineTo(line[i].x, line[i].y);
                    }
                    saveContext.strokeStyle = this.context.strokeStyle as string;
                    saveContext.lineWidth = this.context.lineWidth;
                    saveContext.stroke();
                }
                //PNG
                const dataUrl = saveCanvas.toDataURL('image/png');
                const a = document.createElement('a');
                a.href = dataUrl;
                a.download = 'drawing.png';

                //JSON
                const drawingData = {
                    lines: this.capturedLines,
                };
                const jsonData = JSON.stringify(drawingData);
                const blob = new Blob([jsonData], { type: 'application/json' });
                const b = document.createElement('a');
                b.href = URL.createObjectURL(blob);
                b.download = 'drawing.json';

                //PNG
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);

                //JSON
                document.body.appendChild(b);
                b.click();
                document.body.removeChild(b);

                //Clean up
                saveCanvas.remove();
            }
        }
        this.resetDrawing();
    }

    resetDrawing() {
    console.log("Reset drawings...")
    this.capturedLines = [];
    this.drawOnCanvas();
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
