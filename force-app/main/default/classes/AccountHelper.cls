public with sharing class AccountHelper {
  @AuraEnabled(cacheable=true)
  public static list<account> getAccountData(string inputIndustry) {
    return [
      SELECT id, name, industry, rating
      FROM account
      WHERE industry = :inputIndustry
      WITH user_mode
    ];
  }
  @AuraEnabled
  public static String updateTickerRecord(String recordId, String newTicker) {
    Account acc = new Account(Id = recordId, TickerSymbol = newTicker);
    try {
      update acc;
      return 'Success';
    } catch (Exception ex) {
      return ex.getMessage();
    }
  }
}
