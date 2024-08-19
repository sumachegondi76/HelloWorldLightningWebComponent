public with sharing class LeadScoringClass {
  @AuraEnabled(cacheable=true)
  public static decimal getLeadScore(Id leadId) {
    lead leadRecord = [
      SELECT Lead_Score__c
      FROM lead
      WHERE Id = :leadId
      LIMIT 1
    ];
    return leadRecord.Lead_Score__c;
  }
}
