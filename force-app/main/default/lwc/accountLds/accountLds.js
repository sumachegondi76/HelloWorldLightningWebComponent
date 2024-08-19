import { createRecord,getRecord } from 'lightning/uiRecordApi';
import { LightningElement,track,wire } from 'lwc';

const fieldArray=['Account.Name','Account.Phone','Account.Website'];
export default class AccountLds extends LightningElement {
@track accountname;
@track accountphone;
@track accountwebsite;
@track recordId;

@wire(getRecord, {recordId:'$recordId',fields:fieldArray})
accountRecord;

accountnameHandler(event){
    this.accountname = event.target.value;
}

accountphoneHandler(event){
    this.accountphone = event.target.value;
}
accountwebsiteHandler(event){
    this.accountwebsite = event.target.value;
}
createAccount(){
const fields = {'Name' : this.accountname,'Phone':this.accountphone,'Website':this.accountwebsite};
const recordInput = {apiName:'Account',fields}


createRecord(recordInput).then(response => {
console.log('Account created successfully:',response.id );
this.recordId = response.id;
}).catch(error => {
console.error('Error creating  record:',error.body.message);
});
}

get retAccountName(){
    if(this.accountRecord.data){
        return this.accountRecord.data.fields.Name.value;
    }
    return undefined;
}
get retAccountPhone(){
    if(this.accountRecord.data){
        return this.accountRecord.data.fields.Phone.value;
    }
    return undefined;
}
get retAccountWebsite(){
    if(this.accountRecord.data){
        return this.accountRecord.data.fields.Website.value;
    }
    return undefined;
}
}