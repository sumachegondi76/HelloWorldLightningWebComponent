import { LightningElement, wire } from "lwc";
import getContactList from "@salesforce/apex/contactApex.getContactList";
export default class ContactListParent extends LightningElement {
  @wire(getContactList) contacts;
  selectedContact;
  selectionHandler(event) {
    let selectedContactId = event.detail;
    this.selectedContact = this.contacts.data.find(
      (curritem) => curritem.Id === selectedContactId
    );
  }
}
