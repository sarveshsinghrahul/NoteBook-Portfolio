
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-screen',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isVisible()) {
      <div id="loading-screen" 
           class="fixed top-0 left-0 w-full h-full bg-[#fcfcfb] z-[9999] flex flex-col justify-center items-center transition-opacity duration-800 ease-out font-mono"
           [style.opacity]="opacity()"
           style="background-image: radial-gradient(#cbd5e1 1px, transparent 1px); background-size: 30px 30px;">
        
        <!-- Center Content -->
        <div class="relative flex flex-col items-center">
            
            <!-- Logo Area: Self-Drawing Geometric Shape -->
            <div class="relative w-48 h-48 mb-12">
                <!-- Outer Pulse Ring -->
                <div class="absolute inset-0 border-2 border-dashed border-gray-300 rounded-full animate-[spin_10s_linear_infinite]"></div>
                <div class="absolute inset-2 border border-gray-200 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
                
                <!-- Main SVG Logo -->
                <svg class="w-full h-full drop-shadow-xl p-10" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <!-- Isometric/Penrose Triangle Path -->
                    <path class="text-gray-800 logo-draw-path" d="M50 10 L85 30 L85 70 L50 90 L15 70 L15 30 Z M50 10 L50 50 M15 70 L50 50 M85 70 L50 50" stroke-dasharray="300" stroke-dashoffset="300"></path>
                    
                    <!-- Inner details -->
                    <circle class="text-red-500 opacity-0 fade-in-delay" cx="50" cy="50" r="3" fill="currentColor" stroke="none"></circle>
                    <path class="text-blue-500 opacity-0 fade-in-delay-2" d="M50 10 L50 0" stroke-dasharray="2 2"></path>
                    <path class="text-blue-500 opacity-0 fade-in-delay-2" d="M15 30 L5 25" stroke-dasharray="2 2"></path>
                    <path class="text-blue-500 opacity-0 fade-in-delay-2" d="M85 30 L95 25" stroke-dasharray="2 2"></path>
                    <path class="text-blue-500 opacity-0 fade-in-delay-2" d="M15 70 L5 75" stroke-dasharray="2 2"></path>
                    <path class="text-blue-500 opacity-0 fade-in-delay-2" d="M85 70 L95 75" stroke-dasharray="2 2"></path>
                    <path class="text-blue-500 opacity-0 fade-in-delay-2" d="M50 90 L50 100" stroke-dasharray="2 2"></path>
                </svg>
            </div>

            <!-- Loading Status Text -->
            <div class="flex items-center gap-4 mb-4 text-xs tracking-[0.2em] text-gray-500 uppercase">
                <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span>Initializing Workspace</span>
                <span class="w-12 text-right font-bold text-gray-800">{{ progress() }}%</span>
            </div>

            <!-- Enhanced Loading Bar -->
            <div class="relative w-80 h-3 bg-gray-100 rounded-full overflow-visible border border-gray-200 shadow-inner">
                <!-- Tick Marks -->
                <div class="absolute inset-0 w-full h-full opacity-30" 
                     style="background-image: linear-gradient(90deg, #9ca3af 1px, transparent 1px); background-size: 10% 100%;"></div>
                
                <!-- Progress Fill (Scribble/Graphite Texture) -->
                <div class="h-full bg-gray-700 relative rounded-l-full transition-[width] duration-75 ease-linear overflow-hidden" [style.width]="progress() + '%'">
                     <div class="absolute inset-0 opacity-20 w-full h-full animate-[scanline_1s_linear_infinite]" 
                          style="background-image: repeating-linear-gradient(45deg, transparent, transparent 2px, #fff 2px, #fff 4px);"></div>
                </div>

                <!-- Pencil Tip Indicator -->
                <div class="absolute top-1/2 -translate-y-1/2 -ml-3 w-8 h-8 transition-[left] duration-75 ease-linear filter drop-shadow-lg z-20 pointer-events-none"
                     [style.left]="progress() + '%'">
                     <!-- Complex Pencil SVG -->
                     <svg viewBox="0 0 32 32" class="w-full h-full transform -rotate-45 origin-center">
                        <!-- Body -->
                        <path d="M6 22 L22 6 L26 10 L10 26 Z" fill="#f59e0b" stroke="#b45309" stroke-width="1"></path>
                        <!-- Metal Ferrule -->
                        <path d="M22 6 L24 4 L28 8 L26 10 Z" fill="#d1d5db" stroke="#6b7280" stroke-width="1"></path>
                        <!-- Eraser -->
                        <path d="M24 4 L25 3 C26 2 27 2 28 3 L29 4 C30 5 30 6 29 7 L28 8 Z" fill="#fca5a5" stroke="#ef4444" stroke-width="1"></path>
                        <!-- Wood Cone -->
                        <path d="M6 22 L10 26 L4 28 Z" fill="#fde68a" stroke="#d97706" stroke-width="0.5"></path>
                        <!-- Lead Tip -->
                        <path d="M4 28 L3 29 L2 30 L4 28 Z" fill="#1f2937"></path>
                     </svg>
                </div>
            </div>

            <!-- Footer Tech Label -->
            <div class="mt-8 text-[10px] text-gray-400 font-mono tracking-widest opacity-60">
                SYSTEM_REF: V.2.0.4 // LOGGING_ENABLED
            </div>

        </div>
      </div>
    }
  `,
  styles: [`
    .logo-draw-path {
      animation: drawLogo 2s ease-in-out forwards;
    }
    .fade-in-delay {
        animation: fadeIn 0.5s ease-out 1.5s forwards;
    }
    .fade-in-delay-2 {
        animation: fadeIn 0.5s ease-out 2s forwards;
    }
    @keyframes drawLogo {
      to { stroke-dashoffset: 0; }
    }
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
  `]
})
export class LoadingScreenComponent {
  progress = signal(0);
  opacity = signal(1);
  isVisible = signal(true);

  constructor() {
    // Start loading animation immediately
    const interval = setInterval(() => {
      if (this.progress() >= 100) {
        clearInterval(interval);
        this.opacity.set(0);
        setTimeout(() => {
          this.isVisible.set(false);
          document.body.classList.add('animations-active');
        }, 800);
      } else {
        this.progress.update(p => p + 1);
      }
    }, 25);
  }
}
