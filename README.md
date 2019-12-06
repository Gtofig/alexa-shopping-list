# alexa-shopping-list
Basic shopping list code

# Building Voice User Interface
1. Go to https://developer.amazon.com and login (or sign-up if you haven’t done so yet)
2. Create new Alexa Skill, give it a name and choose “Custom” type with “Provision your own” backend
3. Choose “Start from scratch”
4. Under “Invocation” give your skills an invocation name, such as “shopping mate”
5. Add new Intent, call it “AddIntent” and click “Create custom intent”
6. Add a sample utterance “Add {item} to my shopping list”
    - Add more utterances as you feel necessary
7. Choose type “AMAZON.food” under slot type to get a better voice recognition model
8. Add another intent, “ListIntent”, for listing items on your shopping list
9. Click “Save Model”, and then “Build Model”
10. Click “Evaluate Model” and test your intents by typing different messages
11. Under endpoints choose “AWS Lambda Arn” and note your skill ID. You will need it when creating backend

# Creating serverless backend for the skill
1. Login into your AWS account and make sure you’re in the Ireland region
2. Go to Lambda service (Services->Lambda)
3. Click “Create function”
4. Choose serverless app repository and find “alexa-skills-kit-nodejs-factskill”
5. Give your application a name and click “Deploy”
6. Wait until deployment succeeds
7. Click on “alexaskillskitnodejsfactskill” resource (It’s your Lambda function)
8. Click on “Alexa Skills Kit” trigger and delete it.
9. Click on “Add new trigger”, choose “Alexa Skills Kit” and use the skill ID that you got from Skill Builder
10. Click back on your lambda function, and click on “view role” under “Execution role” section
11. Under “Permissions” click “Attach Policies” and search for “AmazonDynamoDBFullAccess”
12. Select AmazonDynamoDBFullAccess policy and click “Attach Policy”
13. Go back to your lambda function and add code for the shopping mate skill. Check index.js if you need reference.
14. Don’t forget to update your skill endpoint to point to your new lambda ARN
15. Test your new Alexa Skill by going under “Test” section of Alexa Developer Console. You can use either voice or text for testing
16. If something doesn’t work, you can debug your backend by going to “Monitoring” section of Lambda console and clicking “View Logs in CloudWatch”
