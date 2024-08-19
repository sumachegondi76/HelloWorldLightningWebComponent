public with sharing class AccountManager {
   @AuraEnabled(cacheable=true)
  public static list<Account> getAccounts(Integer numberOfRecords){
    return[select id, Name,Phone from Account Limit :numberOfRecords];
  }
}