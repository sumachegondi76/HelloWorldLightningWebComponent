import { LightningElement,wire,api } from 'lwc';
import { getFieldValue, getRecord } from 'lightning/uiRecordApi';
export default class WireExample extends LightningElement {
@api recordId;

    @wire(getRecord,{recordId:'$recordId',fields:['Account.Name','Account.Phone']})
    accounts;

     // eslint-disable-next-line getter-return, consistent-return
     get getName(){
        if(this.accounts.data)
        return getFieldValue(this.accounts.data,'Account.Name');
        
         else if(this.accounts.error)
           return this.accounts.error;
    }

 // eslint-disable-next-line getter-return, consistent-return
 get getPhone(){
        if(this.accounts.data)
        return getFieldValue(this.accounts.data,'Account.Phone');
        
        else if(this.accounts.error)
            return this.accounts.error;
    }
    
}