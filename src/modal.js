//функция открытия модального окна и добавление слушателя
export function openModal(popup) {
  popup.classList.add("popup_is-opened");
  popup.classList.add("popup_is-animated"); //анимация
  document.addEventListener("keydown", (event) => {
    closePopupOnEsc(event, popup); // добавляем при открытии обработчик
  });
}

//функция закрытия модального окна и снятие слушателя
export function closeModal(popup) {
  popup.classList.remove("popup_is-opened");
  document.removeEventListener("keydown", closePopupOnEsc); //убираем обработчик при закрытии
}

//функция закрытия через  Esc
function closePopupOnEsc(event, popup) {
  if (event.key === "Escape") {
    closeModal(popup);
  }
}

//обработчик клик на оверлей для закрытия попапа
popup.forEach((popup) => {
  popup.addEventListener("click", function (event) {
    closePopupByOverlay(event, popup);
  });
});

//обработчик клик на Esc для закрытия попапа
popup.forEach((popup) => {
  popup.addEventListener("keydown", function (event) {
    closePopupOnEsc(event, popup);
  });
});
