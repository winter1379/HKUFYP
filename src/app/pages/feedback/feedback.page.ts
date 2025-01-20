import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FeedbackService } from './feedback.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.page.html',
  styleUrls: ['./feedback.page.scss'],
})
export class FeedbackPage {

  feedback = {
    name: '',
    sex: '',
    age: 0,
    email: '',
    message: ''
  };

  constructor(private feedbackService: FeedbackService) { }

  async submitFeedback(form: NgForm) {
    if (form.valid) {
      try {
        await this.feedbackService.submitFeedback(this.feedback);
        form.reset();
        alert('Feedback submitted successfully!');
      } catch (error) {
        console.error('Error submitting feedback:', error);
        alert('There was an error submitting your feedback. Please try again later.');
      }
    }
  }
}
