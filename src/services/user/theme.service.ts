import { BehaviorSubject, Observable } from 'rxjs';
import { AppTheme } from 'src/app/shared/models/user.model';

export class ThemeService {
  private static readonly _theme: BehaviorSubject<AppTheme | null> = new BehaviorSubject(null);
  static readonly theme$: Observable<AppTheme | null> = ThemeService._theme.asObservable();

  /**
   * Toggles the application theme between LIGHT and DARK. It updates the document body class and returns the new theme.
   *
   * @returns The new theme after toggling.
   */
  static toggleTheme(): AppTheme {
    const currentTheme = document.body.classList.contains(AppTheme.DARK) ? AppTheme.DARK : AppTheme.LIGHT;
    const newTheme = currentTheme === AppTheme.DARK ? AppTheme.LIGHT : AppTheme.DARK;
    this.setTheme(newTheme);
    return newTheme;
  }

  /**
   * Sets the application theme by updating the document body class. It removes any existing theme classes and adds the new theme class.
   *
   * @param theme The theme to set (either LIGHT or DARK).
   */
  static setTheme(theme: AppTheme) {
    document.body.classList.remove(AppTheme.LIGHT, AppTheme.DARK);
    document.body.classList.add(theme);
    this._theme.next(theme);
  }
}
