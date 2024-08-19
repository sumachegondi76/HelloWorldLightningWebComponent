import { LightningElement, api, wire } from "lwc";
import getLeadScore from "@salesforce/apex/LeadScoringClass.getLeadScore";
export default class LeadScoring extends LightningElement {
  @api recordId;
  totalPossibleScore = 70;
  leadScore;

  @wire(getLeadScore, { leadId: "$recordId" })
  getLeadWithScores({ error, data }) {
    if (data) {
      this.leadScore = data;
      console.log("lead score:", this.leadScore);
    } else if (error) {
      console.log("Error retrieving lead score:", error);
    }
  }
  get scoreClass() {
    if (this.leadScore >= 51 && this.leadScore <= 70) {
      return "score-green";
    } else if (this.leadScore >= 31 && this.leadScore <= 50) {
      return "score-orange";
    } else {
      this.leadScore >= 0 && this.leadScore <= 30;
      return "score-red";
    }
  }
}
