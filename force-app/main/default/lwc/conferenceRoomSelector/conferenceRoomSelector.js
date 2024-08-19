import { LightningElement, api, track } from "lwc";
import getConferenceRooms from "@salesforce/apex/ConferenceController.getConferenceRooms";

export default class ConferenceRoomSelector extends LightningElement {
  @api floorId;
  @api selectedDate;
  @track conferenceRooms;
  timeSlots = ["9-12", "12-3", "3-6"];

  connectedCallback() {
    this.loadConferenceRooms();
  }

  @api
  loadConferenceRooms() {
    getConferenceRooms({ floorId: this.floorId, date: this.selectedDate })
      .then((result) => {
        this.conferenceRooms = result;
      })
      .catch((error) => {
        this.conferenceRooms = undefined;
      });
  }

  handleTimeSlotClick(event) {
    const roomId = event.target.dataset.room;
    const timeSlot = event.target.dataset.slot;
    const bookingEvent = new CustomEvent("booking", {
      detail: { roomId, timeSlot }
    });
    this.dispatchEvent(bookingEvent);
  }
}
