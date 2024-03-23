// @todo: Функция создания карточки
export function createCard(
  link,
  altText,
  name,
  deleteHandler,
  likeButton,
  handleCardClick
) {
  const cardTemplate = document.querySelector("#card-template").content; // @todo: Темплейт карточки
  const cardElement = cardTemplate
    .querySelector(".places__item")
    .cloneNode(true); //клонируем шаблон
  const cardImage = cardElement.querySelector(".card__image");
  const cardText = cardElement.querySelector(".card__title");

  cardImage.src = link; //наполняем содержимым
  cardImage.alt = altText;
  cardText.textContent = name; //наполняем содержимым

  // иконка удаления
  const cardDeleteButton = cardElement.querySelector(".card__delete-button"); // выбрали кнопку удаления
  cardDeleteButton.addEventListener("click", deleteHandler); //слушатель удаления

  // иконка лайка
  const cardLikeButton = cardElement.querySelector(".card__like-button"); //выбрали кнопку лайка
  cardLikeButton.addEventListener("click", function () {
    //слушатель клика
    likeButton(cardLikeButton);
  });

  // слушатель на открытие карточки
  cardImage.addEventListener("click", function () {
    handleCardClick(link, name);
  });

  return cardElement; //возвращаем карточку
}

// @todo: Функция удаления карточки
export function deleteCard(event) {
  const iconDelete = event.target.closest(".places__item");
  iconDelete.remove();
}

//функция изменения статуса сердечка карточки
export function likeCard(cardLikeButton) {
  cardLikeButton.classList.toggle("card__like-button_is-active");
}
