# _Daily Expense Tracker_

This is a simple web application designed to help users track their daily expenses. It allows users to log in using their Google account for data privacy and security. The application provides features to add and remove expense items, displaying a list of items along with the total expenses incurred. The data is stored in a real-time database using Firebase, ensuring seamless updates and access across devices.

## Features
- **Google Sign-In:** Users can sign in securely using their Google account to access the expense tracking functionality.
- **Add Expense:** Users can add new expense items along with their respective costs.
- **Remove Expense:** Users can remove items from the expense list (by **double clicking** on the item), useful for correcting mistakes or removing outdated entries.
- **Real-time Updates:** The application utilizes Firebase real-time database to ensure that any changes made to the expense list are immediately reflected across all devices.
- **Responsive Design:** The application is designed to be responsive, providing an optimal viewing and interaction experience for both mobile and desktop users.

## Technologies Used
- HTML: Used for structuring the web page.
- CSS: Used for styling the user interface.
- JavaScript: Used for implementing interactive features and functionality.
- Firebase: Used for user authentication and real-time data storage.

## Usage
1. **Sign In:** Click on the "Continue with Google" button to sign in with your Google account.
2. **Add Expense:** Enter the item name and its cost, then click on the "Add Expense" button to add it to the list.
3. **Remove Expense:** Double click on an item in the list to remove it.
4. **Logout:** Click on the "Logout" button to sign out of your Google account and exit the application.

## Installation
To install and run this application locally, follow these steps:
1. Clone the repository to your local machine using:
   `git clone https://github.com/kshitij-hash/expense-tracker`
2. Set up a Firebase project and configure authentication and real-time database.
3. Create a `config.js` file, add the Firebase configuration and import it in `index.js` file.
4. Open the `index.html` file in a web browser to launch the application.