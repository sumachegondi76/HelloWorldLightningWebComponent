import { LightningElement,api } from 'lwc';

export default class MeetingRoom extends LightningElement {
@api meetingRoomInfo; 
@api showRoomProperty = false;
}