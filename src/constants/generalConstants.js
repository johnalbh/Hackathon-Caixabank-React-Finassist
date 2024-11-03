export const APP_CONFIG = {
  DEFAULT_LANGUAGE: 'en',
};

export const TIME_SIMULATE_LOADING = {
  LOADING_DELAY: 300,
};

export const CONTACTS_CONFIG = {
  DEFAULT_CONTACTS: 5,
  MAX_CONTACTS: 10,
  AVATAR_SIZE: 56, //px
  REFRESH_INTERVAL: 300000,
};

export const TRANSACTIONS_CONFIG = {
  NUMBER_OF_RECENT_TRANSACTIONS: 5,
  MAX_TRANSACTIONS_HISTORY: 100,
  TRANSACTION_CACHE_TIME: 3600000,
};

export const DEFAULT_LAYOUT_DASHBOARD = {
  lg: [
    {
      w: 4,
      h: 3,
      x: 0,
      y: 0,
      i: 'income',
      minW: 3,
      maxW: 4,
      moved: false,
      static: false,
    },
    {
      w: 4,
      h: 3,
      x: 4,
      y: 0,
      i: 'expenses',
      minW: 3,
      maxW: 4,
      moved: false,
      static: false,
    },
    {
      w: 4,
      h: 3,
      x: 8,
      y: 0,
      i: 'balance',
      minW: 3,
      maxW: 4,
      moved: false,
      static: false,
    },
    {
      w: 6,
      h: 10,
      x: 0,
      y: 12,
      i: 'statistics',
      minW: 4,
      moved: false,
      static: false,
    },
    {
      w: 6,
      h: 10,
      x: 6,
      y: 12,
      i: 'recommendations',
      minW: 4,
      moved: false,
      static: false,
    },
    {
      w: 6,
      h: 9,
      x: 0,
      y: 3,
      i: 'analysisGraph',
      minW: 4,
      moved: false,
      static: false,
    },
    {
      w: 6,
      h: 9,
      x: 6,
      y: 3,
      i: 'balanceOverTime',
      minW: 4,
      moved: false,
      static: false,
    },
    {
      w: 12,
      h: 9,
      x: 0,
      y: 22,
      i: 'recentTransactions',
      minW: 6,
      moved: false,
      static: false,
    },
  ],
};
