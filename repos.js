document.addEventListener("DOMContentLoaded", () => {
  const searchBtn = document.querySelector(".searchBtn");
  const nameInput = document.querySelector("#nameInput");
  const numberOfRepos = document.querySelector(`.numberOfRepos`);

  nameInput.focus();

  function fetchRepos() {
    const userName = nameInput.value.trim();

    if (!userName) return;

    document.querySelector(`.yourUserName`).textContent =
      userName.toUpperCase();

    const xhr = new XMLHttpRequest();
    xhr.open("GET", `https://api.github.com/users/${userName}/repos`);

    xhr.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        const data = JSON.parse(this.responseText);
        const repoList = document.querySelector(".repo-ul");
        repoList.innerHTML = "";

        data.forEach((repo) => {
          const li = document.createElement("li");
          li.innerHTML = `<strong>${repo.name}</strong> - ${
            repo.description || "No description"
          }`;
          repoList.appendChild(li);
        });

        numberOfRepos.textContent = "Number of repos: " + data.length;

        // Intersection observer
        const listItems = document.querySelectorAll(`li`);
        const options = { threshold: 0.6 };

        const listObserver = new IntersectionObserver((entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add(`show-list`);
            }
          });
        }, options);

        listItems.forEach((item) => listObserver.observe(item));
      }
    };

    xhr.send();
    nameInput.value = "";
  }

  searchBtn.addEventListener("click", fetchRepos);

  nameInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      fetchRepos();
    }
  });
});
