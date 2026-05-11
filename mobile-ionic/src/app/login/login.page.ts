import { Component, inject } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { CommonModule } from "@angular/common";
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonIcon,
  IonText,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonSpinner,
  ToastController,
} from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import {
  logInOutline,
  mailOutline,
  lockClosedOutline,
  eyeOutline,
  eyeOffOutline,
  schoolOutline,
  alertCircleOutline,
  arrowForwardOutline,
  playOutline,
} from "ionicons/icons";
import { AuthService } from "../core/services/auth.service";
import { ApiErrorService } from "../core/services/api-error.service";
import { finalize } from "rxjs";

@Component({
  selector: "app-login",
  templateUrl: "login.page.html",
  styleUrls: ["login.page.scss"],
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonIcon,
    IonText,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonSpinner,
  ],
})
export class LoginPage {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);
  private apiError = inject(ApiErrorService);

  loginForm: FormGroup;
  showPassword = false;
  isLoading = false;

  constructor() {
    addIcons({
      logInOutline,
      mailOutline,
      lockClosedOutline,
      eyeOutline,
      eyeOffOutline,
      schoolOutline,
      alertCircleOutline,
      arrowForwardOutline,
      playOutline,
    });

    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(8)]],
    });
  }

  get email() {
    return this.loginForm.get("email");
  }

  get password() {
    return this.loginForm.get("password");
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const credentials = {
      email: this.loginForm.value.email,
      motDePasse: this.loginForm.value.password,
    };

    this.authService.login(credentials)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: () => {
          this.router.navigate(["/tabs"]);
        },
        error: (err) => {
          this.apiError.presentError(err, "Email ou mot de passe incorrect.");
        },
      });
  }
}
