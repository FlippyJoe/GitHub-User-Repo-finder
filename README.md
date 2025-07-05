# Get user repositories from GitHub

## The search is based on username

### HTML structure

The HTML structure is simple, the classic headr, main, footer combo.
Header contains the title of the application and a basic instruction: one needs to enter a GitHub user`s username and recieve the list of repositories with their names and descriptions.

---

- _Input section_: contains the inout field where you enter the username and the corresponding label.
- _Search button:_ You can trigger the search function by hitting the search button, or, by pressing the enter key
- _Username:_ is an empty _div_ where the username will appear once the search is triggered and succesful. The returned name is in all capital case.
- - _Number of repos_ is also an empty _div_, which will be populated with data when it`s loaded and the search returns a result. It will show the number of repositories of the searched user
- _Repo-Container_ is a div that contains the unordered list _(ul)_
- _repo-ul_ is where the obtained data will be displayed. By default it is empty, it will be populated in the case of succesful search.

---

### CSS

- Minimalist dark background style application
- _clamp()_ for responsive font-size
  > h3,
  > label {
  > font-size: clamp(1.1rem, 2vw, 1.6rem);
  > }
- _button:_ simple hover effect
  > button:hover {
  > background-color: #686666;
  > }

* In order to succesfully apply the scroll-based animation in JavaScript I add both (before- and after appearance of element) styles in CSS

  > li {
  > transform: translateY(60px);
  > transition: all 0.4s ease;
  > }

  > .show-list {
  > transform: translateY(0);
  > }

* _.show-list_ style is defined in the JavaScript file

---

### JavaScript

---

#### XmlHttpRequest (XHR) 2/1

To ensure the smooth operation of the application the complete code is wrapped inside and _event listener_, which is applied on the _document_ element. the event is _DOMContentLoaded_.

> document.addEventListener("DOMContentLoaded", () =>

- For consistency I used _querySelector_ for defining the elements

  > const searchBtn = >document.querySelector(".searchBtn");

  > const nameInput = document.querySelector("#nameInput");

* The name input field is focused upon loading the page
  > nameInput.focus();
* The username is defined as the text value of input field, displayed in capital case

  > document.querySelector(`.yourUserName`).textContent =

        userName.toUpperCase();

* For practice purposes I decided to use XHR _(XMLHttpRequest)_ for fetching the data.
* In the .open() method the link contains an object literal (username), which ensures that the search will result in the list of repositories of a particular person

  > const xhr = new XMLHttpRequest();
  > xhr.open("GET", `https://api.github.com/users/${userName}/repos`);

* For succesful data collection and connection to GitHub API two conditions need to meet:
  - readyState has four stages (prperties)
    - 0. Unsent - client had been created, open() not called yet
    - 1. Opened - open() has been called
    - 2. Headers_received - send() has been called, and headers and status are available
    - 3. Loading - Downloading; responseText holds partial data
    - 4. Done - The operation is complete
  - Status values show the status of the process. Values are divided into four sections by hundreds.
    - Succesful responses between 200 and 299
    - Redirection responses between 300 and 399
    - Client error responses between 400 and 499
    - Server error responses from 500
* If the _readyState_ is 4 _(operation complete)_ and the _status_ is 200 _(succesful operation)_ the response (required data) will be collected, alternatively the function won`t be executed
* > if (this.readyState === 4 && this.status === 200)

* > const data = JSON.parse(this.responseText);

* By default the _.repo-ul_ has a value of an empty innerHTML _(there`s no data before providing a username and pressing enter or clicking the search button)_
* > const repoList = document.querySelector(".repo-ul");
        repoList.innerHTML = "";
* Once all conditions met _(username provided, execution triggered by enter key or click on the button, status is 200 and readyState is 4)_ the _ul_ element will be populated with an _innerHTML_, which contains the list of repositories and their description in unordered list format. If a repository doesn`t have description, its value will be set for the fall-back value: "No description"
* > data.forEach((repo) => {
         const li = document.createElement("li");
         li.innerHTML = `<strong>${repo.name}</strong> - ${
           repo.description || "No description"
         }`;
* Finally the returned list with the values will be added to the _ul_ element:
* > repoList.appendChild(li);
  ---
  #### Intersection Observer
* As _options_ variable I store the _threshold_ with value 0.6- which means, that the animation (set in CSS) will be applied to the target element, when it is interacting with the viewport in 60% of its size.
* The observer is called "listObserver", which is observing the position of all _li_ elements
* > const listObserver = new IntersectionObserver((entries, observer) => {
          entries.forEach((entry) =>
* Once an _li_ element is in the viewport in 60%, a new _class name_ will be added to the _classList_, for which a CSS style is added.
* > if (entry.isIntersecting) {
              entry.target.classList.add(`show-list`);
            }
          });
* Options are applied at the end of the observer
* And finally I define that the _listObserver_ should apply to all _li_ elements. For this I use the _.forEach()_ method
* > listItems.forEach((item) => listObserver.observe(item));

---

#### XmlHttpRequest (XHR) 2/2

- The request is being sent to the server by declaring
- > xhr.send();
- After succesfully returning data the input field is emptied and focused again, ready for the next searc
- > nameInput.value = "";
- The search can be triggered on two ways: mouse click, and hitting the _enter_ key
  > searchBtn.addEventListener("click", fetchRepos);

> nameInput.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {
      fetchRepos();
    }}
