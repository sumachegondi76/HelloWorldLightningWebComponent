import { LightningElement } from 'lwc';

export default class Demo extends LightningElement {
    firstname='';
    lastname='';
    handleChangeFirstname(event){
        this.firstname=event.target.value;
    }
    handleChangeLastname(event){
        this.lastname=event.target.value;
    }
    handleClick(){
        const searchEvent = new CustomEvent('getsearchevent',
        {detail:
            {
                Firstname : this.firstname,
                Lastname : this.lastname
            }
        
        
        });
        this.dispatchEvent(searchEvent);
    }
}