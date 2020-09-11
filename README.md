# Booklist

This is an application to keep track of books. Books can be added and deleted, respectively. It is not possible to enter the same book twice. A valid ISBN needs to be entered, otherwise an error message will appear.

![Screen Shot 2020-09-03 at 3.09.33 PM](/Users/kimhaller/Desktop/Projects_Techdegree/booklist/images/screenshot.jpg)

## Instructions

* Start adding a booktitle, an author and an ISBN.
* When you start typing a title or an author, an autocomplete feature is activated and it suggests you different book titles or author names
* Once you select the book/author you want, the rest of the information is pre-filled (title, author, and ISBN)
* A book cover will appear automatically once you hit the 'Submit' button.
* You can delete a book by clicking on the trash icon



## Technologies

I used: 

- DOM manipulation with vanilla JavaScript to alter the HTML. I styled the site using Sass.

- local storage in order to save the books in the list. They are cleared from local storage once the user deletes them.

-  a regular expression to ensure that the user enters a valid ISBN number.

- Fetch requests in order to autocomplete the information about the book title, the author, and the ISBN number of the respective books.

 

