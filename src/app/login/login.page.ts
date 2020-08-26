import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import { Facebook } from '@ionic-native/facebook/ngx';
import { Platform } from '@ionic/angular';
import { AngularFireDatabase } from '@angular/fire/database';

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
})

export class LoginPage implements OnInit {
  email: string = ""
  password: string = ""
  providerFb: firebase.auth.FacebookAuthProvider;

  constructor(
    public afDB: AngularFireDatabase,
    public afAuth: AngularFireAuth,
    private fb: Facebook,
    public platform: Platform,
    private router: Router) { 
      try{
        this.providerFb = new firebase.auth.FacebookAuthProvider();
      }catch(err){
        console.dir(err);
      }
    }

  ngOnInit() { }

  async login() {
    const { email, password } = this;
    try {
      const res = await this.afAuth.signInWithEmailAndPassword(email, password);
      document.querySelector('.erreur').innerHTML = '';
      this.router.navigate(['/home'])
    } catch (err) {
      document.querySelector('.erreur').innerHTML = err.message;
    }
  }

  facebookLogin() {
    if (this.platform.is('cordova')) {
        this.facebookCordova();
    } else {
      this.facebookWeb();
    }
}

  facebookCordova() {
    this.fb.login(['email']).then((response) => {
      const facebookCredential = firebase.auth.FacebookAuthProvider
        .credential(response.authResponse.accessToken);
      firebase.auth().signInWithCredential(facebookCredential)
        .then((success) => {
          this.afDB.object('Users/' + success.user.uid).set({
            displayName: success.user.displayName,
            photoURL: success.user.photoURL
          });
          this.router.navigate(['/home']);
        }).catch((error) => {
          console.log('Erreur: ' + JSON.stringify(error));
        });
    }).catch((error) => { console.log(error); });
  }

  facebookWeb() {
    this.afAuth
      .signInWithPopup(new firebase.auth.FacebookAuthProvider())
      .then((success) => {
        this.afDB.object('Users/' + success.user.uid).set({
          displayName: success.user.displayName,
          photoURL: success.user.photoURL
        });
        this.router.navigate(['/home']);
      }).catch((error) => {
        console.log('Erreur: ' + JSON.stringify(error));
      });
  }
}
