import { LightningElement, track, wire } from "lwc";
import getFloors from "@salesforce/apex/ConferenceRoomBookingController.getFloors";
import getConferenceRoomsByFloor from "@salesforce/apex/ConferenceRoomBookingController.getConferenceRoomsByFloor";
import getRoomBookings from "@salesforce/apex/ConferenceRoomBookingController.getRoomBookings";
import bookRoom from "@salesforce/apex/ConferenceRoomBookingController.bookRoom";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

export default class ConferenceRoomBooking extends LightningElement {
  @track floorOptions = [];
  @track selectedFloor;
  @track conferenceRooms = [];
  @track availabilityMap = {};
  @track selectedDate;
  @track selectedTimeSlot;

  timeSlotOptions = [
    { label: "9:00 AM - 12:00 PM", value: "09:00-12:00" },
    { label: "12:00 PM - 3:00 PM", value: "12:00-15:00" },
    { label: "3:00 PM - 6:00 PM", value: "15:00-18:00" },
    { label: "6:00 PM - 9:00 PM", value: "18:00-21:00" }
  ];

  @wire(getFloors)
  wiredFloors({ error, data }) {
    if (data) {
      this.floorOptions = data
        .map((floor) => {
          return { label: floor.Name, value: floor.Id };
        })
        .sort((a, b) => a.label.localeCompare(b.label));
      console.log("Floors loaded:", this.floorOptions);
    } else if (error) {
      this.showErrorToast("Error loading floors", error.body.message);
    }
  }

  handleFloorClick(event) {
    this.selectedFloor = event.target.value;
    console.log("Selected floor ID:", this.selectedFloor);

    if (this.selectedFloor) {
      getConferenceRoomsByFloor({ floorId: this.selectedFloor })
        .then((result) => {
          console.log("Conference rooms loaded:", result);
          this.conferenceRooms = result;
        })
        .catch((error) => {
          this.showErrorToast(
            "Error loading conference rooms",
            error.body.message
          );
        });
    } else {
      console.error("Floor ID is undefined");
    }
  }

  handleDateChange(event) {
    this.selectedDate = event.target.value;
  }

  handleTimeSlotChange(event) {
    this.selectedTimeSlot = event.detail.value;
  }

  checkAvailability(event) {
    const conferenceRoomId = event.target.dataset.id;
    const [start, end] = this.selectedTimeSlot.split("-");
    const startDateTime = new Date(`${this.selectedDate}T${start}:00.000Z`);
    const endDateTime = new Date(`${this.selectedDate}T${end}:00.000Z`);

    getRoomBookings({ conferenceRoomId, bookingDate: this.selectedDate })
      .then((result) => {
        let available = true;

        for (const booking of result) {
          const bookingStart = new Date(booking.Start_Time__c);
          const bookingEnd = new Date(booking.End_Time__c);
          if (startDateTime < bookingEnd && endDateTime > bookingStart) {
            available = false;
            break;
          }
        }

        this.availabilityMap = {
          ...this.availabilityMap,
          [conferenceRoomId]: available ? "Available" : "Not Available"
        };
      })
      .catch((error) => {
        this.showErrorToast("Error checking availability", error.body.message);
      });
  }

  bookRoom(event) {
    const conferenceRoomId = event.target.dataset.id;
    const [start, end] = this.selectedTimeSlot.split("-");
    const startDateTime = new Date(`${this.selectedDate}T${start}:00.000Z`);
    const endDateTime = new Date(`${this.selectedDate}T${end}:00.000Z`);

    bookRoom({
      conferenceRoomId,
      startTime: startDateTime,
      endTime: endDateTime
    })
      .then((result) => {
        this.showSuccessToast("Success", result);
        this.availabilityMap = {};
      })
      .catch((error) => {
        this.showErrorToast("Error booking room", error.body.message);
      });
  }

  showSuccessToast(title, message) {
    const evt = new ShowToastEvent({
      title: title,
      message: message,
      variant: "success"
    });
    this.dispatchEvent(evt);
  }

  showErrorToast(title, message) {
    const evt = new ShowToastEvent({
      title: title,
      message: message,
      variant: "error"
    });
    this.dispatchEvent(evt);
  }
}
