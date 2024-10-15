self.C3.Plugins.MetaproPlugin.Acts = {
  async RequestAccount() {
    await this._RequestAccount();
  },
  async Login(referral_settings_id, referral_code, rules_checked) {
    await this._Login(referral_settings_id, referral_code, rules_checked);
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
  async AddScore(score, map_id) {
    await this._AddScore(score, map_id);
  },
  async RequestBestScore(map_id) {
    await this._RequestBestScore(map_id);
  },
  async RequestBestScoresLeaderboardByMapId(map_id, limit) {
    await this._RequestBestScoresLeaderboardByMapId(map_id, limit);
  },
  async RequestReferralLeaderboard(
    ref_leaderboard_id,
    ref_leaderboard_api_key,
    limit,
    min_balance,
    max_balance
  ) {
    await this._RequestReferralLeaderboard(
      ref_leaderboard_id,
      ref_leaderboard_api_key,
      limit,
      min_balance,
      max_balance
    );
  },
  async SendContractTransaction(
    contract_address,
    abi,
    function_name,
    input_data,
    chain_id
  ) {
    await this._SendContractTransaction(
      contract_address,
      abi,
      function_name,
      input_data,
      chain_id
    );
  },
  async RequestNumberOfRuns(map_id) {
    await this._RequestNumberOfRuns(map_id);
  },
  CheckReferralCodeFromDeeplink() {
    this._CheckReferralCodeFromDeeplink();
  },
  async ReadContract(
    contract_address,
    abi,
    function_name,
    input_data,
    rpc_url
  ) {
    await this._ReadContract(
      contract_address,
      abi,
      function_name,
      input_data,
      rpc_url
    );
  },
  async RequestUserNfts(query) {
    await this._RequestUserNfts(query);
  },
  async MultipleReadContract(
    contract_address,
    abi,
    function_names,
    inputs_data,
    rpc_url
  ) {
    await this._MultipleReadContract(
      contract_address,
      abi,
      function_names,
      inputs_data,
      rpc_url
    );
  },
  SetTransactionStatus(status) {
    this._SetTransactionStatus(status);
  },
};
