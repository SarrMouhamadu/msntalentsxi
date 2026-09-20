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
      background: rgba(255, 255, 255, 0.82);
      backdrop-filter: saturate(180%) blur(20px);
      -webkit-backdrop-filter: saturate(180%) blur(20px);
      border-bottom: 1px solid rgba(0, 0, 0, 0.08);
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .nav-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 60px;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .brand-badge {
      width: 38px;
      height: 38px;
      border-radius: 12px;
      background: linear-gradient(135deg, #0f766e 0%, #0891b2 100%);
      color: #ffffff;
      border: 1px solid rgba(20, 184, 166, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 1rem;
      box-shadow: 0 4px 12px rgba(15, 118, 110, 0.2);
    }
    .brand-title {
      font-size: 1.15rem;
      font-weight: 700;
      letter-spacing: -0.02em;
      color: var(--dark);
      display: block;
      line-height: 1.15;
    }
    .brand-title strong {
      color: var(--primary);
      font-weight: 800;
    }
    .brand-subtitle {
      font-size: 0.68rem;
      color: var(--gray-medium);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.6px;
    }
    .nav-links {
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .nav-links a {
      font-weight: 500;
      font-size: 0.88rem;
      letter-spacing: -0.01em;
      color: var(--gray-dark);
      padding: 6px 14px;
      border-radius: var(--radius-pill);
      transition: var(--transition);
    }
    .nav-links a:hover {
      color: var(--primary);
      background: rgba(15, 118, 110, 0.08);
    }
    .nav-links a.active {
      color: var(--primary);
      font-weight: 600;
      background: rgba(15, 118, 110, 0.12);
    }
    .btn-sm {
      padding: 6px 16px;
      font-size: 0.82rem;
      letter-spacing: -0.01em;
    }
    .btn-logout {
      background: transparent;
      border: 1.5px solid var(--border);
      color: var(--gray-medium);
      cursor: pointer;
      border-radius: var(--radius-pill);
      padding: 6px 14px;
      font-weight: 600;
      transition: var(--transition);
    }
    .btn-logout:hover {
      background: var(--primary);
      border-color: var(--primary);
      color: #ffffff;
      transform: scale(1.02);
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
