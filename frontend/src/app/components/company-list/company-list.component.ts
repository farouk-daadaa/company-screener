import { Component, OnInit, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CompanyService } from '../../services/company.service';
import { Company } from '../../models/company.model';

@Component({
  selector: 'app-company-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './company-list.component.html',
  styleUrl: './company-list.component.css'
})
export class CompanyListComponent implements OnInit {
  companies = signal<Company[]>([]);
  searchTerm = signal('');
  loading = signal(true);
  error = signal('');

  filtered = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.companies().filter(c =>
      c.name.toLowerCase().includes(term) ||
      c.sector.toLowerCase().includes(term)
    );
  });

  constructor(private companyService: CompanyService) {}

  ngOnInit() {
    this.companyService.getAll().subscribe({
      next: (data) => { this.companies.set(data); this.loading.set(false); },
      error: () => { this.error.set('Failed to load companies.'); this.loading.set(false); }
    });
  }
}