import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { Auth } from '../../../core/services/auth';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule,
    ReactiveFormsModule,RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  errorMessage = '';
  loading = false;

  form: FormGroup;
  
  constructor( 
    private fb: FormBuilder,
    private router: Router,
    private cdr: ChangeDetectorRef,
    // private authService: Auth,
    private userService: UserService,
    @Inject(Auth) private authService: Auth) {
      this.form = this.fb.group({
      email: [''],
      password: ['']
    });
  }

  submit() {
    this.loading =true ;
    this.errorMessage = '';

     console.log(this.form.value);
      this.authService.login(this.form.value).subscribe({
        next: (response: any) => {

          console.log(response);

          localStorage.setItem(
            'token',
            response.token
          );

          console.log('Login Success');
          this.authService
          .getCurrentUser()
          .subscribe(user => {

            this.userService.setUser(user);
            this.router.navigate(['/dashboard']);
          });

        
        },


        error: (error: any) => {
          this.loading = false;
          if(error.status === 401) {
            this.errorMessage = 'Invalid email or password. Please try again.';
             console.error('Unauthorized: Invalid email or password');
          } else {
             this.errorMessage = 'Something went wrong. Please try again later.';
             console.error('An error occurred during login:', error);
          }
          console.error('Invalid email or password');
          this.cdr.detectChanges();
        }
      
  })

}
}
