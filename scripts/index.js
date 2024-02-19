// @todo: Темплейт карточки
const cardTemplate = document.querySelector("#card-template").content;
// @todo: DOM узлы
const cardContainer = document.querySelector(".places__list");

// @todo: Функция создания карточки
function createCard(link, altText, name, deleteHandler) {
  const cardElement = cardTemplate
    .querySelector(".places__item")
    .cloneNode(true); //клонируем шаблон

  const cardImage = cardElement.querySelector(".card__image");
  cardImage.src = link; //наполняем содержимым
  cardImage.alt = altText;
  cardElement.querySelector(".card__title").textContent = name; //наполняем содержимым
  const cardDeleteButton = cardElement.querySelector(".card__delete-button"); // выбрали кнопку удаления
  cardDeleteButton.addEventListener("click", deleteCard); //слушатель удаления
  return cardElement; //возвращаем карточку
}
//функция добавлния карточки в дом
function addCard(cardElement) {
  cardContainer.append(cardElement); //сюда помещаем готовую карточку
}

// @todo: Функция удаления карточки
function deleteCard(event) {
  const iconDelete = event.target.closest(".places__item");
  iconDelete.remove();
}

// @todo: Вывести карточки на страницу
initialCards.forEach(function (item) {
  const card = createCard(item.link, item.name, deleteCard); // передаем картинки и текст
  addCard(card);
});
