import { Injectable, signal, computed } from '@angular/core';
import { Company } from '../models/company.model';

@Injectable({ providedIn: 'root' })
export class WatchlistService {
  private readonly STORAGE_KEY = 'company_watchlist';

  // Load from localStorage on startup
  private watchlist = signal<Company[]>(this.loadFromStorage());

  readonly companies = computed(() => this.watchlist());
  readonly ids = computed(() => this.watchlist().map(c => c.id));

  add(company: Company) {
    if (this.ids().includes(company.id)) return;
    const updated = [...this.watchlist(), company];
    this.watchlist.set(updated);
    this.saveToStorage(updated);
  }

  remove(id: number) {
    const updated = this.watchlist().filter(c => c.id !== id);
    this.watchlist.set(updated);
    this.saveToStorage(updated);
  }

  isWatched(id: number): boolean {
    return this.ids().includes(id);
  }

  private loadFromStorage(): Company[] {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  }

  private saveToStorage(companies: Company[]) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(companies));
  }
}