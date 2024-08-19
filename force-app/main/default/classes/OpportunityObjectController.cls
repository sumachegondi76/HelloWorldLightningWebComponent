public with sharing class OpportunityObjectController {
    @AuraEnabled(cacheable=true)
    public static String createCustomObject(String opportunityId,String name, String customObjectField1) {
        try {
            
            CustomObject__c customObject = new CustomObject__c(
                Opportunity__c = opportunityId,
                Name = name,
                Field1__c = customObjectField1
             
            );

           
            insert customObject;

            return customObject.Id;
        } catch (Exception ex) {
            throw new AuraHandledException('Error creating CustomObject: ' + ex.getMessage());
        }
    }
}
