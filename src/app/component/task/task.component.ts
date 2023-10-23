import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {TaskService} from "../../shared/service/task.service";
import {Task} from "../../shared/model/Task";

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {
  @ViewChild('backgroundImage') backgroundImage!: ElementRef;
  @ViewChild('drawingCanvas', { static: false }) drawingCanvas!: ElementRef;

  backgroundImageUrl = '/assets/Spreadsheet_DE.png';
  canvas: HTMLCanvasElement | null = null;
  context: CanvasRenderingContext2D | null = null;
  drawing = false;

  capturedLines: Array<Array<{ x: number; y: number }>> = [];
  currentLine: { x: number; y: number }[] = [];

  tasks: Task[] = [];

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.capturedLines = [];
    // @ts-ignore
    this.tasks = this.taskService.tasks;
    console.log(this.tasks);
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

  onMouseDown(event: MouseEvent) {
    if (this.context) {
      this.drawing = true;
      this.context.beginPath();
      this.context.moveTo(event.offsetX, event.offsetY);
    }
  }

  onMouseMove(event: MouseEvent) {
    if (this.drawing) {
      const point = { x: event.offsetX, y: event.offsetY };
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
    console.log("Save drawings...")
    if (this.canvas && this.context) {
      const drawingData: { lines: { points: { x: number; y: number }[]; color: string; width: number }[] } = {
        lines: []
      };

      for (const line of this.capturedLines) {
        const lineData = {
          points: [...line],
          color: this.context.strokeStyle as string,
          width: this.context.lineWidth,
        };
        drawingData.lines.push(lineData);
      }

      //TODO: Save drawing data
      console.log('Drawing Data:', drawingData);
    }
  }

  resetDrawing() {
    console.log("Reset drawings...")
    this.capturedLines = [];
    this.drawOnCanvas();
  }
}
