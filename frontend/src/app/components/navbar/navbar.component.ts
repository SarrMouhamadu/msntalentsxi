// frontend/src/app/components/navbar/navbar.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header class="header">
      <div class="container nav-container">
        <a routerLink="/" class="brand">
          <div class="brand-badge">SN</div>
          <div class="brand-text">
            <span class="brand-title">MSN Talents <strong>XI</strong></span>
            <span class="brand-subtitle">Vitrine des Talents Sénégalais</span>
          </div>
        </a>

        <nav class="nav-links">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Accueil</a>
          <a routerLink="/players" routerLinkActive="active">Découvrir les Talents</a>

          <ng-container *ngIf="authService.isLoggedIn(); else guestNav">
            <a routerLink="/my-profile" routerLinkActive="active" class="btn btn-outline btn-sm">
              ⚽ Mon Profil Sportif
            </a>
            <button (click)="logout()" class="btn btn-logout btn-sm">
              Déconnexion
            </button>
          </ng-container>

          <ng-template #guestNav>
            <a routerLink="/login" class="nav-link">Connexion</a>
            <a routerLink="/register" class="btn btn-primary btn-sm">
              Créer mon Profil
            </a>
          </ng-template>
        </nav>
      </div>
    </header>
  `,
  styles: [`
    .header {
      background: #ffffff;
      border-bottom: 1px solid var(--border);
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .nav-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 72px;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .brand-badge {
      width: 42px;
      height: 42px;
      border-radius: 10px;
      background: linear-gradient(135deg, #0f766e 0%, #0891b2 100%);
      color: #ffffff;
      border: 1px solid #14b8a6;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 1.1rem;
      box-shadow: 0 4px 10px rgba(15, 118, 110, 0.25);
    }
    .brand-title {
      font-size: 1.25rem;
      font-weight: 800;
      color: var(--dark);
      display: block;
      line-height: 1.2;
    }
    .brand-title strong {
      color: var(--primary);
      font-weight: 800;
    }
    .brand-subtitle {
      font-size: 0.72rem;
      color: var(--gray-medium);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .nav-links {
      display: flex;
      align-items: center;
      gap: 20px;
    }
    .nav-links a {
      font-weight: 600;
      font-size: 0.95rem;
      color: var(--gray-dark);
      transition: var(--transition);
    }
    .nav-links a:hover, .nav-links a.active {
      color: var(--primary);
      border-bottom: 2px solid var(--primary);
      padding-bottom: 2px;
    }
    .btn-sm {
      padding: 7px 14px;
      font-size: 0.85rem;
    }
    .btn-logout {
      background: transparent;
      border: 1.5px solid var(--border);
      color: var(--gray-medium);
      cursor: pointer;
      border-radius: var(--radius-sm);
      padding: 7px 12px;
      font-weight: 600;
      transition: var(--transition);
    }
    .btn-logout:hover {
      background: var(--primary);
      border-color: var(--primary);
      color: #ffffff;
    }
  `]
})
export class NavbarComponent {
  authService = inject(AuthService);
  private router = inject(Router);

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
