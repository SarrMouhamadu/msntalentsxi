// frontend/src/app/pages/players-list/players-list.component.ts
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PlayerService, Player } from '../../services/player.service';

@Component({
  selector: 'app-players-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page-container container">
      <!-- En-tête de la page -->
      <div class="page-header">
        <div>
          <h1 class="page-title">Annuaire des Talents Sportifs</h1>
          <p class="page-subtitle">Découvrez les profils professionnels et les futurs champions du football sénégalais</p>
        </div>

        <!-- Indicateur de performance Cache Redis / PostgreSQL -->
        <div *ngIf="dataSource()" class="cache-badge" [class.from-cache]="dataSource() === 'cache-redis'">
          ⚡ Source : <strong>{{ dataSource() === 'cache-redis' ? 'Cache Redis (Ultra-rapide)' : 'Base PostgreSQL' }}</strong>
        </div>
      </div>

      <!-- Filtres et Recherche -->
      <div class="filter-card">
        <div class="search-row">
          <div class="search-input-wrap">
            <span class="search-icon">🔍</span>
            <input 
              type="text" 
              class="form-control search-input" 
              placeholder="Rechercher par nom, prénom ou club..."
              [(ngModel)]="searchQuery"
              (input)="onFilterChange()"
            />
          </div>

          <div class="city-select-wrap">
            <select class="form-control" [(ngModel)]="selectedCity" (change)="onFilterChange()">
              <option value="">Toutes les régions / villes</option>
              <option value="Dakar">Dakar</option>
              <option value="Thiès">Thiès</option>
              <option value="Ziguinchor">Ziguinchor</option>
              <option value="Saint-Louis">Saint-Louis</option>
              <option value="Sédhiou">Sédhiou</option>
              <option value="Diouloulou">Diouloulou</option>
              <option value="Kaolack">Kaolack</option>
              <option value="Mbour">Mbour</option>
            </select>
          </div>
        </div>

        <!-- Boutons de filtrage par Poste -->
        <div class="positions-filter">
          <button 
            type="button"
            class="pos-btn" 
            [class.active]="selectedPosition === ''" 
            (click)="setPosition('')"
          >
            Tous les postes
          </button>
          <button 
            type="button"
            class="pos-btn" 
            [class.active]="selectedPosition === 'ATTAQUANT'" 
            (click)="setPosition('ATTAQUANT')"
          >
            Attaquants
          </button>
          <button 
            type="button"
            class="pos-btn" 
            [class.active]="selectedPosition === 'MILIEU'" 
            (click)="setPosition('MILIEU')"
          >
            Milieux
          </button>
          <button 
            type="button"
            class="pos-btn" 
            [class.active]="selectedPosition === 'DEFENSEUR'" 
            (click)="setPosition('DEFENSEUR')"
          >
            Défenseurs
          </button>
          <button 
            type="button"
            class="pos-btn" 
            [class.active]="selectedPosition === 'GARDIEN'" 
            (click)="setPosition('GARDIEN')"
          >
            Gardiens
          </button>
        </div>
      </div>

      <!-- État de chargement -->
      <div *ngIf="loading()" class="text-center py-5">
        <div class="spinner"></div>
        <p>Recherche des talents en cours...</p>
      </div>

      <!-- Aucun résultat -->
      <div *ngIf="!loading() && players().length === 0" class="empty-state card">
        <div class="empty-icon">⚽</div>
        <h3>Aucun talent trouvé</h3>
        <p>Essayez de modifier vos filtres ou effectuez une recherche plus large.</p>
        <button class="btn btn-outline" (click)="resetFilters()">Réinitialiser les filtres</button>
      </div>

      <!-- Grille des Joueurs -->
      <div *ngIf="!loading() && players().length > 0" class="players-grid">
        <div *ngFor="let p of players()" class="card player-card">
          <div class="card-media">
            <img 
              [src]="p.photoUrl ? playerService.getMediaUrl(p.photoUrl) : 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=500&auto=format&fit=crop&q=80'" 
              [alt]="p.firstName + ' ' + p.lastName"
              class="player-img"
            />
            <span class="badge position-badge" [ngClass]="'badge-' + p.position.toLowerCase()">
              {{ p.position }}
            </span>
            <span *ngIf="p.videoUrl" class="video-indicator" title="Vidéo / Highlight disponible">
              ▶ Vidéo
            </span>
          </div>

          <div class="card-body">
            <h3 class="player-name">{{ p.firstName }} {{ p.lastName }}</h3>
            <p class="player-location">
              📍 {{ p.city }} &bull; <strong>{{ p.currentClub || 'Club libre' }}</strong>
            </p>

            <div class="metrics-row">
              <span *ngIf="p.strongFoot" class="metric-tag">Pied {{ p.strongFoot }}</span>
              <span *ngIf="p.height" class="metric-tag">{{ p.height }} cm</span>
              <span *ngIf="p.weight" class="metric-tag">{{ p.weight }} kg</span>
            </div>

            <p *ngIf="p.bio" class="player-bio">
              {{ p.bio }}
            </p>

            <div class="card-footer">
              <a [routerLink]="['/players', p.id]" class="btn btn-primary btn-block">
                Voir le Profil & Vidéos
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
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
      flex-wrap: wrap;
      gap: 15px;
    }
    .page-title {
      font-size: 2.2rem;
      font-weight: 800;
      color: var(--dark);
    }
    .page-subtitle {
      color: var(--gray-medium);
      font-size: 1.05rem;
    }
    .cache-badge {
      background: #e2e8f0;
      color: var(--gray-dark);
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 0.85rem;
      border: 1px solid #cbd5e1;
    }
    .cache-badge.from-cache {
      background: #18181b;
      color: #ffffff;
      border-color: #27272a;
    }
    .filter-card {
      background: #ffffff;
      padding: 24px;
      border-radius: var(--radius);
      border: 1px solid var(--border);
      box-shadow: var(--shadow);
      margin-bottom: 35px;
    }
    .search-row {
      display: flex;
      gap: 15px;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }
    .search-input-wrap {
      flex: 1;
      min-width: 260px;
      position: relative;
    }
    .search-icon {
      position: absolute;
      left: 14px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--gray-medium);
    }
    .search-input {
      padding-left: 42px;
    }
    .city-select-wrap {
      min-width: 220px;
    }
    .positions-filter {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }
    .pos-btn {
      background: var(--gray-light);
      border: 1px solid transparent;
      padding: 8px 16px;
      border-radius: 20px;
      font-weight: 600;
      font-size: 0.85rem;
      cursor: pointer;
      transition: var(--transition);
      color: var(--gray-dark);
    }
    .pos-btn:hover {
      background: #e2e8f0;
    }
    .pos-btn.active {
      background: var(--primary);
      color: #ffffff;
    }
    .players-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 25px;
    }
    .player-card {
      display: flex;
      flex-direction: column;
    }
    .card-media {
      position: relative;
      height: 240px;
      overflow: hidden;
      background: #e2e8f0;
    }
    .player-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .position-badge {
      position: absolute;
      top: 12px;
      right: 12px;
    }
    .video-indicator {
      position: absolute;
      bottom: 12px;
      left: 12px;
      background: rgba(0, 0, 0, 0.75);
      color: #ffffff;
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 700;
    }
    .card-body {
      padding: 20px;
      display: flex;
      flex-direction: column;
      flex: 1;
    }
    .player-name {
      font-size: 1.3rem;
      font-weight: 700;
      margin-bottom: 4px;
    }
    .player-location {
      font-size: 0.9rem;
      color: var(--gray-medium);
      margin-bottom: 12px;
    }
    .metrics-row {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      margin-bottom: 12px;
    }
    .metric-tag {
      background: var(--gray-light);
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.8rem;
      color: var(--gray-dark);
      font-weight: 600;
    }
    .player-bio {
      font-size: 0.88rem;
      color: var(--gray-dark);
      margin-bottom: 20px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      flex: 1;
    }
    .btn-block {
      width: 100%;
      text-align: center;
    }
    .empty-state {
      text-align: center;
      padding: 60px 20px;
      max-width: 500px;
      margin: 40px auto;
    }
    .empty-icon {
      font-size: 3rem;
      margin-bottom: 15px;
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
export class PlayersListComponent implements OnInit {
  playerService = inject(PlayerService);

  players = signal<Player[]>([]);
  dataSource = signal<string>('');
  loading = signal(true);

  searchQuery = '';
  selectedPosition = '';
  selectedCity = '';

  ngOnInit(): void {
    this.fetchPlayers();
  }

  fetchPlayers(): void {
    this.loading.set(true);
    this.playerService.getPlayers({
      position: this.selectedPosition,
      city: this.selectedCity,
      search: this.searchQuery,
    }).subscribe({
      next: (res) => {
        this.players.set(res.players);
        this.dataSource.set(res.source);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erreur lors du chargement des joueurs', err);
        this.loading.set(false);
      }
    });
  }

  setPosition(pos: string): void {
    this.selectedPosition = pos;
    this.fetchPlayers();
  }

  onFilterChange(): void {
    this.fetchPlayers();
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.selectedPosition = '';
    this.selectedCity = '';
    this.fetchPlayers();
  }
}
