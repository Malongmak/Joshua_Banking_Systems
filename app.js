const storageKey = 'ledgerline-data';
const initialData = { accounts: [], transactions: [] };
let data = loadData();

const money = value => `KES ${Number(value).toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const id = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const save = () => localStorage.setItem(storageKey, JSON.stringify(data));
function loadData() {
  try { return JSON.parse(localStorage.getItem(storageKey)) || structuredClone(initialData); }
  catch { return structuredClone(initialData); }
}
function showToast(message) {
  const toast = document.querySelector('#toast');
  toast.textContent = message; toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2800);
}
function accountById(accountId) { return data.accounts.find(account => account.id === accountId); }
function addTransaction(type, amount, description) {
  data.transactions.unshift({ id: id(), type, amount, description, date: new Date().toISOString() });
  data.transactions = data.transactions.slice(0, 20);
}
function render() {
  const total = data.accounts.reduce((sum, account) => sum + account.balance, 0);
  document.querySelector('#total-balance').textContent = money(total);
  document.querySelector('#account-count').textContent = `${data.accounts.length} account${data.accounts.length === 1 ? '' : 's'}`;
  document.querySelector('#active-count').textContent = data.accounts.length;
  document.querySelector('#transaction-count').textContent = data.transactions.length;
  renderAccounts(); renderActivity(); populateSelects();
}
function renderAccounts() {
  const list = document.querySelector('#account-list');
  if (!data.accounts.length) {
    list.innerHTML = '<div class="empty-state"><strong>Your banking workspace is ready.</strong>Create your first account to start moving money.</div>'; return;
  }
  list.innerHTML = data.accounts.map(account => `<div class="account-row">
    <div class="account-badge">${account.type === 'Loan' ? '₭' : account.holder.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase()}</div>
    <div><div class="account-name">${escapeHtml(account.holder)}</div><div class="account-meta">${account.type} / ${account.number}</div></div>
    <div class="account-balance">${money(account.balance)}</div>
    <button class="delete-account" data-delete="${account.id}" title="Delete dormant account" aria-label="Delete ${escapeHtml(account.holder)}">×</button>
  </div>`).join('');
  list.querySelectorAll('[data-delete]').forEach(button => button.addEventListener('click', () => deleteAccount(button.dataset.delete)));
}
function renderActivity() {
  const list = document.querySelector('#activity-list');
  if (!data.transactions.length) { list.innerHTML = '<div class="empty-state">No activity yet. Your recent transactions will appear here.</div>'; return; }
  list.innerHTML = data.transactions.slice(0, 7).map(transaction => {
    const incoming = transaction.type === 'deposit' || transaction.type === 'loan';
    return `<div class="activity-item"><div class="activity-icon">${incoming ? '↙' : '↗'}</div><div><div class="activity-title">${escapeHtml(transaction.description)}</div><div class="activity-time">${formatDate(transaction.date)}</div></div><div class="activity-amount ${incoming ? 'positive' : 'negative'}">${incoming ? '+' : '-'}${money(transaction.amount).replace('KES ', '')}</div></div>`;
  }).join('');
}
function populateSelects() {
  const accountOptions = data.accounts.filter(account => account.type !== 'Loan').map(account => `<option value="${account.id}">${escapeHtml(account.holder)} - ${money(account.balance)}</option>`).join('');
  document.querySelectorAll('.account-select').forEach(select => { select.innerHTML = accountOptions || '<option value="">Create an account first</option>'; });
  const customers = [...new Set(data.accounts.filter(account => account.type !== 'Loan').map(account => account.holder))];
  document.querySelector('.customer-select').innerHTML = customers.map(customer => `<option>${escapeHtml(customer)}</option>`).join('') || '<option value="">Create an account first</option>';
}
function createAccount(form) {
  const holder = form.elements.holder.value.trim();
  const account = { id: id(), holder, type: form.elements.type.value, number: `LL-${String(data.accounts.length + 1).padStart(4, '0')}`, balance: 0 };
  data.accounts.push(account); addTransaction('account', 0, `${account.type} account created`); save(); render(); showToast(`${account.type} account created for ${holder}`);
}
function handleDeposit(form) {
  const account = accountById(form.elements.account.value); const amount = Number(form.elements.amount.value);
  if (!account || amount <= 0) return showToast('Enter a valid deposit amount.');
  account.balance += amount; addTransaction('deposit', amount, `Deposit to ${account.holder}`); save(); render(); showToast(`${money(amount)} deposited`);
}
function handleWithdraw(form) {
  const account = accountById(form.elements.account.value); const amount = Number(form.elements.amount.value);
  if (!account || amount <= 0) return showToast('Enter a valid withdrawal amount.');
  if (account.balance < amount) return showToast('Insufficient funds for this withdrawal.');
  account.balance -= amount; addTransaction('withdrawal', amount, `Withdrawal from ${account.holder}`); save(); render(); showToast(`${money(amount)} withdrawn`);
}
function handleTransfer(form) {
  const from = accountById(form.elements.from.value); const to = accountById(form.elements.to.value); const amount = Number(form.elements.amount.value);
  if (!from || !to || from.id === to.id) return showToast('Choose two different accounts.');
  if (amount <= 0) return showToast('Enter a valid transfer amount.');
  if (from.balance < amount) return showToast('Insufficient funds for this transfer.');
  from.balance -= amount; to.balance += amount; addTransaction('transfer', amount, `Transfer: ${from.holder} to ${to.holder}`); save(); render(); showToast(`${money(amount)} transferred`);
}
function handleLoan(form) {
  const customer = form.elements.customer.value; const destination = accountById(form.elements.account.value);
  if (!destination || !customer) return showToast('Create a bank account before disbursing a loan.');
  const loan = { id: id(), holder: customer, type: 'Loan', number: `LN-${String(data.accounts.filter(account => account.type === 'Loan').length + 1).padStart(4, '0')}`, balance: 10000 };
  data.accounts.push(loan); destination.balance += 10000; addTransaction('loan', 10000, `KES 10,000 loan to ${customer}`); save(); render(); showToast('KES 10,000 loan disbursed');
}
function deleteAccount(accountId) {
  const account = accountById(accountId);
  if (!account) return;
  if (account.balance !== 0) return showToast('Only dormant accounts with a zero balance can be deleted.');
  data.accounts = data.accounts.filter(item => item.id !== accountId); save(); render(); showToast('Dormant account deleted');
}
function escapeHtml(value) { return value.replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' }[character])); }
function formatDate(date) { return new Date(date).toLocaleString('en-KE', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }); }

document.querySelector('#today').textContent = new Date().toLocaleDateString('en-KE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
document.querySelectorAll('[data-modal]').forEach(button => button.addEventListener('click', () => document.querySelector(`#${button.dataset.modal}`).showModal()));
document.querySelectorAll('.close-button').forEach(button => button.addEventListener('click', () => button.closest('dialog').close()));
document.querySelectorAll('form[data-form]').forEach(form => form.addEventListener('submit', event => {
  if (event.submitter?.value === 'cancel') return;
  event.preventDefault();
  ({ account: createAccount, deposit: handleDeposit, withdraw: handleWithdraw, transfer: handleTransfer, loan: handleLoan })[form.dataset.form](form);
  form.reset(); form.closest('dialog').close();
}));
document.querySelector('#clear-data').addEventListener('click', () => { if (confirm('Reset every account and transaction?')) { data = structuredClone(initialData); save(); render(); showToast('Workspace reset'); } });
render();
