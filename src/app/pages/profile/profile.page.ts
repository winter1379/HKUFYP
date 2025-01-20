import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  profile: any = {
    age: '',
    sex: '',
    weight: '',
    height: ''
  };

  constructor(private storage: Storage, private alertController: AlertController) { }

  async ngOnInit() {
    await this.storage.create();
    this.loadData();
  }

  async loadData() {
    this.profile.age = await this.storage.get('age') || '';
    this.profile.sex = await this.storage.get('sex') || '';
    this.profile.weight = await this.storage.get('weight') || '';
    this.profile.height = await this.storage.get('height') || '';
  }

  async openAgePrompt() {
    const alert = await this.alertController.create({
      header: 'Enter Age',
      inputs: [
        {
          name: 'age',
          type: 'number',
          placeholder: 'Age'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'OK',
          handler: async (data) => {
            this.profile.age = data.age;
            await this.storage.set('age', this.profile.age);
            console.log('Age saved:', this.profile.age);
          }
        }
      ]
    });

    await alert.present();
  }

  async openWeightPrompt() {
    const alert = await this.alertController.create({
      header: 'Enter Weight',
      inputs: [
        {
          name: 'weight',
          type: 'number',
          placeholder: 'Weight in kg'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'OK',
          handler: async (data) => {
            this.profile.weight = data.weight;
            await this.storage.set('weight', this.profile.weight);
            console.log('Weight saved:', this.profile.weight);
          }
        }
      ]
    });

    await alert.present();
  }

  async openHeightPrompt() {
    const alert = await this.alertController.create({
      header: 'Enter Height',
      inputs: [
        {
          name: 'height',
          type: 'number',
          placeholder: 'Height in cm'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'OK',
          handler: async (data) => {
            this.profile.height = data.height;
            await this.storage.set('height', this.profile.height);
            console.log('Height saved:', this.profile.height);
          }
        }
      ]
    });

    await alert.present();
  }

  async onSelectSex() {
    await this.storage.set('sex', this.profile.sex);
    console.log('Sex saved:', this.profile.sex);
  }
}
