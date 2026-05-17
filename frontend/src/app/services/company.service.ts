import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Company } from '../models/company.model';

@Injectable({ providedIn: 'root' })
export class CompanyService {
  private api = 'http://localhost:8080/api/companies';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Company[]> {
    return this.http.get<Company[]>(this.api);
  }

  getById(id: number): Observable<Company> {
    return this.http.get<Company>(`${this.api}/${id}`);
  }

  ask(id: number, question: string): Observable<{ answer: string }> {
    return this.http.post<{ answer: string }>(`${this.api}/${id}/ask`, { question });
  }
}