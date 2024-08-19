import { LightningElement } from 'lwc';

export default class CovertCurrency extends LightningElement {
    showOutput = false;
    convertedValue = "";
    toCurrency = "";
    fromCurrency = "";
    enteredamount = "";
    currencyOptions = [];

    connectedCallback(){
      this.fetchSymbols();
    }

    changeHandler(event){
      let{name,value}= event.target;
       if(name === "amount")
       this.enteredamount = value;
       if(name === "fromcurr")
       this.fromCurrency = value;
      if(name === "tocurr")
      this.toCurrency = value;
    }
    clickHandler(){
      this.conversion();
    }

    
      async fetchSymbols(){
        let endpoint = "https://api.frankfurter.app/currencies";
        try{
          let response = await fetch(endpoint);
          if(!response.ok){
            throw new Error("Network response was not OK");
          }
          const data = await response.json();   
          //process the data returned from api
          let options = [];
          // eslint-disable-next-line guard-for-in
          for(let symbol in data){
            options=[...options,{label:symbol,value:symbol}];
          }
             this.currencyOptions = [...options];
        }catch(error){
          console.log(error);
        }
      }
      async conversion(){
        // const host = 'api.frankfurter.app';
        // fetch(`https://${host}/latest?amount=10&from=GBP&to=USD`)
        //   .then(resp => resp.json())
        //   .then((data) => {
        //     alert(`10 GBP = ${data.rates.USD} USD`);
        //   });
        let endpoint = `https://api.frankfurter.app/latest?amount=${this.enteredamount}&from=${this.fromCurrency}&to=${this.toCurrency}`
      
        try{
          let response = await fetch(endpoint);
          if(!response.ok){
            throw new Error("Network response was not OK");
          }
          const data = await response.json();
          //process the data returned from api
         this.convertedValue=data.rates[this.toCurrency];
         this.showOutput=true;
        }catch(error){
          console.log(error);
        }
      }
    }
