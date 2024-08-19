import { LightningElement, api } from "lwc";

export default class Child extends LightningElement {
  @api myAttribute;
  connectedCallback() {
    this.myAttribute =  {...this.myAttribute, prop1:"3"};
    console.log(this.myAttribute.prop1 + this.myAttribute.prop2);
  }
}
