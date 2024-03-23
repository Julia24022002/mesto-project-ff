//функция открытия модального окна и добавление слушателя
export function openModal(popup) {
  popup.classList.add("popup_is-animated"); //анимация
  setTimeout(() => {
    popup.classList.add("popup_is-opened"); // затем открываем карточку
  }, 1);
  document.addEventListener("keydown", closePopupOnEsc); // добавляем при открытии обработчик
}

//функция закрытия модального окна и снятие слушателя
export function closeModal(popup) {
  popup.classList.remove("popup_is-opened");
  document.removeEventListener("keydown", closePopupOnEsc); //убираем обработчик при закрытии
}

//функция закрытия через Esc
export function closePopupOnEsc(event) {
  if (event.key === "Escape") {
    const openedPopup = document.querySelector(".popup_is-opened");
    closeModal(openedPopup);
  }
}

//функция закрытия через  оверлей
export function closePopupByOverlay(event, popup) {
  if (event.target === popup) {
    closeModal(popup);
  }
}
