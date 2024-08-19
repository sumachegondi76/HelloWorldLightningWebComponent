import { LightningElement,wire,api } from 'lwc';
import getAccountList from '@salesforce/apex/wireClass.getAccountList';
export default class WireUsingApex extends LightningElement {
    @api recordId;
    @wire (getAccountList,{accId:'$recordId'})
    accounts;
}