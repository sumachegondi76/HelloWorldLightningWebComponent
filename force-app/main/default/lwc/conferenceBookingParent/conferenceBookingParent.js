import { LightningElement, track } from "lwc";

export default class ParentComponent extends LightningElement {
  @track selectedDate;
  @track selectedFloorId;
  @track selectedRoomId;
  @track selectedTimeSlot;
  @track showFloorsSection = false;
  @track showRoomsSection = false;
  @track showBookingForm = false;

  handleDateChange(event) {
    this.selectedDate = event.detail;
    this.showFloorsSection = true;
    this.showRoomsSection = false;
    this.showBookingForm = false;
  }

  showFloors() {
    this.showFloorsSection = true;
  }

  handleFloorChange(event) {
    this.selectedFloorId = event.detail;
    this.showRoomsSection = true;
  }

  handleBooking(event) {
    this.selectedRoomId = event.detail.roomId;
    this.selectedTimeSlot = event.detail.timeSlot;
    this.showBookingForm = true;
  }

  handleBookingComplete() {
    this.showBookingForm = false;
    this.showRoomsSection = false;
    this.showFloorsSection = false;
    // Optionally, display a success message or refresh the components
  }
}
