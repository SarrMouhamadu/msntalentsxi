// frontend/src/app/pages/register/register.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-page container">
      <div class="auth-card card">
        <div class="auth-header">
          <span class="auth-icon">⚽</span>
          <h2>Créer un compte</h2>
          <p>Rejoignez la vitrine sportive MSN Talents XI</p>
        </div>

        <div *ngIf="errorMessage" class="alert alert-danger">
          {{ errorMessage }}
        </div>

        <form (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label class="form-label">Vous êtes :</label>
            <div class="role-selector">
              <label class="role-option" [class.selected]="role === 'JOUEUR'">
                <input type="radio" name="role" value="JOUEUR" [(ngModel)]="role" />
                <span class="role-title">🏃 Joueur / Talent</span>
              </label>
              <label class="role-option" [class.selected]="role === 'RECRUTEUR'">
                <input type="radio" name="role" value="RECRUTEUR" [(ngModel)]="role" />
                <span class="role-title">📋 Recruteur / Club</span>
              </label>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Adresse Email</label>
            <input 
              type="email" 
              class="form-control" 
              placeholder="votre.nom@exemple.sn"
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
              placeholder="Au moins 6 caractères"
              [(ngModel)]="password" 
              name="password" 
              required 
            />
          </div>

          <button type="submit" class="btn btn-primary btn-block" [disabled]="submitting">
            {{ submitting ? 'Création du compte...' : 'Créer mon compte' }}
          </button>
        </form>

        <div class="auth-footer">
          <p>Déjà inscrit ? <a routerLink="/login" class="link-primary">Se connecter</a></p>
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
      max-width: 480px;
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
    .role-selector {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-top: 6px;
    }
    .role-option {
      border: 2px solid var(--border);
      border-radius: var(--radius-sm);
      padding: 12px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: var(--transition);
    }
    .role-option input {
      display: none;
    }
    .role-option.selected {
      border-color: var(--primary);
      background: var(--primary-light);
    }
    .role-title {
      font-weight: 700;
      font-size: 0.88rem;
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
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  role = 'JOUEUR';
  errorMessage = '';
  submitting = false;

  onSubmit(): void {
    if (!this.email || !this.password) {
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires.';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'Le mot de passe doit comporter au moins 6 caractères.';
      return;
    }

    this.errorMessage = '';
    this.submitting = true;

    this.authService.register({
      email: this.email,
      password: this.password,
      role: this.role,
    }).subscribe({
      next: () => {
        this.submitting = false;
        this.router.navigate(['/my-profile']);
      },
      error: (err) => {
        this.submitting = false;
        this.errorMessage = err.error?.message || 'Erreur lors de la création du compte.';
      }
    });
  }
}
