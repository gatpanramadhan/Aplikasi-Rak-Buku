console.log("Hello, world!");

document.addEventListener("DOMContentLoaded", function () {
  const bookForm = document.getElementById("bookForm");
  const searchForm = document.getElementById("searchBook");
  const incompleteBookList = document.getElementById("incompleteBookList");
  const completeBookList = document.getElementById("completeBookList");
  const BOOKS_KEY = "bookshelf_books";

  // Muat buku dari Penyimpanan lokal
  let books = JSON.parse(localStorage.getItem(BOOKS_KEY)) || [];

  // Simpan buku ke Penyimpanan lokal
  function saveBooks() {
    localStorage.setItem(BOOKS_KEY, JSON.stringify(books));
  }

  // Buat elemen buku
  function createBookElement(book) {
    const bookItem = document.createElement("div");
    bookItem.setAttribute("data-bookid", book.id);
    bookItem.setAttribute("data-testid", "bookItem");

    const bookTitle = document.createElement("h3");
    bookTitle.setAttribute("data-testid", "bookItemTitle");
    bookTitle.textContent = book.title;

    const bookAuthor = document.createElement("p");
    bookAuthor.setAttribute("data-testid", "bookItemAuthor");
    bookAuthor.textContent = `Penulis: ${book.author}`;

    const bookYear = document.createElement("p");
    bookYear.setAttribute("data-testid", "bookItemYear");
    bookYear.textContent = `Tahun: ${book.year}`;

    const buttonsContainer = document.createElement("div");

    const toggleCompleteButton = document.createElement("button");
    toggleCompleteButton.setAttribute(
      "data-testid",
      "bookItemIsCompleteButton"
    );
    toggleCompleteButton.textContent = book.isComplete
      ? "Belum selesai dibaca"
      : "Selesai dibaca";
    toggleCompleteButton.addEventListener("click", () =>
      toggleBookStatus(book.id)
    );

    const deleteButton = document.createElement("button");
    deleteButton.setAttribute("data-testid", "bookItemDeleteButton");
    deleteButton.textContent = "Hapus Buku";
    deleteButton.addEventListener("click", () => deleteBook(book.id));

    buttonsContainer.append(toggleCompleteButton, deleteButton);

    bookItem.append(bookTitle, bookAuthor, bookYear, buttonsContainer);
    return bookItem;
  }

  // Render daftar buku
  function renderBooks() {
    incompleteBookList.innerHTML = "";
    completeBookList.innerHTML = "";

    books.forEach((book) => {
      const bookElement = createBookElement(book);
      if (book.isComplete) {
        completeBookList.append(bookElement);
      } else {
        incompleteBookList.append(bookElement);
      }
    });
  }

  // Tambahkan buku baru
  function addBook(title, author, year, isComplete) {
    const newBook = {
      id: Date.now().toString(),
      title,
      author,
      year,
      isComplete,
    };
    books.push(newBook);
    saveBooks();
    renderBooks();
    alert("Buku berhasil ditambahkan!");
  }

  // Toggle book status (complete/incomplete)
  function toggleBookStatus(bookId) {
    const book = books.find((b) => b.id === bookId);
    if (book) {
      book.isComplete = !book.isComplete;
      saveBooks();
      renderBooks();
    }
  }

  // Hapus buku
  function deleteBook(bookId) {
    if (confirm("Anda yakin ingin menghapus buku ini?")) {
      books = books.filter((b) => b.id !== bookId);
      saveBooks();
      renderBooks();
    }
  }

  // Handle penyerahan formulir buku
  bookForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const title = document.getElementById("bookFormTitle").value;
    const author = document.getElementById("bookFormAuthor").value;
    const year = parseInt(document.getElementById("bookFormYear").value); // Mengubah string menjadi number
    const isComplete = document.getElementById("bookFormIsComplete").checked;

    if (title && author && year) {
      addBook(title, author, year, isComplete);
      bookForm.reset();
    } else {
      alert("Semua kolom harus diisi!");
    }
  });

  // Handle penyerahan formulir pencarian
  searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const searchTitle = document
      .getElementById("searchBookTitle")
      .value.toLowerCase();
    const filteredBooks = books.filter((book) =>
      book.title.toLowerCase().includes(searchTitle)
    );

    incompleteBookList.innerHTML = "";
    completeBookList.innerHTML = "";

    filteredBooks.forEach((book) => {
      const bookElement = createBookElement(book);
      if (book.isComplete) {
        completeBookList.append(bookElement);
      } else {
        incompleteBookList.append(bookElement);
      }
    });
  });

  // Render daftar buku saat memuat halaman
  renderBooks();
});
