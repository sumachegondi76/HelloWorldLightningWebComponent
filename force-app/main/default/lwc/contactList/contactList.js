import { LightningElement ,wire} from 'lwc';
import FIRSTNAME_FIELD from '@salesforce/schema/Contact.FirstName';
import LASTNAME_FIELD from '@salesforce/schema/Contact.LastName';
import EMAIL_FIELD from '@salesforce/schema/Contact.Email';
import getContacts from '@salesforce/apex/ContactController.getContacts';
import { reduceErrors } from 'c/ldsUtils';

const COLUMNS = [
    { label: 'Contact FirstName', fieldName: FIRSTNAME_FIELD.fieldApiName, type:'text'},
    { label: 'Contact LastName',fieldName: LASTNAME_FIELD.fieldApiName,type:'text'},
    { label: 'Email',fieldName: EMAIL_FIELD.fieldApiName,type :'Email'}
];
export default class ContactList extends LightningElement {
    columns = COLUMNS;
@wire (getContacts)
contacts;

get errors(){
    return(this.contacts.error)?
    reduceErrors(this.contacts.error) : [];
}
}