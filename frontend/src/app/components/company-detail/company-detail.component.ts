import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CompanyService } from '../../services/company.service';
import { Company } from '../../models/company.model';

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
    private companyService: CompanyService
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

    const id = this.company()!.id;
    this.companyService.ask(id, this.question()).subscribe({
      next: (res) => { this.answer.set(res.answer); this.aiLoading.set(false); },
      error: () => { this.aiError.set('AI service is unavailable. Please try again.'); this.aiLoading.set(false); }
    });
  }
}