import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CompanyService } from '../../services/company.service';
import { Company } from '../../models/company.model';
import { WatchlistService } from '../../services/watchlist.service';



const SECTOR_COLORS: Record<string, { bg: string; color: string }> = {
  'FinTech':       { bg: '#ede9fe', color: '#4f46e5' },
  'Entertainment': { bg: '#d1fae5', color: '#059669' },
  'E-Commerce':    { bg: '#fef3c7', color: '#d97706' },
  'HealthTech':    { bg: '#fee2e2', color: '#dc2626' },
  'Automation':    { bg: '#f3e8ff', color: '#7c3aed' },
};

const DEFAULT_COLOR = { bg: '#f3f4f6', color: '#374151' };


@Component({
  selector: 'app-company-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './company-detail.component.html',
  styleUrl: './company-detail.component.css'
})
export class CompanyDetailComponent implements OnInit {

  company = signal<Company | null>(null);
  question = signal('');
  answer = signal('');
  aiLoading = signal(false);
  aiError = signal('');
  pageError = signal('');

  constructor(
    private route: ActivatedRoute,
    private companyService: CompanyService,
    public watchlistService: WatchlistService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.companyService.getById(id).subscribe({
      next: (data) => this.company.set(data),
      error: () => this.pageError.set('Company not found.')
    });
  }

  askQuestion() {
    if (!this.question().trim()) return;

    this.aiLoading.set(true);
    this.answer.set('');
    this.aiError.set('');

    const company = this.company();
    if (!company) return;

    const id = company.id;

    this.companyService.ask(id, this.question()).subscribe({
      next: (res) => {
        this.answer.set(res.answer);
        this.aiLoading.set(false);
      },
      error: () => {
        this.aiError.set('AI service is unavailable. Please try again.');
        this.aiLoading.set(false);
      }
    });
  }

  
  initials(name: string): string {
    return name
      .split(' ')
      .map(w => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  // ✅ avatar color based on sector
  avatarStyle(sector: string) {
    const c = SECTOR_COLORS[sector] ?? DEFAULT_COLOR;
    return {
      background: c.bg,
      color: c.color
    };
  }

  // ✅ badge color based on sector
  pillStyle(sector: string) {
    const c = SECTOR_COLORS[sector] ?? DEFAULT_COLOR;
    return {
      background: c.bg,
      color: c.color
    };
  }
}