import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { GithubIssue } from 'src/app/shared/models/github.model';
import { RequestService } from '../request/request.service';

@Injectable({
  providedIn: 'root',
})
export class GitIssueService {
  private readonly requestService = inject(RequestService);


  /**
   * Gets the issues from the GitHub project
   *
   * @returns An observable that emits the list of issues from the GitHub project
   */
  get(orgCode: string): Observable<GithubIssue[]> {
    return this.requestService.get(`v1/github/${orgCode}`);
  }

  /**
   * Create a new issue in the GitHub repository
   *
   * @param issue The issue object containing the details of the issue to be created
   * @returns An observable that emits the response from the GitHub API
   */
  create(issue: GithubIssue): Observable<void> {
    return this.requestService.post<void>(`v1/github`, issue);
  }
}
