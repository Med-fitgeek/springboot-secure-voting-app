import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ElectionRequest } from '../../shared/models/election-request.model';
import { ElectionResponse } from '../../shared/models/election-response.model';
import { VoterToken } from '../../shared/models/voter-token.model';
import { VoteRequest } from '../../shared/models/vote-request.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ElectionService {

  private readonly serviceUrl = `${environment.apiUrl}/elections`

  constructor(private http: HttpClient) {}

  createElection(request: ElectionRequest): Observable<VoterToken[]> {
    return this.http.post<VoterToken[]>(`${this.serviceUrl}`, request);
  }

  getElections(): Observable<ElectionResponse[]> {
    return this.http.get<ElectionResponse[]>(`${this.serviceUrl}`);
  }

  getElection(id: number): Observable<ElectionResponse> {
    return this.http.get<ElectionResponse>(`${this.serviceUrl}/${id}`);
  }

  updateElection(id: number, request: ElectionRequest): Observable<any> {
    return this.http.put(`${this.serviceUrl}/${id}`, request);
  }

  deleteElection(id: number): Observable<void> {
    return this.http.delete<void>(`${this.serviceUrl}/${id}`);
  }

  getResults(id: number): Observable<any> {
    return this.http.get(`${this.serviceUrl}/${id}/results`);
  }

  vote(request: VoteRequest): Observable<any> {
    return this.http.post(`/api/vote`, request);
  }

  getElectionForVote(token: string): Observable<any> {
    return this.http.get(`/api/vote/${token}`);
  }

  uploadVoters(file: File) {

    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<any[]>('/api/elections/upload-voters', formData);

  }
}