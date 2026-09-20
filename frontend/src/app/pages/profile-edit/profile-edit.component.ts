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
      <div class="form-wrapper card">
        <div class="form-header">
          <h2>⚽ Ma Vitrine Sportive Personnelle</h2>
          <p>Complétez votre profil pour maximiser votre visibilité auprès des recruteurs et clubs.</p>
        </div>

        <div *ngIf="successMessage" class="alert alert-success">
          {{ successMessage }}
          <a *ngIf="savedProfileId" [routerLink]="['/players', savedProfileId]" class="ml-2 font-bold underline">
            → Voir mon profil public
          </a>
        </div>

        <div *ngIf="errorMessage" class="alert alert-danger">
          {{ errorMessage }}
        </div>

        <form (ngSubmit)="onSubmit()">
          <!-- Section 1 : Identité & Contact -->
          <div class="form-section">
            <h3 class="section-title">1. Informations Personnelles & Contact</h3>
            <div class="form-row">
              <div class="form-group flex-1">
                <label class="form-label">Prénom *</label>
                <input type="text" class="form-control" [(ngModel)]="firstName" name="firstName" required />
              </div>
              <div class="form-group flex-1">
                <label class="form-label">Nom *</label>
                <input type="text" class="form-control" [(ngModel)]="lastName" name="lastName" required />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group flex-1">
                <label class="form-label">Ville / Région au Sénégal *</label>
                <select class="form-control" [(ngModel)]="city" name="city" required>
                  <option value="">Sélectionnez votre ville</option>
                  <option value="Dakar">Dakar</option>
                  <option value="Thiès">Thiès</option>
                  <option value="Ziguinchor">Ziguinchor</option>
                  <option value="Saint-Louis">Saint-Louis</option>
                  <option value="Kaolack">Kaolack</option>
                  <option value="Mbour">Mbour</option>
                  <option value="Touba">Touba</option>
                  <option value="Kolda">Kolda</option>
                  <option value="Tambacounda">Tambacounda</option>
                  <option value="Autre">Autre région</option>
                </select>
              </div>

              <div class="form-group flex-1">
                <label class="form-label">Numéro WhatsApp / Téléphone</label>
                <input type="text" class="form-control" placeholder="+221 77 000 00 00" [(ngModel)]="phone" name="phone" />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Date de Naissance</label>
              <input type="date" class="form-control" [(ngModel)]="birthDate" name="birthDate" />
            </div>
          </div>

          <!-- Section 2 : Données Sportives -->
          <div class="form-section">
            <h3 class="section-title">2. Caractéristiques Sportives</h3>
            <div class="form-row">
              <div class="form-group flex-1">
                <label class="form-label">Poste de prédilection *</label>
                <select class="form-control" [(ngModel)]="position" name="position" required>
                  <option value="ATTAQUANT">Attaquant (Ailier, Avant-centre)</option>
                  <option value="MILIEU">Milieu (MOC, MDC, Relayeur)</option>
                  <option value="DEFENSEUR">Défenseur (Central, Latéral)</option>
                  <option value="GARDIEN">Gardien de but</option>
                </select>
              </div>

              <div class="form-group flex-1">
                <label class="form-label">Pied fort</label>
                <select class="form-control" [(ngModel)]="strongFoot" name="strongFoot">
                  <option value="">Non précisé</option>
                  <option value="DROITIER">Droitier</option>
                  <option value="GAUCHER">Gaucher</option>
                  <option value="AMBIDEXTRE">Ambidextre (Deux pieds)</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group flex-1">
                <label class="form-label">Taille (en cm)</label>
                <input type="number" class="form-control" placeholder="Ex: 180" [(ngModel)]="height" name="height" />
              </div>

              <div class="form-group flex-1">
                <label class="form-label">Poids (en kg)</label>
                <input type="number" class="form-control" placeholder="Ex: 73" [(ngModel)]="weight" name="weight" />
              </div>

              <div class="form-group flex-1">
                <label class="form-label">Club ou Académie actuelle</label>
                <input type="text" class="form-control" placeholder="Ex: Génération Foot U18" [(ngModel)]="currentClub" name="currentClub" />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Parcours, Biographie & Points forts</label>
              <textarea 
                class="form-control" 
                rows="4" 
                placeholder="Racontez votre parcours, vos qualités principales sur le terrain, vos clubs formateurs..."
                [(ngModel)]="bio" 
                name="bio"
              ></textarea>
            </div>

            <div class="form-group">
              <label class="form-label">Distinctions & Palmarès</label>
              <textarea 
                class="form-control" 
                rows="2" 
                placeholder="Trophées, sélections régionales, meilleur buteur, tournois remportés..."
                [(ngModel)]="palmares" 
                name="palmares"
              ></textarea>
            </div>
          </div>

          <!-- Section 3 : Médias (Photos & Vidéos) -->
          <div class="form-section">
            <h3 class="section-title">3. Médias (Photo & Vidéos Highlights)</h3>

            <div class="form-row">
              <!-- Upload Photo -->
              <div class="form-group flex-1 media-upload-box">
                <label class="form-label">Photo de profil / en action</label>
                <input type="file" (change)="onPhotoSelected($event)" accept="image/*" class="form-control-file" />
                <p class="field-hint">Formats acceptés : JPG, PNG, WEBP</p>
                <div *ngIf="photoPreview" class="preview-wrap mt-2">
                  <img [src]="photoPreview" class="preview-img" alt="Aperçu photo" />
                </div>
              </div>

              <!-- Upload Vidéo -->
              <div class="form-group flex-1 media-upload-box">
                <label class="form-label">Fichier Vidéo (Highlight local)</label>
                <input type="file" (change)="onVideoSelected($event)" accept="video/*" class="form-control-file" />
                <p class="field-hint">Fichier MP4 ou MOV (jusqu'à 100 Mo)</p>
                
                <div class="or-separator">OU lien externe :</div>
                <input 
                  type="url" 
                  class="form-control" 
                  placeholder="https://youtube.com/watch?v=..." 
                  [(ngModel)]="videoUrlLink" 
                  name="videoUrlLink" 
                />
              </div>
            </div>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn btn-primary btn-lg" [disabled]="saving">
              {{ saving ? 'Enregistrement en cours...' : '💾 Enregistrer ma vitrine sportive' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      padding: 40px 20px;
    }
    .form-wrapper {
      max-width: 860px;
      margin: 0 auto;
      padding: 40px;
    }
    .form-header {
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 1px solid var(--border);
    }
    .form-header h2 {
      font-size: 1.8rem;
      font-weight: 800;
      color: var(--dark);
    }
    .form-header p {
      color: var(--gray-medium);
      font-size: 1rem;
      margin-top: 4px;
    }
    .form-section {
      margin-bottom: 35px;
      padding-bottom: 25px;
      border-bottom: 1px solid #f1f5f9;
    }
    .section-title {
      font-size: 1.15rem;
      font-weight: 700;
      color: var(--primary-dark);
      margin-bottom: 20px;
    }
    .form-row {
      display: flex;
      gap: 20px;
      flex-wrap: wrap;
    }
    .flex-1 {
      flex: 1;
      min-width: 240px;
    }
    .media-upload-box {
      background: var(--gray-light);
      padding: 16px;
      border-radius: var(--radius-sm);
      border: 1px dashed var(--border);
    }
    .form-control-file {
      display: block;
      width: 100%;
      margin-top: 6px;
      font-size: 0.9rem;
    }
    .field-hint {
      font-size: 0.8rem;
      color: var(--gray-medium);
      margin-top: 4px;
    }
    .or-separator {
      font-size: 0.82rem;
      font-weight: 700;
      color: var(--gray-medium);
      margin: 12px 0 6px 0;
      text-transform: uppercase;
    }
    .preview-wrap {
      width: 100px;
      height: 100px;
      border-radius: var(--radius-sm);
      overflow: hidden;
      border: 2px solid var(--primary);
    }
    .preview-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .form-actions {
      text-align: center;
      margin-top: 20px;
    }
    .font-bold { font-weight: 700; }
    .underline { text-decoration: underline; }
  `]
})
export class ProfileEditComponent implements OnInit {
  private authService = inject(AuthService);
  private playerService = inject(PlayerService);
  private router = inject(Router);

  firstName = '';
  lastName = '';
  city = '';
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

    // Charger les informations existantes du profil s'il y en a
    this.authService.getMe().subscribe({
      next: (res) => {
        if (res.user && res.user.profile) {
          const p = res.user.profile;
          this.savedProfileId = p.id;
          this.firstName = p.firstName || '';
          this.lastName = p.lastName || '';
          this.city = p.city || '';
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
    if (!this.firstName || !this.lastName || !this.city || !this.position) {
      this.errorMessage = 'Veuillez renseigner les champs obligatoires (Prénom, Nom, Ville, Poste).';
      return;
    }

    this.saving = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Utilisation de FormData pour envoyer les données texte ET les fichiers médias (Multer)
    const formData = new FormData();
    formData.append('firstName', this.firstName);
    formData.append('lastName', this.lastName);
    formData.append('city', this.city);
    formData.append('position', this.position);
    if (this.phone) formData.append('phone', this.phone);
    if (this.birthDate) formData.append('birthDate', this.birthDate);
    if (this.strongFoot) formData.append('strongFoot', this.strongFoot);
    if (this.height) formData.append('height', this.height.toString());
    if (this.weight) formData.append('weight', this.weight.toString());
    if (this.currentClub) formData.append('currentClub', this.currentClub);
    if (this.bio) formData.append('bio', this.bio);
    if (this.palmares) formData.append('palmares', this.palmares);
    if (this.videoUrlLink) formData.append('videoUrlLink', this.videoUrlLink);

    if (this.selectedPhotoFile) {
      formData.append('photo', this.selectedPhotoFile);
    }
    if (this.selectedVideoFile) {
      formData.append('video', this.selectedVideoFile);
    }

    this.playerService.saveMyProfile(formData).subscribe({
      next: (res) => {
        this.saving = false;
        this.successMessage = 'Votre vitrine sportive a été enregistrée avec succès !';
        if (res.profile && res.profile.id) {
          this.savedProfileId = res.profile.id;
        }
      },
      error: (err) => {
        this.saving = false;
        this.errorMessage = err.error?.message || 'Erreur lors de l\'enregistrement du profil.';
      }
    });
  }
}
