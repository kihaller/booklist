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
const urlAPI = "http://openlibrary.org/search.json";
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
//render fucntion
function render() {
  TABLE.innerHTML = "";

  const header = document.createElement("tr");
  header.innerHTML = `
        <tr>
        <th>Cover</th>
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
    <td><img src="http://covers.openlibrary.org/b/isbn/${book.isbn}-S.jpg" /></td>
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

//validate function
function validate(isbn) {
  const isbnEntered = /\d{10,13}/;
  const validISBN = isbnEntered.test(BOOKISBN.value);
  return validISBN;
}

//check duplicate function
function isDuplicate(book) {
  const bookISBN = book.isbn;
  if (books.filter((item) => item.isbn === book.isbn).length > 0) {
    ALERT.style.display = "flex";
    ALERT.innerHTML = "You already have this book in your list.";
    $(ALERT).fadeIn(200);
    $(ALERT).delay(1500).fadeOut(1000);
    return true;
  }
  return false;
}

/* -------------
Event Listeners
------------- */

//event listener on Submit button
SUBMITBUTTON.addEventListener("click", (e) => {
  e.preventDefault();
  //check whether all three input fields have been filled in
  if (
    BOOKTITLE.value &&
    BOOKAUTHOR.value &&
    BOOKISBN.value &&
    validate(BOOKISBN.value)
  ) {
    //Create a new instance of the book class
    const book1 = new Book(BOOKTITLE.value, BOOKAUTHOR.value, BOOKISBN.value);

    if (!isDuplicate(book1)) {
      books.push(book1);
      console.log(books);
      render();
      ALERT.style.display = "flex";
      ALERT.style.backgroundColor = "#32CD32";
      ALERT.innerHTML = "The book was successfully added.";
      $(ALERT).fadeIn(200);
      $(ALERT).delay(1500).fadeOut(1000);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(books));
    }
  } else if (!BOOKTITLE.value || !BOOKAUTHOR.value || !BOOKISBN.value) {
    ALERT.style.display = "flex";
    ALERT.style.backgroundColor = "rgb(245, 84, 159);";
    ALERT.innerHTML = "Please provide all the requested information";
    $(ALERT).fadeIn(200);
    $(ALERT).delay(4000).fadeOut(2000);
  } else {
    ALERT.style.display = "flex";
    ALERT.style.backgroundColor = "rgb(245, 84, 159);";
    ALERT.innerHTML = "Please ensure the ISBN you entered is correct.";
    $(ALERT).fadeIn(200);
    $(ALERT).delay(4000).fadeOut(2000);
  }
});

//event listener on trash icon
function deleteBook(book) {
  books = books.filter((item) => item !== book);
  render();
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(books));
  ALERT.style.display = "flex";
  ALERT.style.backgroundColor = "#DC143C";
  ALERT.innerHTML = "The book was successfully removed.";
  $(ALERT).fadeIn(200);
  $(ALERT).delay(1500).fadeOut(1000);
}

/* ------------
Execute on load
------------ */

window.onload = function () {
  books = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));

  if (books === null) {
    books = [
      new Book(
        "Harry Potter and the Deathly Hallows",
        "J.K. Rowling",
        9780545010221
      ),
      new Book("Five Feet Apart", "Rachael Lippincott", 9781534437333),
      new Book("The Wonderful Wizard of Oz", "L. Frank Baum", 9780688166779),
    ];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(books));
  }

  console.log(books);
  render();
};

/* ------------
Fetch book data from API
------------ */
async function getBookInformationFromTitle(title) {
  try {
    const response = await fetch(
      urlAPI + "?title=" + encodeURIComponent(title)
    );
    return response.json();
  } catch (error) {
    throw error;
  }
}

/* Autocomplete search user*/
var suggestions = ["Victoria Chambers", "Dale Byrd", "Dawn Wood", "Dan Oliver"];

BOOKTITLE.addEventListener("keypress", () => {
  console.log("Key Pressed");
  const datalist = document.createElement("datalist");
  datalist.id = "datalist";
  datalist.innerHTML = `
    <option value="Victoria Chambers"></option>
    <option value="Dale Byrd"></option>
    <option value="Dawn Wood"></option>
    <option value="Dan Oliver"></option>
  `;
  BOOKTITLE.after(datalist);
  BOOKTITLE.setAttribute("list", "datalist");
});
