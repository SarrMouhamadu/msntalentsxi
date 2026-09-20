// frontend/src/app/services/auth.service.ts
// Service d'authentification simple pour gérer la connexion et le profil utilisateur

import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface User {
  id: number;
  email: string;
  role: 'JOUEUR' | 'RECRUTEUR' | 'ADMIN';
  profile?: any;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  // URL de l'API backend Node.js
  private apiUrl = 'http://localhost:4000/api/auth';

  private tokenKey = 'msn_talents_token';
  private userKey = 'msn_talents_user';

  // Inscription
  register(credentials: { email: string; password: string; role?: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, credentials).pipe(
      tap(res => {
        if (res.success && res.token) {
          this.saveSession(res.token, res.user);
        }
      })
    );
  }

  // Connexion
  login(credentials: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(res => {
        if (res.success && res.token) {
          this.saveSession(res.token, res.user);
        }
      })
    );
  }

  // Récupérer le profil actuel depuis le serveur
  getMe(): Observable<{ success: boolean; user: User }> {
    const headers = this.getAuthHeaders();
    return this.http.get<{ success: boolean; user: User }>(`${this.apiUrl}/me`, { headers }).pipe(
      tap(res => {
        if (res.success && res.user) {
          localStorage.setItem(this.userKey, JSON.stringify(res.user));
        }
      })
    );
  }

  // Sauvegarder la session dans le navigateur
  private saveSession(token: string, user: User): void {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  // Déconnexion
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  // Obtenir le token stocké
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Obtenir l'utilisateur actuellement connecté
  getUser(): User | null {
    const raw = localStorage.getItem(this.userKey);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  // Savoir si l'utilisateur est connecté
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // Générer les headers HTTP avec le Token JWT
  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : ''
    });
  }
}
