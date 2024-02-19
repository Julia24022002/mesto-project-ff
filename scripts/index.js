// @todo: Темплейт карточки
const cardTemplate = document.querySelector("#card-template").content;
// @todo: DOM узлы
const cardContainer = document.querySelector(".places__list");
// @todo: Функция создания карточки
function addCard(link, name) {
  const cardElement = cardTemplate
    .querySelector(".places__item")
    .cloneNode(true); //клонируем шаблон

  cardElement.querySelector(".card__image").src = link; //наполняем содержимым
  cardElement.querySelector(".card__title").textContent = name; //наполняем содержимым
  const cardDeleteButton = cardElement.querySelector(".card__delete-button"); // выбрали кнопку удаления
  cardDeleteButton.addEventListener("click", cardDelete); //слушатель удаления
  cardContainer.append(cardElement); //сюда помещаем готовую карточку
}

initialCards.forEach(function (item) {
  addCard(item.link, item.name); // передаем картинки и текст
});

// @todo: Функция удаления карточки
function cardDelete(event) {
  const iconDelete = event.target.closest(".places__item");
  iconDelete.remove();
}

// @todo: Вывести карточки на страницу
