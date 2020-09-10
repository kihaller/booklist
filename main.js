/* -------------
Global Variables
------------- */
const SUBMITBUTTON = document.getElementById("submit-button");
const BOOKTITLE = document.getElementById("title");
const BOOKAUTHOR = document.getElementById("author");
const BOOKISBN = document.getElementById("isbn");
const ALERT = document.getElementById("alert");
const LOCAL_STORAGE_KEY = "books";
const TABLE = document.getElementById("table");
let books = [];

/* -------------
Class Definitions
------------- */

class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

/* -------------
Function Definitions
------------- */
function render() {
  TABLE.innerHTML = "";

  const header = document.createElement("tr");
  header.innerHTML = `
        <tr>
          <th>Title</th>
          <th>Author</th>
          <th>ISBN</th>
          <th></th>
        </tr>
        `;
  TABLE.appendChild(header);

  books.forEach((book) => {
    const row = document.createElement("tr");
    row.innerHTML = `
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td>
      <i class="fa fa-trash trash-icon" aria-hidden="true"></i>
    </td>
   `;

    let trashIcon = row.querySelector(".trash-icon");
    trashIcon.addEventListener("click", () => {
      deleteBook(book);
    });

    TABLE.appendChild(row);
  });
}

//event listener on trash icon
function deleteBook(book) {
  books = books.filter((item) => item !== book);
  render();
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(books));
}

/* -------------
Event Listeners
------------- */

//event listener on Submit button
SUBMITBUTTON.addEventListener("click", (e) => {
  e.preventDefault();
  //check whether all three input fields have been filled in
  if (BOOKTITLE.value && BOOKAUTHOR.value && BOOKISBN.value) {
    //Create a new instance of the book class
    const book1 = new Book(BOOKTITLE.value, BOOKAUTHOR.value, BOOKISBN.value);
    books.push(book1);
    console.log(books);
    render();

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(books));
  } else {
    ALERT.style.display = "flex";
    ALERT.innerHTML = "Please provide all the requested information.";
    $(ALERT).fadeIn(200);
    $(ALERT).delay(4000).fadeOut(2000);
  }
});

//event listener on trash icon
document.querySelectorAll(".trash-icon").forEach((item) => {
  item.addEventListener("click", () => {
    item.parentNode.parentNode.style.display = "none";
  });
});

/* ------------
Execute on load
------------ */

window.onload = function () {
  books = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
  console.log(books);
  render();
};
