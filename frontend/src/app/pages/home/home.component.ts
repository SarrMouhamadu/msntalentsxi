// frontend/src/app/pages/home/home.component.ts
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PlayerService, Player } from '../../services/player.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- Section Hero avec Vidéo de Dribles intégrée -->
    <section class="hero-video-section">
      <div class="container hero-grid">
        <!-- Colonne Texte épurée (moins de texte, direct au but) -->
        <div class="hero-text-content">
          <div class="badge-pill">⚽ MSN TALENTS XI</div>
          <h1 class="hero-title">
            Le talent sénégalais en <span class="highlight">action</span>.
          </h1>
          <p class="hero-desc">
            Découvrez, suivez et contactez les pépites et professionnels du football sénégalais.
          </p>

          <div class="hero-cta">
            <a routerLink="/players" class="btn btn-primary btn-lg">
              🔥 Découvrir les Talents
            </a>
            <a routerLink="/register" class="btn btn-outline-white btn-lg">
              + Rejoindre la vitrine
            </a>
          </div>

          <div class="quick-stats">
            <div class="quick-stat">
              <strong>100%</strong>
              <span>Football Sénégal</span>
            </div>
            <div class="quick-stat">
              <strong>HD</strong>
              <span>Vidéos & Highlights</span>
            </div>
            <div class="quick-stat">
              <strong>Direct</strong>
              <span>Contact Clubs</span>
            </div>
          </div>
        </div>

        <!-- Colonne Vidéo de Dribles en Vedette -->
        <div class="hero-video-wrapper">
          <div class="video-frame">
            <div class="video-badge">▶ Dribbles & Gestes Techniques</div>
            <video 
              src="/videos/hero-dribble.mp4" 
              autoplay 
              loop 
              muted 
              playsinline 
              controls
              class="featured-video"
            ></video>
          </div>
        </div>
      </div>
    </section>

    <!-- Section Talents & Dribbles -->
    <section class="talents-section container">
      <div class="section-top">
        <div>
          <h2 class="section-heading">⭐ Joueurs à la Une</h2>
          <p class="section-sub">Profils récents avec vidéos de dribles et statistiques</p>
        </div>
        <a routerLink="/players" class="btn btn-outline">Tous les talents →</a>
      </div>

      <div *ngIf="loading()" class="text-center py-5">
        <div class="spinner"></div>
      </div>

      <div *ngIf="!loading() && players().length > 0" class="cards-grid">
        <div *ngFor="let p of players()" class="card player-card">
          <div class="card-thumb">
            <img 
              [src]="p.photoUrl ? playerService.getMediaUrl(p.photoUrl) : 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=500&auto=format&fit=crop&q=80'" 
              [alt]="p.firstName + ' ' + p.lastName"
            />
            <span class="badge pos-tag" [ngClass]="'badge-' + p.position.toLowerCase()">
              {{ p.position }}
            </span>
            <span *ngIf="p.videoUrl" class="video-tag">
              🎥 Vidéo drible
            </span>
          </div>

          <div class="card-info">
            <h3 class="name">{{ p.firstName }} {{ p.lastName }}</h3>
            <p class="club">📍 {{ p.city }} &bull; {{ p.currentClub || 'Club libre' }}</p>

            <div class="pills-row">
              <span *ngIf="p.strongFoot" class="pill">Pied {{ p.strongFoot }}</span>
              <span *ngIf="p.height" class="pill">{{ p.height }} cm</span>
            </div>

            <a [routerLink]="['/players', p.id]" class="btn btn-primary btn-block mt-3">
              Voir le Profil & Vidéos
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer épuré -->
    <footer class="footer-minimal">
      <div class="container footer-flex">
        <p><strong>MSN Talents XI</strong> &bull; La vitrine sportive des talents sénégalais</p>
        <a routerLink="/players" class="footer-link">Annuaire des joueurs</a>
      </div>
    </footer>
  `,
  styles: [`
    /* Section Hero avec Vidéo */
    .hero-video-section {
      background: linear-gradient(135deg, #052010 0%, #004d25 60%, #03381b 100%);
      color: #ffffff;
      padding: 60px 0 70px 0;
      overflow: hidden;
    }
    .hero-grid {
      display: grid;
      grid-template-columns: 1.1fr 1fr;
      gap: 40px;
      align-items: center;
    }
    @media (max-width: 960px) {
      .hero-grid {
        grid-template-columns: 1fr;
        text-align: center;
      }
      .hero-cta, .quick-stats {
        justify-content: center;
      }
    }
    .badge-pill {
      display: inline-block;
      background: rgba(253, 239, 66, 0.15);
      color: #fdef42;
      border: 1px solid rgba(253, 239, 66, 0.35);
      padding: 5px 14px;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 800;
      letter-spacing: 0.5px;
      margin-bottom: 15px;
    }
    .hero-title {
      font-size: 3rem;
      font-weight: 800;
      line-height: 1.15;
      margin-bottom: 16px;
      letter-spacing: -0.5px;
    }
    .highlight {
      color: #fdef42;
    }
    .hero-desc {
      font-size: 1.15rem;
      color: #cbd5e1;
      margin-bottom: 30px;
      line-height: 1.6;
      max-width: 500px;
    }
    .hero-cta {
      display: flex;
      gap: 15px;
      margin-bottom: 35px;
      flex-wrap: wrap;
    }
    .btn-lg {
      padding: 12px 24px;
      font-size: 1rem;
      border-radius: 10px;
    }
    .btn-outline-white {
      border: 2px solid rgba(255, 255, 255, 0.4);
      color: #ffffff;
      background: rgba(255, 255, 255, 0.08);
      font-weight: 600;
    }
    .btn-outline-white:hover {
      background: rgba(255, 255, 255, 0.2);
      border-color: #ffffff;
    }
    .quick-stats {
      display: flex;
      gap: 30px;
      border-top: 1px solid rgba(255, 255, 255, 0.15);
      padding-top: 20px;
    }
    .quick-stat {
      display: flex;
      flex-direction: column;
    }
    .quick-stat strong {
      font-size: 1.3rem;
      color: #fdef42;
    }
    .quick-stat span {
      font-size: 0.8rem;
      color: #94a3b8;
    }

    /* Cadre Vidéo en vedette */
    .hero-video-wrapper {
      display: flex;
      justify-content: center;
    }
    .video-frame {
      position: relative;
      width: 100%;
      max-width: 540px;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
      border: 3px solid rgba(253, 239, 66, 0.4);
      background: #000000;
    }
    .video-badge {
      position: absolute;
      top: 12px;
      left: 12px;
      background: rgba(0, 0, 0, 0.75);
      color: #ffffff;
      padding: 5px 12px;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 700;
      z-index: 10;
      backdrop-filter: blur(4px);
    }
    .featured-video {
      width: 100%;
      height: 100%;
      max-height: 380px;
      display: block;
      object-fit: cover;
    }

    /* Grille Talents */
    .talents-section {
      padding: 60px 20px;
    }
    .section-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 30px;
      flex-wrap: wrap;
      gap: 15px;
    }
    .section-heading {
      font-size: 1.8rem;
      font-weight: 800;
      color: var(--dark);
    }
    .section-sub {
      color: var(--gray-medium);
      font-size: 0.95rem;
      margin-top: 3px;
    }
    .cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 25px;
    }
    .player-card {
      display: flex;
      flex-direction: column;
    }
    .card-thumb {
      position: relative;
      height: 220px;
      overflow: hidden;
      background: #e2e8f0;
    }
    .card-thumb img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }
    .player-card:hover .card-thumb img {
      transform: scale(1.05);
    }
    .pos-tag {
      position: absolute;
      top: 10px;
      right: 10px;
    }
    .video-tag {
      position: absolute;
      bottom: 10px;
      left: 10px;
      background: rgba(0, 0, 0, 0.75);
      color: #fdef42;
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 0.72rem;
      font-weight: 700;
    }
    .card-info {
      padding: 18px;
      display: flex;
      flex-direction: column;
      flex: 1;
    }
    .name {
      font-size: 1.2rem;
      font-weight: 700;
      margin-bottom: 3px;
    }
    .club {
      font-size: 0.85rem;
      color: var(--gray-medium);
      margin-bottom: 10px;
    }
    .pills-row {
      display: flex;
      gap: 8px;
      margin-bottom: 10px;
    }
    .pill {
      background: var(--gray-light);
      padding: 3px 8px;
      border-radius: 4px;
      font-size: 0.75rem;
      color: var(--gray-dark);
      font-weight: 600;
    }
    .btn-block {
      width: 100%;
      text-align: center;
    }
    .mt-3 {
      margin-top: auto;
    }

    /* Footer */
    .footer-minimal {
      background: #0f172a;
      color: #94a3b8;
      padding: 25px 20px;
      margin-top: auto;
    }
    .footer-flex {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 10px;
      font-size: 0.9rem;
    }
    .footer-link {
      color: #fdef42;
      font-weight: 600;
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
export class HomeComponent implements OnInit {
  playerService = inject(PlayerService);

  players = signal<Player[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    this.playerService.getFeaturedPlayers().subscribe({
      next: (res) => {
        this.players.set(res.players);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erreur chargement joueurs vedettes', err);
        this.loading.set(false);
      }
    });
  }
}
