import { LightningElement, track, api } from "lwc";
import bookConferenceRoom from "@salesforce/apex/ConferenceController.bookConferenceRoom";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

export default class BookingForm extends LightningElement {
  @track bookingSuccess = false;
  @track showThirdPage = true;
  @api roomId;
  @api roomName;
  @api floorName;
  @api timeSlot;
  @api floorId;
  @api bookingDate;
  @track isBookButtonDisabled = true;
  @api userEmail = "";
  @track name = "";
  //@track email = "";
  @track phone = "";
  @track address = "";

  handleInputChange(event) {
    const { name, value } = event.target;
    this[name] = value;
    this.validateInputs();
  }
  connectedCallback() {
    this.template.addEventListener(
      "userlogin",
      this.handleUserLogin.bind(this)
    );
  }

  handleUserLogin(event) {
    this.userEmail = event.detail.email;
    this.populateEmail();
  }

  populateEmail() {
    if (this.userEmail) {
      this.template.querySelector('[data-id="emailInput"]').value =
        this.userEmail;
      console.log("Email populated:", this.userEmail);
    } else {
      console.log("No email to populate");
    }
  }
  // handleEmailChange(event) {
  //   this.email = event.detail.email;
  // }
  validateInputs() {
    this.isBookButtonDisabled = !(this.name && this.phone && this.address);
  }

  bookRoom() {
    const bookingDetails = {
      roomId: this.roomId,
      floorId: this.floorId,
      date: this.bookingDate,
      timeSlot: this.timeSlot,
      name: this.name,
      email: this.userEmail,
      phone: this.phone,
      address: this.address
    };

    bookConferenceRoom({ bookingDetails })
      .then((result) => {
        if (result) {
          this.bookingSuccess = true;
          this.dispatchEvent(
            new ShowToastEvent({
              title: "Success",
              message: "Room booked successfully!",
              variant: "success"
            })
          );
        } else {
          this.showError("Failed to book the room.");
        }
      })
      .catch((error) => {
        console.error("Error booking room:", error);
        this.showError(error.body ? error.body.message : "Unknown error");
      });
  }

  showError(message) {
    this.dispatchEvent(
      new ShowToastEvent({
        title: "Error",
        message: message,
        variant: "error"
      })
    );
  }

  handlePreviousPage3() {
    this.showThirdPage = true;
    this.dispatchEvent(new CustomEvent("previouspage1"));
  }

  handleSubmit() {
    const submitEvent = new CustomEvent("submitbooking");
    this.dispatchEvent(submitEvent);
    this.bookRoom();
  }
}
