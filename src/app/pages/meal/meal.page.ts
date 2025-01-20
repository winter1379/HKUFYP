import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-meal',
  templateUrl: './meal.page.html',
  styleUrls: ['./meal.page.scss'],
})
export class MealPage implements OnInit {

  selectedTemplate: string = '';
  dailyMeals: any[] = [];
  userProfile: any = {
    age: '',
    sex: '',
    weight: '',
    height: ''
  };
  totalCalories: number = 0;
  totalProteins: number = 0;
  totalCarbs: number = 0;
  totalFats: number = 0;

  constructor(private storage: Storage) { }

  async ngOnInit() {
    await this.storage.create();
    await this.loadUserProfile();
    await this.loadSelectedTemplate();
  }

  async loadUserProfile() {
    this.userProfile.age = await this.storage.get('age') || '';
    this.userProfile.sex = await this.storage.get('sex') || '';
    this.userProfile.weight = await this.storage.get('weight') || '';
    this.userProfile.height = await this.storage.get('height') || '';
  }

  async loadSelectedTemplate() {
    this.selectedTemplate = await this.storage.get('selectedTemplate') || '';
    if (this.selectedTemplate) {
      this.applyTemplate();
    }
  }

  calculateDailyCalories() {
    const { weight, height, age, sex } = this.userProfile;
    let bmr;

    if (sex === 'Male') {
      bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
      bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }

    // Assuming a moderate activity level (BMR * 1.55)
    return bmr * 1.55;
  }

  calculateMacros(calories: number, template: string) {
    let proteinRatio, carbRatio, fatRatio;

    switch (template) {
      case 'weightLoss':
        proteinRatio = 0.30;
        carbRatio = 0.40;
        fatRatio = 0.30;
        break;
      case 'muscleGain':
        proteinRatio = 0.35;
        carbRatio = 0.45;
        fatRatio = 0.20;
        break;
      case 'balancedNutrition':
        proteinRatio = 0.25;
        carbRatio = 0.50;
        fatRatio = 0.25;
        break;
      default:
        proteinRatio = 0.25;
        carbRatio = 0.50;
        fatRatio = 0.25;
    }

    const proteinCalories = calories * proteinRatio;
    const carbCalories = calories * carbRatio;
    const fatCalories = calories * fatRatio;

    return {
      proteins: (proteinCalories / 4),
      carbs: (carbCalories / 4),
      fats: (fatCalories / 9)
    };
  }

  async applyTemplate() {
    if (this.selectedTemplate) {
      const dailyCalories = this.calculateDailyCalories();
      const macros = this.calculateMacros(dailyCalories, this.selectedTemplate);

      this.dailyMeals = [
        { name: 'Breakfast', calories: (dailyCalories * 0.3).toFixed(2), proteins: (macros.proteins * 0.3).toFixed(2), carbs: (macros.carbs * 0.3).toFixed(2), fats: (macros.fats * 0.3).toFixed(2) },
        { name: 'Lunch', calories: (dailyCalories * 0.4).toFixed(2), proteins: (macros.proteins * 0.4).toFixed(2), carbs: (macros.carbs * 0.4).toFixed(2), fats: (macros.fats * 0.4).toFixed(2) },
        { name: 'Dinner', calories: (dailyCalories * 0.3).toFixed(2), proteins: (macros.proteins * 0.3).toFixed(2), carbs: (macros.carbs * 0.3).toFixed(2), fats: (macros.fats * 0.3).toFixed(2) }
      ];

      this.calculateTotals();

      await this.storage.set('selectedTemplate', this.selectedTemplate);
      await this.storage.set('templateTotals', {
        calories: this.totalCalories,
        proteins: this.totalProteins,
        carbs: this.totalCarbs,
        fats: this.totalFats
      });
    }
  }

  calculateTotals() {
    this.totalCalories = this.dailyMeals.reduce((sum, meal) => sum + parseFloat(meal.calories), 0).toFixed(2);
    this.totalProteins = this.dailyMeals.reduce((sum, meal) => sum + parseFloat(meal.proteins), 0).toFixed(2);
    this.totalCarbs = this.dailyMeals.reduce((sum, meal) => sum + parseFloat(meal.carbs), 0).toFixed(2);
    this.totalFats = this.dailyMeals.reduce((sum, meal) => sum + parseFloat(meal.fats), 0).toFixed(2);
  }
}
