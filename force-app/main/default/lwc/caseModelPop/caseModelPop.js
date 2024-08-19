/* eslint-disable default-case */
/* eslint-disable vars-on-top */
import { LightningElement,wire,track } from 'lwc';
import getCaseList from '@salesforce/apex/CaseController.getCaseRecordsWithContacts';
//Row Actions
const actions = [
    { label: 'Account', name: 'viewAccount'}, 
    { label: 'Contact', name: 'viewContact'}
];
const columns = [
    { label: 'Case Id', fieldName: 'CaseNumber',type:'text'},
     { label: 'Contact Name', fieldName:'ContactName',type:'button',
     typeAttributes:{label:{fieldName:'ContactName'},name:'viewContact',variant:'base'}},

     { label: 'Account Name', fieldName:'AccountName',type:'button',
     typeAttributes:{label:{fieldName:'AccountName'},name:'viewAccount',variant:'base'}},
    
     { label: 'Subject', fieldName: 'Subject' },
     {

        type: 'action',
        typeAttributes: { rowActions: actions },
    
    },
 ];
 
export default class CaseModelPop extends LightningElement {
    @track bShowModal = false;
    @track accRecordId;
    @track conRecordId;
    isviewForm = false;
    conForm = false;
    caseRecords = [];

    lstdata = [];
    error;
    columns = columns;

    @wire(getCaseList)
    lstdataWire({error,data})
    {
        if (data) {
            this.caseRecords = data.map(record => {
                return {...record, CaseID: record.Id, ContactName: ( record.Contact ? record.Contact.Name : null ), AccountName: ( record.Account ? record.Account.Name : null ) };
            })
        }
     else if(error)
     {   this.lstdata = undefined;
         this.error = error;
     }
    }
/* on click of closeModal  function the Modal popup will close */

    closeModal() {
        this.bShowModal = false;
    }
    
    handleRowAction(event) {
        var actionName = event.detail.action.name;
        console.log('this is the my actions' + actionName);
        var rowData = event.detail.row;
        console.log('This is row----' +JSON.stringify(rowData));

       
        switch(actionName){
            case 'viewAccount':
                //checking Account
                this.AccCurrentRecord(rowData.AccountId);
                break;  
               //checking Contact
            case 'viewContact':
                console.log('second case:');
                this.ConCurrentRecord(rowData.ContactId);
                break;  
        }
    }

    AccCurrentRecord(selectedAccRecord) {
            this.bShowModal = true;
            this.isviewForm = true;
            this.conForm = false;
            this.accRecordId = selectedAccRecord;
            console.log('This is the value of accRecordId: ' + this.accRecordId);
            
        }
    
        ConCurrentRecord(selectedConRecord)
        {
            this.bShowModal = true;
            this.isviewForm = false;
            this.conForm = true;
            this.conRecordId=selectedConRecord;
            console.log('This is the value of conRecordId: ' + this.conRecordId);

        }
}