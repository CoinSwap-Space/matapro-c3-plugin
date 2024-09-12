# Metapro Plugin for Construct 3

## Features

- Support for managing user accounts, including requesting Ethereum accounts and logging in with Web3 authentication.
- Integration with leaderboard systems, including querying and retrieving leaderboard data.
- Ability to update user information, including username and avatar.
- Support for generating, retrieving, and managing referral codes and referral structures.
- Support for updating and retrieving user scores.
- Event callbacks for handling user account actions, leaderboard data retrieval, registration checks, score updates, referral code checks, and error handling.

## Installation

The Metapro Plugin can be added through either the Construct store or as a dev addon in the editor.

## Downloads

The Metapro Plugin addon is available for download along with project examples. (TODO: Add the download links)

## Supported API Calls

### Actions

| **Action Name**                     | **Description**                                                                                                        | **Params**                                                                                                                                                            |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Request Account**                 | Request an Ethereum account from the user.                                                                             | None                                                                                                                                                                  |
| **Login**                           | Authenticate the user using Web3 and manage user session data.                                                         | **Referral Code**: The referral code provided by the user, if any.<br>**Rules Checked**: Indicates whether the user accepted the rules.                               |
| **Request Leaderboard**             | Query the leaderboard data for a specific score range with an optional limit.                                          | **Limit**: The maximum number of leaderboard entries to retrieve.<br>**Min Balance**: Minimum balance to display.<br>**Max Balance**: Maximum balance to display.     |
| **Update Username**                 | Update the username of the user.                                                                                       | **Username**: The new value for the username. If an empty string (`''`) is provided, the username will be deleted.                                                    |
| **Update Avatar**                   | Update the avatar of the user.                                                                                         | **Avatar**: The new avatar URL. If an empty string (`''`) is provided, the avatar will be deleted.                                                                    |
| **Check If Registered**             | Check whether the user is registered in the system.                                                                    | None                                                                                                                                                                  |
| **Request User Score**              | Request the score for the user.                                                                                        | None                                                                                                                                                                  |
| **Update Score**                    | Update the user's score in the system.                                                                                 | **Score**: The score value to be updated for the user. If positive, it is added to the current and total score. If negative, it is subtracted from the current score. |
| **Add Score**                       | Add a new entry score for the user.                                                                                    | **Score**: User earned score.                                                                                                                                         |
| **Request Best Score**              | Request the user's best score from the leaderboard.                                                                    | None                                                                                                                                                                  |
| **Request Best Scores Leaderboard** | Request the user's best scores from the leaderboard.                                                                   | **Limit**: The maximum number of leaderboard entries to retrieve.                                                                                                     |
| **Fetch Referral Code**             | Fetch an existing referral code for the user.                                                                          | None                                                                                                                                                                  |
| **Generate Referral Code**          | Generates a new referral code for the user if they do not already have one.                                            | None                                                                                                                                                                  |
| **Request Referral Structure**      | Retrieve the user's referral downline structure, including referral levels, total scores, user count, and percentages. | None                                                                                                                                                                  |

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
| **Get Last Error**              | Retrieve the last error message encountered by the plugin.                                                |

## Author

metapro

## License

MIT
