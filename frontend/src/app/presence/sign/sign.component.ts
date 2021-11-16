import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-sign',
  templateUrl: './sign.component.html',
  styleUrls: ['./sign.component.css']
})
export class SignComponent implements OnInit {

  constructor() { }

  @ViewChild("mon_canvas") myCanvas: ElementRef;
  ngAfterViewInit(): void {
    let isDrawing = false;
    let x = 0;
    let y = 0;

    var context = this.myCanvas.nativeElement.getContext('2d');
    this.myCanvas.nativeElement.addEventListener('mousedown', e => {
      x = e.offsetX;
      y = e.offsetY;
      isDrawing = true;
    });

    this.myCanvas.nativeElement.addEventListener('mousemove', e => {
      if (isDrawing === true) {
        drawLine(context, x, y, e.offsetX, e.offsetY);
        x = e.offsetX;
        y = e.offsetY;
      }
    });

    window.addEventListener('mouseup', e => {
      if (isDrawing === true) {
        drawLine(context, x, y, e.offsetX, e.offsetY);
        x = 0;
        y = 0;
        isDrawing = false;
      }
    });

    function drawLine(context, x1, y1, x2, y2) {
      context.beginPath();
      context.strokeStyle = 'black';
      context.lineWidth = 1;
      context.moveTo(x1, y1);
      context.lineTo(x2, y2);
      context.stroke();
      context.closePath();
    }
  }
  ngOnInit(): void {

  }

  getSignature(){
    var canvasContents = this.myCanvas.nativeElement.toDataURL();
    var data = { a: canvasContents };
    var string = JSON.stringify(data);
    var signature = string.substring(6, string.length - 2);
    var date_signature = new Date();
    console.log(signature)
  }

}
