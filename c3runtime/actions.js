self.C3.Plugins.MetaproPlugin.Acts =
{
	async RequestAccount()
	{
		await this._RequestAccount();
	},
	async Login(referral_code, rules_checked)
	{
		await this._Login(referral_code, rules_checked);
	},
	async RequestLeaderboard(level_id, scores_after, scores_before, limit)
	{
		await this._RequestLeaderboard(level_id, scores_after, scores_before, limit);
	}
};