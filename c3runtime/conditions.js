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
};
