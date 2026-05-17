import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/company-list/company-list.component')
        .then(m => m.CompanyListComponent)
  },
  {
    path: 'company/:id',
    loadComponent: () =>
      import('./components/company-detail/company-detail.component')
        .then(m => m.CompanyDetailComponent)
  },
  { path: '**', redirectTo: '' }
];