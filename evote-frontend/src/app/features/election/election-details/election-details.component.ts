import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ElectionService } from '../../../core/services/election.service';

@Component({
  selector: 'app-election-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './election-details.component.html',
  styleUrl: './election-details.component.scss'
})
export class ElectionDetailsComponent implements OnInit {

  election: any;
  electionId!: number;

  constructor(
    private route: ActivatedRoute,
    private electionService: ElectionService,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.electionId = Number(this.route.snapshot.paramMap.get('id'));

    this.electionService.getElection(this.electionId).subscribe({
      next: (data) => this.election = data,
      error: (err) => console.error('Erreur chargement élection', err)
    });

  }

  deleteElection() {

    if (!confirm('Are you sure you want to delete this election?')) {
      return;
    }

    this.electionService.deleteElection(this.electionId).subscribe({
      next: () => {
        alert('Election deleted');
        this.router.navigate(['/dashboard/my-elections']);
      },
      error: (err) => console.error('Error deleting election', err)
    });

  }

}