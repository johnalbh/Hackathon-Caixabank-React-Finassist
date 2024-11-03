import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Shepherd from 'shepherd.js';
import 'shepherd.js/dist/css/shepherd.css';

const TourGuide = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const initTour = () => {
    const tour = new Shepherd.Tour({
      useModalOverlay: true,
      defaultStepOptions: {
        classes: 'shadow-md bg-purple-dark',
        scrollTo: true,
        cancelIcon: {
          enabled: true,
        },
      },
    });

    tour.addStep({
      id: 'dashboard-welcome',
      text: "Welcome to your financial dashboard! Let's take a quick tour.",
      attachTo: {
        element: '[data-tour="dashboard-header"]',
        on: 'bottom',
      },
      advanceOn: { selector: '.shepherd-button', event: 'click' },
      showOn: () => location.pathname === '/',
      beforeShowPromise: function () {
        if (location.pathname !== '/') {
          navigate('/');
          return new Promise((resolve) => setTimeout(resolve, 300));
        }
      },
      buttons: [
        {
          text: 'Next',
          action() {
            this.next();
          },
        },
      ],
    });

    tour.addStep({
      id: 'dashboard-widgets',
      text: 'These widgets show your key financial metrics. You can drag and drop them to customize your layout!',
      attachTo: {
        element: '.layout',
        on: 'bottom',
      },
      showOn: () => location.pathname === '/',
      buttons: [
        {
          text: 'Back',
          action() {
            this.back();
          },
        },
        {
          text: 'Next',
          action() {
            this.next();
          },
        },
      ],
    });

    tour.addStep({
      id: 'dashboard-reset',
      text: 'You can always reset the layout to default using this button.',
      attachTo: {
        element: '[data-tour="reset-layout"]',
        on: 'bottom',
      },
      showOn: () => location.pathname === '/',
      buttons: [
        {
          text: 'Back',
          action() {
            this.back();
          },
        },
        {
          text: 'Next',
          action() {
            navigate('/transactions');
            setTimeout(() => {
              this.next();
            }, 300);
          },
        },
      ],
    });

    tour.addStep({
      id: 'transactions-welcome',
      text: 'Here you can manage all your transactions.',
      attachTo: {
        element: '[data-tour="transactions-header"]',
        on: 'bottom',
      },
      showOn: () => location.pathname === '/transactions',
      beforeShowPromise: function () {
        if (location.pathname !== '/transactions') {
          navigate('/transactions');
          return new Promise((resolve) => setTimeout(resolve, 300));
        }
      },
      buttons: [
        {
          text: 'Back',
          action() {
            navigate('/');
            setTimeout(() => {
              this.back();
            }, 300);
          },
        },
        {
          text: 'Next',
          action() {
            this.next();
          },
        },
      ],
    });

    tour.addStep({
      id: 'add-transaction',
      text: 'Click here to add a new transaction.',
      attachTo: {
        element: '[data-tour="add-transaction"]',
        on: 'bottom',
      },
      showOn: () => location.pathname === '/transactions',
      buttons: [
        {
          text: 'Back',
          action() {
            this.back();
          },
        },
        {
          text: 'Next',
          action() {
            this.next();
          },
        },
      ],
    });

    tour.addStep({
      id: 'filter-controls',
      text: 'Use these controls to filter and sort your transactions.',
      attachTo: {
        element: '[data-tour="filter-controls"]',
        on: 'bottom',
      },
      showOn: () => location.pathname === '/transactions',
      buttons: [
        {
          text: 'Back',
          action() {
            this.back();
          },
        },
        {
          text: 'Next',
          action() {
            navigate('/settings');
            setTimeout(() => {
              this.next();
            }, 300);
          },
        },
      ],
    });
    tour.addStep({
      id: 'settings-welcome',
      text: 'Configure your budget settings and preferences here.',
      attachTo: {
        element: '[data-tour="settings-header"]',
        on: 'bottom',
      },
      showOn: () => location.pathname === '/settings',
      beforeShowPromise: function () {
        if (location.pathname !== '/settings') {
          navigate('/settings');
          return new Promise((resolve) => setTimeout(resolve, 300));
        }
      },
      buttons: [
        {
          text: 'Back',
          action() {
            navigate('/transactions');
            setTimeout(() => {
              this.back();
            }, 300);
          },
        },
        {
          text: 'Next',
          action() {
            this.next();
          },
        },
      ],
    });

    tour.addStep({
      id: 'budget-limits',
      text: 'Set your total budget limit and individual category limits.',
      attachTo: {
        element: '[data-tour="budget-limits"]',
        on: 'bottom',
      },
      showOn: () => location.pathname === '/settings',
      buttons: [
        {
          text: 'Back',
          action() {
            this.back();
          },
        },
        {
          text: 'Next',
          action() {
            this.next();
          },
        },
      ],
    });

    tour.addStep({
      id: 'alerts-toggle',
      text: 'Enable alerts to get notified when you exceed your budget.',
      attachTo: {
        element: '[data-tour="alerts-toggle"]',
        on: 'bottom',
      },
      showOn: () => location.pathname === '/settings',
      buttons: [
        {
          text: 'Back',
          action() {
            this.back();
          },
        },
        {
          text: 'Done',
          action() {
            this.complete();
            navigate('/');
          },
        },
      ],
    });

    return tour;
  };

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('hasSeenTour');
    if (!hasSeenTour) {
      const tour = initTour();
      setTimeout(() => {
        tour.start();
      }, 500);
      localStorage.setItem('hasSeenTour', 'true');
    }
  }, []);

  // Expose startTour to parent components
  if (window) {
    window.startTour = () => {
      const tour = initTour();
      tour.start();
    };
  }

  return null;
};

export default TourGuide;
