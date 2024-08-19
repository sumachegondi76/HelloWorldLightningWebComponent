public with sharing class ConferenceController {
  // Method to fetch floors
  @AuraEnabled(cacheable=true)
  public static List<Floor__c> getFloors() {
    if (Schema.sObjectType.Floor__c.isAccessible()) {
      List<Floor__c> floors = [
        SELECT Id, Name, Floor_Image__c
        FROM Floor__c
        ORDER BY Name
      ];
      System.debug('Fetched Floors: ' + floors);
      return floors;
    } else {
      // Handle lack of access, e.g., throw an exception or return an error message
      throw new AuraHandledException(
        'You do not have permission to view Floor records.'
      );
    }
  }

  // Method to fetch conference rooms for a specific floor and date
  @AuraEnabled(cacheable=true)
  public static List<ConferenceRoomWrapper> getConferenceRooms(
    String floorName,
    Id floorId,
    Date bookingDate
  ) {
    // Query conference rooms for the specified floor
    List<Conference_Room__c> rooms = [
      SELECT Id, Name, Room_Image__c
      FROM Conference_Room__c
      WHERE Floor__c = :floorId
      ORDER BY Name
    ];

    // Query bookings for the specified date
    List<Booking__c> bookings = [
      SELECT
        Name,
        Conference_Room__r.Name,
        Conference_Room__c,
        Floor__c,
        //Conference_Room__r.Floor__c,
        Floor__r.Name,
        Date__c,
        Time_Slot__c,
        Booked_By__c,
        Booked_By_Email__c,
        Phone__c,
        Address__c,
        Status__c
      FROM Booking__c
      WHERE Date__c = :bookingDate
    ];
    // Map to store booked rooms
    Set<Id> bookedRooms = new Set<Id>();
    for (Booking__c booking : bookings) {
      bookedRooms.add(booking.Conference_Room__c);
    }
    // Map to store booked time slots for each room
    Map<Id, Set<String>> roomBookings = new Map<Id, Set<String>>();
    for (Booking__c booking : bookings) {
      if (!roomBookings.containsKey(booking.Conference_Room__c)) {
        roomBookings.put(booking.Conference_Room__c, new Set<String>());
      }
      roomBookings.get(booking.Conference_Room__c).add(booking.Time_Slot__c);
    }

    // List to hold conference room wrappers
    List<ConferenceRoomWrapper> roomWrappers = new List<ConferenceRoomWrapper>();
    for (Conference_Room__c room : rooms) {
      // room.Room_Image__c = room.Room_Image__c;
      // room.Name = room.Name;
      // Determine if the room is fully booked
      Set<String> bookedSlots = roomBookings.containsKey(room.Id)
        ? roomBookings.get(room.Id)
        : new Set<String>();
      Boolean isRoomFullyBooked = bookedRooms.contains(room.Id);

      // Create a new ConferenceRoomWrapper instance
      ConferenceRoomWrapper roomWrapper = new ConferenceRoomWrapper(
        room,
        bookedSlots,
        isRoomFullyBooked
      );
      roomWrappers.add(roomWrapper);
    }

    return roomWrappers;
  }
  @AuraEnabled(cacheable=true)
  public static List<FloorWrapper> getFullyBookedFloors(Date bookingDate) {
    List<FloorWrapper> fullyBookedFloors = new List<FloorWrapper>();

    // Query all floors
    List<Floor__c> floors = [SELECT Id, Name FROM Floor__c];

    // Query all rooms on each floor
    List<Conference_Room__c> allRooms = [
      SELECT Id, Floor__c
      FROM Conference_Room__c
      WHERE Floor__c IN :floors
    ];

    // Query all bookings for the specified date
    List<Booking__c> bookings = [
      SELECT Conference_Room__c, Time_Slot__c
      FROM Booking__c
      WHERE Date__c = :bookingDate
    ];
    System.debug('Fetched Bookings: ' + bookings);
    // Create maps to hold room bookings by floor
    Map<Id, Set<Id>> floorRoomMap = new Map<Id, Set<Id>>();
    Map<Id, Set<String>> roomTimeSlotMap = new Map<Id, Set<String>>();

    // Initialize maps
    for (Floor__c floor : floors) {
      floorRoomMap.put(floor.Id, new Set<Id>());
    }

    for (Conference_Room__c room : allRooms) {
      floorRoomMap.get(room.Floor__c).add(room.Id);
      roomTimeSlotMap.put(room.Id, new Set<String>());
    }

    // Populate roomTimeSlotMap with booked time slots
    for (Booking__c booking : bookings) {
      if (roomTimeSlotMap.containsKey(booking.Conference_Room__c)) {
        roomTimeSlotMap.get(booking.Conference_Room__c)
          .add(booking.Time_Slot__c);
      }
    }
    System.debug('Room Time Slot Map: ' + roomTimeSlotMap);
    // Define the complete set of time slots
    List<String> allTimeSlots = new List<String>{
      '9 AM - 12 PM',
      '12 PM - 3 PM',
      '3 PM - 6 PM'
    };

    // Check each floor's booking status
    for (Floor__c floor : floors) {
      Set<Id> roomIds = floorRoomMap.get(floor.Id);
      Boolean isFullyBooked = true;

      for (Id roomId : roomIds) {
        Set<String> bookedTimeSlots = roomTimeSlotMap.containsKey(roomId)
          ? roomTimeSlotMap.get(roomId)
          : new Set<String>();

        // If any room is not fully booked, mark the floor as not fully booked
        if (!bookedTimeSlots.containsAll(allTimeSlots)) {
          isFullyBooked = false;
          break;
        }
      }

      // Add the floor to the list with its booking status
      fullyBookedFloors.add(new FloorWrapper(floor, isFullyBooked));
    }
    System.debug('Fully Booked Floors: ' + fullyBookedFloors);
    return fullyBookedFloors;
  }

  // Method to book a conference room
  @AuraEnabled
  public static Boolean bookConferenceRoom(Map<String, Object> bookingDetails) {
    // if (bookingDetails.get('roomId') == null) {
    //   throw new AuraHandledException('Room ID is required');
    // }
    try {
      // Extract booking details
      Id roomId = (Id) bookingDetails.get('roomId');
      Id floorId = (Id) bookingDetails.get('floorId');
      Date bookingDate = Date.valueOf((String) bookingDetails.get('date'));
      String timeSlot = (String) bookingDetails.get('timeSlot');
      String name = (String) bookingDetails.get('name');
      String email = (String) bookingDetails.get('email');
      String phone = (String) bookingDetails.get('phone');
      String address = (String) bookingDetails.get('address');

      // Your logic to book the conference room
      // For example, creating a new Booking__c record
      Booking__c newBooking = new Booking__c(
        Conference_Room__c = roomId,
        Floor__c = floorId,
        Date__c = bookingDate,
        Time_Slot__c = timeSlot,
        Booked_by__c = name,
        Booked_By_Email__c = email,
        Phone__c = phone,
        Address__c = address,
        Status__c = 'Booked'
      );
      insert newBooking;

      // Fetch room and floor names for the email
      Conference_Room__c room = [
        SELECT Name
        FROM Conference_Room__c
        WHERE Id = :roomId
      ];
      Floor__c floor = [SELECT Name FROM Floor__c WHERE Id = :floorId];

      // Send confirmation email
      try {
        sendConfirmationEmail(newBooking, room.Name, floor.Name);
      } catch (Exception e) {
        // Log the email sending error but do not let it affect the booking process
        System.debug('Failed to send confirmation email: ' + e.getMessage());
      }
      return true; // Return true if successful
    } catch (Exception e) {
      // Log the error or handle it appropriately
      System.debug('Error booking room: ' + e.getMessage());
      throw new AuraHandledException(
        'Failed to book the room: ' + e.getMessage()
      );
      //return false; // Return false if there's an error
    }
  }
  private static void sendConfirmationEmail(
    Booking__c booking,
    String roomName,
    String floorName
  ) {
    // Construct email content
    String subject = 'Booking Confirmation';
    String body = 'Thank you for booking a conference room. Details:\n\n';
    body += 'Name: ' + booking.Booked_By__c + '\n';
    body += 'Email: ' + booking.Booked_By_Email__c + '\n';
    body += 'Phone: ' + booking.Phone__c + '\n';
    body += 'Address: ' + booking.Address__c + '\n';
    body += 'Conference Room: ' + roomName + '\n';
    body += 'Floor: ' + floorName + '\n';
    body += 'Time Slot: ' + booking.Time_Slot__c + '\n';
    body += 'Date: ' + booking.Date__c.format() + '\n';

    // Send email
    Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
    String[] toAddresses = new List<String>{ booking.Booked_By_Email__c };
    email.setToAddresses(toAddresses);
    email.setSubject(subject);
    email.setPlainTextBody(body);
    try {
      Messaging.sendEmail(new List<Messaging.SingleEmailMessage>{ email });
      System.debug(
        'Confirmation email sent successfully to: ' + booking.Booked_By_Email__c
      );
    } catch (Exception e) {
      System.debug('Email sending failed: ' + e.getMessage());
      throw new AuraHandledException('Failed to send confirmation email.');
    }
  }

  // Method to fetch bookings for a specific date
  @AuraEnabled(cacheable=true)
  public static List<Booking__c> getBookingsForDate(Date bookingDate) {
    return [
      SELECT Id, Conference_Room__c, Time_Slot__c
      FROM Booking__c
      WHERE Date__c = :bookingDate
    ];
  }
  @AuraEnabled(cacheable=true)
  public static List<Booking__c> getUserBookings(String userId) {
    return [
      SELECT Id, Conference_Room__c, Time_Slot__c, Date__c, Status__c
      FROM Booking__c
      WHERE Registration__c = :userId
    ];
  }

  // Registration method
  @AuraEnabled
  public static String registerUser(
    String firstName,
    String lastName,
    String email,
    String password
  ) {
    String hashedPassword = hashPassword(password);

    // Check if the email is already registered
    List<Registration__c> existingUsers = [
      SELECT Id
      FROM Registration__c
      WHERE Email__c = :email
      LIMIT 1
    ];
    if (!existingUsers.isEmpty()) {
      return 'Email already registered.';
    }

    // Create new registration record
    Registration__c newUser = new Registration__c();
    newUser.FirstName__c = firstName;
    newUser.LastName__c = lastName;
    newUser.Email__c = email;
    newUser.Password__c = hashedPassword; // Encrypt in real scenarios
    try {
      insert newUser;
      return 'Registration successful.';
    } catch (DmlException e) {
      return 'Registration failed: ' + e.getMessage();
    }
  }
  @AuraEnabled
  public static Boolean apexLogin(String email, String password) {
    // Log inputs for debugging
    System.debug('Email: ' + email);
    System.debug('Password: ' + password);

    // Hash the provided password
    String hashedPassword = hashPassword(password);
    System.debug('Hashed Password: ' + hashedPassword);

    // Fetch the registration details from the database based on the provided email
    List<Registration__c> registrations = [
      SELECT Id, Email__c, Password__c
      FROM Registration__c
      WHERE Email__c = :email AND Password__c = :hashedPassword
      LIMIT 1
    ];

    // Log the number of records found
    System.debug('Registrations found: ' + registrations.size());

    return !registrations.isEmpty();
  }

  // Utility method to hash the password
  private static String hashPassword(String password) {
    Blob passwordBlob = Blob.valueOf(password);
    Blob hashedBlob = Crypto.generateDigest('SHA-256', passwordBlob);
    return EncodingUtil.convertToHex(hashedBlob);
  }
 

  // Method to reset the password
  @AuraEnabled
  public static String resetPassword(String email,String newPassword) {
    try{
    // Fetch the user with the provided email and token
    List<Registration__c> registrations = [
        SELECT Id, Email__c, Password__c
        FROM Registration__c 
        WHERE Email__c = :email
        LIMIT 1
    ];
    
    if (registrations.isEmpty()) {
      return 'Email not found.';
    }
    
    Registration__c user = registrations[0];
    System.debug('User found: ' + user.Id);
  // Update the password
     // Encrypt the new password before storing
     String hashedPassword = hashPassword(newPassword);

     // Update the password field with the encrypted password
     user.Password__c = hashedPassword;

     update user;

     return 'Password reset successful.';
   
    } catch (DmlException e) {
      System.debug('DML Exception: ' + e.getMessage());
      return 'Failed to reset password due to a database error. Please try again.';
  } catch (Exception e) {
      System.debug('Exception: ' + e.getMessage());
      return 'Failed to reset password: ' + e.getMessage();
  }
}


  // Utility method to generate a secure token
//   private static String hashPassword(String password) {
//     Blob passwordBlob = Blob.valueOf(password);
//     Blob hashedBlob = Crypto.generateDigest('SHA-256', passwordBlob);
//     return EncodingUtil.convertToHex(hashedBlob);
// }
  

@AuraEnabled(cacheable=true)
public static List<Booking__c> getBookingsByEmail(String email) {
    return [SELECT Id, Floor__r.Name, Conference_Room__r.Name,Date__c, Time_Slot__c 
            FROM Booking__c 
            WHERE Booked_By_Email__c = :email];
}
@AuraEnabled
public static void cancelBooking(Id bookingId) {
  try {
    // Perform deletion of the booking record
    Booking__c booking = [SELECT Id FROM Booking__c WHERE Id = :bookingId LIMIT 1];
    delete booking;
  } catch (Exception e) {
    throw new AuraHandledException('Failed to cancel booking: ' + e.getMessage());
  }
}

  // Wrapper class for conference{} rooms
  public class ConferenceRoomWrapper {
    @AuraEnabled
    public Id Id;
    @AuraEnabled
    public String Name;
    @AuraEnabled
    public String RoomImageUrl;
    @AuraEnabled
    public List<TimeSlotWrapper> TimeSlots; // List to store time slots and their availability
    @AuraEnabled
    public Boolean IsFullyBooked;

    // Constructor to initialize the wrapper with room details and time slots
    public ConferenceRoomWrapper(
      Conference_Room__c room,
      Set<String> bookedSlots,
      Boolean isFullyBooked
    ) {
      this.Id = room.Id;
      this.Name = room.Name;
      this.RoomImageUrl = room.Room_Image__c;
      this.IsFullyBooked = isFullyBooked;
      this.TimeSlots = new List<TimeSlotWrapper>();

      // Example time slots (adjust as per your requirement)
      List<String> timeSlotLabels = new List<String>{
        '9 AM - 12 PM',
        '12 PM - 3 PM',
        '3 PM - 6 PM'
      };

      // Populate time slots based on existing bookings
      for (String slot : timeSlotLabels) {
        Boolean isBooked = bookedSlots != null && bookedSlots.contains(slot);
        this.TimeSlots.add(new TimeSlotWrapper(slot, isBooked));
      }
    }
  }
  // Wrapper class for floors
  public class FloorWrapper {
    @AuraEnabled
    public Id Id;
    @AuraEnabled
    public String Name;
    @AuraEnabled
    public Boolean IsFullyBooked;

    // Constructor to initialize the wrapper with floor details and booking status
    public FloorWrapper(Floor__c floor, Boolean isFullyBooked) {
      this.Id = floor.Id;
      this.Name = floor.Name;
      this.IsFullyBooked = isFullyBooked;
    }
  }
  // Wrapper class for time slots
  public class TimeSlotWrapper {
    @AuraEnabled
    public String slot;
    @AuraEnabled
    public Boolean booked;

    public TimeSlotWrapper(String slot, Boolean booked) {
      this.slot = slot;
      this.booked = booked;
    }
  }
}
