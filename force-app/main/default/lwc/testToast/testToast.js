import { LightningElement } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

export default class TestToast extends LightningElement {
  handleClick() {
    console.log("Button clicked");
    this.dispatchEvent(
      new ShowToastEvent({
        title: "Test Toast",
        message: "This is a test toast notification.",
        variant: "success"
      })
    );
  }
}
