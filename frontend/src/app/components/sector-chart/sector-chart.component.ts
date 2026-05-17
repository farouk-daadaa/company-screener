import { Component, OnInit, OnDestroy, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyService } from '../../services/company.service';
import { Chart, BarController, CategoryScale, LinearScale, BarElement, Tooltip, Legend, ArcElement, PieController } from 'chart.js';

Chart.register(BarController, CategoryScale, LinearScale, BarElement, Tooltip, Legend, ArcElement, PieController);

@Component({
  selector: 'app-sector-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chart-box">
      <h2>📊 Companies by Sector</h2>
      <div *ngIf="loading()" class="loading">Loading chart...</div>
      <canvas *ngIf="!loading()" id="sectorChart" height="300"></canvas>
    </div>
  `,
  styles: [`
    .chart-box {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      margin-top: 40px;
    }
    h2 { margin-bottom: 20px; }
  `]
})
export class SectorChartComponent implements OnInit, OnDestroy {
  loading = signal(true);
  private chart: Chart | null = null;

  constructor(private companyService: CompanyService) {}

  ngOnInit() {
    this.companyService.getAll().subscribe({
      next: (companies) => {
        // Count companies per sector
        const sectorMap: Record<string, number> = {};
        companies.forEach(c => {
          sectorMap[c.sector] = (sectorMap[c.sector] || 0) + 1;
        });

        this.loading.set(false);

        // Wait for canvas to render
        setTimeout(() => this.buildChart(sectorMap), 50);
      },
      error: () => this.loading.set(false)
    });
  }

  private buildChart(sectorMap: Record<string, number>) {
    const canvas = document.getElementById('sectorChart') as HTMLCanvasElement;
    if (!canvas) return;

    const labels = Object.keys(sectorMap);
    const data = Object.values(sectorMap);
    const colors = ['#4f46e5','#7c3aed','#2563eb','#0891b2','#059669','#d97706','#dc2626','#db2777'];

    this.chart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Number of Companies',
          data,
          backgroundColor: colors.slice(0, labels.length),
          borderRadius: 6,
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
      }
    });
  }

  ngOnDestroy() {
    this.chart?.destroy();
  }
}