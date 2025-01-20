import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicStorageModule } from '@ionic/storage-angular';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';


import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { environment } from 'src/environments/environment.prod';

import { HttpClientModule } from '@angular/common/http';

import { AngularFireModule } from '@angular/fire/compat';

import { AngularFirestoreModule } from '@angular/fire/compat/firestore'
import { FeedbackService } from './pages/feedback/feedback.service';





@NgModule({
  declarations: [AppComponent],
  imports: [HttpClientModule,
     FormsModule,
     IonicStorageModule.forRoot(), 
     BrowserModule, IonicModule.forRoot(), 
     AppRoutingModule, 
     ReactiveFormsModule,
     AngularFireModule.initializeApp(environment.firebaseConfig), 
     AngularFirestoreModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },FeedbackService],
  bootstrap: [AppComponent],
})
export class AppModule {}







    AngularFirestoreModule

