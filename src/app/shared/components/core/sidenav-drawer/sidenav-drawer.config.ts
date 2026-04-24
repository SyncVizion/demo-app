import { Access, App, FeatureType } from 'src/app/shared/models/common.model';

export interface NavItem extends NavItemDetails {
  submenu?: {
    id: string;
    items: NavItem[];
  };
}

export interface NavItemDetails {
  id: string;
  name: string;
  icon?: any;
  route?: string;
  href?: string;
  restriction?: FeatureRestriction;
}

export interface FeatureRestriction {
  app: App;
  feature?: FeatureType;
  access?: Access;
}

export const NAVIGATION_ROUTES: NavItem[] = [
  {
    id: 'access-manager',
    name: 'Access Manager',
    icon: 'lock',
    route: '/access-manager',
    restriction: {
      app: App.ACCESS_MANAGER,
    },
    submenu: {
      id: 'accessManagerDropdown',
      items: [
        {
          id: 'applications',
          name: 'Applications',
          route: '/applications',
        },
        {
          id: 'features',
          name: 'Features',
          route: '/features',
        },
      ],
    },
  },
  {
    id: 'accounts',
    name: 'Accounts',
    icon: 'source_environment',
    route: '/accounts',
    restriction: {
      app: App.ACCOUNTS,
      feature: FeatureType.OVERVIEW,
    },
  },
  {
    id: 'jobs',
    name: 'Jobs',
    icon: 'engineering',
    route: '/jobs',
    restriction: {
      app: App.ACCOUNTS,
      feature: FeatureType.OVERVIEW,
    },
  },
  {
    id: 'custom-fields',
    name: 'Custom Fields',
    icon: 'contextual_token_add',
    route: '/custom-fields',
    restriction: {
      app: App.CUSTOM_FIELDS,
      feature: FeatureType.OVERVIEW,
    },
  },
  {
    id: 'contacts',
    name: 'Contacts',
    icon: 'contact_page',
    route: '/contacts',
    restriction: {
      app: App.CONTACTS,
      feature: FeatureType.OVERVIEW,
    },
  },
  {
    id: 'user-management',
    name: 'User Management',
    icon: 'group',
    route: '/user-management',
    restriction: {
      app: App.USER_MANAGEMENT,
      feature: FeatureType.OVERVIEW,
    },
    submenu: {
      id: 'customFormDropdown',
      items: [
        {
          id: 'users',
          name: 'Users',
          route: '/users',
          restriction: {
            app: App.USER_MANAGEMENT,
            feature: FeatureType.USERS,
          },
        },
        {
          id: 'roles',
          name: 'Roles',
          route: '/roles',
          restriction: {
            app: App.USER_MANAGEMENT,
            feature: FeatureType.ROLES,
          },
        },
        {
          id: 'groups',
          name: 'Groups',
          route: '/groups',
          restriction: {
            app: App.USER_MANAGEMENT,
            feature: FeatureType.GROUPS,
          },
        },
      ],
    },
  },
  {
    id: 'schedule',
    name: 'Schedule',
    icon: 'schedule',
    route: '/schedule',
    restriction: {
      app: App.SCHEDULE,
      feature: FeatureType.OVERVIEW,
    },
    submenu: {
      id: 'customFormDropdown',
      items: [
        {
          id: 'team-schedules',
          name: 'Team Schedules',
          route: '/team',
          restriction: {
            app: App.SCHEDULE,
            feature: FeatureType.OVERVIEW,
          },
        },
        {
          id: 'calendar',
          name: 'Calendar',
          route: '/calendar',
          restriction: {
            app: App.SCHEDULE,
            feature: FeatureType.OVERVIEW,
          },
        },
      ],
    },
  },
  {
    id: 'check-in',
    name: 'Check In',
    icon: 'list_alt_check',
    route: '/check-in',
    restriction: {
      app: App.CHECK_IN,
      feature: FeatureType.OVERVIEW,
    },
  },
  {
    id: 'inventory',
    name: 'Inventory',
    icon: 'warehouse',
    route: '/inventory',
    restriction: {
      app: App.INVENTORY,
      feature: FeatureType.OVERVIEW,
    },
    submenu: {
      id: 'customFormDropdown',
      items: [
        {
          id: 'assets',
          name: 'Assets',
          route: '/assets',
        },
        {
          id: 'locations',
          name: 'Locations',
          route: '/locations',
        },
        {
          id: 'workflows',
          name: 'Workflows',
          route: '/workflows',
          restriction: {
            app: App.INVENTORY,
            feature: FeatureType.WORKFLOWS,
          },
        },
      ],
    },
  },
  {
    id: 'custom-form',
    name: 'Custom Forms',
    icon: 'analytics',
    route: '/custom',
    restriction: {
      app: App.CUSTOM,
    },
    submenu: {
      id: 'customFormDropdown',
      items: [
        {
          id: 'formBuilder',
          name: 'Form Builder',
          route: '/form-builder',
          restriction: {
            app: App.CUSTOM,
            feature: FeatureType.FORM_BUILDER,
          },
        },
        {
          id: 'reportBuilder',
          name: 'Report Builder',
          route: '/report-builder',
          restriction: {
            app: App.CUSTOM,
            feature: FeatureType.REPORT_BUILDER,
          },
        },
        // {
        //   id: 'pdfBuilder',
        //   name: 'PDF Builder',
        //   route: '/pdf-builder',
        //   restriction: {
        //     app: App.CUSTOM,
        //     feature: FeatureType.PDF_BUILDER,
        //   },
        // },
      ],
    },
  },
  {
    id: 'quickbooks',
    name: 'Quickbooks',
    icon: 'account_tree',
    route: '/quickbooks',
    restriction: {
      app: App.QUICKBOOKS,
    },
  },
  {
    id: 'xero',
    name: 'Xero',
    icon: 'account_tree',
    route: '/xero',
    restriction: {
      app: App.XERO,
    },
  },
  {
    id: 'helpCenter',
    name: 'Help Center',
    icon: 'forum',
    route: '/help-center',
    restriction: {
      app: App.HELP_CENTER,
    },
  },
  {
    id: 'email',
    name: 'Email',
    icon: 'mail',
    route: '/email',
    restriction: {
      app: App.EMAIL,
    },
  },
];
