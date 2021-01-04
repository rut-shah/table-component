import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  loginForm!: FormGroup;
  hide = true;
  invalidUser = false;

  constructor( private authService: AuthService, private router: Router ) { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      'username': new FormControl(null, [Validators.required]),
      'password': new FormControl(null, [Validators.required])
    });
  }

  login() {
    this.authService.login({
      username: this.loginForm.get('username')?.value,
      password: this.loginForm.get('password')?.value
    }).subscribe((response) => {
      if(response.isUserValid) {
        this.invalidUser = false;
        localStorage.setItem('isUserLoggedIn', 'true');
        this.router.navigate(['/dashboard']);
      } else {
        this.invalidUser = true;
      }
    })
  }

}
