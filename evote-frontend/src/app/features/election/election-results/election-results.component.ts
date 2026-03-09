import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Chart } from 'chart.js/auto';
import { ElectionService } from '../../../core/services/election.service';

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

  constructor(
    private route: ActivatedRoute,
    private electionService: ElectionService
  ) {}

  ngOnInit(): void {

    this.electionId = Number(this.route.snapshot.paramMap.get('id'));

    this.electionService.getResults(this.electionId).subscribe({

      next: (data) => {

        this.results = data;

        setTimeout(() => {
          this.createChart();
        });

      },

      error: err => console.error(err)

    });

  }

  createChart() {

    const labels = this.results.map(r => r.label);
    const votes = this.results.map(r => r.votes);

    new Chart(this.chartCanvas.nativeElement, {

      type: 'doughnut',

      data: {

        labels: labels,

        datasets: [

          {
            data: votes,
            backgroundColor: [
              '#3b82f6',
              '#22c55e',
              '#f59e0b',
              '#ef4444',
              '#8b5cf6'
            ]
          }

        ]

      },

      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }

    });

  }

}