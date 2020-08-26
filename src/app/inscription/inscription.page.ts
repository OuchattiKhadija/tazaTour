import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {Router} from '@angular/router';


@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.page.html',
  styleUrls: ['./inscription.page.scss'],
})
export class InscriptionPage implements OnInit {

  email: string=""
  nom: string=""
  password: string=""
  cpassword: string=""


  constructor(public afAuth: AngularFireAuth, public router:Router) { }

  ngOnInit() {
  }

  async inscription() {
    const { email, nom, password, cpassword } = this; 
    if(password!=cpassword)
    alert("les mots de passes ne se correspand pas !");
    else{
      try {
        const res = await this.afAuth.createUserWithEmailAndPassword(email, password);
        this.router.navigateByUrl("/login");
      } catch (err) {
        console.dir(err);
        alert("Login / Password incorrect !");
      }
    }
  }
}
