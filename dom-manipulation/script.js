const API_URL = 'https://jsonplaceholder.typicode.com/posts';

// Load quotes from local storage if available
const savedQuotes = localStorage.getItem('quotes');
const quotes = savedQuotes ? JSON.parse(savedQuotes) : [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Life" },
    { text: "Your time is limited, don't waste it living someone else's life.", category: "Inspirational" }
];

// Load last selected category from local storage if available
const savedCategory = localStorage.getItem('selectedCategory') || 'all';

function showRandomQuote() {
    const categoryFilter = document.getElementById('categoryFilter').value;
    const filteredQuotes = categoryFilter === 'all' ? quotes : quotes.filter(quote => quote.category === categoryFilter);
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const quote = filteredQuotes[randomIndex];
    document.getElementById('quoteDisplay').innerHTML = `<p>${quote.text}</p><p><em>${quote.category}</em></p>`;
    sessionStorage.setItem('lastViewedQuote', JSON.stringify(quote));
}

function showLastViewedQuote() {
    const lastViewedQuote = sessionStorage.getItem('lastViewedQuote');
    if (lastViewedQuote) {
        const quote = JSON.parse(lastViewedQuote);
        document.getElementById('quoteDisplay').innerHTML = `<p>${quote.text}</p><p><em>${quote.category}</em></p>`;
    } else {
        showRandomQuote();
    }
}

function saveQuotesToLocalStorage() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

function updateCategoryFilter() {
    populateCategories();
    const categoryFilter = document.getElementById('categoryFilter');
    categoryFilter.value = savedCategory;
}

function filterQuotes() {
    const categoryFilter = document.getElementById('categoryFilter').value;
    localStorage.setItem('selectedCategory', categoryFilter);
    showRandomQuote();
}

function populateCategories() {
    const categoryFilter = document.getElementById('categoryFilter');
    const categories = Array.from(new Set(quotes.map(quote => quote.category)));
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

function createAddQuoteForm() {
    const form = document.createElement('form');
    form.id = 'addQuoteForm';

    const quoteInput = document.createElement('input');
    quoteInput.type = 'text';
    quoteInput.placeholder = 'Quote';
    quoteInput.required = true;
    form.appendChild(quoteInput);

    const categoryInput = document.createElement('input');
    categoryInput.type = 'text';
    categoryInput.placeholder = 'Category';
    categoryInput.required = true;
    form.appendChild(categoryInput);

    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.innerText = 'Add Quote';
    form.appendChild(submitButton);

    form.addEventListener('submit', async function (event) {
        event.preventDefault();
        const newQuote = {
            text: quoteInput.value,
            category: categoryInput.value
        };
        quotes.push(newQuote);
        saveQuotesToLocalStorage();
        updateCategoryFilter();
        filterQuotes();
        await postQuoteToServer(newQuote);
        form.reset();
    });

    document.body.appendChild(form);
}

async function postQuoteToServer(quote) {
    try {
        await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(quote)
        });
    } catch (error) {
        console.error('Error posting quote:', error);
    }
}

function exportQuotesToJsonFile() {
    const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    a.click();
    URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        const importedQuotes = JSON.parse(event.target.result);
        quotes.push(...importedQuotes);
        saveQuotesToLocalStorage();
        updateCategoryFilter();
        filterQuotes();
        alert('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]);
}

async function fetchQuotesFromServer() {
    try {
        const response = await fetch(API_URL);
        const serverQuotes = await response.json();
        resolveConflicts(serverQuotes);
        saveQuotesToLocalStorage();
        updateCategoryFilter();
        filterQuotes();
        showNotification('Quotes synced with server!');
    } catch (error) {
        console.error('Error fetching quotes:', error);
    }
}

function resolveConflicts(serverQuotes) {
    const localQuoteTexts = quotes.map(quote => quote.text);
    serverQuotes.forEach(serverQuote => {
        if (!localQuoteTexts.includes(serverQuote.text)) {
            quotes.push(serverQuote);
        }
    });
}

function showNotification(message) {
    const notificationsDiv = document.getElementById('notifications');
    const notification = document.createElement('div');
    notification.innerText = message;
    notificationsDiv.appendChild(notification);
    setTimeout(() => notificationsDiv.removeChild(notification), 5000);
}

function syncQuotesPeriodically() {
    setInterval(fetchQuotesFromServer, 60000); // Sync every 60 seconds
}

document.getElementById('newQuote').addEventListener('click', showRandomQuote);
document.getElementById('exportQuotes').addEventListener('click', exportQuotesToJsonFile);
document.getElementById('importFile').addEventListener('change', importFromJsonFile);
createAddQuoteForm();
updateCategoryFilter();
filterQuotes();
showLastViewedQuote();
syncQuotesPeriodically();
