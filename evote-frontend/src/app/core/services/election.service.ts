import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ElectionRequest } from '../../shared/models/election-request.model';
import { ElectionResponse } from '../../shared/models/election-response.model';
import { VoterToken } from '../../shared/models/voter-token.model';
import { VoteRequest } from '../../shared/models/vote-request.model';

@Injectable({
  providedIn: 'root'
})
export class ElectionService {

  private readonly API_URL = '/api/elections';

  constructor(private http: HttpClient) {}

  createElection(request: ElectionRequest): Observable<VoterToken[]> {
    return this.http.post<VoterToken[]>(`${this.API_URL}`, request);
  }

  getElections(): Observable<ElectionResponse[]> {
    return this.http.get<ElectionResponse[]>(`${this.API_URL}`);
  }

  getElection(id: number): Observable<ElectionResponse> {
    return this.http.get<ElectionResponse>(`${this.API_URL}/${id}`);
  }

  updateElection(id: number, request: ElectionRequest): Observable<any> {
    return this.http.put(`${this.API_URL}/${id}`, request);
  }

  deleteElection(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  getResults(id: number): Observable<any> {
    return this.http.get(`${this.API_URL}/${id}/results`);
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