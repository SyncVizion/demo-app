export interface GithubIssue {
  title: string;
  body: string;
  status?: string;
  labels?: string[];
  type?: string;
  createdUser?: string;
  createdUserId?: number;
  createdDate?: Date;
}
