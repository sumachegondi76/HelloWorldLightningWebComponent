
import { LightningElement } from 'lwc';

export default class querySelector extends LightningElement {
    Fname ='suma';
    Lname = 'chegondi';
    handleClick(){
        var input = this.template.querySelectorAll('lightning-input').value;
        input.forEach(function(element){
            if(element.name ==="FirstName"){
                this.Fname=element.value
            }
           else if(element.name === "LastName"){
                this.Lname=element.value
            }
        },this)
    }

}