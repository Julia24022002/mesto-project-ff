import "../pages/index.css"; // добавьте импорт главного файла стилей
import { initialCards } from "../scripts/cards"; //иморт карточек
import { createCard, deleteCard, likeCard } from "../scripts/card";
import {
  openModal,
  closeModal,
  closePopupOnEsc,
  closePopupByOverlay,
} from "../scripts/modal";

// @todo: DOM узлы
const cardContainer = document.querySelector(".places__list");
const popups = document.querySelectorAll(".popup"); //все попапы
const profileTitle = document.querySelector(".profile__title"); // Выберите элементы, куда должны быть вставлены значения полей
const profileDesc = document.querySelector(".profile__description");
const editButton = document.querySelector(".profile__edit-button"); //кнопка редактировать
const popupEdit = document.querySelector(".popup_type_edit"); // попап редактировать
const addButton = document.querySelector(".profile__add-button"); // кнопка добавления (+)
const popupNew = document.querySelector(".popup_type_new-card"); // попап дбавления (+)
const popupTypeImages = document.querySelector(".popup_type_image"); //картинка попап
const popupImages = document.querySelector(".popup__image");
const popupCaption = document.querySelector(".popup__caption");
const profileForm = document.forms["edit-profile"]; // Находим форму в DOM
const nameInput = profileForm.querySelector(".popup__input_type_name"); // Находим поля формы в DOM
const jobInput = profileForm.querySelector(".popup__input_type_description");
const formElementPlace = document.forms["new-place"]; // вывод новых карточек на страницу

// Обработчик «отправки» формы, хотя пока она никуда отправляться не будет
function handleProfileFormSubmit(evt) {
  evt.preventDefault(); //  отмена стандартной отправки формы.
  const nameValue = nameInput.value; // Получите значение полей  из свойства value
  const jobValue = jobInput.value;
  // Вставьте новые значения с помощью textContent (Обновляем отображение на странице)
  profileTitle.textContent = nameValue;
  profileDesc.textContent = jobValue;

  closeModal(popupEdit);
}
// Прикрепляем обработчик к форме: он будет следить за событием “submit” - «отправка»
profileForm.addEventListener("submit", handleProfileFormSubmit);

formElementPlace.addEventListener("submit", (evt) => {
  evt.preventDefault();
  // передаем новые значения
  const name = formElementPlace["place-name"].value;
  const link = formElementPlace.link.value;
  const altText = name;
  // создаем новую карточку
  const cardElements = createCard(
    link,
    altText,
    name,
    deleteCard,
    likeCard,
    handleCardClick
  );
  cardContainer.prepend(cardElements);
  formElementPlace.reset();
  closeModal(popupNew);
});

//функция добавлния карточки в дом
function addCard(cardElement) {
  cardContainer.append(cardElement); //сюда помещаем готовую карточку
}

// функция открытия карточки
function handleCardClick(link, name) {
  popupImages.src = link;
  popupImages.alt = name;
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

//обработчик клик на оверлей для закрытия попапа
popups.forEach((popups) => {
  popups.addEventListener("click", function (event) {
    closePopupByOverlay(event, popups);
  });
});

//крестик
const closeButton = document.querySelectorAll(".popup__close");
//клик на крестик
closeButton.forEach((button) => {
  const popup = button.closest(".popup");  // 1 раз находим
  button.addEventListener("click", function () {  // а потом уже клик вешаем
    closeModal(popup);
  });
});


// @todo: Вывести карточки на страницу
initialCards.forEach(function (item) {
  const card = createCard(
    item.link,
    item.name,
    item.name,
    deleteCard,
    likeCard,
    handleCardClick
  ); // передаем картинки и текст и удаление
  addCard(card);
});
