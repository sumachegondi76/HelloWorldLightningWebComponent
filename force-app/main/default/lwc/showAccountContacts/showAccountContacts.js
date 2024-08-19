/* eslint-disable no-undef */
import { LightningElement,wire,api } from 'lwc';
import { MessageContext,subscribe, unsubscribe } from 'lightning/messageService';

import Acc from '@salesforce/messageChannel/Acc__c';
import getAccountContacts from '@salesforce/apex/AccountClass.getAccountContacts';
import LightningConfirm from 'lightning/confirm';
import { deleteRecord } from 'lightning/uiRecordApi';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';

export default class ShowAccountContacts extends LightningElement {
subscription=null;

title='Contacts';
contacts=[];
hascontacts=false;
isAccountelected=false;
isAddContactClicked=false;
isEditClicked=false;
@api recordId;
editableContactId;

@wire(MessageContext)messageContext;
accountId;
accountName;
    connectedcallback(){ 
        this.handleSubscribe();
    } 
  disconnectedCallback()
  {
    this.handleUnsubscribe();
  }
  handleSubscribe(){

    if(!this.subscription)
    {
       this.subscription=subscribe(this.messageContext,Acc,
        (parameter)=>
        {
            this.accountId=parameter.accountId;
            this.accountName=parameter.accountName;
            this.title=this.accountName+"'s Contacts";
            this.getContacts();
            //this.hascontacts=this.contacts.length>0?true:false;
        }
        );

    }
    console.log('Event subscribed');
  }
 
  async getContacts(){
    this.contacts=await getAccountContacts({accountId:this.accountId});
    this.hascontacts=this.contacts.length>0?true:false;
    this.isAccountelected=true;
        }
  
 
  handleUnsubscribe()
  { 

    if(this.subscription){
    unsubscribe(this.subscription);
    this.subscription=null;
  }
}
  handleAddContact(){
    this.isAddContactClicked=true;
  }
  handleAddContactCancel(){
    this.isAddContactClicked=false;
  }

  handleEdit(event){
    this.isEditClicked=true;
    this.editableContactId=event.dataset.contactId;
  }
  handleEditCancel(){
    this.isEditClicked=false;
  }
  handleSuccess(){
    this.isAddContactClicked=false;
    this.isEditClicked=false;
    this.getContacts();
  }
  async handleDelete(event){
    this.editableContactId=event.dataset.contactId
      // eslint-disable-next-line no-unused-vars
      const result = await LightningConfirm.open({
          message: 'Are you sure you want to delete this contact',
          variant: 'headerless',
          label: 'this is the aria-label value',
          // setting theme would have no effect
      });
      if(result)
      {
       // eslint-disable-next-line no-unused-vars
       let deleteResult= await deleteRecord(editableContactId);
       this.getContacts();
       this.showToast();

      }
    }
    showToast() {
      const event = new ShowToastEvent({
          title: 'Delete contact',
          message:
              'contact deleted successfuly',
      });
      this.dispatchEvent(event);
  }
}