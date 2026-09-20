// frontend/src/app/pages/login/login.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-page container">
      <div class="auth-card card">
        <div class="auth-header">
          <span class="auth-icon">🔐</span>
          <h2>Connexion</h2>
          <p>Accédez à votre espace MSN Talents XI</p>
        </div>

        <div *ngIf="errorMessage" class="alert alert-danger">
          {{ errorMessage }}
        </div>

        <form (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label class="form-label">Adresse Email</label>
            <input 
              type="email" 
              class="form-control" 
              placeholder="votre.email@exemple.com"
              [(ngModel)]="email" 
              name="email" 
              required 
            />
          </div>

          <div class="form-group">
            <label class="form-label">Mot de passe</label>
            <input 
              type="password" 
              class="form-control" 
              placeholder="••••••••"
              [(ngModel)]="password" 
              name="password" 
              required 
            />
          </div>

          <button type="submit" class="btn btn-primary btn-block" [disabled]="submitting">
            {{ submitting ? 'Connexion en cours...' : 'Se connecter' }}
          </button>
        </form>

        <div class="auth-footer">
          <p>Pas encore de compte ? <a routerLink="/register" class="link-primary">Créer un profil</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      padding: 60px 20px;
      display: flex;
      justify-content: center;
    }
    .auth-card {
      max-width: 440px;
      width: 100%;
      padding: 35px;
    }
    .auth-header {
      text-align: center;
      margin-bottom: 25px;
    }
    .auth-icon {
      font-size: 2.5rem;
      display: block;
      margin-bottom: 8px;
    }
    .auth-header h2 {
      font-size: 1.6rem;
      font-weight: 800;
    }
    .auth-header p {
      color: var(--gray-medium);
      font-size: 0.95rem;
    }
    .btn-block {
      width: 100%;
      margin-top: 10px;
      padding: 12px;
    }
    .auth-footer {
      text-align: center;
      margin-top: 25px;
      padding-top: 20px;
      border-top: 1px solid var(--border);
      font-size: 0.95rem;
      color: var(--gray-medium);
    }
    .link-primary {
      color: var(--primary);
      font-weight: 700;
    }
  `]
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  errorMessage = '';
  submitting = false;

  onSubmit(): void {
    if (!this.email || !this.password) {
      this.errorMessage = 'Veuillez remplir tous les champs.';
      return;
    }

    this.errorMessage = '';
    this.submitting = true;

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        this.submitting = false;
        // Rediriger vers l'édition du profil
        this.router.navigate(['/my-profile']);
      },
      error: (err) => {
        this.submitting = false;
        this.errorMessage = err.error?.message || 'Erreur lors de la connexion. Vérifiez vos identifiants.';
      }
    });
  }
}
