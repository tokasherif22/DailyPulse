import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule , Validators ,ValidationErrors, AbstractControl } from '@angular/forms';
import { Auth } from '../../../core/services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [CommonModule,
    ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {

  form: FormGroup;
  loading = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private router: Router,
    // private authService: Auth
    @Inject(Auth) private authService: Auth
  ) {
    this.form = this.fb.group({
      fullName: [''],
      email:           ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      role:            ['USER', Validators.required]  
    },{
      validators: this.passwordMatchValidator
    }
  );
  }

  // custom validator — checks both password fields match
  private passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password        = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  setRole(role: 'USER' | 'ADMIN'): void {
    this.form.get('role')?.setValue(role);  // ← updates the card highlight
  }

  submit() {
    this.loading = true;
     console.log(this.form.value);
      this.authService.register(this.form.value).subscribe({
        next: (response: any) => {
          this.loading = false;
          console.log(response);

          localStorage.setItem(
            'token',
            response.token
          );

          this.router.navigate(['/dashboard']);

        },
        error: (error: any) => {
          this.loading = false;
           this.form.reset();
          this.errorMessage = error.status === 409
          ? 'An account with this email already exists.'
          : 'Registration failed. Please try again.';
          this.cdr.detectChanges();
        }
      
  })
}
}
