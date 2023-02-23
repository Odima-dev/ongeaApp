const express = require('express');
const app = express();

// Set up middleware to handle POST requests
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set up route to handle incoming voice calls
app.post('/voice', (req, res) => {
  const { sessionId, callerNumber } = req.body;

  // Create a new response object
  const response = new africastalking.voice.Response();

  // Say a greeting to the caller
  response.say('Welcome to my voice application! Press 1 for English or 2 for Swahili.');

  // Collect user input
  response.collectDigits({
    timeout: 10,
    finishOnKey: '#',
    numDigits: 1,
    callbackUrl: `https://yourdomain.com/voice/callback?sessionId=${sessionId}&callerNumber=${callerNumber}`,
  });

  // Send the response to the caller
  res.set('Content-Type', 'text/plain');
  res.send(response.toString());
});

// Set up route to handle user input
app.post('/voice/callback', (req, res) => {
  const { sessionId, callerNumber, dtmfDigits } = req.body;

  // Log the user input
  console.log(`User ${callerNumber} pressed ${dtmfDigits}`);

  // Create a new response object
  const response = new africastalking.voice.Response();

  // Say a message based on the user input
  switch (dtmfDigits) {
    case '1':
      response.say('You selected English. Goodbye!');
      break;
    case '2':
      response.say('You selected Swahili. Kwaheri!');
      break;
    default:
      response.say('Invalid input. Please try again.');
      response.collectDigits({
        timeout: 10,
        finishOnKey: '#',
        numDigits: 1,
        callbackUrl: `https://yourdomain.com/voice/callback?sessionId=${sessionId}&callerNumber=${callerNumber}`,
      });
      break;
  }

  // Send the response to the caller
  res.set('Content-Type', 'text/plain');
  res.send(response.toString());
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
