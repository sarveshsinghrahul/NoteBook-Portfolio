
import { Component, ViewChild, ElementRef, AfterViewInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chalkboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col items-center w-full max-w-5xl mx-auto">
      <!-- Board Frame -->
      <div class="relative w-full aspect-[16/9] md:aspect-[2/1] bg-[#2b3a33] rounded-t-lg shadow-2xl overflow-hidden border-8 border-[#5d4037] border-b-0 select-none cursor-none shadow-inner group">
        <!-- Chalkboard Texture -->
        <div class="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_center,_#ffffff_0%,_transparent_100%)] bg-[length:4px_4px]"></div>
        <div class="absolute inset-0 pointer-events-none opacity-20" style="background-image: radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px); background-size: 20px 20px;"></div>
        
        <canvas #canvas 
          class="absolute inset-0 w-full h-full z-10 touch-none"
          [class.chalk-brush]="currentTool() === 'chalk'"
          [class.eraser-brush]="currentTool() === 'duster'"
          (mousedown)="startDraw($event)"
          (mousemove)="draw($event)"
          (mouseup)="stopDraw()"
          (mouseout)="stopDraw()"
          (touchstart)="handleTouchStart($event)"
          (touchmove)="handleTouchMove($event)"
          (touchend)="stopDraw()">
        </canvas>
      </div>

      <!-- Wooden Tray -->
      <div class="w-[101%] h-14 bg-[#5d4037] rounded-b-sm shadow-[0_10px_20px_rgba(0,0,0,0.4)] flex items-center justify-center gap-20 relative border-t-[6px] border-[#3e2723] z-20">
          
          <!-- Chalk Tool -->
          <div (click)="setTool('chalk')" 
               class="group cursor-pointer relative top-1 hover:-translate-y-1 transition-all duration-300"
               title="Use Chalk">
               <div class="w-16 h-2 bg-white/90 rounded-sm shadow-sm transform rotate-1 filter drop-shadow-md relative z-10"
                    [class.ring-2]="currentTool() === 'chalk'"
                    [class.ring-yellow-400]="currentTool() === 'chalk'"></div>
               <div class="w-16 h-2 bg-white/90 rounded-sm shadow-sm transform -rotate-3 absolute top-0 left-2 opacity-80 z-0"></div>
               @if (currentTool() === 'chalk') {
                 <div class="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[9px] font-mono text-[#a1887f] uppercase tracking-widest opacity-80">Active</div>
               }
          </div>

          <!-- Duster Tool -->
          <div (click)="setTool('duster')" 
               class="group cursor-pointer relative top-0 hover:-translate-y-1 transition-all duration-300"
               title="Use Duster">
               <div class="w-24 h-7 bg-[#4e342e] rounded-sm shadow-[2px_2px_4px_rgba(0,0,0,0.5)] relative overflow-hidden border border-[#3e2723]"
                    [class.ring-2]="currentTool() === 'duster'"
                    [class.ring-yellow-400]="currentTool() === 'duster'">
                  <!-- Wood texture stripes -->
                  <div class="absolute top-1 left-2 w-16 h-[1px] bg-black/20"></div>
                  <div class="absolute top-3 right-4 w-10 h-[1px] bg-black/20"></div>
                  <!-- Felt bottom visual -->
                  <div class="absolute bottom-0 w-full h-2 bg-[#d7ccc8] border-t border-black/10"></div>
               </div>
               @if (currentTool() === 'duster') {
                 <div class="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[9px] font-mono text-[#a1887f] uppercase tracking-widest opacity-80">Active</div>
               }
          </div>
      </div>
    </div>
  `
})
export class ChalkboardComponent implements AfterViewInit {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  
  currentTool = signal<'chalk' | 'duster'>('chalk');
  isDrawing = false;
  lastX = 0;
  lastY = 0;
  ctx: CanvasRenderingContext2D | null = null;

  ngAfterViewInit() {
    this.ctx = this.canvasRef.nativeElement.getContext('2d');
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  resizeCanvas() {
    if (!this.canvasRef) return;
    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
  }

  setTool(tool: 'chalk' | 'duster') {
    this.currentTool.set(tool);
  }

  startDraw(e: MouseEvent | TouchEvent) {
    this.isDrawing = true;
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const clientX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
    const clientY = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
    this.lastX = clientX - rect.left;
    this.lastY = clientY - rect.top;
  }

  handleTouchStart(e: TouchEvent) {
    e.preventDefault();
    this.startDraw(e);
  }

  handleTouchMove(e: TouchEvent) {
    e.preventDefault();
    this.draw(e);
  }

  draw(e: MouseEvent | TouchEvent) {
    if (!this.isDrawing || !this.ctx) return;
    
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const clientX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
    const clientY = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    this.ctx.beginPath();
    this.ctx.moveTo(this.lastX, this.lastY);
    this.ctx.lineTo(x, y);
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';

    if (this.currentTool() === 'chalk') {
      this.ctx.globalCompositeOperation = 'source-over';
      this.ctx.strokeStyle = '#ffffff';
      this.ctx.lineWidth = 2;
      this.ctx.shadowBlur = 1;
      this.ctx.shadowColor = 'white';
      this.ctx.stroke();

      // Texture effect
      this.ctx.beginPath();
      this.ctx.moveTo(this.lastX + (Math.random()-0.5)*2, this.lastY + (Math.random()-0.5)*2);
      this.ctx.lineTo(x + (Math.random()-0.5)*2, y + (Math.random()-0.5)*2);
      this.ctx.lineWidth = 1;
      this.ctx.strokeStyle = 'rgba(255,255,255,0.4)';
      this.ctx.stroke();
    } else {
      this.ctx.globalCompositeOperation = 'destination-out';
      this.ctx.lineWidth = 40;
      this.ctx.shadowBlur = 10;
      this.ctx.shadowColor = 'rgba(0,0,0,1)';
      this.ctx.stroke();
      
      this.ctx.globalCompositeOperation = 'source-over';
      this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      this.ctx.lineWidth = 35;
      this.ctx.shadowBlur = 0;
      this.ctx.stroke();
    }

    this.lastX = x;
    this.lastY = y;
  }

  stopDraw() {
    this.isDrawing = false;
    this.ctx?.beginPath();
  }
}
