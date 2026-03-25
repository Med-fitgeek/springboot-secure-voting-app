import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ElectionService } from '../../../core/services/election.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-election-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './election-details.component.html',
  styleUrl: './election-details.component.scss',
})
export class ElectionDetailsComponent implements OnInit {
  election: any = null;
  electionId!: number;
  isLoading = true;
  isDeleting = false;
  showDeleteModal = false;

  constructor(
    private route: ActivatedRoute,
    private electionService: ElectionService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.electionId = Number(this.route.snapshot.paramMap.get('id'));
    this.electionService.getElection(this.electionId).subscribe({
      next: (data) => {
        this.election = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.toastr.error('Impossible de charger cette élection.');
      },
    });
  }

  get statusLabel(): string {
    if (!this.election) return '';
    const now = new Date();
    if (new Date(this.election.startDate) > now) return 'À venir';
    if (new Date(this.election.endDate) < now) return 'Terminée';
    return 'En cours';
  }

  get statusBadge(): string {
    if (!this.election) return '';
    const now = new Date();
    if (new Date(this.election.startDate) > now) return 'badge-pending';
    if (new Date(this.election.endDate) < now) return 'badge-closed';
    return 'badge-active';
  }

  get canEdit(): boolean {
    return this.election && new Date(this.election.startDate) > new Date();
  }

  deleteElection(): void {
    this.isDeleting = true;
    this.electionService.deleteElection(this.electionId).subscribe({
      next: () => {
        this.toastr.success('Élection supprimée avec succès.');
        this.router.navigate(['/dashboard/my-elections']);
      },
      error: () => {
        this.toastr.error('Impossible de supprimer cette élection.');
        this.isDeleting = false;
        this.showDeleteModal = false;
      },
    });
  }
}