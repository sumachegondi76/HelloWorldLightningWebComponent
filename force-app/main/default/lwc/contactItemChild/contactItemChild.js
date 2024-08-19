import { LightningElement, api } from "lwc";

export default class ContactItemChild extends LightningElement {
  @api contact;

  clickHandler(event) {
    event.preventDefault();
    const selectionevent = new CustomEvent("selection", {
      detail: this.contact.Id
    });
    this.dispatchEvent(selectionevent);
  }
}
