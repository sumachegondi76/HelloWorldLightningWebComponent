import { LightningElement, wire } from "lwc";
import getAccountData from "@salesforce/apex/AccountHelper.getAccountData";
import { getObjectInfo, getPicklistValues } from "lightning/uiObjectInfoApi";
import ACCOUNT_INDUSTRY from "@salesforce/schema/Account.Industry";
import ACCOUNT_OBJECT from "@salesforce/schema/Account";

export default class ImperativeApexDemo extends LightningElement {
  data = [];
  options = [];

  @wire(getObjectInfo, {
    objectApiName: ACCOUNT_OBJECT
  })
  accountinfo;

  @wire(getPicklistValues, {
    recordTypeId: "$accountinfo.data.defaultRecordTypeId",
    fieldApiName: ACCOUNT_INDUSTRY
  })
  industryPicklist;
  columns = [
    { label: "Account NAme", fieldName: "Name" },
    { label: "Account Industry", fieldName: "Industry" },
    { label: "Account rating", fieldName: "rating" }
  ];
  selectedIndustry;

  handleChange(event) {
    this.selectedIndustry = event.target.value;
  }

  clickHandler() {
    getAccountData({
      inputIndustry: this.selectedIndustry
    })
      .then((result) => {
        console.log("account records", result);
        this.data = result;
      })
      .catch((error) => {
        console.log("Account error", error);
      });
  }
}
