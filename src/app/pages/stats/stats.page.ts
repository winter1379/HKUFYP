import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Chart, registerables } from 'chart.js';

interface Meal {
  date: string;
  item: string;
  calories: number;
  proteins: number;
  fats: number;
  carbs: number;
}

interface AggregatedData {
  [date: string]: {
    calories: number;
    proteins: number;
    fats: number;
    carbs: number;
  };
}

@Component({
  selector: 'app-stats',
  templateUrl: './stats.page.html',
  styleUrls: ['./stats.page.scss'],
})
export class StatsPage implements OnInit {

  @ViewChild('caloriesCanvas', { static: true }) caloriesCanvas!: ElementRef;
  @ViewChild('proteinsCanvas', { static: true }) proteinsCanvas!: ElementRef;
  @ViewChild('fatsCanvas', { static: true }) fatsCanvas!: ElementRef;
  @ViewChild('carbsCanvas', { static: true }) carbsCanvas!: ElementRef;
  caloriesChart: any;
  proteinsChart: any;
  fatsChart: any;
  carbsChart: any;
  recommendedValues: any = {
    calories: 0,
    proteins: 0,
    carbs: 0,
    fats: 0
  };

  constructor(private storage: Storage) { 
    Chart.register(...registerables);
  }

  async ngOnInit() {
    await this.storage.create();
    this.loadMeals();
    this.loadRecommendedValues();
  }

  async loadMeals() {
    const meals: Meal[] = await this.storage.get('meals') || [];
    const aggregatedData = this.aggregateDataByDate(meals);

    const dates = Object.keys(aggregatedData).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());;
    const calories = dates.map(date => aggregatedData[date].calories);
    const proteins = dates.map(date => aggregatedData[date].proteins);
    const fats = dates.map(date => aggregatedData[date].fats);
    const carbs = dates.map(date => aggregatedData[date].carbs);

    this.caloriesChart = this.createLineChart(this.caloriesCanvas.nativeElement, 'Calories Intake', dates, calories, 'rgba(255, 99, 132, 1)', 'rgba(255, 99, 132, 0.2)', this.recommendedValues.calories);
    this.proteinsChart = this.createLineChart(this.proteinsCanvas.nativeElement, 'Proteins Intake', dates, proteins, 'rgba(54, 162, 235, 1)', 'rgba(54, 162, 235, 0.2)', this.recommendedValues.proteins);
    this.fatsChart = this.createLineChart(this.fatsCanvas.nativeElement, 'Fats Intake', dates, fats, 'rgba(255, 206, 86, 1)', 'rgba(255, 206, 86, 0.2)', this.recommendedValues.fats);
    this.carbsChart = this.createLineChart(this.carbsCanvas.nativeElement, 'Carbohydrates Intake', dates, carbs, 'rgba(75, 192, 192, 1)', 'rgba(75, 192, 192, 0.2)', this.recommendedValues.carbs);
  }

  async loadRecommendedValues() {
    const recommendedValues = await this.storage.get('templateTotals');
    console.log('Recommended Values from Storage:', recommendedValues);
    
    this.recommendedValues = recommendedValues || {
      calories: 0,
      proteins: 0,
      carbs: 0,
      fats: 0
    };

    this.updateChartWithTemplateValues();
  }

  updateChartWithTemplateValues() {
    if (this.caloriesChart) {
      this.caloriesChart.data.datasets.push({
        label: 'Recommended Calories',
        data: new Array(this.caloriesChart.data.labels.length).fill(this.recommendedValues.calories),
        borderColor: 'rgba(153, 102, 255, 1)',
        borderDash: [5, 5],
        fill: false
      });
      this.caloriesChart.update();
    }

    if (this.proteinsChart) {
      this.proteinsChart.data.datasets.push({
        label: 'Recommended Proteins',
        data: new Array(this.proteinsChart.data.labels.length).fill(this.recommendedValues.proteins),
        borderColor: 'rgba(153, 102, 255, 1)',
        borderDash: [5, 5],
        fill: false
      });
      this.proteinsChart.update();
    }

    if (this.fatsChart) {
      this.fatsChart.data.datasets.push({
        label: 'Recommended Fats',
        data: new Array(this.fatsChart.data.labels.length).fill(this.recommendedValues.fats),
        borderColor: 'rgba(153, 102, 255, 1)',
        borderDash: [5, 5],
        fill: false
      });
      this.fatsChart.update();
    }

    if (this.carbsChart) {
      this.carbsChart.data.datasets.push({
        label: 'Recommended Carbohydrates',
        data: new Array(this.carbsChart.data.labels.length).fill(this.recommendedValues.carbs),
        borderColor: 'rgba(153, 102, 255, 1)',
        borderDash: [5, 5],
        fill: false
      });
      this.carbsChart.update();
    }
  }

  aggregateDataByDate(meals: Meal[]): AggregatedData {
    return meals.reduce((acc: AggregatedData, meal: Meal) => {
      if (!acc[meal.date]) {
        acc[meal.date] = { calories: 0, proteins: 0, fats: 0, carbs: 0 };
      }
      acc[meal.date].calories += meal.calories;
      acc[meal.date].proteins += meal.proteins;
      acc[meal.date].fats += meal.fats;
      acc[meal.date].carbs += meal.carbs;
      return acc;
    }, {});
  }

  createLineChart(canvas: any, label: string, dates: string[], data: number[], borderColor: string, backgroundColor: string, recommendedValue: number) {
    return new Chart(canvas, {
      type: 'line',
      data: {
        labels: dates,
        datasets: [
          {
            label: label,
            data: data,
            borderColor: borderColor,
            backgroundColor: backgroundColor,
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Date'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Grams'
            }
          }
        }
      }
    });
  }
}
