/* detect a duplicate job using heuristics.

Stores details of last job as a JSON object in user variable

Uses the standard JSON library as a an include file. Copy
json2.js to [app-root]/server/custom/print-script-common.js. Obtain
the JSON library from

  https://github.com/douglascrockford/JSON-js


*/

var printJobSignificantAttr = [ "documentName", "clientMachineOrIP", "cost", "username" ];

function job2json(inputs){
             // turns job details into a JSON string. Returns string
              
             var  job = {};
             for (var i=0; i < printJobSignificantAttr.length ; i++){
               var item = printJobSignificantAttr[i];
              
               job[item] = inputs.job[item];
             }
             return JSON.stringify(job);
}

function printJobHook(inputs, actions) {
              
              if (!inputs.job.isAnalysisComplete)
              return;
              
               
              var pj = inputs.user.getProperty("last-job-details"); //previous job
              var cj = job2json(inputs,actions); //current job
              
              if (pj != null ) { // We have a last job
                cj = job2json(inputs);
              
                if (pj == cj) {
                  actions.client.sendMessage("This job was denied because a duplicate job was detected."
                      + " Please contact the administrator if you thing this is error");
              
                  actions.job.cancelAndLog("This job was denied because a duplicate job was detected");
            
                  return;
                 }
               }
               actions.user.onCompletionSaveProperty("last-job-details",cj);
  
  }