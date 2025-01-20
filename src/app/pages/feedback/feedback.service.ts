import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(private firestore: AngularFirestore) { }

  submitFeedback(feedback: { name: string, sex: string, age: number, email: string, message: string }) {
    return this.firestore.collection('feedback').add(feedback);
  }
}
