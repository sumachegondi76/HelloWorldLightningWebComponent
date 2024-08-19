import { LightningElement, wire } from 'lwc';
import getCaseRecordsWithContacts from '@salesforce/apex/CaseController.getCaseRecordsWithContacts';

export default class CaseRecordListParent extends LightningElement {
    caseRecords = [];
    selectedRecord={};
    isModalVisible = false;
    isEditMode = false;

    columns = [
         { label: 'Case ID', fieldName: 'Id', type: 'url',
         typeAttributes: { label: { fieldName: 'Id' }, target: '_blank' }},
         { label: 'Contact Name', fieldName: 'ContactName', type: 'url',
         typeAttributes: { label: { fieldName: 'ContactName' }, target: '_blank' } }
       
         
    ];

    @wire(getCaseRecordsWithContacts)
    wiredCaseRecords({ error, data }) {
        if (data) {
            this.caseRecords = data.map(record => {
                return {...record, CaseID: record.Id, ContactName: ( record.Contact ? record.Contact.Name : null ) };
            })
        } else if (error) {
            // Handle error
        }
    }

    handleRowAction(event) {
        console.log('Row Clicked:', event.detail.row);
        const action = event.detail.action;
        const row = event.detail.row;

        switch (action.name) {
            case 'view':
                this.viewRecordDetails(row);
                break;
            case 'edit':
                this.editRecordDetails(row);
                break;
            default:
                // Handle other actions if needed
        }
    }
    viewRecordDetails(row) {
        this.selectedRecord = row;
        this.isModalVisible = true;
        this.isEditMode = false;
    }

    handleEditClick() {
        this.isEditMode = true;
    }
    handleModalClose() {
        this.isModalVisible = false;
        this.selectedRecord = null;
        this.isEditMode = false;
    }
}
