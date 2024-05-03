import "../pages/index.css"; // добавьте импорт главного файла стилей
import { initialCards } from "../scripts/cards"; //иморт карточек
import { createCard, deleteCard, likeCard } from "../scripts/card";
import {
  openModal,
  closeModal,
  closePopupOnEsc,
  closePopupByOverlay,
} from "../scripts/modal";

import { enableValidation, clearValidation } from "../scripts/validation";
import {
  updateProfile,
  addNewCardToServer,
  userInfoPromise,
  cardsPromise,
  avatarServer,
} from "../scripts/api";
// @todo: DOM узлы
const cardContainer = document.querySelector(".places__list");
const popups = document.querySelectorAll(".popup"); //все попапы
const profileTitle = document.querySelector(".profile__title"); // Выберите элементы, куда должны быть вставлены значения полей
const profileDesc = document.querySelector(".profile__description");

const profileImage = document.querySelector(".profile__image"); // находим аватар
const popupAvatar = document.querySelector(".popup_type_avatar"); // попап для смены аватара
const avatarForm = document.forms["avatar-card"]; // Находим форму в DOM смены аватар

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

// Функция для изменения текста кнопки
function toggleButtonState(button, isLoading) {
  if (isLoading) {
    button.textContent = "Сохранение...";
    button.disabled = true;
  } else {
    button.textContent = "Сохранить";
    button.disabled = false;
  }
}

// Обработчик «отправки» формы изменения данных о пользователе
function handleProfileFormSubmit(evt) {
  evt.preventDefault();

  const saveButtonProfile = profileForm.querySelector(".button");
  toggleButtonState(saveButtonProfile, true);

  const nameValue = nameInput.value;
  const jobValue = jobInput.value;

  updateProfile(nameValue, jobValue) // Вызываем функцию для отправки запроса на сервер
    .then((data) => {
      profileTitle.textContent = nameValue;
      profileDesc.textContent = jobValue;
    })
    .catch((error) => {
      console.error("Ошибка при обновлении профиля:", error);
    })
    .finally(() => {
      toggleButtonState(saveButtonProfile, false);
      closeModal(popupEdit);
    });
}
// Прикрепляем обработчик к форме: он будет следить за событием “submit” - «отправка»
profileForm.addEventListener("submit", handleProfileFormSubmit);

formElementPlace.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const saveButtonPlace = formElementPlace.querySelector(".button");
  toggleButtonState(saveButtonPlace, true);
  // передаем новые значения
  const name = formElementPlace["place-name"].value;
  const link = formElementPlace.link.value;
  const altText = name;

  addNewCardToServer(name, link)
    .then((data) => {
      console.log("карточка успешно добавлена:", data);
      // Создаем новую карточку с данными с сервера
      const cardElements = createCard(
        link,
        altText,
        name,

        deleteCard,
        likeCard,
        handleCardClick,
        data.likes,
        data.owner._id, // передаем идентификатор владельца карточки
        data.userData, // передаем идентификатор текущего пользователя
        data._id // передаем идентификатор карточки
      );
      cardContainer.prepend(cardElements);
      formElementPlace.reset();
      closeModal(popupNew);
    })
    .catch((error) => {
      console.error("Ошибка при добавлении карточки:", error);
    })
    .finally(() => {
      // Восстанавливаем состояние кнопки после завершения обработки
      toggleButtonState(saveButtonPlace, false);
    });
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

  clearValidation(profileForm, validationConfig);
  openModal(popupEdit);
});

//клик на добавить
addButton.addEventListener("click", function () {
  clearValidation(formElementPlace, validationConfig);
  formElementPlace.reset();
  openModal(popupNew);
});

// клик на редактировать аватарку
profileImage.addEventListener("click", function () {
  clearValidation(avatarForm, validationConfig); // очистка ошибок
  avatarForm.reset(); //очистка формы
  openModal(popupAvatar);
});

// Добавляем обработчик события отправки формы
avatarForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const saveButtonAvatar = avatarForm.querySelector(".button");
  toggleButtonState(saveButtonAvatar, true);
  // Получаем ссылку на аватар из поля формы
  const newAvatarUrl = avatarForm.link.value;
  // Обновляем картинку на странице у пользователя
  profileImage.style.backgroundImage = `url(${newAvatarUrl})`;

  // Вызываем функцию для отправки запроса на сервер
  avatarServer(newAvatarUrl)
    .then((data) => {
      console.log("Аватар успешно обновлен:", data);
    })
    .catch((error) => {
      console.error("Ошибка при обновлении аватара:", error);
    })
    .finally(() => {
      toggleButtonState(saveButtonAvatar, false); // Сбрасываем состояние загрузки
    });

  closeModal(popupAvatar);
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
  const popup = button.closest(".popup"); // 1 раз находим
  button.addEventListener("click", function () {
    // а потом уже клик вешаем
    closeModal(popup);
  });
});

// валидацияя......................
// Слушатель события input
nameInput.addEventListener("input", function (evt) {
  // Выведем в консоль значение свойства validity.valid поля ввода,  на котором слушаем событие input
  console.log(evt.target.validity.valid);
});

// включение валидации вызовом enableValidation все настройки передаются при вызове
const validationConfig = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "form__submit_inactive",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__input_error_active",
};
enableValidation(validationConfig);

// Отображение предзагруженных карточек после получения данных пользователя и карточек
Promise.all([userInfoPromise(), cardsPromise()])
  .then(([userData, cardsData]) => {
    // Отображение информации о пользователе и карточек на странице
    profileTitle.textContent = userData.name; // имя пользователя
    profileDesc.textContent = userData.about; // описание пользователя
    profileImage.style.backgroundImage = `url(${userData.avatar})`; // аватар пользователя

    cardsData.forEach((card) => {
      const cardElement = createCard(
        card.link,
        card.altText,
        card.name,
        deleteCard,
        likeCard,
        handleCardClick,
        card.likes,
        card.owner._id, // передаем идентификатор владельца карточки
        userData._id, // передаем идентификатор текущего пользователя
        card._id // передаем идентификатор карточки
      );
      addCard(cardElement);
      // console.log(cardsData);
    });
  })
  .catch((err) => {
    console.log("Error fetching user and cards data: ", err);
  });
