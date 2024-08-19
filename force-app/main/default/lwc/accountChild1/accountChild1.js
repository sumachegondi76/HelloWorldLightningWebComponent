import { LightningElement } from 'lwc';

export default class AccountChild1 extends LightningElement {
    searchTextChild1;
    handleChange(event){
        this.searchTextChild1=event.target.value;
    }
    handleClick(){
        const searchEvent = new CustomEvent('getsearchevent',{detail:this.searchTextChild1});
        this.dispatchEvent(searchEvent);
    }
}