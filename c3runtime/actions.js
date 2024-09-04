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
};
