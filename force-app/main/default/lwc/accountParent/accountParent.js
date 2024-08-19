import { LightningElement } from 'lwc';

export default class AccountParent extends LightningElement {
    searchTextParent;
    handleEvent(event){
        this.searchTextParent = event.detail;
    }
}