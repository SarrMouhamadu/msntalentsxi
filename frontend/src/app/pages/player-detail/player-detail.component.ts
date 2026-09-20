// frontend/src/app/pages/player-detail/player-detail.component.ts
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PlayerService, Player } from '../../services/player.service';

@Component({
  selector: 'app-player-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page-container container">
      <div class="back-link">
        <a routerLink="/players" class="btn btn-outline btn-sm">← Retour aux talents</a>
      </div>

      <div *ngIf="loading()" class="text-center py-5">
        <div class="spinner"></div>
        <p>Chargement du profil sportif...</p>
      </div>

      <div *ngIf="!loading() && !player()" class="card empty-card">
        <h3>Joueur introuvable</h3>
        <p>Ce profil n'existe pas ou a été retiré.</p>
        <a routerLink="/players" class="btn btn-primary mt-3">Voir tous les profils</a>
      </div>

      <div *ngIf="!loading() && player()" class="profile-layout">
        <!-- Colonne Gauche : Identité & Photo -->
        <div class="profile-sidebar">
          <div class="card photo-card">
            <div class="img-wrapper">
              <img 
                [src]="player()?.photoUrl ? playerService.getMediaUrl(player()?.photoUrl) : 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=500&auto=format&fit=crop&q=80'" 
                [alt]="player()?.firstName + ' ' + player()?.lastName"
                class="main-photo"
              />
              <span class="badge position-badge" [ngClass]="'badge-' + player()?.position?.toLowerCase()">
                {{ player()?.position }}
              </span>
            </div>

            <div class="sidebar-info">
              <h2 class="player-fullname">{{ player()?.firstName }} {{ player()?.lastName }}</h2>
              <p class="player-club-text">
                ⚽ {{ player()?.currentClub || 'Club libre' }}
              </p>
              <p class="player-city-text">
                📍 {{ player()?.city }}, Sénégal
              </p>

              <hr class="divider" />

              <div class="contact-box" *ngIf="player()?.phone">
                <a [href]="'https://wa.me/' + cleanPhone(player()?.phone)" target="_blank" class="btn btn-whatsapp btn-block">
                  💬 Contacter sur WhatsApp
                </a>
                <span class="phone-display">{{ player()?.phone }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Colonne Droite : Données sportives, parcours, vidéo -->
        <div class="profile-main">
          <!-- Caractéristiques physiques & techniques -->
          <div class="card card-section">
            <h3 class="section-title">📊 Caractéristiques Physiques & Techniques</h3>
            <div class="specs-grid">
              <div class="spec-box">
                <span class="spec-label">Poste principal</span>
                <span class="spec-val">{{ player()?.position }}</span>
              </div>
              <div class="spec-box">
                <span class="spec-label">Pied fort</span>
                <span class="spec-val">{{ player()?.strongFoot || 'Non renseigné' }}</span>
              </div>
              <div class="spec-box">
                <span class="spec-label">Taille</span>
                <span class="spec-val">{{ player()?.height ? player()?.height + ' cm' : 'Non renseignée' }}</span>
              </div>
              <div class="spec-box">
                <span class="spec-label">Poids</span>
                <span class="spec-val">{{ player()?.weight ? player()?.weight + ' kg' : 'Non renseigné' }}</span>
              </div>
              <div class="spec-box" *ngIf="player()?.birthDate">
                <span class="spec-label">Date de naissance</span>
                <span class="spec-val">{{ player()?.birthDate | date:'longDate' }}</span>
              </div>
            </div>
          </div>

          <!-- Parcours & Biographie -->
          <div class="card card-section" *ngIf="player()?.bio">
            <h3 class="section-title">📝 Parcours & Profil Sportif</h3>
            <p class="text-content">{{ player()?.bio }}</p>
          </div>

          <!-- Palmarès & Distinctions -->
          <div class="card card-section" *ngIf="player()?.palmares">
            <h3 class="section-title">🏆 Distinctions & Palmarès</h3>
            <p class="text-content">{{ player()?.palmares }}</p>
          </div>

          <!-- Section Vidéo / Highlights -->
          <div class="card card-section" *ngIf="player()?.videoUrl">
            <h3 class="section-title">🎥 Vidéo & Highlights Sportifs</h3>
            
            <!-- Vidéo uploadée localement -->
            <div *ngIf="isVideoFile(player()?.videoUrl)" class="video-container">
              <video [src]="playerService.getMediaUrl(player()?.videoUrl)" controls class="video-player">
                Votre navigateur ne supporte pas la lecture de vidéo.
              </video>
            </div>

            <!-- Lien externe (ex YouTube) -->
            <div *ngIf="!isVideoFile(player()?.videoUrl)" class="external-video-box">
              <p>Vidéo disponible sur plateforme externe :</p>
              <a [href]="player()?.videoUrl" target="_blank" class="btn btn-outline mt-2">
                ▶ Regarder la vidéo highlight externe
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      padding: 40px 20px;
    }
    .back-link {
      margin-bottom: 25px;
    }
    .profile-layout {
      display: grid;
      grid-template-columns: 360px 1fr;
      gap: 30px;
      align-items: start;
    }
    @media (max-width: 860px) {
      .profile-layout {
        grid-template-columns: 1fr;
      }
    }
    .photo-card {
      padding: 0;
      overflow: hidden;
    }
    .img-wrapper {
      position: relative;
      height: 380px;
      background: #0f172a;
    }
    .main-photo {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .position-badge {
      position: absolute;
      top: 15px;
      right: 15px;
      font-size: 0.85rem;
      padding: 6px 14px;
    }
    .sidebar-info {
      padding: 24px;
      text-align: center;
    }
    .player-fullname {
      font-size: 1.6rem;
      font-weight: 800;
      margin-bottom: 6px;
    }
    .player-club-text {
      font-size: 1.05rem;
      font-weight: 600;
      color: var(--primary-dark);
      margin-bottom: 4px;
    }
    .player-city-text {
      font-size: 0.95rem;
      color: var(--gray-medium);
    }
    .divider {
      border: 0;
      height: 1px;
      background: var(--border);
      margin: 20px 0;
    }
    .btn-whatsapp {
      background: #25d366;
      color: #ffffff;
      font-weight: 700;
    }
    .btn-whatsapp:hover {
      background: #1eb956;
    }
    .phone-display {
      display: block;
      font-size: 0.85rem;
      color: var(--gray-medium);
      margin-top: 8px;
    }
    .card-section {
      padding: 26px;
      margin-bottom: 25px;
    }
    .section-title {
      font-size: 1.25rem;
      font-weight: 700;
      margin-bottom: 18px;
      color: var(--dark);
    }
    .specs-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 15px;
    }
    .spec-box {
      background: var(--gray-light);
      padding: 14px;
      border-radius: var(--radius-sm);
      display: flex;
      flex-direction: column;
    }
    .spec-label {
      font-size: 0.8rem;
      color: var(--gray-medium);
      text-transform: uppercase;
      font-weight: 600;
      margin-bottom: 4px;
    }
    .spec-val {
      font-size: 1.05rem;
      font-weight: 700;
      color: var(--dark);
    }
    .text-content {
      font-size: 1rem;
      line-height: 1.8;
      color: var(--gray-dark);
      white-space: pre-line;
    }
    .video-container {
      border-radius: var(--radius-sm);
      overflow: hidden;
      background: #000;
    }
    .video-player {
      width: 100%;
      max-height: 480px;
      display: block;
    }
    .empty-card {
      padding: 50px;
      text-align: center;
      max-width: 500px;
      margin: 40px auto;
    }
    .spinner {
      border: 3px solid #f3f3f3;
      border-top: 3px solid var(--primary);
      border-radius: 50%;
      width: 36px;
      height: 36px;
      animation: spin 1s linear infinite;
      margin: 20px auto;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `]
})
export class PlayerDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  playerService = inject(PlayerService);

  player = signal<Player | null>(null);
  loading = signal(true);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.fetchPlayer(parseInt(idParam, 10));
    }
  }

  fetchPlayer(id: number): void {
    this.loading.set(true);
    this.playerService.getPlayerById(id).subscribe({
      next: (res) => {
        this.player.set(res.player);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erreur chargement joueur', err);
        this.loading.set(false);
      }
    });
  }

  isVideoFile(url?: string): boolean {
    if (!url) return false;
    return url.startsWith('/uploads/');
  }

  cleanPhone(phone?: string): string {
    if (!phone) return '';
    return phone.replace(/[^0-9]/g, '');
  }
}
