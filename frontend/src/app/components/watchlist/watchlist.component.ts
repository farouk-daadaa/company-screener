import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { WatchlistService } from '../../services/watchlist.service';

@Component({
  selector: 'app-watchlist',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="watchlist-box">
      <div class="watchlist-header" (click)="open.set(!open())">
        <h2>⭐ Watchlist ({{ watchlistService.companies().length }})</h2>
        <span>{{ open() ? '▲' : '▼' }}</span>
      </div>

      <div *ngIf="open()">
        <p *ngIf="watchlistService.companies().length === 0" class="empty">
          No companies saved yet. Click ⭐ on a company to add it.
        </p>
        <div class="watchlist-items">
          <div class="watchlist-item" *ngFor="let c of watchlistService.companies()">
            <span><strong>{{ c.name }}</strong> — {{ c.sector }}, {{ c.country }}</span>
            <div class="watchlist-actions">
              <a [routerLink]="['/company', c.id]" class="btn-view">View</a>
              <button class="btn-remove" (click)="watchlistService.remove(c.id)">Remove</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .watchlist-box {
      background: white;
      border-radius: 12px;
      padding: 20px 24px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      margin-top: 32px;
    }
    .watchlist-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      user-select: none;
    }
    .watchlist-header h2 { margin: 0; }
    .empty { color: #888; padding: 12px 0; }
    .watchlist-items { margin-top: 16px; display: flex; flex-direction: column; gap: 10px; }
    .watchlist-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 14px;
      background: #f8f8ff;
      border-radius: 8px;
    }
    .watchlist-actions { display: flex; gap: 8px; }
    .btn-view {
      background: #4f46e5; color: white; padding: 5px 12px;
      border-radius: 6px; text-decoration: none; font-size: 0.85rem;
    }
    .btn-remove {
      background: #fee2e2; color: #dc2626; border: none;
      padding: 5px 12px; border-radius: 6px; cursor: pointer; font-size: 0.85rem;
    }
    .btn-remove:hover { background: #fecaca; }
  `]
})
export class WatchlistComponent {
  open = signal(true);
  constructor(public watchlistService: WatchlistService) {}
}