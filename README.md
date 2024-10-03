# Metapro Plugin for Construct 3

## Features

- **Account Management**:

  - Request and manage Ethereum accounts.
  - Support for Web3 authentication for user logins.

- **Leaderboard Integration**:

  - Query and retrieve leaderboard data.
  - Retrieve best scores, current score, total score, and referral leaderboard data.

- **User Information Management**:

  - Update and retrieve user data like usernames, avatars, and authentication tokens.

- **Referral System Integration**:

  - Generate, retrieve, and manage referral codes.
  - View referral structures, including downline information, referral scores, and leaderboard rankings.

- **Score Management**:

  - Add, update, and retrieve user scores.
  - Access current, best, and total scores from the leaderboard.

- **Smart Contract Interaction**:

  - Read data from smart contracts and interact with them using transactions, ABI, function names, input data, and chain ID.

- **Event Triggers**:

  - Event handling for actions like user login, leaderboard data retrieval, score updates, referral code management, and transaction events.
  - Error handling for plugin operations.

- **Map-based Runs**:

  - Request and retrieve the number of user runs, with an optional map ID parameter.

- **Custom Error Handling**:
  - Retrieve the last error message encountered by the plugin for debugging and user notification purposes.

## Installation

The Metapro Plugin can be added through either the Construct store or as a dev addon in the editor.

## Downloads

The Metapro Plugin addon is available for download along with project examples. (TODO: Add the download links)

### Properties

| **Property Name**           | **Description**                                                |
| --------------------------- | -------------------------------------------------------------- |
| **Users Service API URL**   | The URL of the Users Service API used by the Metapro system.   |
| **Project ID**              | The unique identifier for your project in Metapro.             |
| **Leaderboard ID**          | The ID of the leaderboard used in the Metapro system.          |
| **Referral Leaderboard ID** | The ID of the referral leaderboard used in the Metapro system. |
| **Leaderboard API Key**     | The API key required to access the leaderboard.                |
| **Leaderboard API URL**     | The URL of the Leaderboard API used in the Metapro system.     |
| **Referral API URL**        | The URL of the Referral API used in the Metapro system.        |
| **Platform ID**             | The ID of the platform associated with the project.            |

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
| **Add Score**                       | Add a new entry score for the user.                                                                                    | **Score**: User earned score.<br>**Map ID**: The ID of the map where the score was achieved.                                                                                                                                                                                                                                                                                                                                                                                                |
| **Request Best Score**              | Request the user's best score from the leaderboard.                                                                    | **Map ID**: The ID of the map for which the best score is requested.                                                                                                                                                                                                                                                                                                                                                                                                                        |
| **Request Best Scores Leaderboard** | Request the user's best scores from the leaderboard.                                                                   | **Limit**: The maximum number of leaderboard entries to retrieve (default 20).<br>**Map ID**: The ID of the map.                                                                                                                                                                                                                                                                                                                                                                            |
| **Fetch Referral Code**             | Fetch an existing referral code for the user.                                                                          | None                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| **Generate Referral Code**          | Generates a new referral code for the user if they do not already have one.                                            | None                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| **Request Referral Structure**      | Retrieve the user's referral downline structure, including referral levels, total scores, user count, and percentages. | None                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| **Request Referral Leaderboard**    | Request the referral leaderboard for the user.                                                                         | **Referral Leaderboard ID**: The ID of the referral leaderboard.<br>**Referral Leaderboard API Key**: The API key for accessing the referral leaderboard.<br>**Limit**: The maximum number of leaderboard entries to retrieve (default 20).<br>**Min Balance**: Minimum balance to display.<br>**Max Balance**: Maximum balance to display.                                                                                                                                                 |
| **Send Contract Transaction**       | Send a transaction to interact with a smart contract based on the provided ABI, input data, and chain ID.              | **Contract Address**: The address of the smart contract.<br>**ABI**: A JSON stringified representation of the ABI (Application Binary Interface).<br>**Function Name**: The name of the function being called in the ABI, provided as a JSON stringified representation.<br>**Input Data**: A JSON stringified representation of the input data required for the function call. Example format: `{'_to':'123','_tokenId':1,'_amount':1}`.<br>**Chain ID**: The target chain ID in decimals. |
| **Request Number of Runs**          | Request the total number of runs for the user, with an optional map ID.                                                | **Map ID** (optional): The unique identifier of the map (number).                                                                                                                                                                                                                                                                                                                                                                                                                           |
| **Read Contract Data**              | Read data from a smart contract at a specified address.                                                                | **Contract Address**: The address of the smart contract.<br>**ABI**: A JSON stringified representation of the ABI (Application Binary Interface).<br>**Function Name**: The name of the function being called in the ABI.<br>**Input Data**: A JSON stringified representation of the input data required for the function call.<br>**RPC URL**: The URL of the Remote Procedure Call (RPC) endpoint for interacting with the blockchain.                                                   |

### Conditions

| **Condition Name**                        | **Description**                                                                 |
| ----------------------------------------- | ------------------------------------------------------------------------------- |
| **On Account Received**                   | Triggered when an Ethereum account is successfully received.                    |
| **On User Logged In**                     | Triggered when a user is successfully logged in.                                |
| **On Leaderboard Received**               | Triggered when leaderboard data is successfully retrieved.                      |
| **On Username Updated**                   | Triggered when the user's username is successfully updated.                     |
| **On Avatar Updated**                     | Triggered when the user's avatar is successfully updated.                       |
| **On Is User Registered**                 | Triggered when the user is confirmed to be registered.                          |
| **On User Not Registered**                | Triggered when the user is confirmed to be not registered.                      |
| **On User Score Received**                | Triggered when the user's current and total score is successfully retrieved.    |
| **On Referral Code Exists**               | Triggered when the user's referral code already exists.                         |
| **On Referral Code Empty**                | Triggered when the user does not have an existing referral code.                |
| **On Referral Code Generated**            | Triggered when a new referral code is successfully generated.                   |
| **On Referral Structure Received**        | Triggered when the user's referral structure is successfully retrieved.         |
| **On Referral Leaderboard Received**      | Triggered when the referral leaderboard data is successfully retrieved.         |
| **On Transaction Sent**                   | Triggered when a transaction is successfully sent.                              |
| **On Number of Runs Received**            | Triggered when the number of runs for the user is successfully retrieved.       |
| **On Error**                              | Triggered when an error occurs during any plugin operation.                     |
| **On Referral Code from Deeplink Exists** | Triggered when the referral code from the deeplink is successfully retrieved.   |
| **On Contract Data Received**             | Triggered when data from the smart contract is successfully retrieved and read. |

### Expressions

| **Expression Name**                 | **Description**                                                                                           |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------- |
| **Get Account**                     | Retrieve the currently logged-in Ethereum account.                                                        |
| **Get Avatar**                      | Retrieve the user's avatar image URL.                                                                     |
| **Get User ID**                     | Retrieve the user's unique ID.                                                                            |
| **Get Username**                    | Retrieve the user's username.                                                                             |
| **Get Access Token**                | Retrieve the user's authentication token.                                                                 |
| **Get Leaderboard**                 | Retrieve the requested leaderboard data.                                                                  |
| **Get Current Score**               | Retrieve the user's current score.                                                                        |
| **Get Total Score**                 | Retrieve the user's total score.                                                                          |
| **Get Best Score**                  | Retrieve the user's best score from the leaderboard.                                                      |
| **Get Best Scores Leaderboard**     | Retrieve the leaderboard showing the user's best scores.                                                  |
| **Get Referral Code**               | Retrieve the user's referral code.                                                                        |
| **Get Referral Structure**          | Retrieve the user's referral downline structure, including downline levels, total scores, and user count. |
| **Get Referral Leaderboard**        | Retrieve the referral leaderboard data.                                                                   |
| **Get Number of Runs**              | Retrieve the number of runs for the user.                                                                 |
| **Get Last Transaction Hash**       | Retrieve the hash of the most recent transaction sent by the plugin.                                      |
| **Get Last Error**                  | Retrieve the last error message encountered by the plugin.                                                |
| **Get Project ID**                  | Retrieve the project ID associated with the current session.                                              |
| **Get Leaderboard ID**              | Retrieve the leaderboard ID associated with the current project.                                          |
| **Get Leaderboard API Key**         | Retrieve the API key for accessing the leaderboard services.                                              |
| **Get Users Service API URL**       | Retrieve the URL for accessing the Users Service API.                                                     |
| **Get Leaderboard API URL**         | Retrieve the URL for accessing the Leaderboard API.                                                       |
| **Get Referral API URL**            | Retrieve the URL for accessing the Referral API.                                                          |
| **Get Platform ID**                 | Retrieve the platform ID for the current project.                                                         |
| **Get Referral Code from Deeplink** | Retrieve the referral code from the provided deeplink.                                                    |
| **Get Last Read Contract Data**     | Retrieve the data returned from the last read contract interaction.                                       |

## Author

metapro

## License

MIT
