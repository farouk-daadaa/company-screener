import { Component, OnInit, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CompanyService } from '../../services/company.service';
import { WatchlistService } from '../../services/watchlist.service';
import { Company } from '../../models/company.model';
import { SectorChartComponent } from '../sector-chart/sector-chart.component';
import { WatchlistComponent } from '../watchlist/watchlist.component';

const SECTOR_COLORS: Record<string, { bg: string; color: string }> = {
  'FinTech':       { bg: '#ede9fe', color: '#4f46e5' },
  'Entertainment': { bg: '#d1fae5', color: '#059669' },
  'E-Commerce':    { bg: '#fef3c7', color: '#d97706' },
  'HealthTech':    { bg: '#fee2e2', color: '#dc2626' },
  'Automation':    { bg: '#f3e8ff', color: '#7c3aed' },
};

const DEFAULT_COLOR = { bg: '#f3f4f6', color: '#374151' };

@Component({
  selector: 'app-company-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, SectorChartComponent, WatchlistComponent],
  templateUrl: './company-list.component.html',
  styleUrl: './company-list.component.css'
})
export class CompanyListComponent implements OnInit {
  companies   = signal<Company[]>([]);
  searchTerm  = signal('');
  selectedSector = signal('');
  loading     = signal(true);
  error       = signal('');

  sectors = computed(() => [...new Set(this.companies().map(c => c.sector))].sort());

  countryCount = computed(() => new Set(this.companies().map(c => c.country)).size);

  filtered = computed(() => {
    const term   = this.searchTerm().toLowerCase();
    const sector = this.selectedSector();
    return this.companies().filter(c =>
      (c.name.toLowerCase().includes(term) || c.sector.toLowerCase().includes(term)) &&
      (sector === '' || c.sector === sector)
    );
  });

  constructor(
    private companyService: CompanyService,
    public  watchlistService: WatchlistService
  ) {}

  ngOnInit() {
    this.companyService.getAll().subscribe({
      next:  (data) => { this.companies.set(data); this.loading.set(false); },
      error: ()     => { this.error.set('Failed to load companies.'); this.loading.set(false); }
    });
  }

  toggleWatch(company: Company) {
    this.watchlistService.isWatched(company.id)
      ? this.watchlistService.remove(company.id)
      : this.watchlistService.add(company);
  }

  initials(name: string): string {
    return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  }

  avatarStyle(sector: string) {
    const c = SECTOR_COLORS[sector] ?? DEFAULT_COLOR;
    return { background: c.bg, color: c.color };
  }

  pillStyle(sector: string) {
    const c = SECTOR_COLORS[sector] ?? DEFAULT_COLOR;
    return { background: c.bg, color: c.color };
  }

  scrollToWatchlist() {
    document.getElementById('watchlist-section')?.scrollIntoView({ behavior: 'smooth' });
  }
}