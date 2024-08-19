import { LightningElement,wire } from 'lwc';
import {
    APPLICATION_SCOPE,
    MessageContext,
     subscribe,
    unsubscribe,
} from 'lightning/messageService';
import MOVIE_CHANNEL from '@salesforce/messageChannel/movieChannel__c';
export default class MovieDetail extends LightningElement {
    subscription = null;
    loadComponent = false;
    movieDetails={};
    @wire(MessageContext)
    messageContext;
 // Standard lifecycle hooks used to subscribe and unsubsubscribe to the message channel
 connectedCallback() {
    this.subscribeToMessageChannel();
}
disconnectedCallback() {
    this.unsubscribeToMessageChannel();
}
    // Encapsulate logic for Lightning message service subscribe and unsubsubscribe
    subscribeToMessageChannel() {
        if (!this.subscription) {
            this.subscription = subscribe(
                this.messageContext,
                MOVIE_CHANNEL,
                (message) => this.handleMessage(message),
                { scope: APPLICATION_SCOPE }
            );
        }
    }
     // Handler for message received by component
    handleMessage(message) {
        let movieId = message.movieId;
        console.log("movieId",movieId);
        this.fetchMovieDetail(movieId);
    }
    unsubscribeToMessageChannel() {
        unsubscribe(this.subscription);
        this.subscription = null;
    }
    async fetchMovieDetail(movieId){
        let url = `https://www.omdbapi.com/?i=${movieId}&plot=full&apikey=e4e4d37e`;
      const res = await fetch(url);
      const data = await res.json();
      console.log("Movie Details",data);
      this.loadComponent = true;
      this.movieDetails = data;
    }
}