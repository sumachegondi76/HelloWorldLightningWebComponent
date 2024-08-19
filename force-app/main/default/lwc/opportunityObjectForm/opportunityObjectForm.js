import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import createCustomObject from '@salesforce/apex/OpportunityObjectController.createCustomObject';

export default class OpportunityObjectForm extends LightningElement {
    @api recordId;
    name = '';
    customObjectField1 = '';
    

    handleFieldChange(event) {
       
        const fieldName = event.target.name;
        this[fieldName] = event.target.value;
    }

    handleSuccess(event) {
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: 'CustomObject created successfully.',
                variant: 'success',
            })
        );

    }

    handleError(event) {
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Error',
                message: 'Error creating CustomObject: ' + event.detail.message,
                variant: 'error',
            })
        );
    }

    handleSubmit(event) {
        
        event.preventDefault();

        // Call the Apex method to create the CustomObject record
        createCustomObject({
            opportunityId: this.recordId,
            name: this.name, 
            customObjectField1: this.customObjectField1,
            
        })
            .then((result) => {
               
                this.handleSuccess(result);
            })
            .catch((error) => {
                
                this.handleError(error);
            });
    }
}
