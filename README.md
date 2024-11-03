## 🚀 Key Features

- **Interactive Tour Guide**: A comprehensive guided tour that helps new users discover and understand all features of the application. The tour:

  - Automatically starts for first-time users
  - Can be restarted anytime via the "Start Tour" button
  - Guides users through Dashboard, Transactions, and Settings pages
  - Features smooth transitions and visual indicators

- **Drag & Drop Dashboard**:

  - Fully customizable widget layout
  - Drag and reposition widgets according to preference
  - Resizable widgets for better visualization
  - Layout persistence between sessions
  - Reset layout option available

- **Local Storage Persistence**:

  - User authentication state
  - Dashboard layout configuration
  - User preferences and settings
  - Tour completion status
  - Budget alerts and notifications

- **Demo Data Generation**:
  - Random transaction data generation
  - Demo budget settings
  - Sample category allocations
  - Realistic financial scenarios
  - Quick data population for testing

## 📂 Repository Structure

```bash
hackathon-caixabank-frontend-react-finassist/
├── [Detailed_info.md](http://_vscodecontentref_/#%7B%22uri%22%3A%7B%22%24mid%22%3A1%2C%22fsPath%22%3A%22%2FUsers%2Fjohnalbh%2FPersonalProjects%2Fhackathon-caixabank-frontend-react-finassist%2FDetailed_info.md%22%2C%22path%22%3A%22%2FUsers%2Fjohnalbh%2FPersonalProjects%2Fhackathon-caixabank-frontend-react-finassist%2FDetailed_info.md%22%2C%22scheme%22%3A%22file%22%7D%7D)
├── [package.json](http://_vscodecontentref_/#%7B%22uri%22%3A%7B%22%24mid%22%3A1%2C%22fsPath%22%3A%22%2FUsers%2Fjohnalbh%2FPersonalProjects%2Fhackathon-caixabank-frontend-react-finassist%2Fpackage.json%22%2C%22path%22%3A%22%2FUsers%2Fjohnalbh%2FPersonalProjects%2Fhackathon-caixabank-frontend-react-finassist%2Fpackage.json%22%2C%22scheme%22%3A%22file%22%7D%7D)
├── [package-lock.json](http://_vscodecontentref_/#%7B%22uri%22%3A%7B%22%24mid%22%3A1%2C%22fsPath%22%3A%22%2FUsers%2Fjohnalbh%2FPersonalProjects%2Fhackathon-caixabank-frontend-react-finassist%2Fpackage-lock.json%22%2C%22path%22%3A%22%2FUsers%2Fjohnalbh%2FPersonalProjects%2Fhackathon-caixabank-frontend-react-finassist%2Fpackage-lock.json%22%2C%22scheme%22%3A%22file%22%7D%7D)
├── public
│   ├── favicon.ico
│   ├── index.html
│   ├── logo192.png
│   ├── logo512.png
│   ├── manifest.json
│   └── robots.txt
├── [README.md](http://_vscodecontentref_/#%7B%22uri%22%3A%7B%22%24mid%22%3A1%2C%22fsPath%22%3A%22%2FUsers%2Fjohnalbh%2FPersonalProjects%2Fhackathon-caixabank-frontend-react-finassist%2FREADME.md%22%2C%22path%22%3A%22%2FUsers%2Fjohnalbh%2FPersonalProjects%2Fhackathon-caixabank-frontend-react-finassist%2FREADME.md%22%2C%22scheme%22%3A%22file%22%7D%7D)
└── src
    ├── App.css
    ├── App.js
    ├── App.test.js
    ├── assets
    ├── components
    │   ├── Dashboard.js       # Drag & Drop dashboard implementation
    │   ├── TourGuide.js       # Interactive tour implementation
    │   ├── TransactionList.js # Transaction management with demo data
    │   ├── Settings.js        # Settings with demo configuration
    │   ├── LoginPage.js       # User login page
    │   ├── RegisterPage.js    # User registration page
    │   ├── ProtectedRoute.js  # Route protection for authenticated users
    │   ├── BudgetAlert.js     # Budget alerts and notifications
    │   ├── AlertBanner.js     # Banner for displaying alerts
    │   ├── SupportPage.js     # Support page with external API handling
    │   ├── RecentTransactions.js # Display recent transactions
    │   ├── Recommendations.js # Display financial recommendations
    │   ├── AnalysisGraph.js   # Data visualization and graphs
    │   ├── Footer.js          # Footer component
    │   ├── Navbar.js          # Navbar component
    │   ├── Statistics.js      # Display financial statistics
    │   ├── BalanceOverTime.js # Display balance over time
    │   ├── MonthlyChart.js    # Monthly financial chart
    │   ├── NotificationPopup.js # Popup for notifications
    │   ├── TransactionForm.js # Form for managing transactions
    │   ├── ForgotPasswordPage.js # Password recovery page
    │   ├── ExportButton.js    # Button for exporting data
    │   └── [other components]
    ├── constants
    ├── stores
    │   ├── authStore.js       # Authentication state management
    │   ├── dashboardStore.js  # Layout persistence
    │   ├── transactionStore.js # Transaction state management
    │   ├── budgetAlertStore.js # Budget alerts state management
    │   └── [other stores]
    ├── theme.js
    ├── utils
    └── __tests__
        ├── App.test.js
        ├── LoginPage.test.js
        ├── RegisterPage.test.js
        ├── ProtectedRoute.test.js
        ├── BudgetAlert.test.js
        ├── AlertBanner.test.js
        ├── SupportPage.test.js
        ├── RecentTransactions.test.js
        ├── Recommendations.test.js
        ├── AnalysisGraph.test.js
        ├── Footer.test.js
        ├── Navbar.test.js
        ├── Statistics.test.js
        ├── BalanceOverTime.test.js
        ├── MonthlyChart.test.js
        ├── NotificationPopup.test.js
        ├── TransactionForm.test.js
        ├── ForgotPasswordPage.test.js
        ├── ExportButton.test.js
        └── [other tests]
```

🎯 Tasks
Task1: Transaction Management (CRUD)
Task2: Budget Management and Alerts
Task3: Design and Layout with Material UI
Task4: Conditional Rendering
Task5: External API Handling
Task6: Componentization and Reusability
Task7: State Management with Nanostores
Task8: Data Visualization and Graphs
Task9: Unit and Integration Testing
Task10: Performance Optimization
Task11: Notifications and Alerts
Task12: Authentication and Route Protection
Task13: Password Recovery
Task14: Footer and Navbar
Task15: Utilities and Helpers
📑 Detailed information about tasks
You will find more detailed information about each of the tasks in the file Detailed_info.md.

💫 Guides
⚠️As this is a hackathon, with more time than usual and we are competing, we have created a long challenge. It is crucial to get the app working in order to correct it, so it is important to manage time well and prioritise rather than trying to get everything done and the app not working when it is corrected.⚠️

General information
As this challenge is part of a hackathon, participants are free to modify anything they need to implement their solution. There are no limits of any kind, neither technological nor visual.

A deployed website with all the functionalities to be created is provided so that participants have a clear reference of the expected performance.

Key implemented features include:

Comprehensive interactive tour guide for new users
Drag & drop dashboard with layout persistence
Local storage for user data and preferences
Demo data generation in Transactions and Settings
Dynamic widget system with real-time updates
Responsive Material UI implementation
Performance optimized components
The code provides a basis on which to work, and also contains comments that may be useful.

📤 Submission
Solve the proposed tasks.
Continuously push the changes you have made.
The last commit will be the one to be taken into account for manual correction.

```

```
