/* eslint-disable no-alert */
// accountSearchAndDetails.js
import { LightningElement, track, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import searchAccounts from '@salesforce/apex/AccountController.searchAccounts';


const columns = [
    { label: 'Account Name', fieldName: 'Name', type: 'button',
      typeAttributes:{label:{fieldName:'Name'},name:'view_details',variant:'base'} },
    { label: 'Industry', fieldName: 'Industry', type: 'text' },
    { label: 'Phone', fieldName: 'Phone', type: 'text' },
    { label: 'Website', fieldName: 'Website', type: 'url' },
];

export default class AccountSearchAndDetails extends NavigationMixin(LightningElement) {
    @track searchTerm = '';
    @track accounts = [];
    record={};
    columns=columns;

    @wire(searchAccounts, { searchTerm: '$searchTerm' })
    wiredAccounts({ error, data }) {
        if (data) {
            this.accounts = data.map(account => ({ ...account, Id: account.Id }));
        } else if (error) {
            console.error('Error fetching accounts', error);
        }
    }

    handleSearchTermChange(event) {
        this.searchTerm = event.target.value;
    }

    handleRowAction(event) {
        const action = event.detail.action.name;
        const row = event.detail.row;
        //    alert('action'+action);
        //    alert('selected values:'+JSON.stringify(row));
        if (action === 'view_details') {
            this.navigateToRecord(row);
        }
        // switch(action){
        //     case "view_details":
        //         this.navigateToRecord(row);
        //         break;
        //     default:
        //         break;    
        // }
    }

    navigateToRecord(row) {
        this.record = row;
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.record.Id,
                objectApiName: 'Account',
                actionName: 'view'
            }
        });
    }
   

    // get columns() {
    //     return columns;
    // }
}
