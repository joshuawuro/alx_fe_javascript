// Load quotes from local storage if available
const savedQuotes = localStorage.getItem('quotes');
const quotes = savedQuotes ? JSON.parse(savedQuotes) : [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Life" },
    { text: "Your time is limited, don't waste it living someone else's life.", category: "Inspirational" }
];

function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
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

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const newQuote = {
            text: quoteInput.value,
            category: categoryInput.value
        };
        quotes.push(newQuote);
        saveQuotesToLocalStorage();
        showRandomQuote();
        form.reset();
    });

    document.body.appendChild(form);
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
        alert('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]);
}

document.getElementById('newQuote').addEventListener('click', showRandomQuote);
document.getElementById('exportQuotes').addEventListener('click', exportQuotesToJsonFile);
document.getElementById('importFile').addEventListener('change', importFromJsonFile);
createAddQuoteForm();
showLastViewedQuote();
