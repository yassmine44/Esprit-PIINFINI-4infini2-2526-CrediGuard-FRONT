import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule for ngIf, ngFor
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel
import { FinanceService } from '../../services/finance';

interface Message {
  text: string;
  sender: 'user' | 'bot';
  time: Date;
}

@Component({
  selector: 'app-chatbot',
  standalone: true, // Ensuring standalone is true
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.html',
  styleUrl: './chatbot.css',
})
export class Chatbot {
  financeService = inject(FinanceService);

  isOpen = false;
  userInput = '';
  messages: Message[] = [
    { text: 'Bonjour ! Comment puis-je vous aider avec vos finances ?', sender: 'bot', time: new Date() }
  ];

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  toggleChat() {
    this.isOpen = !this.isOpen;
  }

  sendMessage() {
    if (!this.userInput.trim()) return;

    // Add user message
    this.messages.push({
      text: this.userInput,
      sender: 'user',
      time: new Date()
    });

    const question = this.userInput;
    this.userInput = '';

    // Simulate delay
    setTimeout(() => {
      const response = this.financeService.getChatbotResponse(question);
      this.messages.push({
        text: response,
        sender: 'bot',
        time: new Date()
      });
      this.scrollToBottom();
    }, 500);

    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      setTimeout(() => {
        this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
      }, 0);
    } catch (err) { }
  }
}
