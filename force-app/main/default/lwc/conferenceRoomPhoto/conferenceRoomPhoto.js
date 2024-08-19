import { LightningElement, track } from "lwc";
import apexLogin from "@salesforce/apex/ConferenceController.apexLogin";
import registerUser from "@salesforce/apex/ConferenceController.registerUser";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import conferenceRoomPhoto from "@salesforce/resourceUrl/ConferenceRoomPhoto";
//import forgotPassword from "@salesforce/apex/ConferenceController.forgotPassword";
import resetPassword from "@salesforce/apex/ConferenceController.resetPassword";
export default class ConferenceRoomPhoto extends LightningElement {
  @track email = "";
  @track password = "";
  @track confirmPassword = "";
  @track firstName = "";
  @track lastName = "";
  @track loginEmail = "";
  @track loginPassword = "";
  @track isAuthenticated = false;
  @track conferenceRoomPhotoUrl = conferenceRoomPhoto;
  @track successMessage = "";
  @track errorMessage = "";
  @track showLoginForm = true;
  @track showRegistrationForm = false;
  @track showResetPasswordForm = false;
  @track passwordError = "";
  @track errorTooltipDisplayData = { password: "" };
  @track infoTooltipDisplayData = { password: "" };
  @track showTermsAndConditionsLoading = false;
  @track loginPasswordType = "password";
  @track passwordType = "password";
  @track confirmPasswordType = "password";
  @track loginEyeIcon = "utility:hide";
  @track eyeIcon = "utility:hide";
  @track confirmEyeIcon = "utility:hide";
  @track token = "";
  @track newPassword = "";
  @track message = "";
  //@track resetEmail = "";

  handleInputChange(event) {
    const field = event.target.dataset.id;
    if (field === "firstName") {
      this.firstName = event.target.value;
    } else if (field === "lastName") {
      this.lastName = event.target.value;
    } else if (field === "email") {
      this.email = event.target.value;
    } else if (field === "password") {
      this.password = event.target.value;
      this.validatePassword();
    } else if (field === "confirmPassword") {
      this.confirmPassword = event.target.value;
      this.validatePassword();
    } else if (field === "loginEmail") {
      this.loginEmail = event.target.value;
    } else if (field === "loginPassword") {
      this.loginPassword = event.target.value;
    }
  }
  validatePassword() {
    const passwordCheck =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(
        this.password
      );

    if (!passwordCheck) {
      this.passwordError =
        "Password must be a minimum of eight characters, at least one letter, one number, and one special character.";
      this.passwordSuccess = "";
    } else if (this.password !== this.confirmPassword) {
      this.passwordError = "Passwords do not match.";
      this.passwordSuccess = "";
    } else {
      this.passwordError = "";
      this.passwordSuccess = "Passwords match and meet the criteria.";
    }
  }

  handleEmailChange(event) {
    this.email = event.target.value;
  }
  handleNewPasswordChange(event) {
    this.newPassword = event.target.value;
    this.validatePassword();
  }

  handleConfirmNewPasswordChange(event) {
    this.confirmNewPassword = event.target.value;
    //this.validatePassword();
  }
  handleLogin() {
    // Assuming this is where the user logs in and you have the user's email
    const email = this.template.querySelector('[data-id="email"]').value;
    const event = new CustomEvent("userlogin", { detail: { email: email } });
    this.dispatchEvent(event);
  }

  handleForgotPassword(event) {
    event.preventDefault(); // Prevent default action for anchor tag
    console.log("Navigating to Reset Password Form");

    this.showLoginForm = false;
    this.showRegistrationForm = false;
    this.showResetPasswordForm = true;
    this.resetResetPasswordForm();

    console.log("showLoginForm:", this.showLoginForm);
    console.log("showRegistrationForm:", this.showRegistrationForm);
    console.log("showResetPasswordForm:", this.showResetPasswordForm);
  }

  handleResetPassword() {
    this.passwordError = "";
    this.passwordSuccess = "";

    if (!this.email && !this.newPassword && !this.confirmNewPassword) {
      this.showToast("Error", "Please fill out all fields.", "error");
      return;
    }
    if (this.newPassword !== this.confirmNewPassword) {
      this.showToast("Error", "Passwords do not match.", "error");
      return;
    }

    // if (this.newPassword !== this.confirmNewPassword) {
    //   this.showToast("Error", "Passwords do not match.", "error");
    //   return;
    // }
    // if (this.passwordError) {
    //   return; // Do not proceed if there's an error
    // }
    resetPassword({ email: this.email, newPassword: this.newPassword })
      .then((result) => {
        this.passwordError = "";
        this.passwordSuccess = "Password reset successful!";
        this.showToast("Success", result, "success");
        this.showLoginFormHandler(); // Redirect to login form after reset
        this.resetResetPasswordForm();
      })
      .catch((error) => {
        this.showToast(
          "Error",
          "An error occurred during password reset. Please try again.",
          "error"
        );
        console.error("Error during password reset:", error);
      });
  }

  // showLoginFormHandler() {
  //   this.showLoginForm = true;
  //   this.showRegistrationForm = false;
  //   this.showResetPasswordForm = false;
  // }
  resetResetPasswordForm() {
    this.newPassword = "";
    this.confirmNewPassword = "";
    this.email = "";
    this.passwordError = "";
    this.passwordSuccess = "";
  }

  toggleLoginPasswordVisibility() {
    if (this.loginPasswordType === "password") {
      this.loginPasswordType = "text";
      this.loginEyeIcon = "utility:preview";
    } else {
      this.loginPasswordType = "password";
      this.loginEyeIcon = "utility:hide";
    }
  }
  // Toggle registration password visibility
  togglePasswordVisibility(event) {
    const targetIcon = event.currentTarget;
    const inputField = targetIcon.previousElementSibling;

    if (inputField.type === "password") {
      inputField.type = "text";
      targetIcon.iconName = "utility:preview";
    } else {
      inputField.type = "password";
      targetIcon.iconName = "utility:hide";
    }
  }

  // Toggle confirm password visibility
  toggleConfirmPasswordVisibility() {
    if (this.confirmPasswordType === "password") {
      this.confirmPasswordType = "text";
      this.confirmEyeIcon = "utility:preview";
    } else {
      this.confirmPasswordType = "password";
      this.confirmEyeIcon = "utility:hide";
    }
  }
  register() {
    if (!this.firstName || !this.lastName || !this.email || !this.password) {
      this.showToast("Error", "All fields are required.", "error");
      return;
    }

    this.validatePassword();

    if (this.passwordError) {
      return; // Do not proceed with registration if there's an error
    }

    // Proceed with registration logic
    registerUser({
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password
    })
      .then((result) => {
        if (result === "Registration successful.") {
          this.isAuthenticated = true;
          this.dispatchEvent(
            new CustomEvent("login", {
              detail: { email: this.email }
            })
          );
          this.successMessage = result;
          this.errorMessage = "";
          this.showToast("Success", result, "success");
          this.showLoginForm = true;
          this.showRegistrationForm = false;
          this.resetForm();
        } else {
          this.showToast("Error", result, "error");
          this.errorMessage = result;
          this.successMessage = "";
        }
      })
      .catch((error) => {
        this.errorMessage =
          "An error occurred during registration. Please try again.";
        this.successMessage = "";
        this.showToast(
          "Error",
          "An error occurred during registration. Please try again.",
          "error"
        );
        console.error("Error during registration:", error);
      });
  }

  login() {
    console.log("Login method triggered");
    if (!this.loginEmail || !this.loginPassword) {
      this.showToast("Error", "Email and password are required.", "error");
      return;
    }

    apexLogin({ email: this.loginEmail, password: this.loginPassword })
      .then((result) => {
        if (result) {
          this.isAuthenticated = true;

          //this.conferenceRoomPhotoUrl = result.photoUrl; // Assuming result contains the photo URL
          // this.successMessage = "Login successful!";
          // this.errorMessage = "Invalid email or password.";
          this.showPhoto();
          const email = this.loginEmail;
          const event = new CustomEvent("userlogin", { detail: { email } });
          this.dispatchEvent(event);
        } else {
          this.showToast("Error", "Invalid email or password.", "error");
        }
      })
      .catch((error) => {
        this.errorMessage = "An error occurred during login. Please try again.";
        this.successMessage = "";
        this.showToast(
          "Error",
          "An error occurred during login. Please try again.",
          "error"
        );
        console.error("Error during login:", error);
      });
  }
  sendEmailToBookingForm() {
    const emailEvent = new CustomEvent("emailchange", {
      detail: { email: this.email }
    });
    this.dispatchEvent(emailEvent);
  }

  showPhoto() {
    if (this.isAuthenticated) {
      // Hide the registration and login forms
      this.showLoginForm = false;
      this.showRegistrationForm = false;
      // Show the photo container
      const formsContainer = this.template.querySelector(".forms-container");
      if (formsContainer) {
        formsContainer.style.display = "none"; // Make sure this is visible
      }
    }
  }

  navigateToBooking() {
    if (this.isAuthenticated) {
      const navigateEvent = new CustomEvent("navigate", {
        detail: { component: "conferenceHall" }
      });
      this.dispatchEvent(navigateEvent);
    } else {
      this.showToast("Error", "You must register or login first.", "error");
    }
  }

  showRegistrationFormHandler() {
    this.showLoginForm = false;
    this.showRegistrationForm = true;
  }

  showLoginFormHandler() {
    this.showLoginForm = true;
    this.showRegistrationForm = false;
    this.showResetPasswordForm = false;
  }
  resetForm() {
    this.firstName = "";
    this.lastName = "";
    this.email = "";
    this.password = "";
    this.confirmPassword = "";
  }
  showToast(title, message, variant) {
    console.log(
      `Toast - Title: ${title}, Message: ${message}, Variant: ${variant}`
    );
    const event = new ShowToastEvent({
      title,
      message,
      variant
    });
    this.dispatchEvent(event);
  }
}
