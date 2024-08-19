import { LightningElement } from 'lwc';
import {NavigationMixin} from 'lightning/navigation';
export default class NavigationExample extends NavigationMixin (LightningElement) {

    openSalesForce(){
        console.log('navigated');
        this[NavigationMixin.Navigate]({
            type:'standard__webPage',
            attributes:{
                url: 'https://salesforce.com'
            }
        });
      
    }
}