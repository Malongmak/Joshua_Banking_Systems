# Joshua_Banking systems

> A focused, browser-based banking workspace for managing accounts, moving money, and disbursing loans in Kenyan Shillings.

![Joshua_Banking systems dashboard](https://placehold.co/1400x720/182d2a/d5f25e?text=Joshua_Banking+systems)

## Overview

Joshua_Banking systems is a lightweight banking transaction interface designed for clear, everyday account management. It provides a simple dashboard for creating accounts, recording transactions, reviewing activity, and handling a fixed KES 10,000 loan disbursement.

The project runs directly in the browser with no build process, backend, or database setup required.

## Features

- **Create bank accounts** with a holder name and Current or Savings account type
- **Deposit funds** into an available account
- **Withdraw funds** with insufficient-balance validation
- **Transfer funds** between two different accounts
- **Delete dormant accounts** only when their balance is KES 0.00
- **Create and disburse a KES 10,000 loan account** for an existing customer
- **Live dashboard metrics** for total balance, account count, and transaction count
- **Recent activity feed** showing deposits, withdrawals, transfers, loans, and account creation
- **Persistent browser storage** using `localStorage`
- **Responsive layout** for desktop and mobile screens
- **KES currency formatting** throughout the interface

## Preview

The dashboard is organized around three areas:

| Area | Purpose |
| --- | --- |
| Overview | Shows total balance, available accounts, and activity count |
| Accounts | Lists account holders, account types, balances, and account numbers |
| Quick actions | Opens focused dialogs for deposits, withdrawals, transfers, and loans |

## Getting Started

### Requirements

- A modern web browser such as Chrome, Edge, Firefox, or Safari
- No package installation required

### Run locally

1. Clone the repository:

   ```powershell
   git clone https://github.com/Malongmak/Joshua_Banking_Systems.git
   ```

2. Open the project folder:

   ```powershell
   cd Joshua_Banking_Systems
   ```

3. Open `index.html` in your browser.

You can also open the local file directly from the VS Code Explorer.

## Using the Interface

### Create an account

Select **New account**, enter the account holder's name, choose an account type, and submit the form. A unique local account number is generated automatically.

### Move money

Use the quick action buttons to open the relevant transaction form. Amounts are validated before balances are updated, and each successful action appears in the activity feed.

### Disburse a loan

Open **Create loan account**, choose an existing customer and destination account, then submit. The app creates a loan account and credits KES 10,000 to the selected account.

### Delete a dormant account

An account can only be deleted when its balance is exactly KES 0.00. Accounts with funds are protected from accidental deletion.

## Technology

- HTML5
- CSS3
- Vanilla JavaScript
- Browser `localStorage`
- Native HTML `<dialog>` elements
- Google Fonts: Manrope and DM Mono

## Project Structure

```text
Joshua_Banking_Systems/
├── index.html     # Application layout and dialogs
├── styles.css     # Visual design and responsive layout
├── app.js         # Banking logic, validation, and persistence
└── README.md      # Project documentation
```

## Data and Privacy

This is a frontend demonstration project. Account and transaction data is stored only in the browser's local storage for the current browser profile. It is not connected to a real banking service and should not be used with sensitive financial information.

Use the reset icon in the top-right corner to clear all locally stored accounts and transactions.

## License

This project is provided for educational and demonstration purposes.
