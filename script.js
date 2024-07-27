const quotes = [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Life" },
    { text: "Your time is limited, don't waste it living someone else's life.", category: "Inspirational" }
];

function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    document.getElementById('quoteDisplay').innerText = `${quote.text} - ${quote.category}`;
}

// Show a random quote when the page loads
showRandomQuote();

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
        showRandomQuote();
        form.reset();
    });

    document.body.appendChild(form);
}

document.getElementById('newQuote').addEventListener('click', showRandomQuote);
createAddQuoteForm();
