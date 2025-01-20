import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Storage } from '@ionic/storage-angular';
import { AlertController } from '@ionic/angular';
import axios from 'axios';

@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.page.html',
  styleUrls: ['./tracking.page.scss'],
})
export class TrackingPage implements OnInit {

  meal: any = {
    date: '', 
    item: '',
    calories: '',
    proteins: '',
    carbs: '',
    fats: ''
  };
  searchQuery: string = '';
  nutritionInfo: any = null;
  meals: any[] = [];
  filteredMeals: any[] = [];
  selectedDate: string = new Date().toISOString().split('T')[0];
  editIndex: number = -1;

  constructor(private storage: Storage, private alertController: AlertController) { }

  async ngOnInit() {
    await this.storage.create();
    this.loadMeals();
  }

  async loadMeals() {
    this.meals = (await this.storage.get('meals')) || [];
    this.filterMealsByDate();
  }

  async saveMeal(form: NgForm) {
    if (form.valid) {
      let mealWithDate;
      if (this.editIndex >= 0) {
        
        mealWithDate = { ...this.meal, date: this.meals[this.editIndex].date };
        this.meals[this.editIndex] = mealWithDate;
        this.editIndex = -1;
      } else {
        
        mealWithDate = { ...this.meal, date: new Date().toISOString().split('T')[0] };
        this.meals.unshift(mealWithDate);
      }

      await this.storage.set('meals', this.meals);
      form.reset();
      this.loadMeals();
    }
  }

  async searchNutrition() {
    if (this.searchQuery.trim() === '') {
      this.nutritionInfo = null;
      return;
    }

    try {
      const apiKey = 'ifrQ1Ij93C/SX1S7j55vkg==NV5gZGlMPOfs4Nbr';
      const apiUrl = `https://api.calorieninjas.com/v1/nutrition?query=${this.searchQuery}`;
      const headers = { 'X-Api-Key': apiKey };

    
      const response = await axios.get<{ items: NutritionItem[] }>(apiUrl, { headers });

      if (response.data.items && response.data.items.length > 0) {
        // Initialize total values
        let totalCalories = 0;
        let totalProteins = 0;
        let totalCarbs = 0;
        let totalFats = 0;

        // Sum up values of all items
        response.data.items.forEach(item => {
          totalCalories += item.calories;
          totalProteins += item.protein_g;
          totalCarbs += item.carbohydrates_total_g;
          totalFats += item.fat_total_g;
        });

        // Save combined values
        this.nutritionInfo = {
          calories: totalCalories,
          proteins: totalProteins,
          carbs: totalCarbs,
          fats: totalFats
        };
        this.meal.calories = totalCalories.toString();
        this.meal.proteins = totalProteins.toString();
        this.meal.carbs = totalCarbs.toString();
        this.meal.fats = totalFats.toString();
      } else {
        this.nutritionInfo = null;
      }
    } catch (error) {
      console.error('Error fetching nutrition info:', error);
      this.nutritionInfo = null;
    }
  }

  editMeal(index: number) {
    this.meal = { ...this.meals[index] };
    this.editIndex = index;
    this.selectedDate = this.meal.date; 
  }

  async confirmDeleteMeal(index: number) {
    const alert = await this.alertController.create({
      header: 'Confirm Delete',
      message: 'Are you sure you want to delete this meal?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Delete cancelled');
          }
        }, {
          text: 'Delete',
          handler: () => {
            this.deleteMeal(index);
          }
        }
      ]
    });

    await alert.present();
  }

  async deleteMeal(index: number) {
    this.meals.splice(index, 1);
    await this.storage.set('meals', this.meals);
    this.filterMealsByDate();
  }

  filterMealsByDate() {
    this.filteredMeals = this.meals.filter(meal => meal.date === this.selectedDate);
  }
}


interface NutritionItem {
  calories: number;
  protein_g: number;
  carbohydrates_total_g: number;
  fat_total_g: number;
}
