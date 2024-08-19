/* eslint-disable @lwc/lwc/no-async-operation */
import { LightningElement, track, api, wire } from "lwc";
import getFloors from "@salesforce/apex/ConferenceController.getFloors";
// import deleteBookingRecord from "@salesforce/apex/ConferenceController.deleteBookingRecord";
import getBookingsByEmail from "@salesforce/apex/ConferenceController.getBookingsByEmail";
import cancelBooking from "@salesforce/apex/ConferenceController.cancelBooking";
import getFullyBookedFloors from "@salesforce/apex/ConferenceController.getFullyBookedFloors";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
const SEAT_AVAILABLE_CLASS =
  "seatButtonAvailableStyle slds-button slds-button_neutral slds-button_stretch";
const SEAT_SELECTED_CLASS =
  "seatButtonSelectedStyle slds-button slds-button_neutral slds-button_stretch";
const SEAT_BOOKED_CLASS =
  "seatButtonBookedStyle slds-button slds-button_neutral slds-button_stretch";

export default class ConferenceHall extends LightningElement {
  @api roomId;
  @api roomName;
  @api floorName;
  @track selectedDate;
  @track floorOptions = [];
  @track selectedFloorId;
  @track selectedRoomId;
  @track selectedFloorName;
  @track selectedRoomName;
  @track selectedTimeSlot;
  @track showGetFloorsButton = false;
  @track showFloorButton = false;
  @track showFloors = false;
  @track showFirstPage = true;
  @track showSecondPage = false;
  @track showThirdPage = false;
  @track showFourthPage = false;
  @track showSeatStatuses = false;
  @track showSelectRoomButton = false;
  @track errorMessage = "";
  @track previouslySelectedFloorId;
  @track previouslySelectedRoomId;
  @track previouslySelectedTimeSlot;
  @track showSpinner = false;
  @track currentStep = "step1";
  @track showPhoto = true;
  @track fullyBookedFloors = [];
  showSelectFloorText = false;
  seatAvailableClass = SEAT_AVAILABLE_CLASS;
  seatSelectedClass = SEAT_SELECTED_CLASS;
  seatBookedClass = SEAT_BOOKED_CLASS;
  @track registeredEmail; // Add this to store the registered email
  @track previousBookings = [];
  @track showCancelModal = false;
  @track bookingIdToCancel = null;

  // @track allRoomsFullyBooked = false;
  steps = [
    { label: "Select Date", value: "step1" },
    { label: "Select Floor", value: "step2" },
    { label: "Select Room", value: "step3" },
    { label: "Booking Form", value: "step4" },
    { label: "Confirmation", value: "step5" }
  ];
  handleNavigation(event) {
    if (event.detail.component === "conferenceHall") {
      this.showPhoto = false;
      this.showFirstPage = true;
    }
  }
  handleBackToPhoto() {
    this.showPhoto = true;
  }

  // @wire(getUserBookings, { userId: "$userId" })
  // wiredBookings({ error, data }) {
  //   if (data) {
  //     this.userBookings = data;
  //   } else if (error) {
  //     console.error("Error fetching bookings", error);
  //   }
  // }

  handleCancelBooking(event) {
    this.bookingIdToCancel = event.target.dataset.bookingId;
    this.showCancelModal = true;
  }

  closeCancelModal() {
    this.showCancelModal = false;
    this.bookingIdToCancel = null;
  }
  confirmCancelBooking() {
    cancelBooking({ bookingId: this.bookingIdToCancel })
      .then(() => {
        this.showCancelModal = false;
        this.previousBookings = this.previousBookings.filter(
          (booking) => booking.Id !== this.bookingIdToCancel
        );
        this.dispatchEvent(
          new ShowToastEvent({
            title: "Success",
            message: "Booking canceled successfully",
            variant: "success"
          })
        );
      })
      .catch((error) => {
        this.dispatchEvent(
          new ShowToastEvent({
            title: "Error",
            message: "Failed to cancel booking",
            variant: "error"
          })
        );
        console.error("Error canceling booking: ", error);
      });
  }
  connectedCallback() {
    this.previouslySelectedFloorId = null;
    // this.loadFloors();
  }
  handleUserLogin(event) {
    this.registeredEmail = event.detail.email; // Capture the email from the event
    // Other logic related to user login can be added here
    this.loadPreviousBookings();
    console.log("Registered email:", this.registeredEmail);
  }

  isFutureDate(date) {
    const bookingDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to 00:00:00 to compare only dates
    return bookingDate >= today;
  }

  loadPreviousBookings() {
    if (this.registeredEmail) {
      getBookingsByEmail({ email: this.registeredEmail })
        .then((result) => {
          // Sort the bookings by date in descending order
          this.previousBookings = result
            .map((booking) => {
              return {
                ...booking,
                showCancelButton: this.isFutureDate(booking.Date__c)
              };
            })
            .sort((a, b) => {
              const dateA = new Date(a.Date__c);
              const dateB = new Date(b.Date__c);
              return dateB - dateA; // Descending order (newest to oldest)
            });
        })
        .catch((error) => {
          console.error("Error fetching previous bookings:", error);
        });
    }
  }

  handleDateChange(event) {
    this.selectedDate = event.target.value;
    this.errorMessage = "";

    if (!this.selectedDate || this.isInvalidDate(this.selectedDate)) {
      this.errorMessage = "Please select a valid date.";
      this.showGetFloorsButton = false;
      this.showFloors = false;
    } else {
      this.errorMessage = "";
      this.showGetFloorsButton = true;
      this.showFloors = true;
    }
  }

  handleGetFloors() {
    if (!this.selectedDate || this.isInvalidDate(this.selectedDate)) {
      this.errorMessage = "Please select a valid date.";
      this.selectedDate = null;
      this.showGetFloorsButton = false;
      this.showFloors = false;
      return;
    }

    this.errorMessage = "";
    this.showSpinner = true;
    this.loadFloors();
  }

  isInvalidDate(date) {
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate < today;
  }

  loadFloors() {
    getFloors({ cacheBuster: new Date().getTime() })
      .then((result) => {
        console.log("Floors loaded:", JSON.stringify(result));
        this.floorOptions = result.map((floor) => ({
          label: floor.Name,
          value: floor.Id,
          // name: parseInt(floor.Name), // Ensure sorting by numeric value
          // rooms: floor.Rooms,
          image: this.extractImageUrl(floor.Floor_Image__c)
        }));
        console.log("Floor options:", this.floorOptions);
        this.floorOptions.sort((a, b) => a.name - b.name);
        this.showFloors = true;
        this.showSelectFloorText = true;
        this.showSpinner = false;
        this.currentStep = "step2";
        this.showSeatStatuses = true;

        this.loadFullyBookedFloors();
      })
      .catch((error) => {
        console.error("Error loading floors:", JSON.stringify(error));
        this.errorMessage = error.message || "Unknown error";
        this.showSpinner = false;
      });
  }
  // Method to extract image URL from Rich Text Area content
  extractImageUrl(richTextContent) {
    let parser = new DOMParser();
    let doc = parser.parseFromString(richTextContent, "text/html");
    let imgElement = doc.querySelector("img");

    if (imgElement) {
      return imgElement.src;
    }

    return "";
  }
  loadFullyBookedFloors() {
    getFullyBookedFloors({ bookingDate: this.selectedDate })
      .then((result) => {
        this.fullyBookedFloors = result;
        this.checkAndHighlightFloors();
      })
      .catch((error) => {
        console.error("Error loading fully booked floors:", error);
      });
  }
  checkAndHighlightFloors() {
    const floorTiles = this.template.querySelectorAll(".floor-tile");
    floorTiles.forEach((tile) => {
      const floorId = tile.dataset.floorId;
      const isFullyBooked = this.isFloorFullyBooked(floorId);
      if (isFullyBooked) {
        tile.classList.add("floor-all-booked");
      } else {
        tile.classList.remove("floor-all-booked");
      }
    });
  }

  isFloorFullyBooked(floorId) {
    return this.fullyBookedFloors.some(
      (floor) => floor.Id === floorId && floor.IsFullyBooked
    );
  }

  // handleDeleteBooking(bookingId) {
  //   deleteBookingRecord({ bookingId })
  //     .then(() => {
  //       console.log("Booking deleted successfully.");
  //       // Refresh the floor availability and UI after deletion
  //       this.dispatchEvent(new CustomEvent("bookingchanged"));
  //     })
  //     .catch((error) => {
  //       console.error("Error deleting booking:", error);
  //     });
  // }
  // eslint-disable-next-line no-dupe-class-members
  // connectedCallback() {
  //   // Listen for booking changes event from conference rooms component
  //   this.addEventListener("bookingchanged", this.handleBookingChanged);
  // }

  // handleBookingChanged() {
  //   // Update floor highlighting when booking status changes
  //   this.checkAndHighlightFloors();
  // }

  // disconnectedCallback() {
  //   // Clean up event listener on component disconnect
  //   this.removeEventListener("bookingchanged", this.handleBookingChanged);
  // }
  handleFloorClick(event) {
    const newFloorId = event.currentTarget.dataset.floorId;

    if (this.selectedFloorId && newFloorId !== this.selectedFloorId) {
      this.resetSelections(); // Reset previous selections if floor changes
    }

    this.selectedFloorId = newFloorId;
    this.selectedFloorName = event.currentTarget.dataset.floorName;
    this.highlightSelectedFloor();
    this.showSelectRoomButton = true;
  }
  handleFloorSelection(event) {
    const newFloorId = event.currentTarget.dataset.floorId;

    if (this.selectedFloorId && newFloorId !== this.selectedFloorId) {
      this.resetSelections(); // Reset previous selections if floor changes
    }

    this.selectedFloorId = newFloorId;
    this.showSecondPage = true;
  }

  handleRoomSelection(event) {
    this.selectedRoomId = event.detail.roomId;
    this.selectedRoomName = event.detail.roomName;
    //this.checkAndHighlightFloors();
  }

  handleTimeSlotSelection(event) {
    this.selectedTimeSlot = event.detail.timeSlot;
    //this.checkAndHighlightFloors();
  }
  handleSelectConferenceRooms() {
    this.previouslySelectedFloorId = this.selectedFloorId;
    this.showFirstPage = false;
    this.showSecondPage = true;
    this.currentStep = "step3";
    this.previouslySelectedRoomId = this.selectedRoomId;
    this.previouslySelectedTimeSlot = this.selectedTimeSlot;
    setTimeout(() => {
      const conferenceRoomsComponent =
        this.template.querySelector("c-conference-rooms");
      if (conferenceRoomsComponent) {
        conferenceRoomsComponent.highlightSelectedRoomAndTimeSlot(
          this.selectedRoomId,
          this.selectedTimeSlot,
          this.selectedRoomName
        );
      }
    }, 0);
  }

  resetSelections() {
    this.selectedRoomId = null;
    this.selectedTimeSlot = null;
  }
  handleSelectBookingForm(event) {
    this.selectedRoomId = event.detail.roomId;
    this.selectedRoomName = event.detail.roomName;
    this.selectedFloorName = event.detail.floorName;
    this.selectedTimeSlot = event.detail.timeSlot;
    this.showSecondPage = false;
    this.showThirdPage = true;
    this.currentStep = "step4";
    const { roomId, roomName, floorName, timeSlot } = event.detail;

    console.log("Selected Room Name:", roomName);
    console.log("Selected Room ID:", roomId);
    console.log("Selected Floor Name:", floorName);
    console.log("Selected Time Slot:", timeSlot);
  }

  handlePreviousPage2() {
    this.showFirstPage = true;
    this.showSecondPage = false;
    this.currentStep = "step2";
    setTimeout(() => {
      this.highlightSelectedFloor();
      this.loadFullyBookedFloors();
      const dateInput = this.template.querySelector("#dateInput");
      if (dateInput) {
        dateInput.value = this.selectedDate;
      }
    }, 0);
  }

  handlePreviousPage3() {
    this.showSecondPage = true;
    this.showThirdPage = false;
    this.currentStep = "step3";
    setTimeout(() => {
      const conferenceRoomsComponent =
        this.template.querySelector("c-conference-rooms");
      if (conferenceRoomsComponent) {
        conferenceRoomsComponent.highlightSelectedRoomAndTimeSlot(
          this.selectedRoomId,
          this.selectedTimeSlot,
          this.selectedRoomName
        );
      }
    }, 0);
  }

  handleSubmitBooking(event) {
    this.showThirdPage = false;
    this.showFourthPage = true;
    this.currentStep = "step5";
  }

  handleBackToHome() {
    this.showFourthPage = false;
    this.showFirstPage = true;
    this.currentStep = "step1";
    this.selectedDate = null;
    this.floorOptions = [];
    this.selectedFloorId = null;
    this.selectedRoomId = null;
    this.selectedFloorName = null;
    this.selectedRoomName = null;
    this.selectedTimeSlot = null;
    this.showGetFloorsButton = false;
    this.showFloors = false;
    this.showSelectRoomButton = false;
    this.errorMessage = "";
    this.previouslySelectedFloorId = null;
  }

  highlightSelectedFloor() {
    this.template.querySelectorAll(".floor-tile").forEach((tile) => {
      tile.classList.remove("selected-floor");
    });
    const selectedTile = this.template.querySelector(
      `[data-floor-id="${this.selectedFloorId}"]`
    );
    if (selectedTile) {
      selectedTile.classList.add("selected-floor");
    }
  }
}
