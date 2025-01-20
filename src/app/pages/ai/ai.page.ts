import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import axios from 'axios';

@Component({
  selector: 'app-ai',
  templateUrl: './ai.page.html',
  styleUrls: ['./ai.page.scss'],
})
export class AiPage implements OnInit {

  question: string = '';
  response: string = '';

  constructor() { }

  ngOnInit() {}

  async askNutritionQuestion(form: NgForm) {
    if (form.valid) {
      try {
        const apiKey = 'sk-proj-vQhox7r52H4rvVU3NaN8jKc6dkL1dov_jJXV03eUeyh7TSbcbjWGqlOy3Pbvzi5tQwRP_Ri6T3BlbkFJjHNHstiM7d8YiCOkD9gBETn7nm-mDk1ZlSbSxPl0Yku-gIFHMj1_7O9pxgVz_r-rxgz--PgDQA'; // Replace with your OpenAI API key
        const apiUrl = 'https://api.openai.com/v1/completions';
        
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        };

        const data = {
          model: 'text-davinci-003', // Use the appropriate model
          prompt: this.question,
          max_tokens: 150
        };

        const result = await axios.post(apiUrl, data, { headers });
        this.response = result.data.choices[0].text.trim();
      } catch (error) {
        console.error('Error querying OpenAI:', error);
        this.response = 'There was an error processing your request. Please try again later.';
      }
    }
  }
}
