import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { User } from 'src/app/shared/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  /**
   * Will return the copied object of it's own instance.
   *
   * @param obj The object to be copied
   * @returns new object instance
   */
  copyObject(obj: any): any {
    return JSON.parse(JSON.stringify(obj));
  }

  /**
   * Formats the given date object or string. The default format being used is month/day/year.
   *
   * @param value The value to be formatted.
   * @returns The formatted string.
   */
  formatDate(value: Date | string, format = 'MM/dd/yyyy', zone?: string): string {
    if (value === null) {
      return '-';
    }

    let dateValue;
    if (value instanceof Date) {
      dateValue = value;
    } else {
      dateValue = new Date(value);
    }

    return new DatePipe('en-US', zone).transform(dateValue, format);
  }

  /**
   * Determines if the user has access to another user based on their roles.
   *
   * @param accessingUser The user who is trying to access another user's information.
   * @param userToAccess The user whose information is being accessed.
   * @returns A boolean indicating whether the accessing user can access the other user's information.
   */
  canAccessUser(accessingUser: User, userToAccess: User): boolean {
    // return Number(RoleRank[accessingUser.role]) <= Number(RoleRank[userToAccess.role]);
    return true;
  }

  canDeleteUser(accessingUser: User, userToDelete: User): boolean {
    // if (userToDelete.role === Role.SYSTEM) {
    //   return false;
    // }

    // if (accessingUser.role === Role.DEVELOPER) {
    //   return true;
    // }

    // if (accessingUser.role === Role.ADMINISTRATOR) {
    //   return Number(RoleRank[userToDelete.role]) !== Number(RoleRank[Role.DEVELOPER]);
    // }

    return true;
  }

  /**
   * Gets the roles that the accessing user is allowed to create.
   *
   * @param accessingUser The user who is trying to create another user.
   * @returns The roles that the accessing user is allowed to create.
   */
  // getAllowedRolesToCreate(accessingUser: User): Role[] {
  //   if (accessingUser.role === Role.DEVELOPER) {
  //     return [Role.DEVELOPER, Role.ADMINISTRATOR, Role.ADMINISTRATOR_ASSISTANT, Role.TECH, Role.SYSTEM];
  //   }

  //   if (accessingUser.role === Role.ADMINISTRATOR) {
  //     return [Role.ADMINISTRATOR, Role.ADMINISTRATOR_ASSISTANT, Role.TECH];
  //   }

  //   if (accessingUser.role === Role.ADMINISTRATOR_ASSISTANT) {
  //     return [Role.ADMINISTRATOR_ASSISTANT, Role.TECH];
  //   }

  //   return [];
  // }
}
