/* -------------
Global Variables
------------- */
const SUBMITBUTTON = document.getElementById("submit-button");
const TITLE_INPUT = document.getElementById("title");
const AUTHOR_INPUT = document.getElementById("author");
const ISBN_INPUT = document.getElementById("isbn");
const ALERT = document.getElementById("alert");
const LOCAL_STORAGE_KEY = "books";
const TABLE = document.getElementById("table");
const URL_API = "http://openlibrary.org/search.json";
const TITLE_DATALIST = document.getElementById("title-datalist");
const AUTHOR_DATALIST = document.getElementById("author-datalist");
let books = [];
let titleOptions = new Map();

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
  const validISBN = isbnEntered.test(ISBN_INPUT.value);
  return validISBN;
}

//check duplicate function
function isDuplicate(book) {
  const bookISBN = book.isbn;
  if (books.filter((item) => item.isbn === book.isbn).length > 0) {
    ALERT.style.display = "flex";
    ALERT.style.backgroundColor = "#f5549f";
    ALERT.innerHTML = "You already have this book in your list.";
    $(ALERT).fadeIn(200);
    $(ALERT).delay(1500).fadeOut(1000);
    TITLE_INPUT.value = "";
    AUTHOR_INPUT.value = "";
    ISBN_INPUT.value = "";
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
    TITLE_INPUT.value &&
    AUTHOR_INPUT.value &&
    ISBN_INPUT.value &&
    validate(ISBN_INPUT.value)
  ) {
    //Create a new instance of the book class
    const book1 = new Book(
      TITLE_INPUT.value,
      AUTHOR_INPUT.value,
      ISBN_INPUT.value
    );

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
      TITLE_INPUT.value = "";
      AUTHOR_INPUT.value = "";
      ISBN_INPUT.value = "";
    }
  } else if (!TITLE_INPUT.value || !AUTHOR_INPUT.value || !ISBN_INPUT.value) {
    ALERT.style.display = "flex";
    ALERT.style.backgroundColor = "#f5549f";
    ALERT.innerHTML = "Please provide all the requested information";
    $(ALERT).fadeIn(200);
    $(ALERT).delay(4000).fadeOut(2000);
  } else {
    ALERT.style.display = "flex";
    ALERT.style.backgroundColor = "#f5549f";
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
async function getBookInformation(key, value) {
  try {
    console.log("Querying:", `${URL_API}?${key}=${encodeURIComponent(value)}`);
    const response = await fetch(
      `${URL_API}?${key}=${encodeURIComponent(value)}`
    );
    return response.json();
  } catch (error) {
    throw error;
  }
}

/* Autocomplete search title*/

TITLE_INPUT.addEventListener("keyup", async () => {
  if (TITLE_INPUT.value.length === 5) {
    // API request
    var response = await getBookInformation("title", TITLE_INPUT.value);

    var suggestions = response.docs.map(
      (doc) =>
        new Book(
          doc.title_suggest,
          doc.author_name ? doc.author_name[0] : "",
          doc.isbn ? doc.isbn[0] : ""
        )
    ); // convert response
    console.log("Title suggestions:", suggestions);

    TITLE_DATALIST.innerHTML = "";
    titleOptions = new Map();
    for (book of suggestions) {
      let option = document.createElement("option");

      let optionValue = book.title + " - " + book.author;
      option.setAttribute("value", optionValue);
      titleOptions.set(optionValue, book);

      TITLE_DATALIST.appendChild(option);
    }
  }
});

TITLE_INPUT.addEventListener("change", (event) => {
  let book = titleOptions.get(event.target.value);

  if (book) {
    TITLE_INPUT.value = book.title;
    AUTHOR_INPUT.value = book.author;
    ISBN_INPUT.value = book.isbn;
  }
});

/* Autocomplete search author*/

AUTHOR_INPUT.addEventListener("keyup", async () => {
  if (AUTHOR_INPUT.value.length === 4) {
    // API request
    var response = await getBookInformation("author", AUTHOR_INPUT.value);

    var suggestions = response.docs.map(
      (doc) =>
        new Book(
          doc.title_suggest,
          doc.author_name ? doc.author_name[0] : "",
          doc.isbn ? doc.isbn[0] : ""
        )
    ); // convert response
    console.log("Author suggestions:", suggestions);

    AUTHOR_DATALIST.innerHTML = "";
    authorOptions = new Map();
    for (book of suggestions) {
      let option = document.createElement("option");

      let optionValue = book.author + " - " + book.title;
      option.setAttribute("value", optionValue);
      authorOptions.set(optionValue, book);

      AUTHOR_DATALIST.appendChild(option);
    }
  }
});

AUTHOR_INPUT.addEventListener("change", (event) => {
  let book = authorOptions.get(event.target.value);

  if (book) {
    TITLE_INPUT.value = book.title;
    AUTHOR_INPUT.value = book.author;
    ISBN_INPUT.value = book.isbn;
  }
});
