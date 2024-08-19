import { LightningElement } from 'lwc';

export default class MeetingRooms extends LightningElement {
    meetingRoomInfo = [
        {roomName:'A-01',roomCapacity:'12'},
        {roomName:'A-02',roomCapacity:'5'},
        {roomName:'A-03',roomCapacity:'9'},
        {roomName:'B-01',roomCapacity:'7'},
        {roomName:'B-02',roomCapacity:'10'},
        {roomName:'C-01',roomCapacity:'20'}

    ];
}