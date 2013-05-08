//
// This script is a game of Russian Roulette for our students.
// http://www.papercut.com/edugeek/competition/
// 
// The aim of this script is to give students a one in ten chance of being selected
// to play a game of Russian Roulette. If they are chosen to play, the student is given
// a popup, which will ask them to guess a number between one and ten.
//
// If they guess correctly, their print job is spared and they are informed how lucky they are. 
// If they guess wrong, their job is sent to a random printer in the school and they need
// to go hunting for it.
//

function printJobHook(inputs, actions) {
  if (!inputs.job.isAnalysisComplete) {
    return;
  }
  
  // This is our random printer array the script will choose from
  // It's not truly random however it leaves them guessing.
  var printerDestinations = 
      [
        "Maths-Printer1",
        "Maths-Printer3",
        "Print-Lab13",
        "Principals-Office",
        "Admin-Printer2",
        "Science-Printer12",
        "Science-Printer1",
        "Photograpy-Printer2",
        "English-Printer21",
        "Health-Printer4"
      ];
  
  
  // Sets the variables (done mostly in HTML) for the dialog popups that will be used later on.
  var russianRoulettePopup =  "<html>"
      + "<div style='width:400px; height:200px; padding: 5px; font-size: 12px; color:black;"
      + "    background-color: #f0f0f0;'>"
      + "  <div style='padding: 10px; font-weight: bold; font-size: 25px; text-align: center; color: red;'>"
      + "    Russian Roulette!<br><br>"
      + "    <img width=128 height=123 src=http://i.imgur.com/GUWDOTT.png></div>"
      + "  <div style='font-size: 14px; font-weight: bold; text-align: center; color: red;'>"
      + "    I want to play a game...</div><br><br>"
      + "  <div style='font-size: 12px; text-align: center; padding: 10px'>"
      + "   Just guess the correct number between <strong>1 and 10</strong><br><br>"
      + "   If you are correct, your print job will be <strong>SAFE</strong><br>"
      + "   <img width=325 height=4 src=http://i.imgur.com/HkqQaYa.png><br>"
      + "  <div style='font-size: 12px; text-align: center; padding: 5px'>"
      + "   Be careful not to be <strong>WRONG</strong><br><br>"
      + "   Or your print job will be sent to a random printer in the school."
      + "</div>"
      + "</html>";
  
  var youWin =  "<html>"
      + "<div style='width:400px; height:175px; font-size: 12px; color:black;"
      + "    background-color: #f0f0f0;'>"
      + "  <div style='font-weight: bold; font-size: 25px; text-align: center; color: green;'>"
      + "    Your print job is safe!<br><br>"
      + "   <img width=256 height=256 src=http://i.imgur.com/PJOik93.png></div>"
      + "  <div style='font-size: 12px; padding: 20px; text-align: center'>"
      + "   You win, this time...<br><br>"
      + "</div>"
      + "</html>";
  
  var youLose=  "<html>"
      + "<div style='width:400px; height:175px; font-size: 12px; color:black;"
      + "    background-color: #f0f0f0;'>"
      + "  <div style='font-weight: bold; font-size: 25px; text-align: center; color: red;'>"
      + "    Happy hunting!<br><br>"
      + "   <img width=339 height=270 src=http://i.imgur.com/2ujG5ZU.png></div>"
      + "  <div style='font-size: 12px; padding: 20px; text-align: center'>"
      + "   You lose, enjoy the hunt...<br><br>"
      + "</div>"
      + "</html>";
  
  // Get a number between 0.0 and 1.0
  var play = pseudoRandom(inputs.job.date.getTime());
  
  
  // Using the variable above, the IF statement below is giving the user a one in ten chance 
  // of being chosen to play Russian Roulette. That's pretty reasonable I think :)
  if (play <= 0.1) {
    if (inputs.user.isInGroup("Students")) {
      
      var win = randomNumber1to10(inputs.job); 
      
      var response = actions.client.promptForText(russianRoulettePopup, 
                                                  {
                                                    'dialogTitle': 'Russian Roulette',
                                                    'dialogDesc': 'I want to play a game...',
                                                    'hideJobDetails': true,
                                                    'fastResponse': true,
                                                  }
                                                 );
      
      // The user won! Their print job is safe. Better let them know how lucky they are.
      if (response == win) {
        actions.client.promptOK(youWin,
                                {
                                  'dialogTitle': 'Russian Roulette',
                                  'dialogDesc': 'You win, this time...',
                                  'hideJobDetails': true
                                }
                               );
        
      }   
      
      // The user guessed wrong... time to give them the bad news.
      else if (response !== win) {
        actions.client.promptOK(youLose,
                                {
                                  'dialogTitle': 'Russian Roulette',
                                  'dialogDesc': 'You lose, enjoy the hunt...',
                                  'hideJobDetails': true
                                }
                               );
        actions.log.warning("You lost");
        
        // The users print job is now redirected to one of 10 random printers in the school, one being the principals
        actions.job.redirect(printerDestinations[Math.floor(Math.random() * printerDestinations.length)]);
        
      }
    }
  } 
  
  // Borrowed from codedance's example print script
  function randomNumber1to10(job) {
    var seed = "";
    seed += inputs.job.date.getTime();
    seed += inputs.job.spoolSizeKB;
    seed += inputs.job.documentName;
    seed += inputs.job.clientMachineOrIP;
    
    var randomVal = pseudoRandom(seed);
    
    return Math.floor((randomVal * 10) + 1);
  }
  
  // Borrowed from codedance's print script
  function pseudoRandom(seed) {
    var seedI32 = java.lang.String("" + seed).hashCode();
    return (new java.util.Random(seedI32)).nextDouble();
  }  
}