import { Role, User } from './user.model';

export class UserAccess {
  readonly user: User;
  readonly accessibleRoles: Role[];
  readonly features: Map<string, string>;

  get userId(): number {
    return this.user.id;
  }

  get fullName(): string {
    return `${this.user.firstName} ${this.user.lastName}`;
  }

  constructor(userAccess: UserAccess) {
    Object.assign(this, userAccess);
  }
}
