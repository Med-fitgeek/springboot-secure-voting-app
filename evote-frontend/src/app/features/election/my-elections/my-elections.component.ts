import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ElectionService } from '../../../core/services/election.service';
import { ElectionResponse } from '../../../shared/models/election-response.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-my-elections',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './my-elections.component.html',
  styleUrl: './my-elections.component.scss',
})
export class MyElectionsComponent implements OnInit {
  elections: ElectionResponse[] = [];
  isLoading = true;
  isDeleting = false;

  deleteModal = {
    open: false,
    electionId: 0,
    electionTitle: '',
  };

  constructor(
    private electionService: ElectionService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.fetchElections();
  }

  fetchElections(): void {
    this.isLoading = true;
    this.electionService.getElections().subscribe({
      next: (data) => {
        this.elections = data;
        this.isLoading = false;
      },
      error: () => {
        this.toastr.error('Impossible de charger les élections.');
        this.isLoading = false;
      },
    });
  }

  // ── Statut ────────────────────────────────────────
  getStatusLabel(election: ElectionResponse): string {
    const now = new Date();
    if (new Date(election.startDate) > now) return 'À venir';
    if (new Date(election.endDate) < now) return 'Terminée';
    return 'En cours';
  }

  getStatusBadge(election: ElectionResponse): string {
    const now = new Date();
    if (new Date(election.startDate) > now) return 'badge-pending';
    if (new Date(election.endDate) < now) return 'badge-closed';
    return 'badge-active';
  }

  canEdit(election: ElectionResponse): boolean {
    return new Date(election.startDate) > new Date();
  }

  // ── Suppression ───────────────────────────────────
  confirmDelete(election: ElectionResponse): void {
    this.deleteModal = {
      open: true,
      electionId: election.id,
      electionTitle: election.title,
    };
  }

  closeDeleteModal(): void {
    if (!this.isDeleting) this.deleteModal.open = false;
  }

  executeDelete(): void {
    this.isDeleting = true;
    this.electionService.deleteElection(this.deleteModal.electionId).subscribe({
      next: () => {
        this.elections = this.elections.filter(
          (e) => e.id !== this.deleteModal.electionId
        );
        this.toastr.success('Élection supprimée avec succès.');
        this.isDeleting = false;
        this.deleteModal.open = false;
      },
      error: () => {
        this.toastr.error('Impossible de supprimer cette élection.');
        this.isDeleting = false;
      },
    });
  }
}