public with sharing class contactApex {
  @AuraEnabled(cacheable=true)
  public static list<contact> getContactList() {
    list<contact> conList = [
      SELECT id, firstname, lastname, title, phone, email
      FROM contact
      WITH user_mode
      LIMIT 10
    ];
    return conList;
  }
}
