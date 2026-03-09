import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ElectionService } from '../../../core/services/election.service';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-election-results',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './election-results.component.html',
  styleUrl: './election-results.component.scss'
})
export class ElectionResultsComponent implements OnInit {

  @ViewChild('chartCanvas') chartCanvas!: ElementRef;

  electionId!: number;
  results: any[] = [];
  chart!: Chart;

  constructor(
    private route: ActivatedRoute,
    private electionService: ElectionService
  ) {}

  ngOnInit(): void {
    this.electionId = Number(this.route.snapshot.paramMap.get('id'));

    this.electionService.getResults(this.electionId).subscribe({
      next: (data) => {
        this.results = data;
        setTimeout(() => this.renderChart(), 0);
      },
      error: (err) => console.error('Error loading results', err)
    });
  }

  renderChart() {

    const labels = this.results.map(r => r.label);
    const votes = this.results.map(r => r.votes);

    this.chart = new Chart(this.chartCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Votes',
            data: votes,
            backgroundColor: [
              '#0d6efd',
              '#198754',
              '#ffc107',
              '#dc3545'
            ]
          }
        ]
      }
    });

  }

}