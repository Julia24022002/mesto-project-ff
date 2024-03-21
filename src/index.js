import "./pages/index.css"; // добавьте импорт главного файла стилей
import { initialCards } from "./cards"; //иморт карточек
import { createCard, deleteCard, likeButton } from "./card";
import { openModal, closeModal } from "./modal";

// @todo: DOM узлы
const cardContainer = document.querySelector(".places__list");
const popup = document.querySelectorAll(".popup"); //все попапы
const profileTitle = document.querySelector(".profile__title"); // Выберите элементы, куда должны быть вставлены значения полей
const profileDesc = document.querySelector(".profile__description");
const editButton = document.querySelector(".profile__edit-button"); //кнопка редактировать
const popupEdit = document.querySelector(".popup_type_edit"); // попап редактировать
const addButton = document.querySelector(".profile__add-button"); // кнопка добавления (+)
const popupNew = document.querySelector(".popup_type_new-card"); // попап дбавления (+)
const popupTypeImages = document.querySelector(".popup_type_image"); //картинка попап
const popupImages = document.querySelector(".popup__image");
const popupCaption = document.querySelector(".popup__caption");
const formElement = document.querySelector(".popup__form"); // Находим форму в DOM
const nameInput = formElement.querySelector(".popup__input_type_name"); // Находим поля формы в DOM
const jobInput = formElement.querySelector(".popup__input_type_description");
const formElementPlace = document.forms["new-place"]; // вывод новых карточек на страницу

// Обработчик «отправки» формы, хотя пока она никуда отправляться не будет
function handleSubmit(evt) {
  evt.preventDefault(); //  отмена стандартной отправки формы.
  const nameValue = nameInput.value; // Получите значение полей  из свойства value
  const jobValue = jobInput.value;
  // Вставьте новые значения с помощью textContent (Обновляем отображение на странице)
  profileTitle.textContent = nameValue;
  profileDesc.textContent = jobValue;
}
// Прикрепляем обработчик к форме: он будет следить за событием “submit” - «отправка»
formElement.addEventListener("submit", handleSubmit);

formElementPlace.addEventListener("submit", (evt) => {
  evt.preventDefault();
  // передаем новые значения
  const name = formElementPlace["place-name"].value;
  const link = formElementPlace.link.value;
  const altText = formElementPlace.value;
  // создаем новую карточку
  const cardElements = createCard(
    link,
    altText,
    name,
    deleteCard,
    likeButton,
    cardPopup
  );
  cardContainer.prepend(cardElements);
  formElementPlace.reset();
});

//функция добавлния карточки в дом
function addCard(cardElement) {
  cardContainer.append(cardElement); //сюда помещаем готовую карточку
}

// функция открытия карточки
function cardPopup(link, name) {
  popupImages.src = link;
  popupCaption.textContent = name;
  openModal(popupTypeImages);
}

//клик на редактировать
editButton.addEventListener("click", function () {
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDesc.textContent;
  openModal(popupEdit);
});

//клик на добавить
addButton.addEventListener("click", function () {
  openModal(popupNew);
});

// кнопка сохранить
const saveButton = document.querySelectorAll(".popup__button");
saveButton.forEach((button) => {
  button.addEventListener("click", function () {
    const popup = button.closest(".popup");
    closeModal(popup);
  });
});

//крестик
const closeButton = document.querySelectorAll(".popup__close");
//клик на крестик
closeButton.forEach((button) => {
  button.addEventListener("click", function () {
    const popup = button.closest(".popup");
    closeModal(popup);
  });
});
//функция закрытия через  оверлей
function closePopupByOverlay(event, popup) {
  if (event.target === popup) {
    closeModal(popup);
  }
}

// @todo: Вывести карточки на страницу
initialCards.forEach(function (item) {
  const card = createCard(
    item.link,
    item.altText,
    item.name,
    deleteCard,
    likeButton,
    cardPopup
  ); // передаем картинки и текст и удаление
  addCard(card);
});
