self.C3.Plugins.MetaproPlugin.Exps = {
  GetAccount() {
    return this._GetAccount();
  },
  GetAvatar() {
    return this._GetAvatar();
  },
  GetUserId() {
    return this._GetUserId();
  },
  GetUsername() {
    return this._GetUsername();
  },
  GetAccessToken() {
    return this._GetAccessToken();
  },
  GetLeaderboard() {
    const leaderboard = this._GetLeaderboard();
    const jsonLeaderboard = JSON.stringify(leaderboard);

    return jsonLeaderboard;
  },
  GetCurrentScore() {
    return this._GetCurrentScore();
  },
  GetTotalScore() {
    return this._GetTotalScore();
  },
  GetReferralCode() {
    return this._GetReferralCode();
  },
  GetReferralStructure() {
    const structure = this._GetReferralStructure();
    const jsonStructure = JSON.stringify(structure);

    return jsonStructure;
  },
  GetBestScore() {
    return this._GetBestScore();
  },
  GetDynamicReward() {
    const result = this._GetDynamicReward();

    if (typeof result === "object") {
      // If the result is an object, return its JSON string representation
      return JSON.stringify(result);
    } else {
      // If the result is a number, return it directly
      return result;
    }
  },
  GetBestScoresLeaderboard() {
    const leaderboard = this._GetBestScoresLeaderboard();
    const jsonLeaderboard = JSON.stringify(leaderboard);

    return jsonLeaderboard;
  },
  GetReferralLeaderboard() {
    const leaderboard = this._GetReferralLeaderboard();
    const jsonLeaderboard = JSON.stringify(leaderboard);

    return jsonLeaderboard;
  },
  GetNumberOfRuns() {
    return this._GetNumberOfRuns();
  },
  GetLastTransactionHash() {
    return this._GetLastTransactionHash();
  },
  GetLastError() {
    return this._GetLastError();
  },
  GetProjectId() {
    return this._GetProjectId();
  },
  GetLeaderboardId() {
    return this._GetLeaderboardId();
  },
  GetLeaderboardApiKey() {
    return this._GetLeaderboardApiKey();
  },
  GetUsersServiceApiUrl() {
    return this._GetUsersServiceApiUrl();
  },
  GetLeaderboardApiUrl() {
    return this._GetLeaderboardApiUrl();
  },
  GetReferralApiUrl() {
    return this._GetReferralApiUrl();
  },
  GetPlatformId() {
    return this._GetPlatformId();
  },
  GetRefCodeFromDeeplink() {
    return this._GetRefCodeFromDeeplink();
  },
  GetLastReadContractData() {
    const data = this._GetLastReadContractData();
    const jsonData = JSON.stringify(data);

    return jsonData;
  },
  GetLastMultipleReadContractData() {
    const data = this._GetLastMultipleReadContractData();
    const jsonData = JSON.stringify(data);

    return jsonData;
  },
  GetUserNfts() {
    const data = this._GetUserNfts();
    const jsonData = JSON.stringify(data);

    return jsonData;
  },
  GetNftApiUrl() {
    return this._GetNftApiUrl();
  },
  GetTransactionStatus() {
    return this._GetTransactionStatus();
  },
};
