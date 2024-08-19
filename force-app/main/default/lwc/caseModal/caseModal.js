/* eslint-disable @lwc/lwc/no-api-reassignments */
import { LightningElement, api } from 'lwc';

export default class CaseModal extends LightningElement {
    @api isModalVisible;
    @api selectedRecordId; // If you need the record Id in the modal
    @api isEditMode = false;

    // Fields for editing (add more fields as needed)
    caseSubject;
    caseDescription;

    // Handle the Close button click event
    handleCloseModal() {
        this.dispatchEvent(new CustomEvent('closemodal'));
    }

    // Handle the Edit button click event
    handleEditClick() {
        this.isEditMode = true;
        // Load existing record data for editing (use this.selectedRecordId to fetch the record details)
        // Example: Call Apex method to fetch case details based on this.selectedRecordId and set the fields for editing
    }

    // Handle the Save button click event
    handleSaveClick() {
        // Save logic: Call Apex method to update the record with the edited fields
        // Example: Call Apex method to update case details based on this.selectedRecordId and edited fields
        // Reset edit mode after saving
        this.isEditMode = false;
    }

    // Handle the Cancel button click event
    handleCancelClick() {
        // Reset fields and edit mode
        // Example: Reset this.caseSubject and this.caseDescription to their original values from the database
        this.isEditMode = false;
    }

    // Handle input field changes (you can add more fields and corresponding methods as needed)
    handleSubjectChange(event) {
        this.caseSubject = event.target.value;
    }

    handleDescriptionChange(event) {
        this.caseDescription = event.target.value;
    }
}
