// frontend/src/app/pages/profile-edit/profile-edit.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { PlayerService } from '../../services/player.service';

@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page-container container">
      <div class="wizard-card card">
        
        <!-- En-tête simple et direct -->
        <div class="wizard-header">
          <h2 class="title">⚽ Ma Vitrine Sportive</h2>
          <p class="subtitle">Complète ta fiche en 3 étapes simples</p>
          
          <!-- Stepper visuel 3 étapes façon Apple -->
          <div class="stepper-bar">
            <button 
              type="button" 
              class="step-item" 
              [class.active]="step === 1" 
              [class.completed]="step > 1"
              (click)="goToStep(1)"
            >
              <span class="step-num">{{ step > 1 ? '✓' : '1' }}</span>
              <span class="step-label">👤 Identité</span>
            </button>
            <div class="step-line" [class.filled]="step >= 2"></div>

            <button 
              type="button" 
              class="step-item" 
              [class.active]="step === 2" 
              [class.completed]="step > 2"
              (click)="goToStep(2)"
            >
              <span class="step-num">{{ step > 2 ? '✓' : '2' }}</span>
              <span class="step-label">⚽ Football</span>
            </button>
            <div class="step-line" [class.filled]="step >= 3"></div>

            <button 
              type="button" 
              class="step-item" 
              [class.active]="step === 3" 
              (click)="goToStep(3)"
            >
              <span class="step-num">3</span>
              <span class="step-label">📸 Photo & Vidéo</span>
            </button>
          </div>
        </div>

        <!-- Alertes de succès ou d'erreur -->
        <div *ngIf="successMessage" class="alert alert-success">
          🎉 {{ successMessage }}
          <a *ngIf="savedProfileId" [routerLink]="['/players', savedProfileId]" class="ml-2 font-bold underline">
            → Voir ma vitrine en ligne
          </a>
        </div>

        <div *ngIf="errorMessage" class="alert alert-danger">
          ⚠️ {{ errorMessage }}
        </div>

        <form (ngSubmit)="onSubmit()">
          
          <!-- ============================================== -->
          <!-- ÉTAPE 1 : IDENTITÉ & CONTACT                  -->
          <!-- ============================================== -->
          <div *ngIf="step === 1" class="step-content">
            <div class="step-badge">Étape 1 sur 3</div>
            <h3 class="step-heading">👤 Qui es-tu ?</h3>
            <p class="step-desc">Tes informations de base pour que les clubs puissent te contacter.</p>

            <div class="inputs-grid">
              <div class="form-group">
                <label class="form-label">Prénom *</label>
                <input 
                  type="text" 
                  class="form-control big-input" 
                  placeholder="Ex: Sadio" 
                  [(ngModel)]="firstName" 
                  name="firstName" 
                  required 
                />
              </div>

              <div class="form-group">
                <label class="form-label">Nom de famille *</label>
                <input 
                  type="text" 
                  class="form-control big-input" 
                  placeholder="Ex: Mané" 
                  [(ngModel)]="lastName" 
                  name="lastName" 
                  required 
                />
              </div>
            </div>

            <!-- Sélection de Ville avec boutons rapides visuels -->
            <div class="form-group">
              <label class="form-label">📍 Ta Ville au Sénégal *</label>
              <div class="quick-cities">
                <button 
                  type="button" 
                  *ngFor="let c of topCities" 
                  class="city-chip" 
                  [class.active]="city === c" 
                  (click)="setCity(c)"
                >
                  {{ c }}
                </button>
              </div>

              <select class="form-control big-input mt-2" [(ngModel)]="city" name="city" required>
                <option value="">Ou choisis dans la liste...</option>
                <option value="Dakar">Dakar</option>
                <option value="Thiès">Thiès</option>
                <option value="Ziguinchor">Ziguinchor</option>
                <option value="Saint-Louis">Saint-Louis</option>
                <option value="Kaolack">Kaolack</option>
                <option value="Mbour">Mbour</option>
                <option value="Touba">Touba</option>
                <option value="Kolda">Kolda</option>
                <option value="Tambacounda">Tambacounda</option>
                <option value="Fatick">Fatick</option>
                <option value="Diourbel">Diourbel</option>
                <option value="Louga">Louga</option>
                <option value="Kédougou">Kédougou</option>
                <option value="Matam">Matam</option>
                <option value="Autre">Autre région</option>
              </select>
            </div>

            <div class="inputs-grid">
              <div class="form-group">
                <label class="form-label">📱 Numéro WhatsApp</label>
                <div class="phone-input-wrap">
                  <span class="phone-icon">💬</span>
                  <input 
                    type="text" 
                    class="form-control big-input with-icon" 
                    placeholder="77 123 45 67" 
                    [(ngModel)]="phone" 
                    name="phone" 
                  />
                </div>
                <small class="field-hint">Pour recevoir les appels des recruteurs</small>
              </div>

              <div class="form-group">
                <label class="form-label">🎂 Date ou Année de Naissance</label>
                <input 
                  type="date" 
                  class="form-control big-input" 
                  [(ngModel)]="birthDate" 
                  name="birthDate" 
                />
              </div>
            </div>

            <div class="step-actions">
              <div></div>
              <button type="button" class="btn btn-primary btn-step" (click)="goToStep(2)">
                Continuer vers l'étape 2 ➔
              </button>
            </div>
          </div>

          <!-- ============================================== -->
          <!-- ÉTAPE 2 : TON FOOTBALL (Poste & Qualités)      -->
          <!-- ============================================== -->
          <div *ngIf="step === 2" class="step-content">
            <div class="step-badge">Étape 2 sur 3</div>
            <h3 class="step-heading">⚽ Quel est ton poste sur le terrain ?</h3>
            <p class="step-desc">Touche ton poste principal pour le sélectionner :</p>

            <!-- Grosses cartes tactiles très visuelles -->
            <div class="position-cards-grid">
              <div 
                class="pos-card" 
                [class.selected]="position === 'ATTAQUANT'" 
                (click)="setPosition('ATTAQUANT')"
              >
                <div class="pos-icon">🎯</div>
                <div class="pos-title">Attaquant</div>
                <div class="pos-sub">Ailier / Buteur</div>
                <div *ngIf="position === 'ATTAQUANT'" class="pos-check">✓ Choisi</div>
              </div>

              <div 
                class="pos-card" 
                [class.selected]="position === 'MILIEU'" 
                (click)="setPosition('MILIEU')"
              >
                <div class="pos-icon">⚡</div>
                <div class="pos-title">Milieu</div>
                <div class="pos-sub">Meneur / Relayeur</div>
                <div *ngIf="position === 'MILIEU'" class="pos-check">✓ Choisi</div>
              </div>

              <div 
                class="pos-card" 
                [class.selected]="position === 'DEFENSEUR'" 
                (click)="setPosition('DEFENSEUR')"
              >
                <div class="pos-icon">🛡️</div>
                <div class="pos-title">Défenseur</div>
                <div class="pos-sub">Central / Latéral</div>
                <div *ngIf="position === 'DEFENSEUR'" class="pos-check">✓ Choisi</div>
              </div>

              <div 
                class="pos-card" 
                [class.selected]="position === 'GARDIEN'" 
                (click)="setPosition('GARDIEN')"
              >
                <div class="pos-icon">🧤</div>
                <div class="pos-title">Gardien</div>
                <div class="pos-sub">Dans les buts</div>
                <div *ngIf="position === 'GARDIEN'" class="pos-check">✓ Choisi</div>
              </div>
            </div>

            <!-- Pied fort avec gros boutons tactiles -->
            <div class="form-group mt-4">
              <label class="form-label">🦶 Ton meilleur pied :</label>
              <div class="feet-selector">
                <button 
                  type="button" 
                  class="foot-btn" 
                  [class.active]="strongFoot === 'DROITIER'" 
                  (click)="strongFoot = 'DROITIER'"
                >
                  🦶 Droitier
                </button>
                <button 
                  type="button" 
                  class="foot-btn" 
                  [class.active]="strongFoot === 'GAUCHER'" 
                  (click)="strongFoot = 'GAUCHER'"
                >
                  🦶 Gaucher
                </button>
                <button 
                  type="button" 
                  class="foot-btn" 
                  [class.active]="strongFoot === 'AMBIDEXTRE'" 
                  (click)="strongFoot = 'AMBIDEXTRE'"
                >
                  👟 Les 2 pieds
                </button>
              </div>
            </div>

            <!-- Détails facultatifs simples -->
            <div class="inputs-grid mt-3">
              <div class="form-group">
                <label class="form-label">Club ou Académie actuelle</label>
                <input 
                  type="text" 
                  class="form-control big-input" 
                  placeholder="Ex: Génération Foot, Diambars ou Libre" 
                  [(ngModel)]="currentClub" 
                  name="currentClub" 
                />
              </div>

              <div class="form-group">
                <label class="form-label">Taille (cm)</label>
                <input 
                  type="number" 
                  class="form-control big-input" 
                  placeholder="Ex: 180" 
                  [(ngModel)]="height" 
                  name="height" 
                />
              </div>
            </div>

            <div class="step-actions">
              <button type="button" class="btn btn-outline btn-step" (click)="goToStep(1)">
                ⬅ Précédent
              </button>
              <button type="button" class="btn btn-primary btn-step" (click)="goToStep(3)">
                Continuer vers Photos & Vidéos ➔
              </button>
            </div>
          </div>

          <!-- ============================================== -->
          <!-- ÉTAPE 3 : MÉDIAS (Photo & Vidéo)               -->
          <!-- ============================================== -->
          <div *ngIf="step === 3" class="step-content">
            <div class="step-badge">Étape 3 sur 3</div>
            <h3 class="step-heading">📸 Ta Photo & Ta Vidéo</h3>
            <p class="step-desc">Ajoute ta photo et ta meilleure vidéo de dribles pour impressionner les recruteurs !</p>

            <div class="media-boxes-grid">
              
              <!-- 1. Boîte Photo -->
              <div class="media-upload-card" [class.has-file]="photoPreview">
                <div class="card-media-icon">📸</div>
                <h4>1. Ta Photo</h4>
                <p>Une photo claire de toi en maillot ou en tenue de sport.</p>

                <div *ngIf="photoPreview" class="photo-preview-box">
                  <img [src]="photoPreview" alt="Aperçu photo" class="preview-img" />
                  <span class="badge-ok">✅ Photo prête</span>
                </div>

                <label class="file-upload-btn btn btn-outline mt-2">
                  <span>{{ photoPreview ? 'Changer la photo' : '+ Choisir ma photo' }}</span>
                  <input type="file" (change)="onPhotoSelected($event)" accept="image/*" class="hidden-file-input" />
                </label>
              </div>

              <!-- 2. Boîte Vidéo -->
              <div class="media-upload-card" [class.has-file]="selectedVideoFile || videoUrlLink">
                <div class="card-media-icon">🎥</div>
                <h4>2. Ta Vidéo de Dribles</h4>
                <p>Montre tes gestes techniques, buts et accélérations.</p>

                <div *ngIf="selectedVideoFile" class="video-preview-badge">
                  <span>✅ Fichier vidéo prêt :</span>
                  <strong>{{ selectedVideoFile.name }}</strong>
                </div>

                <label class="file-upload-btn btn btn-primary mt-2">
                  <span>{{ selectedVideoFile ? 'Changer la vidéo' : '+ Choisir une vidéo (MP4)' }}</span>
                  <input type="file" (change)="onVideoSelected($event)" accept="video/*" class="hidden-file-input" />
                </label>

                <div class="video-link-divider">ou colle un lien vidéo :</div>
                <input 
                  type="url" 
                  class="form-control" 
                  placeholder="Lien YouTube, TikTok ou Facebook..." 
                  [(ngModel)]="videoUrlLink" 
                  name="videoUrlLink" 
                />
              </div>
            </div>

            <!-- Détails supplémentaires optionnels (dépliables) -->
            <div class="optional-details-box">
              <details>
                <summary>📝 Écrire quelques mots sur toi (Facultatif)</summary>
                <div class="mt-3">
                  <div class="form-group">
                    <label class="form-label">Ton parcours ou tes points forts</label>
                    <textarea 
                      class="form-control" 
                      rows="3" 
                      placeholder="Ex: Rapide sur les ailes, bon pied gauche, formé dans le quartier..." 
                      [(ngModel)]="bio" 
                      name="bio"
                    ></textarea>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Tes trophées ou tournois gagnés</label>
                    <input 
                      type="text" 
                      class="form-control" 
                      placeholder="Ex: Vainqueur coupe régionale Navétanes..." 
                      [(ngModel)]="palmares" 
                      name="palmares" 
                    />
                  </div>
                </div>
              </details>
            </div>

            <!-- Boutons finaux -->
            <div class="step-actions mt-4">
              <button type="button" class="btn btn-outline btn-step" (click)="goToStep(2)">
                ⬅ Précédent
              </button>
              <button type="submit" class="btn btn-primary btn-step btn-final" [disabled]="saving">
                {{ saving ? '⏳ Enregistrement...' : '✅ Publier ma Vitrine Sportive' }}
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      padding: 40px 20px;
    }
    
    .wizard-card {
      max-width: 820px;
      margin: 0 auto;
      padding: 40px;
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-hover);
      border: 1px solid rgba(203, 213, 225, 0.8);
    }

    @media (max-width: 640px) {
      .wizard-card {
        padding: 24px 18px;
      }
    }

    /* En-tête */
    .wizard-header {
      text-align: center;
      margin-bottom: 35px;
    }

    .title {
      font-size: 2.2rem;
      font-weight: 800;
      letter-spacing: -0.025em;
      color: var(--dark);
    }

    .subtitle {
      color: var(--gray-medium);
      font-size: 1.05rem;
      margin-top: 6px;
    }

    /* Stepper visuel Apple */
    .stepper-bar {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 28px;
      gap: 10px;
    }

    .step-item {
      display: flex;
      align-items: center;
      gap: 8px;
      background: transparent;
      border: none;
      cursor: pointer;
      padding: 8px 14px;
      border-radius: var(--radius-pill);
      transition: var(--transition);
    }

    .step-num {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: #e2e8f0;
      color: var(--gray-medium);
      font-weight: 800;
      font-size: 0.95rem;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: var(--transition);
    }

    .step-label {
      font-weight: 600;
      font-size: 0.9rem;
      color: var(--gray-medium);
    }

    .step-item.active .step-num {
      background: var(--primary);
      color: #ffffff;
      box-shadow: 0 0 12px rgba(15, 118, 110, 0.4);
    }

    .step-item.active .step-label {
      color: var(--primary);
      font-weight: 700;
    }

    .step-item.completed .step-num {
      background: #0284c7;
      color: #ffffff;
    }

    .step-line {
      flex: 1;
      max-width: 45px;
      height: 3px;
      background: #e2e8f0;
      border-radius: 2px;
      transition: var(--transition);
    }

    .step-line.filled {
      background: var(--primary);
    }

    /* Étape contenu */
    .step-content {
      animation: fadeIn 0.3s ease-out;
    }

    .step-badge {
      display: inline-block;
      background: rgba(15, 118, 110, 0.12);
      color: var(--primary);
      padding: 4px 12px;
      border-radius: var(--radius-pill);
      font-size: 0.8rem;
      font-weight: 700;
      margin-bottom: 10px;
    }

    .step-heading {
      font-size: 1.6rem;
      font-weight: 800;
      letter-spacing: -0.02em;
      color: var(--dark);
      margin-bottom: 6px;
    }

    .step-desc {
      color: var(--gray-medium);
      font-size: 0.95rem;
      margin-bottom: 25px;
    }

    .inputs-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    @media (max-width: 680px) {
      .inputs-grid {
        grid-template-columns: 1fr;
      }
    }

    .big-input {
      padding: 14px 18px;
      font-size: 1rem;
      border-radius: var(--radius-sm);
    }

    .phone-input-wrap {
      position: relative;
    }

    .phone-icon {
      position: absolute;
      left: 14px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 1.2rem;
    }

    .with-icon {
      padding-left: 45px;
    }

    /* Villes rapides */
    .quick-cities {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 10px;
    }

    .city-chip {
      background: #f1f5f9;
      border: 1.5px solid transparent;
      padding: 6px 14px;
      border-radius: var(--radius-pill);
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      color: var(--gray-dark);
      transition: var(--transition);
    }

    .city-chip:hover {
      background: #e2e8f0;
      color: var(--primary);
    }

    .city-chip.active {
      background: var(--primary);
      color: #ffffff;
      border-color: var(--primary);
    }

    /* Cartes des Postes tactiles */
    .position-cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 16px;
      margin-bottom: 25px;
    }

    .pos-card {
      background: #ffffff;
      border: 2px solid #e2e8f0;
      border-radius: var(--radius);
      padding: 22px 14px;
      text-align: center;
      cursor: pointer;
      transition: var(--transition);
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .pos-card:hover {
      border-color: var(--primary);
      transform: translateY(-3px) scale(1.02);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
    }

    .pos-card.selected {
      border-color: var(--primary);
      background: rgba(15, 118, 110, 0.06);
      box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.2);
    }

    .pos-icon {
      font-size: 2.4rem;
      margin-bottom: 10px;
    }

    .pos-title {
      font-size: 1.15rem;
      font-weight: 800;
      color: var(--dark);
      letter-spacing: -0.01em;
    }

    .pos-sub {
      font-size: 0.78rem;
      color: var(--gray-medium);
      margin-top: 4px;
    }

    .pos-check {
      margin-top: 10px;
      background: var(--primary);
      color: #ffffff;
      padding: 3px 10px;
      border-radius: var(--radius-pill);
      font-size: 0.75rem;
      font-weight: 700;
    }

    /* Pieds sélecteur */
    .feet-selector {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }

    .foot-btn {
      flex: 1;
      min-width: 120px;
      padding: 12px 16px;
      border-radius: var(--radius-pill);
      background: #f1f5f9;
      border: 2px solid transparent;
      font-weight: 700;
      font-size: 0.95rem;
      cursor: pointer;
      transition: var(--transition);
      color: var(--gray-dark);
      text-align: center;
    }

    .foot-btn:hover {
      background: #e2e8f0;
    }

    .foot-btn.active {
      background: var(--primary);
      color: #ffffff;
      border-color: var(--primary);
      box-shadow: 0 4px 12px rgba(15, 118, 110, 0.25);
    }

    /* Boîtes Médias */
    .media-boxes-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 25px;
    }

    @media (max-width: 680px) {
      .media-boxes-grid {
        grid-template-columns: 1fr;
      }
    }

    .media-upload-card {
      background: #f8fafc;
      border: 2px dashed #cbd5e1;
      border-radius: var(--radius);
      padding: 24px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      transition: var(--transition);
    }

    .media-upload-card.has-file {
      border-color: var(--primary);
      background: rgba(15, 118, 110, 0.04);
    }

    .card-media-icon {
      font-size: 2.6rem;
      margin-bottom: 8px;
    }

    .media-upload-card h4 {
      font-size: 1.15rem;
      font-weight: 800;
      color: var(--dark);
      margin-bottom: 4px;
    }

    .media-upload-card p {
      font-size: 0.85rem;
      color: var(--gray-medium);
      margin-bottom: 16px;
    }

    .file-upload-btn {
      cursor: pointer;
      position: relative;
      overflow: hidden;
      display: inline-flex;
    }

    .hidden-file-input {
      position: absolute;
      top: 0;
      left: 0;
      opacity: 0;
      width: 100%;
      height: 100%;
      cursor: pointer;
    }

    .photo-preview-box {
      width: 110px;
      height: 110px;
      border-radius: 16px;
      overflow: hidden;
      margin-bottom: 12px;
      position: relative;
      border: 3px solid var(--primary);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .preview-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .badge-ok {
      position: absolute;
      bottom: 4px;
      left: 4px;
      right: 4px;
      background: rgba(15, 118, 110, 0.9);
      color: #ffffff;
      font-size: 0.68rem;
      font-weight: 700;
      padding: 2px 4px;
      border-radius: 4px;
    }

    .video-preview-badge {
      background: rgba(15, 118, 110, 0.12);
      color: var(--primary);
      padding: 8px 12px;
      border-radius: var(--radius-sm);
      font-size: 0.82rem;
      margin-bottom: 10px;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .video-link-divider {
      font-size: 0.78rem;
      color: var(--gray-medium);
      font-weight: 600;
      margin: 14px 0 8px 0;
      text-transform: uppercase;
    }

    .optional-details-box {
      background: #ffffff;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 16px 20px;
      margin-bottom: 25px;
    }

    .optional-details-box summary {
      font-weight: 700;
      color: var(--gray-dark);
      cursor: pointer;
      font-size: 0.95rem;
    }

    /* Actions étapes */
    .step-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 15px;
      margin-top: 30px;
      flex-wrap: wrap;
    }

    .btn-step {
      padding: 13px 26px;
      font-size: 1rem;
      font-weight: 700;
      letter-spacing: -0.01em;
    }

    .btn-final {
      background: linear-gradient(135deg, #0f766e 0%, #0891b2 100%);
      font-size: 1.1rem;
      padding: 14px 32px;
      box-shadow: 0 6px 20px rgba(15, 118, 110, 0.35);
    }

    .btn-final:hover {
      transform: scale(1.03);
      box-shadow: 0 10px 25px rgba(15, 118, 110, 0.45);
    }
  `]
})
export class ProfileEditComponent implements OnInit {
  private authService = inject(AuthService);
  private playerService = inject(PlayerService);
  private router = inject(Router);

  step = 1; // Étape courante (1, 2 ou 3)

  topCities = ['Dakar', 'Thiès', 'Ziguinchor', 'Saint-Louis', 'Mbour', 'Kaolack'];

  firstName = '';
  lastName = '';
  city = 'Dakar';
  phone = '';
  birthDate = '';
  position = 'ATTAQUANT';
  strongFoot = 'DROITIER';
  height: number | null = null;
  weight: number | null = null;
  currentClub = '';
  bio = '';
  palmares = '';
  videoUrlLink = '';

  selectedPhotoFile: File | null = null;
  selectedVideoFile: File | null = null;
  photoPreview: string | null = null;

  saving = false;
  successMessage = '';
  errorMessage = '';
  savedProfileId: number | null = null;

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    // Préremplir avec les informations existantes du profil
    this.authService.getMe().subscribe({
      next: (res) => {
        if (res.user && res.user.profile) {
          const p = res.user.profile;
          this.savedProfileId = p.id;
          this.firstName = p.firstName || '';
          this.lastName = p.lastName || '';
          this.city = p.city || 'Dakar';
          this.phone = p.phone || '';
          if (p.birthDate) {
            this.birthDate = new Date(p.birthDate).toISOString().split('T')[0];
          }
          this.position = p.position || 'ATTAQUANT';
          this.strongFoot = p.strongFoot || 'DROITIER';
          this.height = p.height || null;
          this.weight = p.weight || null;
          this.currentClub = p.currentClub || '';
          this.bio = p.bio || '';
          this.palmares = p.palmares || '';
          if (p.videoUrl && !p.videoUrl.startsWith('/uploads/')) {
            this.videoUrlLink = p.videoUrl;
          }
          if (p.photoUrl) {
            this.photoPreview = this.playerService.getMediaUrl(p.photoUrl);
          }
        }
      },
      error: (err) => {
        console.error('Erreur chargement profil utilisateur', err);
      }
    });
  }

  goToStep(targetStep: number): void {
    if (targetStep > 1 && (!this.firstName.trim() || !this.lastName.trim() || !this.city)) {
      this.errorMessage = '⚠️ Écris au moins ton prénom et ton nom avant de continuer.';
      return;
    }
    this.errorMessage = '';
    this.step = targetStep;
    window.scrollTo({ top: 120, behavior: 'smooth' });
  }

  setCity(cityName: string): void {
    this.city = cityName;
  }

  setPosition(pos: string): void {
    this.position = pos;
  }

  onPhotoSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedPhotoFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.photoPreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onVideoSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedVideoFile = file;
    }
  }

  onSubmit(): void {
    if (!this.firstName.trim() || !this.lastName.trim() || !this.city || !this.position) {
      this.errorMessage = '⚠️ Renseigne au moins ton prénom, ton nom et ta ville.';
      this.step = 1;
      return;
    }

    this.saving = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formData = new FormData();
    formData.append('firstName', this.firstName.trim());
    formData.append('lastName', this.lastName.trim());
    formData.append('city', this.city);
    formData.append('position', this.position);
    if (this.phone) formData.append('phone', this.phone.trim());
    if (this.birthDate) formData.append('birthDate', this.birthDate);
    if (this.strongFoot) formData.append('strongFoot', this.strongFoot);
    if (this.height) formData.append('height', this.height.toString());
    if (this.weight) formData.append('weight', this.weight.toString());
    if (this.currentClub) formData.append('currentClub', this.currentClub.trim());
    if (this.bio) formData.append('bio', this.bio);
    if (this.palmares) formData.append('palmares', this.palmares);
    if (this.videoUrlLink) formData.append('videoUrlLink', this.videoUrlLink.trim());

    if (this.selectedPhotoFile) {
      formData.append('photo', this.selectedPhotoFile);
    }
    if (this.selectedVideoFile) {
      formData.append('video', this.selectedVideoFile);
    }

    this.playerService.saveMyProfile(formData).subscribe({
      next: (res) => {
        this.saving = false;
        this.successMessage = 'Ta vitrine sportive a été enregistrée avec succès !';
        if (res.profile && res.profile.id) {
          this.savedProfileId = res.profile.id;
        }
      },
      error: (err) => {
        this.saving = false;
        this.errorMessage = err.error?.message || 'Erreur lors de l\'enregistrement.';
      }
    });
  }
}
