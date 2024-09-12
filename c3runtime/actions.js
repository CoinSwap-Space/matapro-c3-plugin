self.C3.Plugins.MetaproPlugin.Acts = {
  async RequestAccount() {
    await this._RequestAccount();
  },
  async Login(referral_code, rules_checked) {
    await this._Login(referral_code, rules_checked);
  },
  async RequestLeaderboard(limit, min_balance, max_balance) {
    await this._RequestLeaderboard(limit, min_balance, max_balance);
  },
  async UpdateScore(score) {
    await this._UpdateScore(score);
  },
  async UpdateUsername(username) {
    await this._UpdateUsername(username);
  },
  async UpdateAvatar(avatar) {
    await this._UpdateAvatar(avatar);
  },
  async CheckIfRegistered() {
    await this._CheckIfRegistered();
  },
  async RequestUserScore() {
    await this._RequestUserScore();
  },
  async FetchReferralCode() {
    await this._FetchReferralCode();
  },
  async GenerateReferralCode() {
    await this._GenerateReferralCode();
  },
  async RequestReferralStructure() {
    await this._RequestReferralStructure();
  },
  async AddScore(score) {
    await this._AddScore(score);
  },
  async RequestBestScore() {
    await this._RequestBestScore();
  },
};
