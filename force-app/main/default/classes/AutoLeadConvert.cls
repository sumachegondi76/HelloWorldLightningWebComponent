public with sharing class AutoLeadConvert {
  @AuraEnabled(cacheable=true)
  public static Map<Id, Id> LeadAssign(List<Id> LeadIds) {
    Map<Id, Id> leadToOpportunityMap = new Map<Id, Id>();

    Leadstatus ConLeadStatus = [
      SELECT Id, MasterLabel
      FROM LeadStatus
      WHERE isConverted = TRUE
      LIMIT 1
    ];
    list<Database.LeadConvert> MassLeadConvert = new List<Database.LeadConvert>();
    for (id currentLead : LeadIds) {
      Database.LeadConvert LeadConvert = new Database.LeadConvert();
      LeadConvert.setLeadId(currentLead);
      LeadConvert.setConvertedStatus(ConLeadStatus.MasterLabel);
      MassLeadConvert.add(LeadConvert);
    }

    if (!MassLeadConvert.isEmpty()) {
      List<Database.LeadConvertResult> leadcon = Database.convertLead(
        MassLeadConvert
      );
      for (Database.LeadConvertResult result : leadcon) {
        if (result.isSuccess() && result.getOpportunityId() != null) {
          leadToOpportunityMap.put(
            result.getLeadId(),
            result.getOpportunityId()
          );
        }
      }
    }
    return leadToOpportunityMap;
  }
}
