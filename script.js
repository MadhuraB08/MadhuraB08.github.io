

// Initialize transactions array
let transactions;

// Check if data exists in storage 
if (localStorage.getItem('transactions')) {
  // If exists, convert it from string to array
  transactions = JSON.parse(localStorage.getItem('transactions'));
} else {
  // If doesn't exist, start with empty array
  transactions = [];
}

// Save transactions to localStorage
function saveTransactions() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Format currency as ₹ with 2 decimal places
function formatCurrency(amount) {
  return '₹' + amount.toFixed(2);
}

// Calculate total balance, income and expenses
function calculateBalances() {
  let income = 0;
  let expense = 0;
  
  // Loop through all transactions
  for (let i = 0; i < transactions.length; i++) {
    if (transactions[i].type === 'income') {
      income += transactions[i].amount;
    } else {
      expense += transactions[i].amount;
    }
  }
  
  const balance = income - expense;
  return { balance, income, expense };
}

// Update the dashboard with current totals
function updateDashboard() {
  const totals = calculateBalances();
  
  if (document.getElementById('balance')) {
    document.getElementById('balance').textContent = formatCurrency(totals.balance);
    document.getElementById('total-income').textContent = formatCurrency(totals.income);
    document.getElementById('total-expense').textContent = formatCurrency(totals.expense);
  }
}

// Handle the add transaction form
function setupTransactionForm() {
  const form = document.getElementById('transaction-form');
  
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form values
      const title = document.getElementById('title').value;
      const amount = parseFloat(document.getElementById('amount').value);
      const type = document.getElementById('type').value;
      const date = document.getElementById('date').value;
      
      // Validate inputs
      if (title && !isNaN(amount) && date) {
        // Create new transaction
        const newTransaction = {
          id: Date.now(),
          title,
          amount,
          type,
          date
        };
        
        // Add to array and save
        transactions.push(newTransaction);
        saveTransactions();
        
        // Reset form
        form.reset();
        document.getElementById('date').valueAsDate = new Date();
        
        // Update dashboard if on that page
        updateDashboard();
        
        // Show success message
        alert('Transaction added successfully!');
      }
    });
    
    // Set default date to today
    document.getElementById('date').valueAsDate = new Date();
  }
}

// Display transactions in history page
function showTransactionHistory() {
  const transactionList = document.getElementById('transaction-list');
  
  if (transactionList) {
    // Get search and filter values
    const searchTerm = document.getElementById('search').value.toLowerCase();
    const filterType = document.getElementById('filter').value;
    
    // Filter transactions
    let filteredTransactions = [];
    for (let i = 0; i < transactions.length; i++) {
      const t = transactions[i];
      const matchesSearch = t.title.toLowerCase().includes(searchTerm);
      const matchesFilter = filterType === 'all' || t.type === filterType;
      
      if (matchesSearch && matchesFilter) {
        filteredTransactions.push(t);
      }
    }
    
    // Sort by date (newest first)
    filteredTransactions.sort(function(a, b) {
      return new Date(b.date) - new Date(a.date);
    });
    
    // Display transactions or empty message
    if (filteredTransactions.length === 0) {
      transactionList.innerHTML = '<p class="empty">No transactions found</p>';
    } else {
      let html = '';
      for (let i = 0; i < filteredTransactions.length; i++) {
        const t = filteredTransactions[i];
        html += `
          <div class="transaction-item ${t.type}-item">
            <div class="transaction-details">
              <strong>${t.title}</strong>
              <small>${new Date(t.date).toLocaleDateString()}</small>
            </div>
            <div class="transaction-amount">
              ${t.type === 'income' ? '+' : '-'}${formatCurrency(t.amount)}
            </div>
          </div>
        `;
      }
      transactionList.innerHTML = html;
    }
  }
}

// Set up event listeners for history page
function setupHistoryPage() {
  const searchInput = document.getElementById('search');
  const filterSelect = document.getElementById('filter');
  
  if (searchInput && filterSelect) {
    searchInput.addEventListener('input', showTransactionHistory);
    filterSelect.addEventListener('change', showTransactionHistory);
  }
}

// Initialize the app when page loads
function initApp() {
  updateDashboard();
  setupTransactionForm();
  showTransactionHistory();
  setupHistoryPage();
}

// Run the app when the page finishes loading
window.addEventListener('DOMContentLoaded', initApp);