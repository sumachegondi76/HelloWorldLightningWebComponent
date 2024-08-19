import { LightningElement } from "lwc";

export default class FullNameUsingGetterSetter extends LightningElement {
  FirstName = "";
  LastName = "";
  FullName = "";

  changeHandler(event) {
    let { name, value } = event.target;
    if (name === "firstname") {
      this.FirstName = value;
    } else if (name === "lastname") {
      this.LastName = value;
    }
    this.FullName = this.FirstName + " " + this.LastName;
  }
}
