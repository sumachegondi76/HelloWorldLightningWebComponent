public with sharing class wireClass {
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccountList(Id accId){    
        try {
            return [select id,Name,Phone from Account where id =: accId];
        }
        catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
  
  
}