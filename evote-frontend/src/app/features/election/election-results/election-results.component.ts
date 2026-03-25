import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { ElectionService } from '../../../core/services/election.service';
import { ToastrService } from 'ngx-toastr';

Chart.register(...registerables);

@Component({
  selector: 'app-election-results',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './election-results.component.html',
  styleUrl: './election-results.component.scss',
})
export class ElectionResultsComponent implements OnInit {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef;

  electionId!: number;
  results: any[] = [];
  isLoading = true;
  private chart: Chart | null = null;

  // Palette cohérente avec la charte violet
  private readonly COLORS = [
    '#5B3FD9', '#7B63E0', '#22C55E', '#F59E0B',
    '#3B82F6', '#EF4444', '#8B5CF6', '#06B6D4',
  ];

  constructor(
    private route: ActivatedRoute,
    private electionService: ElectionService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.electionId = Number(this.route.snapshot.paramMap.get('id'));
    this.electionService.getResults(this.electionId).subscribe({
      next: (data) => {
        // Tri décroissant
        this.results = [...data].sort((a, b) => b.voteCount - a.voteCount);
        this.isLoading = false;
        // Le canvas est disponible après le prochain cycle de détection
        setTimeout(() => this.buildChart(), 80);
      },
      error: () => {
        this.toastr.error('Impossible de charger les résultats.');
        this.isLoading = false;
      },
    });
  }

  get totalVotes(): number {
    return this.results.reduce((acc, r) => acc + r.voteCount, 0);
  }

  get winner(): any | null {
    return this.results.length > 0 ? this.results[0] : null;
  }

  getPercent(votes: number): number {
    if (this.totalVotes === 0) return 0;
    return Math.round((votes / this.totalVotes) * 100);
  }

  private buildChart(): void {
    if (!this.chartCanvas || this.results.length === 0) return;

    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }

    const labels = this.results.map((r) => r.optionLabel);
    const votes  = this.results.map((r) => r.voteCount);
    const colors = this.results.map((_, i) => this.COLORS[i % this.COLORS.length]);

    this.chart = new Chart(this.chartCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data: votes,
          backgroundColor: colors,
          borderColor: '#ffffff',
          borderWidth: 3,
          hoverOffset: 8,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        cutout: '62%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              font: { family: "'DM Sans', sans-serif", size: 13, weight: 500 },
              color: '#4A4A6A',
              padding: 16,
              usePointStyle: true,
              pointStyleWidth: 10,
            },
          },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const pct = this.getPercent(ctx.parsed);
                return ` ${ctx.label} : ${ctx.parsed} vote${ctx.parsed > 1 ? 's' : ''} (${pct}%)`;
              },
            },
          },
        },
      },
    });
  }
}