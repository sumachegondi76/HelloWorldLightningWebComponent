/* eslint-disable eqeqeq */
/* eslint-disable no-undef */
import { LightningElement,api,wire} from 'lwc';
import getAccounts from '@salesforce/apex/AccountClass.getAccounts';
import { MessageContext,publish } from 'lightning/messageService';
import Acc from '@salesforce/messageChannel/Acc__c';
export default class AccountChild2 extends LightningElement {
    //accountRecords = {};
    @api searchTextChild2; //search-text-child2
    @wire(MessageContext) messageContext;
   // @track searchtext=this.searchTextChild2;

   columns=[
    {label:'Id',fieldName:'Id'},
    {label:'Name',fieldName:'Name'},
    {label:'Actions',fieldName:'Actions',type:'button',typeAttributes:
{
    label:'View Contacts',
    value:'view_contacts'
}
}];
rows=[
    {
        Id:'65',Name:'suma'
    },
    { Id:'76',Name:'sri'},
    {Id:'87',Name:'bhav'}
]

connectedCallback() {
    console.log('Search Text in Child Component: ', this.searchTextChild2);
}

currentId;
currentName;
handleRowAction(event){
    if(event.detail.action.value ==='view_contacts'){
        this.currentId = event.detail.row.Id;
        this.currentName = event.detail.row.Name;

        const payload=
        {
            accountId:event.detail.row.Id,
            accountName:event.detail.row.Name
        };
        publish(this.messageContext,Acc,payload)
    }
    console.log('event published');
}    


// }
@wire(getAccounts)
accountRecords;
// ({ error, data }) {
//     if (data) {
//         console.log('Fetched Data: ', data);
//     } else if (error) {
//         console.error('Error fetching data: ', error);
//     }
// }

}