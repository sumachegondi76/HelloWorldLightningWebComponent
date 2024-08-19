import { LightningElement, api, track, wire } from "lwc";
import getConferenceRooms from "@salesforce/apex/ConferenceController.getConferenceRooms";
import getBookingsForDate from "@salesforce/apex/ConferenceController.getBookingsForDate";
// import deleteBookingRecord from "@salesforce/apex/ConferenceController.deleteBookingRecord";
const SEAT_AVAILABLE_CLASS =
  "seatButtonAvailableStyle slds-button slds-button_neutral slds-button_stretch";
const SEAT_SELECTED_CLASS =
  "seatButtonSelectedStyle slds-button slds-button_neutral slds-button_stretch";
const SEAT_BOOKED_CLASS =
  "seatButtonBookedStyle slds-button slds-button_neutral slds-button_stretch";

export default class ConferenceRooms extends LightningElement {
  @api floorId;
  @api bookingDate;
  @api floorName;
  @api floorOptions;
  //@api roomName;
  @track conferenceRooms = [];
  @track showSecondPage = true;
  @track showThirdPage = false;
  @track selectedRoomId = "";
  @track selectedRoom;
  @track selectedRoomName;
  @track selectedTimeSlot = "";
  @track bookings = [];
  @track error;
  @track showSelectBookingButton = false;
  @track selectedFloorId;
  @track slot;
  @track isSaveButtonDisabled = true;
  seatAvailableClass = SEAT_AVAILABLE_CLASS;
  seatSelectedClass = SEAT_SELECTED_CLASS;
  seatBookedClass = SEAT_BOOKED_CLASS;
  @track image;
  // @track room;

  // @track previouslySelectedRoomId;
  // @track previouslySelectedTimeSlot;

  @wire(getConferenceRooms, {
    floorId: "$floorId",

    bookingDate: "$bookingDate"
  })
  wiredConferenceRooms({ error, data }) {
    if (data) {
      this.conferenceRooms = data.map((room) => {
        return {
          ...room,
          RoomImageUrl: this.extractImageUrl(room.RoomImageUrl) // Adjust this if needed
        };
      });
      this.error = undefined;
      this.checkIfAllRoomsBooked();
      // this.resetFloorColors();
    } else if (error) {
      this.error = error;
      this.conferenceRooms = [];
    }
  }

  extractImageUrl(richTextContent) {
    let parser = new DOMParser();
    let doc = parser.parseFromString(richTextContent, "text/html");
    let imgElement = doc.querySelector("img");

    if (imgElement) {
      return imgElement.src;
    }

    return richTextContent;
  }

  @wire(getBookingsForDate, { bookingDate: "$bookingDate" })
  wiredBookings({ error, data }) {
    if (data) {
      this.bookings = data;
      this.checkIfAllRoomsBooked();
      console.log("Fetched bookings for date:", data);
    } else if (error) {
      this.error = error;
      this.bookings = [];
      console.error("Error fetching bookings for date:", error);
    }
  }
  checkIfAllRoomsBooked() {
    if (this.conferenceRooms.length > 0) {
      let allRoomsBooked = true;
      this.conferenceRooms.forEach((room) => {
        if (!room.TimeSlots.every((slot) => slot.booked)) {
          allRoomsBooked = false;
        }
      });

      if (allRoomsBooked) {
        this.dispatchEvent(new CustomEvent("allroomsbooked"));
      } else {
        this.dispatchEvent(new CustomEvent("notallroomsbooked"));
      }
    }
  }
  // connectedCallback() {
  //   this.addEventListener("resetfloorcolors", this.handleResetFloorColors);
  // }
  // connectedCallback() {
  //   this.previouslySelectedRoomId = null;
  //   this.previouslySelectedTimeSlot = null;
  // }

  handleRoomClick(event) {
    const roomId = event.currentTarget.dataset.roomId;
    const roomName = event.currentTarget.dataset.roomName;

    // Log and set properties
    console.log("Room Clicked ID:", roomId);
    console.log("Room Clicked Name:", roomName);

    this.selectedRoomId = roomId;
    this.selectedRoomName = roomName;
    this.selectedTimeSlot = null; // Reset selected time slot

    // Reset and highlight room
    this.resetSelectedTimeSlot();
    this.highlightSelectedRoom();

    this.dispatchEvent(
      new CustomEvent("roomselect", {
        detail: {
          roomName: this.selectedRoomName,
          roomId: this.selectedRoomId
        }
      })
    );

    this.updateSaveButtonState();
  }
  handleSelectBookingForm() {
    // this.previouslySelectedRoomId = this.selectedRoomId;
    // this.previouslySelectedTimeSlot = this.selectedTimeSlot;

    const selectBookingFormEvent = new CustomEvent("selectbookingform", {
      detail: {
        roomId: this.selectedRoomId,
        roomName: this.selectedRoomName, // Pass selected room name
        floorName: this.floorName, // Pass floor name
        timeSlot: this.selectedTimeSlot,
        bookingDate: this.bookingDate
      }
    });
    this.dispatchEvent(selectBookingFormEvent);
    console.log("roomName" + this.selectedRoomName);

    console.log("timeSlot" + this.selectedTimeSlot);
  }

  resetSelectedTimeSlot() {
    // Remove selected-timeslot class from all time slots
    this.template.querySelectorAll(".timeslot-tile").forEach((tile) => {
      tile.classList.remove("selected-timeslot");
    });
  }
  @api
  highlightSelectedRoomAndTimeSlot(
    selectedRoomId = "",
    selectedTimeSlot = "",
    selectedRoomName = ""
  ) {
    this.selectedRoomId = selectedRoomId;
    this.selectedRoomName = selectedRoomName;
    this.selectedTimeSlot = selectedTimeSlot;

    this.highlightSelectedRoom();
    this.highlightSelectedTimeSlot();
    //this.showSelectBookingButton = true;
    this.updateSaveButtonState();
  }

  // handleBackFromBookingForm(event) {
  //   const backEvent = new CustomEvent("back", {
  //     detail: {
  //       selectedRoomId: this.selectedRoomId,
  //       selectedTimeSlot: this.selectedTimeSlot
  //     }
  //   });
  //   this.dispatchEvent(backEvent);
  // }
  handleTimeSlotClick(event) {
    const timeslot = event.currentTarget.dataset.timeslot;
    const roomId = event.currentTarget.dataset.roomId;

    console.log("Time Slot Clicked:", timeslot);
    console.log("Room ID Clicked:", roomId);

    if (roomId === this.selectedRoomId) {
      const room = this.conferenceRooms.find(
        // eslint-disable-next-line no-shadow
        (room) => room.Id === this.selectedRoomId
      );
      if (room) {
        const selectedTimeSlotExists = room.TimeSlots.find(
          (slot) => slot.slot === timeslot
        );
        if (selectedTimeSlotExists && !selectedTimeSlotExists.booked) {
          this.selectedTimeSlot = timeslot;

          this.highlightSelectedTimeSlot();
          this.updateSaveButtonState();
          this.dispatchEvent(
            new CustomEvent("timeslotselect", {
              detail: { timeSlot: this.selectedTimeSlot }
            })
          );
        } else {
          console.error(`Time slot '${timeslot}' not found or already booked.`);
        }
      } else {
        console.error(`Room with ID '${this.selectedRoomId}' not found.`);
      }
    } else {
      console.error(`Clicked time slot does not belong to the selected room.`);
    }
  }

  isTimeSlotBooked(timeslot) {
    const bookedSlots = this.bookings.map((booking) => booking.Time_Slot__c);
    return bookedSlots.includes(timeslot);
  }
  handlePreviousPage2() {
    this.showSecondPage = true;
    const previousPageEvent = new CustomEvent("previouspage");
    this.dispatchEvent(previousPageEvent);
  }
  getRoomTileClass(roomId) {
    return roomId === this.selectedRoomId
      ? "room-tile selected-room"
      : "room-tile";
  }
  @api
  set rooms(data) {
    this.conferenceRooms = data;
    this.highlightBookedTimeSlots();
  }

  get rooms() {
    return this.conferenceRooms;
  }
  // eslint-disable-next-line no-dupe-class-members
  connectedCallback() {
    this.highlightBookedTimeSlots();
  }

  renderedCallback() {
    this.highlightBookedTimeSlots();
    console.log("Component rendered.");
  }

  isTimeSlotDisabled(slot) {
    return !this.selectedRoomId || slot.booked;
  }

  highlightSelectedRoom() {
    this.template.querySelectorAll(".room-tile").forEach((tile) => {
      tile.classList.remove("selected-room");
    });
    const selectedTile = this.template.querySelector(
      `[data-room-id="${this.selectedRoomId}"]`
    );
    if (selectedTile) {
      selectedTile.classList.add("selected-room");
    }
  }

  highlightSelectedTimeSlot() {
    console.log("Highlighting selected time slot...");
    console.log("Selected Room ID:", this.selectedRoomId);
    console.log("Selected Time Slot:", this.selectedTimeSlot);

    try {
      // Ensure that selectedRoomId and selectedTimeSlot are defined
      // if (!this.selectedRoomId || !this.selectedTimeSlot) {
      //   console.error("Selected Room ID or Time Slot is undefined.");
      //   return;
      // }

      // Remove previous selection
      this.template.querySelectorAll(".timeslot-tile").forEach((tile) => {
        tile.classList.remove("selected-timeslot");
      });

      // Find the selected room
      const selectedRoom = this.conferenceRooms.find((room) => room.Id);
      console.log("Selected Room:", this.selectedRoomId);

      if (selectedRoom) {
        // Find and highlight the selected time slot
        const selectedTile = this.template.querySelector(
          `[data-room-id="${this.selectedRoomId}"][data-timeslot="${this.selectedTimeSlot}"]`
        );

        if (selectedTile) {
          selectedTile.classList.add("selected-timeslot");
        } else {
          console.error("Selected time slot element not found.");
        }
      } else {
        console.error(`Room with ID not found.`);
      }
    } catch (error) {
      console.error("Error in highlightSelectedTimeSlot:", error);
    }
  }

  // handleDeleteBooking(bookingId) {
  //   deleteBookingRecord({ bookingId })
  //     .then(() => {
  //       // Refresh the floor availability and UI after deletion
  //       this.dispatchEvent(new CustomEvent("bookingchanged"));
  //     })
  //     .catch((error) => {
  //       console.error("Error deleting booking:", error);
  //     });
  // }
  highlightBookedTimeSlots() {
    try {
      console.log("Highlighting booked time slots...");

      // Iterate over all rooms
      this.conferenceRooms.forEach((room) => {
        let allSlotsBooked = true;

        room.TimeSlots.forEach((slot) => {
          const slotTile = this.template.querySelector(
            `[data-room-id="${room.Id}"][data-timeslot="${slot.slot}"]`
          );

          if (slotTile) {
            // Apply booked class if the slot is booked
            if (slot.booked) {
              slotTile.classList.add("booked");
              console.log(
                `Time slot ${slot.slot} is booked. Applying booked class.`
              );
            } else {
              allSlotsBooked = false;
            }
          } else {
            console.error(
              `Time slot element with slot ${slot.slot} not found in the DOM.`
            );
          }
        });

        // Apply class to the room container if all time slots are booked
        const roomContainer = this.template.querySelector(
          `[data-room-id="${room.Id}"]`
        );

        if (allSlotsBooked && roomContainer) {
          roomContainer.classList.add("all-booked");
          console.log(
            `All time slots in room ${room.Id} are booked. Applying all-booked class.`
          );
        } else if (roomContainer) {
          roomContainer.classList.remove("all-booked");
        }
      });
    } catch (error) {
      console.error("Error in highlightBookedTimeSlots:", error);
    }
  }

  updateSaveButtonState() {
    this.isSaveButtonDisabled = !(this.selectedRoomId && this.selectedTimeSlot);
  }
}
