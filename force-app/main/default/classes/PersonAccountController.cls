public with sharing class PersonAccountController {
    //  query the personal account 
    @AuraEnabled(cacheable=true)
    public static List<Account> getPersonalAccounts() {
        return [SELECT Id, Name,Phone,PersonEmail FROM Account WHERE RecordType.DeveloperName = 'Sponsor_Record_Type' AND IsPersonAccount = true];
      
    }
}