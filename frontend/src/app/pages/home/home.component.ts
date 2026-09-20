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
    <!-- Section Hero avec Vidéo de Dribles intégrée & Animations de texte -->
    <section class="hero-video-section">
      <div class="container hero-grid">
        <!-- Colonne Texte animée -->
        <div class="hero-text-content">
          <div class="badge-pill anim-fade-in anim-delay-1">
            <span class="pulse-dot"></span>
            ⚽ MSN TALENTS XI &bull; SÉNÉGAL
          </div>
          
          <h1 class="hero-title anim-fade-in-up anim-delay-2">
            Le talent sénégalais en 
            <span class="highlight shimmer-text">action</span>.
          </h1>
          
          <p class="hero-desc anim-fade-in-up anim-delay-3">
            Découvrez, suivez et contactez les pépites et professionnels du football sénégalais à travers leurs meilleures vidéos de dribles et performances.
          </p>

          <div class="hero-cta anim-fade-in-up anim-delay-4">
            <a routerLink="/players" class="btn btn-primary btn-lg btn-glow">
              🔥 Découvrir les Talents
            </a>
            <a routerLink="/register" class="btn btn-outline-white btn-lg btn-interactive">
              + Rejoindre la vitrine
            </a>
          </div>

          <div class="quick-stats anim-fade-in-up anim-delay-5">
            <div class="quick-stat">
              <strong>100%</strong>
              <span>Football Sénégal</span>
            </div>
            <div class="stat-separator"></div>
            <div class="quick-stat">
              <strong>HD</strong>
              <span>Vidéos & Dribbles</span>
            </div>
            <div class="stat-separator"></div>
            <div class="quick-stat">
              <strong>Direct</strong>
              <span>Clubs & Recruteurs</span>
            </div>
          </div>
        </div>

        <!-- Colonne Vidéo de Dribles en Vedette avec effet flottant et lueur -->
        <div class="hero-video-wrapper anim-fade-in anim-delay-3">
          <div class="video-frame">
            <div class="video-badge">
              <span class="live-dot"></span>
              ▶ Dribbles & Gestes Techniques
            </div>
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
      <div class="section-top anim-fade-in">
        <div>
          <h2 class="section-heading">⭐ Joueurs à la Une</h2>
          <p class="section-sub">Profils récents avec vidéos de dribles et statistiques</p>
        </div>
        <a routerLink="/players" class="btn btn-outline btn-hover-slide">Tous les talents →</a>
      </div>

      <div *ngIf="loading()" class="text-center py-5">
        <div class="spinner"></div>
      </div>

      <div *ngIf="!loading() && players().length > 0" class="cards-grid">
        <div *ngFor="let p of players(); let i = index" class="card player-card anim-card" [style.animation-delay]="(i * 100) + 'ms'">
          <div class="card-thumb">
            <img 
              [src]="p.photoUrl ? playerService.getMediaUrl(p.photoUrl) : 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=500&auto=format&fit=crop&q=80'" 
              [alt]="p.firstName + ' ' + p.lastName"
            />
            <span class="badge pos-tag" [ngClass]="'badge-' + p.position.toLowerCase()">
              {{ p.position }}
            </span>
            <span *ngIf="p.videoUrl" class="video-tag animate-pulse-badge">
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

            <a [routerLink]="['/players', p.id]" class="btn btn-primary btn-block mt-3 btn-hover-grow">
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
      padding: 65px 0 75px 0;
      overflow: hidden;
      position: relative;
    }

    .hero-video-section::before {
      content: '';
      position: absolute;
      top: -50px;
      right: -50px;
      width: 450px;
      height: 450px;
      background: radial-gradient(circle, rgba(253, 239, 66, 0.1) 0%, transparent 70%);
      pointer-events: none;
    }

    .hero-grid {
      display: grid;
      grid-template-columns: 1.15fr 1fr;
      gap: 45px;
      align-items: center;
      position: relative;
      z-index: 1;
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
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(253, 239, 66, 0.12);
      color: #fdef42;
      border: 1px solid rgba(253, 239, 66, 0.35);
      padding: 6px 16px;
      border-radius: 30px;
      font-size: 0.82rem;
      font-weight: 800;
      letter-spacing: 0.6px;
      margin-bottom: 18px;
      backdrop-filter: blur(8px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .pulse-dot {
      width: 8px;
      height: 8px;
      background: #fdef42;
      border-radius: 50%;
      display: inline-block;
      animation: pulseDot 2s infinite ease-in-out;
    }

    .hero-title {
      font-size: 3.2rem;
      font-weight: 800;
      line-height: 1.15;
      margin-bottom: 18px;
      letter-spacing: -0.5px;
    }

    /* Texte scintillant sur le mot action */
    .shimmer-text {
      background: linear-gradient(90deg, #fdef42 0%, #ffffff 40%, #fdef42 80%);
      background-size: 200% auto;
      color: transparent;
      -webkit-background-clip: text;
      background-clip: text;
      animation: shimmer 4s linear infinite;
      display: inline-block;
      text-decoration: underline;
      text-decoration-color: rgba(253, 239, 66, 0.5);
    }

    .hero-desc {
      font-size: 1.18rem;
      color: #cbd5e1;
      margin-bottom: 32px;
      line-height: 1.65;
      max-width: 520px;
    }

    .hero-cta {
      display: flex;
      gap: 16px;
      margin-bottom: 40px;
      flex-wrap: wrap;
    }

    .btn-lg {
      padding: 13px 26px;
      font-size: 1rem;
      border-radius: 10px;
      transition: all 0.25s ease;
    }

    .btn-glow {
      box-shadow: 0 4px 15px rgba(0, 133, 63, 0.4);
    }

    .btn-glow:hover {
      box-shadow: 0 8px 25px rgba(0, 133, 63, 0.6);
      transform: translateY(-2px);
    }

    .btn-interactive:hover {
      transform: translateY(-2px);
      background: rgba(255, 255, 255, 0.22);
      border-color: #ffffff;
    }

    .btn-outline-white {
      border: 2px solid rgba(255, 255, 255, 0.4);
      color: #ffffff;
      background: rgba(255, 255, 255, 0.08);
      font-weight: 600;
      backdrop-filter: blur(6px);
    }

    .quick-stats {
      display: flex;
      align-items: center;
      gap: 25px;
      border-top: 1px solid rgba(255, 255, 255, 0.15);
      padding-top: 22px;
    }

    .quick-stat {
      display: flex;
      flex-direction: column;
    }

    .quick-stat strong {
      font-size: 1.35rem;
      color: #fdef42;
      font-weight: 800;
      letter-spacing: -0.5px;
    }

    .quick-stat span {
      font-size: 0.8rem;
      color: #94a3b8;
      font-weight: 500;
    }

    .stat-separator {
      width: 1px;
      height: 28px;
      background: rgba(255, 255, 255, 0.15);
    }

    /* Cadre Vidéo en vedette avec effet respiration */
    .hero-video-wrapper {
      display: flex;
      justify-content: center;
      animation: subtleFloat 6s ease-in-out infinite;
    }

    .video-frame {
      position: relative;
      width: 100%;
      max-width: 540px;
      border-radius: 18px;
      overflow: hidden;
      animation: pulseGlow 4s infinite ease-in-out;
      border: 2px solid rgba(253, 239, 66, 0.45);
      background: #000000;
      transition: transform 0.3s ease;
    }

    .video-frame:hover {
      transform: scale(1.02);
    }

    .video-badge {
      position: absolute;
      top: 12px;
      left: 12px;
      background: rgba(0, 0, 0, 0.75);
      color: #ffffff;
      padding: 6px 14px;
      border-radius: 8px;
      font-size: 0.78rem;
      font-weight: 700;
      z-index: 10;
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      gap: 6px;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .live-dot {
      width: 8px;
      height: 8px;
      background: #ef4444;
      border-radius: 50%;
      display: inline-block;
      animation: pulseDot 1.5s infinite;
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
      font-size: 1.85rem;
      font-weight: 800;
      color: var(--dark);
      letter-spacing: -0.5px;
    }

    .section-sub {
      color: var(--gray-medium);
      font-size: 0.95rem;
      margin-top: 3px;
    }

    .btn-hover-slide {
      transition: all 0.2s ease;
    }

    .btn-hover-slide:hover {
      padding-right: 24px;
    }

    .cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 25px;
    }

    .player-card {
      display: flex;
      flex-direction: column;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .player-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
    }

    .card-thumb {
      position: relative;
      height: 230px;
      overflow: hidden;
      background: #e2e8f0;
    }

    .card-thumb img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.4s ease;
    }

    .player-card:hover .card-thumb img {
      transform: scale(1.06);
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
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 700;
      backdrop-filter: blur(4px);
    }

    .animate-pulse-badge {
      animation: pulseDot 3s infinite ease-in-out;
    }

    .card-info {
      padding: 18px;
      display: flex;
      flex-direction: column;
      flex: 1;
    }

    .name {
      font-size: 1.25rem;
      font-weight: 700;
      margin-bottom: 3px;
    }

    .club {
      font-size: 0.88rem;
      color: var(--gray-medium);
      margin-bottom: 12px;
    }

    .pills-row {
      display: flex;
      gap: 8px;
      margin-bottom: 12px;
    }

    .pill {
      background: var(--gray-light);
      padding: 3px 8px;
      border-radius: 4px;
      font-size: 0.75rem;
      color: var(--gray-dark);
      font-weight: 600;
    }

    .btn-hover-grow {
      transition: transform 0.2s ease, background-color 0.2s ease;
    }

    .btn-hover-grow:hover {
      transform: scale(1.02);
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
