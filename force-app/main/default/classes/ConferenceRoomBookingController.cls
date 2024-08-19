public class ConferenceRoomBookingController {
  @AuraEnabled(cacheable=true)
  public static List<Floor__c> getFloors() {
    return [SELECT Id, Name FROM Floor__c ORDER BY Name ASC];
  }

  @AuraEnabled(cacheable=true)
  public static List<Conference_Room__c> getConferenceRoomsByFloor(Id floorId) {
    return [
      SELECT Id, Name, Floor__c
      FROM Conference_Room__c
      WHERE Floor__c = :floorId
    ];
  }

  @AuraEnabled(cacheable=true)
  public static List<Booking__c> getRoomBookings(
    Id conferenceRoomId,
    Date bookingDate
  ) {
    DateTime startDateTime = DateTime.newInstance(
      bookingDate.year(),
      bookingDate.month(),
      bookingDate.day()
    );
    DateTime endDateTime = DateTime.newInstance(
        bookingDate.year(),
        bookingDate.month(),
        bookingDate.day()
      )
      .addHours(23)
      .addMinutes(59);

    return [
      SELECT Id, Start_Time__c, End_Time__c
      FROM Booking__c
      WHERE
        Conference_Room__c = :conferenceRoomId
        AND Start_Time__c >= :startDateTime
        AND End_Time__c <= :endDateTime
    ];
  }

  @AuraEnabled
  public static String bookRoom(
    Id conferenceRoomId,
    DateTime startTime,
    DateTime endTime
  ) {
    Booking__c newBooking = new Booking__c(
      Conference_Room__c = conferenceRoomId,
      Start_Time__c = startTime,
      End_Time__c = endTime,
      Status__c = 'Requested'
    );
    insert newBooking;
    return 'Booking Requested';
  }
}
