# passport1
I have implemented Google signin using Passport OAuth2.0 strategy and also have used session management that would persist until user logs out. If someone is looking on how to persist session in node.js, go check this repo out. Main server file->Node.js

If you want to test Google sign in just comment the res.sendFile line in app.get('/').

If you want to test Local signin, then comment the entire code in app.get('/') except res.sendfile