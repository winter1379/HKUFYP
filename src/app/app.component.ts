import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Profile', url: '/profile', icon: 'person-circle' },
    { title: 'Meal Planning', url: '/meal', icon: 'paper-plane' },
    { title: 'Nutrition Tracking', url: '/tracking', icon: 'pencil' },
    { title: 'Statistic', url: '/stats', icon: 'stats-chart' },
    { title: 'AI Bot', url: '/ai', icon: 'help' },
    { title: 'Feedback', url: '/feedback', icon: 'chevron-back-circle' },
  ];

  constructor() {}
}
