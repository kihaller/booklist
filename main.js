/* -------------
Global Variables
------------- */
const SUBMITBUTTON = document.getElementById("submit-button");
const BOOKTITLE = document.getElementById("title");
const BOOKAUTHOR = document.getElementById("author");
const BOOKISBN = document.getElementById("isbn");
const ALERT = document.getElementById("alert");

/* -------------
Class Defintions
------------- */
let books = [];

class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
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

    localStorage.setItem("books", JSON.stringify(books));
  } else {
    ALERT.style.display = "flex";
    ALERT.innerHTML = "Please provide all the requested information.";
    $(ALERT).fadeIn();
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
  JSON.parse(localStorage.getItem(books));
};
