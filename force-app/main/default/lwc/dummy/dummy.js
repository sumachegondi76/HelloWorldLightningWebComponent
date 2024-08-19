import { LightningElement} from 'lwc';

export default class Dummy extends LightningElement {
    firstName = '';
    lastName = '';
    handleEvent(event){
        this.firstName=event.detail.Firstname;
        this.lastName=event.detail.Lastname;
    }
}