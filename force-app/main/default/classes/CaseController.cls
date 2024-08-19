public with sharing class CaseController {
    @AuraEnabled(cacheable=true)
    public static List<Case> getCaseRecordsWithContacts() {
        List<Case> caseRecordsWithContacts = new List<Case>();

        // Query case records with related contacts (assuming there is a relationship field called 'ContactId' on Case object)
        caseRecordsWithContacts = [SELECT Id, CaseNumber, Subject, Description,Contact.Name, Account.Name FROM Case LIMIT 10];

        return caseRecordsWithContacts;
    }
}
