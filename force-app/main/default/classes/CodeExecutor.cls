public with sharing class CodeExecutor {
    public class ExecutionResponse {
        @AuraEnabled public String output;
        @AuraEnabled public String errors;
    }
    
    @AuraEnabled(cacheable=true)
    public static ExecutionResponse executeCode(String language, String code) {
        String endpoint = 'https://api.jdoodle.com/v1/execute';
        String clientId = 'your_client_id'; // Get your JDoodle API client ID
        String clientSecret = 'your_client_secret'; // Get your JDoodle API client secret
        
        HttpRequest req = new HttpRequest();
        req.setEndpoint(endpoint);
        req.setMethod('POST');
        req.setHeader('Content-Type', 'application/json');
        req.setBody('{"clientId":"' + clientId + '","clientSecret":"' + clientSecret +
                    '","script":"' + code + '","stdin":"","language":"' + language + '","versionIndex":"0"}');
        
        Http http = new Http();
        HttpResponse res = http.send(req);
        
        if (res.getStatusCode() == 200) {
            Map<String, Object> jsonResponse = (Map<String, Object>) JSON.deserializeUntyped(res.getBody());
            ExecutionResponse response = new ExecutionResponse();
            response.output = String.valueOf(jsonResponse.get('output'));
            response.errors = String.valueOf(jsonResponse.get('error')); // Make sure this matches the actual response structure
            return response;
        } else {
            throw new AuraHandledException('Error occurred while executing code: ' + res.getBody());
        }
    }
}
