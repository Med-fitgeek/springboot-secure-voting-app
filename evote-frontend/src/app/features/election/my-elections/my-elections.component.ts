import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ElectionService } from '../../../core/services/election.service';
import { ElectionRequest } from '../../../shared/models/election-request.model';
import { ElectionResponse } from '../../../shared/models/election-response.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-my-elections',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './my-elections.component.html',
  styleUrl: './my-elections.component.scss'
})
export class MyElectionsComponent implements OnInit {
  elections: ElectionResponse[] = [];

  constructor(private electionService: ElectionService) {}

  ngOnInit(): void {
    this.fetchElections();
  }

  fetchElections(): void {
    this.electionService.getElections().subscribe({
      next: (data) => this.elections = data,
      error: (err) => console.error('Erreur lors du chargement des élections', err)
    });
  }

  // Méthodes pour actions futures
  onDeleteElection(id: number) {
    // À implémenter plus tard
  }

  onEditElection(id: number) {
    // À implémenter plus tard
  }

  onViewResults(id: number) {
    // À implémenter plus tard
  }
}
