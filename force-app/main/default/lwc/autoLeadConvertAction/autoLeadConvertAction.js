import { LightningElement, api } from "lwc";
import LeadAssign from "@salesforce/apex/AutoLeadConvert.LeadAssign";
import { showToastEvent } from "lightning/platformShowToastEvent";
import { NavigationMixin } from "lightning/navigation";
export default class AutoLeadConvertAction extends NavigationMixin(
  LightningElement
) {
  @api recordId;

  @api invoke() {
    this.handleConvert();
  }
  handleConvert() {
    console.log("record id:", this.recordId);

    LeadAssign({ LeadIds: [this.recordId] })
      .then((result) => {
        console.log("lead conversion result:", result);
        this.showToast("success", "lead conversion successful", "success");
        this.navigateToOpportunity(result[this.recordId]);
        console.log("lead navigating result", this.navigateToOpportunity);
      })
      .catch((error) => {
        console.error("lead conversion error:", error);
        this.error = error;
        this.showToast(
          "error",
          "lead is not qualified or lead source is lessthan 50",
          "error"
        );
        console.log("lead conversion result", this.showToast);
      });
  }
  showToast(title, message, variant) {
    const evt = new showToastEvent({
      title: this.title,
      message: message,
      variant: variant
    });
    this.dispatchEvent(evt);
  }
  navigateToOpportunity(opportunityId) {
    this[NavigationMixin.Navigate]({
      type: "standard__recordPage",
      attributes: {
        recordId: opportunityId,
        actionName: "view"
      }
    });
  }
}
