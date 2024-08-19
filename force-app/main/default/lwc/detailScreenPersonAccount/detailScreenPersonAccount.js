import { LightningElement,track, wire} from 'lwc';
import getPersonalAccounts from '@salesforce/apex/PersonAccountController.getPersonalAccounts';
/* displays the coloums of the Personal Account*/
const columns = [
    { label: 'Account Name',fieldName:'Name', type:'button',
    typeAttributes:{label:{fieldName:'Name'},name:'viewContact',variant:'base'}},
    { label: 'Email',fieldName:'PersonEmail', type:'email'},
    { label: 'Phone',fieldName:'Phone', type:'Phone'},

];

export default class DetailScreenPersonAccount extends LightningElement {

   /* intially there is no sponsor recod after click account name  it visible*/ 
    selectedAccountId=false;
    personalAccounts=[];
     error;
    @track lstcolumns=columns;

    /This is a wire method from the apex class of PersonAccountController to call the data of getPersonalAccounts method/
   @wire(getPersonalAccounts)
    wiredPersonalAccounts({ error, data }) {
        if (data) {
            this.personalAccounts = data;
        } else if (error) {
            this.error = error;

        }
    }

    handleRowSelection(event) {
        const action = event.detail.action;
        const row = event.detail.row;

        switch (action.name) {
            case 'viewContact':
                this.selectedAccountId = row.Id;
                break;
            default:
                break;
        }
    }
}