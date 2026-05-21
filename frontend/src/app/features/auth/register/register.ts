import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-register',
  imports: [CommonModule,
    ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    // private authService: Auth
    @Inject(Auth) private authService: Auth
  ) {
    this.form = this.fb.group({
      fullName: [''],
      email: [''],
      password: ['']
    });
  }

  submit() {
     console.log(this.form.value);
      this.authService.register(this.form.value).subscribe({
        next: (response: any) => {

          console.log(response);

          localStorage.setItem(
            'token',
            response.token
          );
        },

        error: (error: any) => {
          console.error(error);
        }
      
  })
}
}
