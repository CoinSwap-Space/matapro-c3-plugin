
self.C3.Plugins.MetaproPlugin.Exps =
{
    GetLastError()
	{
		return this._GetLastError();
	},
    GetAccount()
	{
		return this._GetAccount();
	},
    GetAvatar()
	{
		return this._GetAvatar();
	},
    GetUserId()
	{
		return this._GetUserId();
	},
    GetUsername()
	{
		return this._GetUsername();
	},
    GetAccessToken()
	{
		return this._GetAccessToken();
	},
	GetPersonalLeaderboard()
	{
		const personalLeaderboard = this._GetPersonalLeaderboard();
		const jsonPersonalLeaderboard = JSON.stringify(personalLeaderboard);
		
        return jsonPersonalLeaderboard;
	},
	GetLeaderboard()
	{
		const leaderboard = this._GetLeaderboard();
		const jsonLeaderboard = JSON.stringify(leaderboard);

        return jsonLeaderboard;
	},
	GetUserPosition()
	{
        return this._GetUserPosition();
	},
};
