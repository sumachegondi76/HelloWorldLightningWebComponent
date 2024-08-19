public with sharing class AccountClass {
    @AuraEnabled(cacheable=true)
    public static list<Account> getAccounts(String searchText){
        System.debug('Search Text: ' + searchText);
        try {
           if(String.isEmpty(searchText)){
        return [select id,Name from Account];
        
          
           }
           else{
            searchText='%'+searchText+'%';
            return [select id,Name from Account where Name like: searchText];
         

           }
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled
    public static list<Contact> getAccountContacts(String accountId){
        try {
            return[select Id,Name from Contact where accountId =: accountId];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
   
}