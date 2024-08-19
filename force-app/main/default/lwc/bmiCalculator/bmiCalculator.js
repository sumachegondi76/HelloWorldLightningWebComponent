import { LightningElement,track } from 'lwc';

export default class BmiCalculator extends LightningElement {
    cardTitle = 'BMI Calculator';

    weight;
    height;

     bmi;
    onWeightChange(event){
        this.weight = parseFloat(event.target.value);
    }
    onHeightChange(event){
        this.height = parseFloat(event.target.value);
    }
    calculateBMI(){
        this.bmi = this.weight/(this.height*this.height);
    }
    get bmiValue(){
        if(this.bmi === undefined){
            return "";
        }
        return `Your BMI is: ${this.bmi}`;
    }
}