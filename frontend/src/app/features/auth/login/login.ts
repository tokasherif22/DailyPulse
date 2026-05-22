import { Component, Inject } from '@angular/core';
import { Auth } from '../../../core/services/auth';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule,
    ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {

  form: FormGroup;
  
  constructor( 
    private fb: FormBuilder,
    private router: Router,
    // private authService: Auth
    @Inject(Auth) private authService: Auth) {
      this.form = this.fb.group({
      email: [''],
      password: ['']
    });
  }

  submit() {
     console.log(this.form.value);
      this.authService.login(this.form.value).subscribe({
        next: (response: any) => {

          console.log(response);

          localStorage.setItem(
            'token',
            response.token
          );

          console.log('Login Success');

           this.router.navigate(['/dashboard']);
        },


        error: (error: any) => {
          console.error('Invalid email or password');
        }
      
  })

}
}
