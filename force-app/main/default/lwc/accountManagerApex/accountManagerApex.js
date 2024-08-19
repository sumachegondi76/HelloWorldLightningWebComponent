import { LightningElement,track } from 'lwc';
import getAllAccounts from '@salesforce/apex/AccountManager.getAccounts';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';

export default class AccountManagerApex extends LightningElement {
    @track numberOfRecords;
    @track accounts;
    
    get responseRecieved(){
        if(this.accounts){
            return true;
        }
        return false;
    }
    numberOfAccountChange(event){
        this.numberOfRecords=event.target.value;
    }
    getAccounts(){
        getAllAccounts({numberOfRecords:this.numberOfRecords}).then(response =>{
            this.accounts = response;
            console.log('data:'+this.accounts);
            const toastEvent = new ShowToastEvent({
                title:'Accounts Loaded',
                message: this.numberOfRecords +'Accounts fetched from server',
                variant:'success',
            });
            this.dispatchEvent(toastEvent);
        }
            ).catch(error =>{
                console.error('error in fetching account records',error.body.message);
                const toastEvent = new ShowToastEvent({
                    title:'Error',
                    message: error.body.message,
                    variant:'error',
                });
                this.dispatchEvent(toastEvent);
            })
}
}