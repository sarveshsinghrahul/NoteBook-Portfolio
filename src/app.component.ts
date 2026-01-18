
import { Component, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoadingScreenComponent } from './components/loading-screen.component';
import { ChalkboardComponent } from './components/chalkboard.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingScreenComponent, ChalkboardComponent],
  templateUrl: './app.component.html',
  styles: [`
    :host {
      display: block;
    }
    /* Resume Input Styles */
    .resume-input {
      background: transparent;
      border: none;
      border-bottom: 1px solid transparent;
      width: 100%;
      outline: none;
      transition: border-color 0.2s;
      border-radius: 0;
      padding: 0;
      margin: 0;
      color: inherit;
      font-family: inherit;
      font-weight: inherit;
      font-size: inherit;
      line-height: inherit;
      letter-spacing: inherit;
      text-transform: inherit;
    }
    .resume-input:hover, .resume-input:focus {
      border-bottom-color: #cbd5e1; /* gray-300 */
    }
    .resume-textarea {
      background: transparent;
      border: 1px solid transparent;
      width: 100%;
      outline: none;
      resize: none;
      transition: border-color 0.2s;
      border-radius: 4px;
      padding: 4px;
      color: inherit;
      font-family: inherit;
      overflow: hidden;
    }
    .resume-textarea:hover, .resume-textarea:focus {
      border-color: #cbd5e1;
    }
  `]
})
export class AppComponent {
  darkMode = signal(false);
  isStamped = signal(false);
  
  // Email Form State
  senderName = signal('');
  senderSubject = signal('');
  senderMessage = signal('');
  isSending = signal(false);
  sentSuccess = signal(false);

  // Resume Data State (Editable)
  resumeData = signal({
    name: 'SARVESH SINGH',
    title: 'Engineering Portfolio',
    education: {
      degree: 'B.Tech Engineering',
      university: 'University of Tech',
      years: '2021 - 2025',
      gpa: 'GPA: 3.8/4.0'
    },
    skills: [
      { name: 'Python & C++', icon: 'check' },
      { name: 'TensorFlow/PyTorch', icon: 'check' },
      { name: 'Embedded Systems', icon: 'check' },
      { name: 'Web Technologies', icon: 'check' },
      { name: '3D Modeling', icon: 'check' }
    ],
    contact: {
      email: 'sarveshs.rahul@gmail.com',
      website: 'www.sarvesh.dev',
      location: 'New Delhi, India'
    },
    experience: [
      {
        role: 'Machine Learning Intern',
        company: 'TechCorp Inc. | Summer 2023',
        description: 'Engineered a lightweight Convolutional Neural Network (CNN) for gesture recognition on ESP32 microcontrollers. Reduced model size by 65% while maintaining 92% accuracy through quantization-aware training.'
      },
      {
        role: 'Robotics Research Assistant',
        company: 'University Robotics Lab | 2022 - Present',
        description: 'Developing reinforcement learning agents for autonomous maze navigation. Implemented PPO algorithms in PyTorch to simulate multi-agent environments. Authored a paper on "Swarm Intelligence in Constrained Spaces".'
      }
    ],
    projects: [
      {
        name: 'Autonomous Drone Pathing',
        description: 'A* pathfinding algorithm implemented on custom flight controller hardware.'
      },
      {
        name: 'Smart Home Hub',
        description: 'IoT dashboard built with React and MQTT for real-time sensor monitoring.'
      }
    ]
  });

  constructor() {
    // Load resume data from local storage if available
    const savedResume = localStorage.getItem('resumeData');
    if (savedResume) {
      try {
        this.resumeData.set(JSON.parse(savedResume));
      } catch (e) {
        console.error('Failed to load resume data', e);
      }
    }

    // Auto-save resume data whenever it changes
    effect(() => {
      localStorage.setItem('resumeData', JSON.stringify(this.resumeData()));
    });
  }
  
  toggleDarkMode(event: any) {
    this.darkMode.set(event.target.checked);
    if (this.darkMode()) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  toggleStamp() {
    this.isStamped.update(v => !v);
    
    // Play a sound if we had one, for now just visual
    if (this.isStamped()) {
      // Small vibration for feedback
      if (navigator.vibrate) navigator.vibrate(50);
    }
  }

  // Helper for scroll offset
  scrollTo(id: string) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  sendEmail() {
    if (!this.senderName() || !this.senderMessage()) {
      alert('Please fill in your name and message to send a letter.');
      return;
    }

    this.isSending.set(true);

    // Simulate "processing" time for the aesthetic of the site
    setTimeout(() => {
      const subject = encodeURIComponent(this.senderSubject() || 'Portfolio Inquiry');
      const body = encodeURIComponent(`From: ${this.senderName()}\n\nMessage:\n${this.senderMessage()}`);
      
      // Open default mail client
      window.location.href = `mailto:sarveshs.rahul@gmail.com?subject=${subject}&body=${body}`;

      this.isSending.set(false);
      this.sentSuccess.set(true);

      // Reset success state after a delay
      setTimeout(() => {
        this.sentSuccess.set(false);
        this.senderName.set('');
        this.senderSubject.set('');
        this.senderMessage.set('');
      }, 5000);
    }, 1500);
  }
}
