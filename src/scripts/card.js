import { deleteCardServer, likeCardServer, unlikeCardServer } from "./api";

// @todo: Функция создания карточки
export function createCard(
  link,
  altText,
  name,
  deleteHandler,
  likeButton,
  handleCardClick,
  likes,
  ownerId,
  currentUserId,
  cardId
) {
  const cardTemplate = document.querySelector("#card-template").content; // @todo: Темплейт карточки
  const cardElement = cardTemplate
    .querySelector(".places__item")
    .cloneNode(true); //клонируем шаблон
  const cardImage = cardElement.querySelector(".card__image");
  const cardText = cardElement.querySelector(".card__title");
  const cardDeleteButton = cardElement.querySelector(".card__delete-button");
  const cardLikeButton = cardElement.querySelector(".card__like-button");

  cardImage.src = link; //наполняем содержимым
  cardImage.alt = altText;
  cardText.textContent = name; //наполняем содержимым

  // отображаем количество лайков с сервера
  const likeCountElement = cardElement.querySelector(".like_count");
  likeCountElement.textContent =
    likes && Array.isArray(likes) ? likes.length : 0;

  // Добавляем обработчик удаления карточки
  if (ownerId === currentUserId) {
    cardDeleteButton.addEventListener("click", (evt) =>
      deleteHandler(evt, cardId)
    );
  } else {
    cardDeleteButton.classList.add("card__delete-button-unactive");
  }

  // Добавляем обработчик нажатия на кнопку лайка
  cardLikeButton.addEventListener("click", function () {
    likeCard(cardLikeButton, cardId, likeCountElement);
  });
  // слушатель на открытие карточки
  cardImage.addEventListener("click", function () {
    handleCardClick(link, name);
  });
  return cardElement; //возвращаем карточку
}

// @todo: Функция удаления карточки
export function deleteCard(event, cardId) {
  const iconDelete = event.target.closest(".places__item");
  deleteCardServer(cardId);
  iconDelete.remove();
}

//функция изменения статуса сердечка карточки
export function likeCard(cardLikeButton, cardId, likeCountElement) {
  const isLiked = cardLikeButton.classList.toggle(
    "card__like-button_is-active"
  );
  // делаем отметку понравилась не понравилась
  const likeChange = isLiked ? 1 : -1;

  if (isLiked) {
    likeCardServer(cardId);
  } else {
    unlikeCardServer(cardId);
  }
  // преобразуем из строки в число
  likeCountElement.textContent =
    parseInt(likeCountElement.textContent, 10) + likeChange;
}
