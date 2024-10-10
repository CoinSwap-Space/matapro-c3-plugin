self.C3.Plugins.MetaproPlugin.Cnds = {
  OnError() {
    if (this._triggerError) {
      this._triggerError = false;
      return true;
    }

    return false;
  },
  OnAccountReceived() {
    if (this._triggerAccountReceived) {
      this._triggerAccountReceived = false;
      return true;
    }

    return false;
  },
  OnUserLoggedIn() {
    if (this._triggerUserLoggedIn) {
      this._triggerUserLoggedIn = false;
      return true;
    }

    return false;
  },
  OnLeaderboardReceived() {
    if (this._triggerLeaderboardReceived) {
      this._triggerLeaderboardReceived = false;
      return true;
    }

    return false;
  },
  OnUsernameUpdated() {
    if (this._triggerUsernameUpdated) {
      this._triggerUsernameUpdated = false;
      return true;
    }

    return false;
  },
  OnAvatarUpdated() {
    if (this._triggerAvatarUpdated) {
      this._triggerAvatarUpdated = false;
      return true;
    }

    return false;
  },
  OnUserScoreReceived() {
    if (this._triggerUserScoreReceived) {
      this._triggerUserScoreReceived = false;
      return true;
    }

    return false;
  },
  OnIsRegistered() {
    if (this._triggerIsRegistered) {
      this._triggerIsRegistered = false;
      return true;
    }

    return false;
  },
  OnIsNotRegistered() {
    if (this._triggerIsNotRegistered) {
      this._triggerIsNotRegistered = false;
      return true;
    }

    return false;
  },
  OnReferralCodeExists() {
    if (this._triggerReferralCodeExists) {
      this._triggerReferralCodeExists = false;
      return true;
    }

    return false;
  },
  OnReferralCodeEmpty() {
    if (this._triggerReferralCodeEmpty) {
      this._triggerReferralCodeEmpty = false;
      return true;
    }

    return false;
  },
  OnReferralCodeGenerated() {
    if (this._triggerReferralCodeGenerated) {
      this._triggerReferralCodeGenerated = false;
      return true;
    }

    return false;
  },
  OnReferralStructureReceived() {
    if (this._triggerReferralStructureReceived) {
      this._triggerReferralStructureReceived = false;
      return true;
    }

    return false;
  },
  OnBestScoreReceived() {
    if (this._triggerBestScoreReceived) {
      this._triggerBestScoreReceived = false;
      return true;
    }

    return false;
  },
  OnBestScoresLeaderboardReceived() {
    if (this._triggerBestScoresLeaderboardReceived) {
      this._triggerBestScoresLeaderboardReceived = false;
      return true;
    }

    return false;
  },
  OnReferralLeaderboardReceived() {
    if (this._triggerReferralLeaderboardReceived) {
      this._triggerReferralLeaderboardReceived = false;
      return true;
    }

    return false;
  },
  OnTransactionSent() {
    if (this._triggerTransactionSent) {
      this._triggerTransactionSent = false;
      return true;
    }

    return false;
  },
  OnNumberOfRunsReceived() {
    if (this._triggerNumberOfRunsReceived) {
      this._triggerNumberOfRunsReceived = false;
      return true;
    }

    return false;
  },
  OnRefCodeFromDeeplinkExists() {
    if (this._triggerRefCodeFromDeeplinkExists) {
      this._triggerRefCodeFromDeeplinkExists = false;
      return true;
    }

    return false;
  },
  OnReadContractDataReceived() {
    if (this._triggerReadContractDataReceived) {
      this._triggerReadContractDataReceived = false;
      return true;
    }

    return false;
  },
  OnMultipleReadContractDataReceived() {
    if (this._triggerMultipleReadContractDataReceived) {
      this._triggerMultipleReadContractDataReceived = false;
      return true;
    }

    return false;
  },
  OnUserNftsReceived() {
    if (this._triggerUserNftsReceived) {
      this._triggerUserNftsReceived = false;
      return true;
    }

    return false;
  },
};
