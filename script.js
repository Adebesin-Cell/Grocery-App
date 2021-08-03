//Selecting elements

const form = document.querySelector(".grocery__form");
const formBtn = document.querySelector(".grocery__btn");
const groceryListEl = document.querySelector(".grocery__list");
const groceryInput = document.querySelector(".grocery__input");
const clearAllBtn = document.querySelector(".clear-all__btn");
const item = document.querySelector(".grocery__item");
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");

const modalForm = document.querySelector(".modal__form");

let groceryList = [];
const showModal = function () {
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

overlay.addEventListener("click", closeModal);

const addGrocery = function (value) {
  const groceryItem = {
    text: value,
    id: Number((Date.now() + "").slice(-10)),
  };

  groceryList.push(groceryItem);
  renderGrocery(groceryItem);
};

const renderGrocery = function (grocery) {
  localStorage.setItem("Grocery", JSON.stringify(groceryList));
  const groceryItemEl = document.querySelector(`[data-id = '${grocery.id}']`);
  if (grocery.deleted) {
    groceryItemEl.remove();
    return;
  }

  const groceryItem = document.createElement("li");
  groceryItem.setAttribute("class", "grocery__item");
  groceryItem.setAttribute("data-id", `${grocery.id}`);
  groceryItem.setAttribute("id", `${grocery.id}`);

  groceryItem.innerHTML = `<p class="grocery__details">${grocery.text}</p><div class="grocery__actions"><button class="edit__btn" id = ${grocery.id}><svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="edit" class="svg-inline--fa fa-edit fa-w-18" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M402.3 344.9l32-32c5-5 13.7-1.5 13.7 5.7V464c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V112c0-26.5 21.5-48 48-48h273.5c7.1 0 10.7 8.6 5.7 13.7l-32 32c-1.5 1.5-3.5 2.3-5.7 2.3H48v352h352V350.5c0-2.1.8-4.1 2.3-5.6zm156.6-201.8L296.3 405.7l-90.4 10c-26.2 2.9-48.5-19.2-45.6-45.6l10-90.4L432.9 17.1c22.9-22.9 59.9-22.9 82.7 0l43.2 43.2c22.9 22.9 22.9 60 .1 82.8zM460.1 174L402 115.9 216.2 301.8l-7.3 65.3 65.3-7.3L460.1 174zm64.8-79.7l-43.2-43.2c-4.1-4.1-10.8-4.1-14.8 0L436 82l58.1 58.1 30.9-30.9c4-4.2 4-10.8-.1-14.9z"></path></svg></button>
    <button class="delete__btn"><svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="trash" class="svg-inline--fa fa-trash fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16zM53.2 467a48 48 0 0 0 47.9 45h245.8a48 48 0 0 0 47.9-45L416 128H32z"></path></svg></button></div>`;

  if (groceryItemEl) {
    groceryItem.replaceWith(groceryItemEl);
  } else {
    groceryListEl.insertAdjacentElement("beforeend", groceryItem);
  }
};

const clearInput = function () {
  groceryInput.value = "";
  groceryInput.focus();
};

groceryListEl.addEventListener("click", function (e) {
  if (e.target.classList.contains("edit__btn")) {
    const key = e.target.closest(".grocery__item").dataset.id;
    const i = groceryList.findIndex((item) => item.id === Number(key));
    editGrocery(key);
    document.querySelector(".modal__input").value = groceryList[i].text;
    showModal();

    document
      .querySelector(".modal__form")
      .addEventListener("submit", function () {
        groceryList[i].text = document.querySelector(".modal__input").value;
        renderGrocery(groceryList[i]);
        window.location.reload();
      });
  }

  if (e.target.classList.contains("delete__btn")) {
    const key = e.target.closest(".grocery__item").dataset.id;
    deleteGrocery(key);
  }
});

const updateGrocery = function () {
  const modalInput = document.querySelector(".modal__input");

  if (modalInput.value !== "") {
    closeModal();
  }
};

const editGrocery = function (key, value) {
  const item = groceryList.find((item) => item.id === Number(key));
  console.log(item);
};

const deleteGrocery = function (key) {
  const i = groceryList.findIndex((item) => item.id === Number(key));
  const groceryItem = {
    deleted: true,
    ...groceryList[i],
  };

  groceryList = groceryList.filter((item) => item.id !== Number(key));

  renderGrocery(groceryItem);
};

modalForm.addEventListener("submit", function (e) {
  e.preventDefault();
  updateGrocery();
});

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const text = groceryInput.value;

  if (text !== "") {
    addGrocery(text.trim());
    clearInput();
    console.log(groceryList);
  } else {
    alert("Please Input a value");
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const data = JSON.parse(localStorage.getItem("Grocery"));

  if (!data) return;

  groceryList = data;

  groceryList.forEach((grocery) => {
    renderGrocery(grocery);
  });
});

clearAllBtn.addEventListener("click", function () {
  groceryList = [];
  groceryListEl.innerHTML = "";
  localStorage.removeItem("Grocery");
});
