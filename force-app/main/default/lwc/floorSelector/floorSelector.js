import { LightningElement, wire, track, api } from "lwc";
import getFloors from "@salesforce/apex/ConferenceController.getFloors";

export default class FloorSelector extends LightningElement {
  @track floors;
  @api floorOptions = [];
  @wire(getFloors)
  wiredFloors({ error, data }) {
    if (data) {
      this.floors = data;
    } else if (error) {
      this.floors = undefined;
    }
  }

  handleFloorChange(event) {
    // Check if the selected floor has changed before dispatching an event
    const selectedFloorId = event.detail.value;
    if (selectedFloorId !== this.selectedFloorId) {
      const floorChangeEvent = new CustomEvent("floorchange", {
        detail: selectedFloorId
      });
      this.dispatchEvent(floorChangeEvent);
      this.selectedFloorId = selectedFloorId; // Optionally update local state
    }
  }
}
