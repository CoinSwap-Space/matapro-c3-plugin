# Metapro Plugin for Construct 3

## Features

- Support for managing user accounts, including requesting Ethereum accounts and logging in with Web3 authentication.
- Integration with leaderboard systems, including querying and retrieving leaderboard data.
- Ability to update user information, including username and avatar.
- Support for updating and retrieving user scores.
- Event callbacks for handling user account actions, leaderboard data retrieval, score updates, and error handling.
- Minification compatible for optimized deployment.

## Installation

The Metapro Plugin can be added through either the Construct store or as a dev addon in the editor.

## Downloads

The Metapro Plugin addon is available for download along with project examples. (TODO: Add the download links)

## Supported API Calls

### Actions

- **Set Project ID**: Set the project ID for the Metapro integration.
- **Request Account**: Request an Ethereum account from the user.
- **Login**: Authenticate the user using Web3 and manage user session data.
- **Request Leaderboard**: Query the leaderboard data for a specific level or score range.
- **Update Username**: Update the username of the user.
- **Update Avatar**: Update the avatar of the user.
- **Check if Registered**: Check whether the user is registered in the system.
- **Request User Score**: Request the score for the user.
- **Update Score**: Update the user's score in the system.

### Conditions

- **On Account Received**: Triggered when an Ethereum account is successfully received.
- **On User Logged In**: Triggered when a user is successfully logged in.
- **On Leaderboard Received**: Triggered when leaderboard data is successfully retrieved.
- **On Username Updated**: Triggered when the user's username is successfully updated.
- **On Avatar Updated**: Triggered when the user's avatar is successfully updated.
- **On Register Checked**: Triggered when the registration status of the user has been checked.
- **On User Score Received**: Triggered when the user's score is successfully retrieved.
- **On Error**: Triggered when an error occurs during any of the plugin's operations.

### Expressions

- **Get Account**: Retrieve the currently logged-in Ethereum account.
- **Get Avatar**: Retrieve the user's avatar image URL.
- **Get User ID**: Retrieve the user's unique ID.
- **Get Username**: Retrieve the user's username.
- **Get Access Token**: Retrieve the user's Web3 authentication token.
- **Get Leaderboard**: Retrieve the general leaderboard data.
- **Get Is Registered**: Retrieve whether the user is registered in the system.
- **Get Current Score**: Retrieve the user's current score.
- **Get Total Score**: Retrieve the user's total score.
- **Get Last Error**: Retrieve the last error message encountered by the plugin.

## Author

metapro

## License

MIT
