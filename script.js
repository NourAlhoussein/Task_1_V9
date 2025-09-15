// Book class//

class Book {
  #title;
  #author;
  #category;
  #isAvailable;
  constructor(title, author, category, isAvailable = true) {
    this.#title = title;
    this.#author = author;
    this.#category = category;
    this.#isAvailable = isAvailable;
  }
  get title() {
    return this.#title;
  }
  get author() {
    return this.#author;
  }
  get category() {
    return this.#category;
  }
  get isAvailable() {
    return this.#isAvailable;
  }
  changeStatus() {
    this.#isAvailable = !this.#isAvailable;
  }
  displayInfo() {
    return `${this.#title} by ${this.#author} , ${this.#category} , status: ${
      this.#isAvailable
    }`;
  }
}

// Library class //

class Library {
  #books = [];
  addBook(book) {
    this.#books.push(book);
  }

  removeBook(title) {
    this.#books = this.#books.filter((b) => b.title != title);
  }
  searchBooks(text) {
    return this.#books.filter(
      (b) =>
        b.title.toLowerCase().includes(text.toLowerCase()) ||
        b.author.toLowerCase().includes(text.toLowerCase())
    );
  }
  filterByCategory(category) {
    if (category === "all") return this.#books;
    return this.#books.filter((b) => b.category === category);
  }
  toggleAvailability(title) {
    const book = this.#books.find((b) => b.title === title);
    if (book) book.changeStatus();
  }
  getBooks() {
    return this.#books;
  }
}
// ReferenceBook Class
class ReferenceBook extends Book {
  #locationCode;
  constructor(title, author, category, locationCode, isAvailable = true) {
    super(title, author, category, isAvailable);
    this.#locationCode = locationCode;
  }
  displayInfo() {
    return `${super.displayInfo()} , Location: ${this.#locationCode}`;
  }
}

const library = new Library();

// Add some test books
library.addBook(new Book("Math", "Nour", "Science"));
library.addBook(new Book("JavaScript Basics", "John Doe", "Programming"));
library.addBook(new Book("React Basics", "John Doe", "Programming"));
library.addBook(new Book("UI & UX", "John Doe", "Design"));
library.addBook(new ReferenceBook("Life", "Mahmoud", "History", "Shelf B3"));
library.addBook(new ReferenceBook("Animals", "Lara", "Nature", "Shelf B3"));

const booksContainer = document.getElementById("booksContainer");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");

// show Books in UI

function renderBooks(books) {
  booksContainer.innerHTML = "";
  books.forEach((book) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
    <div class="book-card">
        <div class="book-title">${book.title}</div>
    <div class="book-author">by : ${book.author}</div>
    <div class="book-category">Category : ${book.category}</div>
    <div class="${book.isAvailable ? "available" : "not-available"}">
      ${book.isAvailable ? "Available" : "Not Available"}
    </div>
     <button class="toggle-btn">Toggle</button>
      <button class="remove-btn">Remove</button>
      </div>
    `;
    //button action
    card.querySelector(".toggle-btn").addEventListener("click", () => {
      library.toggleAvailability(book.title);
      renderBooks(library.getBooks());
    });
    card.querySelector(".remove-btn").addEventListener("click", () => {
      library.removeBook(book.title);
      renderBooks(library.getBooks());
    });

    booksContainer.appendChild(card);
  });
}

// Initial Books
renderBooks(library.getBooks());

// show options of category in UI
function updateCategories() {
  const categories = library.getBooks().map((b) => b.category);
  const uniqueCategories = [...new Set(categories)];
  console.log(uniqueCategories);
  categoryFilter.innerHTML = "";
  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;
  uniqueCategories.forEach((c) => {
    categoryFilter.innerHTML += `<option value="${c}">${c}</option>`;
  });
}

updateCategories();
// search by title or author function

searchInput.addEventListener("input", (e) => {
  const searchText = e.target.value;
  const result = library.searchBooks(searchText);
  renderBooks(result.length ? result : library.getBooks());
});

// filter by category

categoryFilter.addEventListener("change", (e) => {
  const t = e.target.value;
  renderBooks(library.filterByCategory(t));
});

// add new book

const addBookForm = document.getElementById("addBookForm");
const titleInput = document.getElementById("titleInput");
const authorInput = document.getElementById("authorInput");
const categoryInput = document.getElementById("categoryInput");

addBookForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = titleInput.value.trim();
  const author = authorInput.value.trim();
  const category = categoryInput.value.trim();

  if (title && author && category) {
    const newBook = new Book(title, author, category);
    library.addBook(newBook);
    renderBooks(library.getBooks());
    addBookForm.reset();
  }
});
