# metapro Plugin for Construct 3

## Features

- Support for managing user accounts, including requesting Ethereum accounts and logging in with Web3 authentication.
- Integration with leaderboard systems, including querying and retrieving leaderboard data.
- Ability to update user information, including username and avatar.
- Support for generating, retrieving, and managing referral codes and referral structures.
- Support for updating and retrieving user scores.
- Event callbacks for handling user account actions, leaderboard data retrieval, registration checks, score updates, referral code checks, and error handling.

## Installation

The metapro Plugin can be added through either the Construct store or as a dev addon in the editor.

## Downloads

The metapro Plugin addon is available for download along with project examples. (TODO: Add the download links)

### Properties

| **Property Name**           | **Description**                                                |
| --------------------------- | -------------------------------------------------------------- |
| **Users Service API URL**   | The URL of the Users Service API used by the metapro system.   |
| **Project ID**              | The unique identifier for your project in metapro.             |
| **Leaderboard ID**          | The ID of the leaderboard used in the metapro system.          |
| **Referral Leaderboard ID** | The ID of the referral leaderboard used in the metapro system. |
| **Leaderboard API Key**     | The API key required to access the leaderboard.                |
| **Leaderboard API URL**     | The URL of the Leaderboard API used in the metapro system.     |
| **Referral API URL**        | The URL of the referral API used in the metapro system.        |
| **Map ID**                  | The ID of the generated map.                                   |

## Supported API Calls

### Actions

| **Action Name**                     | **Description**                                                                                                        | **Params**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Request Account**                 | Request an Ethereum account from the user.                                                                             | None                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| **Login**                           | Authenticate the user using Web3 and manage user session data.                                                         | **Referral Settings ID**: The ID for the referral settings configured in the project.<br>**Referral Code**: The referral code provided by the user, if any.<br>**Rules Checked**: Indicates whether the user accepted the rules.                                                                                                                                                                                                                                                            |
| **Request Leaderboard**             | Query the leaderboard data for a specific score range with an optional limit.                                          | **Limit**: The maximum number of leaderboard entries to retrieve.<br>**Min Balance**: Minimum balance to display.<br>**Max Balance**: Maximum balance to display.                                                                                                                                                                                                                                                                                                                           |
| **Update Username**                 | Update the username of the user.                                                                                       | **Username**: The new value for the username. If an empty string (`''`) is provided, the username will be deleted.                                                                                                                                                                                                                                                                                                                                                                          |
| **Update Avatar**                   | Update the avatar of the user.                                                                                         | **Avatar**: The new avatar URL. If an empty string (`''`) is provided, the avatar will be deleted.                                                                                                                                                                                                                                                                                                                                                                                          |
| **Check If Registered**             | Check whether the user is registered in the system.                                                                    | None                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| **Request User Score**              | Request the score for the user.                                                                                        | None                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| **Update Score**                    | Update the user's score in the system.                                                                                 | **Score**: The score value to be updated for the user. If positive, it is added to the current and total score. If negative, it is subtracted from the current score.                                                                                                                                                                                                                                                                                                                       |
| **Add Score**                       | Add a new entry score for the user.                                                                                    | **Score**: User earned score.                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| **Request Best Score**              | Request the user's best score from the leaderboard.                                                                    | None                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| **Request Best Scores Leaderboard** | Request the user's best scores from the leaderboard.                                                                   | **Limit**: The maximum number of leaderboard entries to retrieve (dafault 20).                                                                                                                                                                                                                                                                                                                                                                                                              |
| **Fetch Referral Code**             | Fetch an existing referral code for the user.                                                                          | None                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| **Generate Referral Code**          | Generates a new referral code for the user if they do not already have one.                                            | None                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| **Request Referral Structure**      | Retrieve the user's referral downline structure, including referral levels, total scores, user count, and percentages. | None                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| **Request Referral Leaderboard**    | Request the referral leaderboard for the user.                                                                         | **Referral Leaderboard ID**: The ID of the referral leaderboard.<br>**Referral Leaderboard API Key**: The API key for accessing the referral leaderboard.<br>**Limit**: The maximum number of leaderboard entries to retrieve (default 20).<br>**Min Balance**: Minimum balance to display.<br>**Max Balance**: Maximum balance to display.                                                                                                                                                 |
| **Send Contract Transaction**       | Send a transaction to interact with a smart contract based on the provided ABI, input data, and chain ID.              | **Contract Address**: The address of the smart contract.<br>**ABI**: A JSON stringified representation of the ABI (Application Binary Interface).<br>**Function Name**: The name of the function being called in the ABI, provided as a JSON stringified representation.<br>**Input Data**: A JSON stringified representation of the input data required for the function call. Example format: `{'_to':'123','_tokenId':1,'_amount':1}`.<br>**Chain ID**: The target chain ID in decimals. |

### Conditions

| **Condition Name**                      | **Description**                                                                        |
| --------------------------------------- | -------------------------------------------------------------------------------------- |
| **On Account Received**                 | Triggered when an Ethereum account is successfully received.                           |
| **On User Logged In**                   | Triggered when a user is successfully logged in.                                       |
| **On Leaderboard Received**             | Triggered when leaderboard data is successfully retrieved.                             |
| **On Username Updated**                 | Triggered when the user's username is successfully updated.                            |
| **On Avatar Updated**                   | Triggered when the user's avatar is successfully updated.                              |
| **On Is Registered**                    | Triggered when the user is confirmed to be registered.                                 |
| **On Is Not Registered**                | Triggered when the user is confirmed to be not registered.                             |
| **On User Score Received**              | Triggered when the user's current and total score is successfully retrieved.           |
| **On Best Score Received**              | Triggered when the user's best score is successfully retrieved from the leaderboard.   |
| **On Best Scores Leaderboard Received** | Triggered when the user's best scores are successfully retrieved from the leaderboard. |
| **On Referral Code Exists**             | Triggered when the user's referral code already exists.                                |
| **On Referral Code Empty**              | Triggered when the user does not have an existing referral code.                       |
| **On Referral Code Generated**          | Triggered when a new referral code is successfully generated.                          |
| **On Referral Structure Received**      | Triggered when the user's referral structure is successfully retrieved.                |
| **On Referral Leaderboard Received**    | Triggered when the referral leaderboard data is successfully retrieved.                |
| **On Transaction Sent**                 | Triggered when a transaction is successfully sent.                                     |
| **On Error**                            | Triggered when an error occurs during any plugin operation.                            |

### Expressions

| **Expression Name**             | **Description**                                                                                           |
| ------------------------------- | --------------------------------------------------------------------------------------------------------- |
| **Get Account**                 | Retrieve the currently logged-in Ethereum account.                                                        |
| **Get Avatar**                  | Retrieve the user's avatar image URL.                                                                     |
| **Get User ID**                 | Retrieve the user's unique ID.                                                                            |
| **Get Username**                | Retrieve the user's username.                                                                             |
| **Get Access Token**            | Retrieve the user's authentication token.                                                                 |
| **Get Leaderboard**             | Retrieve the requested leaderboard data.                                                                  |
| **Get Current Score**           | Retrieve the user's current score.                                                                        |
| **Get Total Score**             | Retrieve the user's total score.                                                                          |
| **Get Best Score**              | Retrieve the user's best score from the leaderboard.                                                      |
| **Get Best Scores Leaderboard** | Retrieve the user's best scores from the leaderboard.                                                     |
| **Get Referral Code**           | Retrieve the user's referral code.                                                                        |
| **Get Referral Structure**      | Retrieve the user's referral downline structure, including downline levels, total scores, and user count. |
| **Get Referral Leaderboard**    | Retrieve the referral leaderboard data.                                                                   |
| **Get Last Transaction Hash**   | Retrieve the hash of the most recent transaction sent by the plugin.                                      |
| **Get Last Error**              | Retrieve the last error message encountered by the plugin.                                                |
| **Get Project Id**              | Retrieve the project ID.                                                                                  |
| **Get Leaderboard Id**          | Retrieve the leaderboard ID.                                                                              |
| **Get Leaderboard Api Key**     | Retrieve the API key for the leaderboard.                                                                 |
| **Get Users Service Api Url**   | Retrieve the URL of the users service API.                                                                |
| **Get Leaderboard Api Url**     | Retrieve the URL of the leaderboard API.                                                                  |
| **Get Referral Api Url**        | Retrieve the URL of the referral API.                                                                     |
| **Get Map Id**                  | Retrieve the map ID.                                                                                      |

## Author

metapro

## License

MIT
