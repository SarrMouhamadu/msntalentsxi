// frontend/src/app/services/player.service.ts
// Service pour récupérer et gérer les profils des joueurs

import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface Player {
  id: number;
  userId: number;
  firstName: string;
  lastName: string;
  birthDate?: string;
  city: string;
  phone?: string;
  position: 'ATTAQUANT' | 'MILIEU' | 'DEFENSEUR' | 'GARDIEN';
  strongFoot?: 'DROITIER' | 'GAUCHER' | 'AMBIDEXTRE';
  height?: number;
  weight?: number;
  currentClub?: string;
  bio?: string;
  palmares?: string;
  photoUrl?: string;
  videoUrl?: string;
  isFeatured?: boolean;
  createdAt: string;
  user?: { email: string };
}

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = 'http://localhost:4000/api/players';

  // 1. Obtenir la liste des joueurs avec filtres optionnels
  getPlayers(filters?: { position?: string; city?: string; search?: string }): Observable<{ success: boolean; source: string; players: Player[] }> {
    let params = new HttpParams();
    if (filters?.position) params = params.set('position', filters.position);
    if (filters?.city) params = params.set('city', filters.city);
    if (filters?.search) params = params.set('search', filters.search);

    return this.http.get<{ success: boolean; source: string; players: Player[] }>(this.apiUrl, { params });
  }

  // 2. Obtenir les joueurs en vedette pour la page d'accueil
  getFeaturedPlayers(): Observable<{ success: boolean; source: string; players: Player[] }> {
    return this.http.get<{ success: boolean; source: string; players: Player[] }>(`${this.apiUrl}/featured`);
  }

  // 3. Obtenir les détails complets d'un joueur par son ID
  getPlayerById(id: number): Observable<{ success: boolean; player: Player }> {
    return this.http.get<{ success: boolean; player: Player }>(`${this.apiUrl}/${id}`);
  }

  // 4. Enregistrer ou modifier son profil joueur (avec envoi FormData pour les fichiers photo/vidéo)
  saveMyProfile(formData: FormData): Observable<{ success: boolean; message: string; profile: Player }> {
    const headers = this.authService.getAuthHeaders();
    return this.http.post<{ success: boolean; message: string; profile: Player }>(
      `${this.apiUrl}/my-profile`,
      formData,
      { headers }
    );
  }

  // URL absolue pour afficher un média (photo ou vidéo stockée en local)
  getMediaUrl(relativePath?: string | null): string {
    if (!relativePath) return '';
    if (relativePath.startsWith('http')) return relativePath; // Si lien externe
    return `http://localhost:4000${relativePath}`;
  }
}
