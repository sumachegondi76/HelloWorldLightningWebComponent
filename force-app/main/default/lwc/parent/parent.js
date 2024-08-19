import { LightningElement } from "lwc";

export default class Parent extends LightningElement {
  parentObj;
  connectedCallback() {
    this.parentObj = { prop1: "1", prop2: "2" };
  }
}
