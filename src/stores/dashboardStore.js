import { atom } from 'nanostores';
import { DEFAULT_LAYOUT_DASHBOARD } from '../constants/generalConstants';

export const dashboardLayoutStore = atom(null);

export const dashboardLayoutActions = {
  saveLayout: (userId, layout) => {
    try {
      const layouts = JSON.parse(
        localStorage.getItem('dashboardLayouts') || '{}'
      );
      layouts[userId] = layout;
      localStorage.setItem('dashboardLayouts', JSON.stringify(layouts));
      dashboardLayoutStore.set(layout);
    } catch (error) {
      console.error('Error saving layout:', error);
    }
  },

  loadLayout: (userId) => {
    try {
      const layouts = JSON.parse(
        localStorage.getItem('dashboardLayouts') || '{}'
      );
      const userLayout = layouts[userId] || DEFAULT_LAYOUT_DASHBOARD;
      dashboardLayoutStore.set(userLayout);
      return userLayout;
    } catch (error) {
      console.error('Error loading layout:', error);
      dashboardLayoutStore.set(DEFAULT_LAYOUT_DASHBOARD);
      return DEFAULT_LAYOUT_DASHBOARD;
    }
  },

  resetLayout: (userId) => {
    try {
      dashboardLayoutActions.saveLayout(userId, DEFAULT_LAYOUT_DASHBOARD);
    } catch (error) {
      console.error('Error resetting layout:', error);
    }
  },

  clearAllLayouts: () => {
    try {
      localStorage.removeItem('dashboardLayouts');
      dashboardLayoutStore.set(null);
    } catch (error) {
      console.error('Error clearing layouts:', error);
    }
  },
};
