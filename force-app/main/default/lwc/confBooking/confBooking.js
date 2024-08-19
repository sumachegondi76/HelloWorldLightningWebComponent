import { LightningElement, track } from "lwc";

export default class ConfBooking extends LightningElement {
  handleDateChange(event) {
    const selectedDate = event.target.value;
    const dateChangeEvent = new CustomEvent("datechange", {
      detail: selectedDate
    });
    this.dispatchEvent(dateChangeEvent);
  }
}
