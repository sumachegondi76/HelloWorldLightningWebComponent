// AccountController.cls
public with sharing class AccountController {
    
    @AuraEnabled(cacheable=true)
    public static List<Account> searchAccounts(String searchTerm) {
        String searchKey = '%' + searchTerm + '%';
        return [SELECT Id, Name, Industry, Phone, Website FROM Account WHERE Name LIKE :searchKey LIMIT 10];
    }

    @AuraEnabled(cacheable=true)
    public static Account getAccountDetails(String accountId) {
        return [SELECT Id, Name, Industry, Phone, Website FROM Account WHERE Id = :accountId LIMIT 1];
    }
}
