let stripe = null;
const C3 = self.C3;

const DOM_COMPONENT_ID = "MetaproPlugin";

C3.Plugins.MetaproPlugin.Instance = class MetaproPluginInstance extends (
  C3.SDKInstanceBase
) {
  constructor(inst, properties) {
    super(inst, DOM_COMPONENT_ID);

    // Initial setup
    this._projectId = "";
    this._referralSettingsId = "";
    this._leaderboardId = "";
    this._leaderboardApiKey = "";
    this._usersServiceApiUrl = "";
    this._leaderboardApiUrl = "";

    // Error
    this._errorMsg = "";

    // Triggers
    this._triggerAccountReceived = false;
    this._triggerUserLoggedIn = false;
    this._triggerLeaderboardReceived = false;
    this._triggerUsernameUpdated = false;
    this._triggerAvatarUpdated = false;
    this._triggerIsRegistered = false;
    this._triggerIsNotRegistered = false;
    this._triggerUserScoreReceived = false;
    this._triggerError = false;

    // User data
    this._account = null; // string
    this._accessToken = null; // string
    this._avatar = null; // string
    this._username = null; // string
    this._userId = null; // string
    this._personalDetails = {};

    // Leaderboard data
    this._leaderboard = []; // array
    this._currentScore = 0;
    this._totalScore = 0;

    if (properties) {
      this._projectId = properties[0];
      this._referralSettingsId = properties[1];
      this._leaderboardId = properties[2];
      this._leaderboardApiKey = properties[3];
      this._usersServiceApiUrl = properties[4];
      this._leaderboardApiUrl = properties[5];
    }
  }

  Release() {
    super.Release();
  }

  ConvertToBoolean(value) {
    if (value === 0) {
      return false;
    } else if (value === 1) {
      return true;
    } else {
      throw new Error("Invalid value for rules_checked. Expected 0 or 1.");
    }
  }

  ShortenText(text, firstChars = 4, lastChars = 4) {
    const textLength = text.length;
    if (textLength <= firstChars + lastChars) return text;
    return `${text.substring(0, firstChars)}...${text.substring(
      textLength - lastChars
    )}`;
  }

  HandleError(errorMsg) {
    this._errorMsg = errorMsg;
    this._triggerError = true;
    this.Trigger(C3.Plugins.MetaproPlugin.Cnds.OnError);
  }

  // Actions
  async _RequestAccount() {
    try {
      const accounts = await this.PostToDOMAsync("eth-request-accounts");

      if (accounts?.[0]) {
        this._account = accounts[0].toLowerCase();
        this.OnAccountReceived();
      }
    } catch (error) {
      console.error("Error in _RequestAccount:", error);
      this.HandleError("Failed to request account: " + error.message);
    }
  }

  async _Login(referral_code, rules_checked) {
    try {
      const hashResponse = await fetch(
        `${this._usersServiceApiUrl}/v2/auth/web3/signature/hash`,
        {
          headers: {
            "x-account-wallet": this._account,
          },
        }
      );

      if (!hashResponse.ok) {
        const errorData = await hashResponse.json();
        throw new Error(
          errorData?.messages?.[0] ||
            errorData?.message ||
            "Something went wrong. Try again later!"
        );
      }

      const { hash } = await hashResponse.json();
      const signature = await this.PostToDOMAsync("get-signature", {
        account: this._account,
        hash,
      });

      const checkWalletResponse = await fetch(
        `${this._usersServiceApiUrl}/v2/auth/web3/check/${this._account}?projectId=${this._projectId}`
      );

      if (!checkWalletResponse.ok) {
        const errorData = await checkWalletResponse.json();
        throw new Error(
          errorData?.messages?.[0] ||
            errorData?.message ||
            "Something went wrong. Try again later!"
        );
      }

      const { hasAccount, hasRulesChecked } = await checkWalletResponse.json();

      let body = {
        wallet: this._account,
        signature,
        projectId: this._projectId,
      };

      if (!(hasAccount && hasRulesChecked)) {
        body.rulesChecked = this.ConvertToBoolean(rules_checked);
        if (referral_code) {
          body.referralSettingsId = this._referralSettingsId;
          body.referralCode = referral_code;
        }
      }

      const loginResponse = await fetch(
        `${this._usersServiceApiUrl}/v2/auth/web3/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-account-wallet": this._account,
            "x-account-login-hash": hash,
          },
          body: JSON.stringify(body),
        }
      );

      if (!loginResponse.ok) {
        const errorData = await loginResponse.json();
        throw new Error(
          errorData?.messages?.[0] ||
            errorData?.message ||
            "Something went wrong. Try again later!"
        );
      }

      const user = await loginResponse.json();

      this._accessToken = user.token.accessToken;
      this._username =
        user.account.personalDetails?.username ||
        this.ShortenText(this._account, 6, 4);
      this._avatar = user.account.personalDetails?.avatar || "";
      this._userId = user.account.userId;

      this._personalDetails = user.account.personalDetails;

      this.OnUserLoggedIn();
    } catch (error) {
      console.log(error);
      this.HandleError("Login failed: " + error.message);
    }
  }

  async _RequestLeaderboard(limit, min_balance, max_balance) {
    try {
      const params = new URLSearchParams({
        limit: limit || 20,
        ...(min_balance && { minBalance: min_balance }),
        ...(max_balance && { maxBalance: max_balance }),
      }).toString();

      const url = `${this._leaderboardApiUrl}/score-total/leaderboard/${this._leaderboardId}?${params}`;

      const leaderboardResponse = await fetch(url, {
        headers: {
          leaderboardApiKey: this._leaderboardApiKey,
        },
      });

      if (!leaderboardResponse.ok) {
        const errorData = await leaderboardResponse.json();
        throw new Error(
          errorData?.messages?.[0] ||
            errorData?.message ||
            "Something went wrong. Try again later!"
        );
      }

      let leaderboard = await leaderboardResponse.json();

      if (leaderboard.length > 0) {
        const requestParams = new URLSearchParams({ limit: 99999 });

        leaderboard.forEach((item) =>
          requestParams.append("userIds", item.userId)
        );

        const usersResponse = await fetch(
          `${this._usersServiceApiUrl}/profiles?${requestParams}`
        );

        if (!usersResponse.ok) {
          const errorData = await usersResponse.json();
          throw new Error(
            errorData?.messages?.[0] ||
              errorData?.message ||
              "Something went wrong. Try again later!"
          );
        }

        const { results } = await usersResponse.json();

        leaderboard = leaderboard.map((player) => {
          const user = results.find(({ userId }) => userId === player.userId);
          const walletAddress = user?.addresses[0]?.wallet;

          return {
            ...player,
            username:
              user?.personalDetails?.username ||
              this.ShortenText(walletAddress, 6, 4),
            avatar: user?.personalDetails?.avatar || "",
          };
        });
      }

      this._leaderboard = leaderboard;

      this.OnLeaderboardReceived();
    } catch (error) {
      console.log(error);
      this.HandleError("Failed to get leaderboard: " + error.message);
    }
  }

  async _UpdateScore(score) {
    try {
      const updateScoreResponse = await fetch(
        `${this._leaderboardApiUrl}/score-total/${this._userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            leaderboardApiKey: this._leaderboardApiKey,
          },
          body: JSON.stringify({
            leaderboardId: this._leaderboardId,
            projectId: this._projectId,
            referralSettingsId: this._referralSettingsId,
            roundData: {
              score,
            },
          }),
        }
      );

      if (!updateScoreResponse.ok) {
        const errorData = await updateScoreResponse.json();
        throw new Error(
          errorData?.messages?.[0] ||
            errorData?.message ||
            "Something went wrong. Try again later!"
        );
      }
      const updatedScore = await updateScoreResponse.json();

      this._currentScore = updatedScore.scoreTotal.currentRoundData.score;
      this._totalScore = updatedScore.scoreTotal.totalRoundData.score;

      this.OnUserScoreReceived();
    } catch (error) {
      console.log(error);
      this.HandleError("Failed to update score: " + error.message);
    }
  }

  async _UpdateUsername(username) {
    try {
      const body = { ...this._personalDetails };
      if (username !== "") {
        body.username = username;
      } else {
        delete body.username;
      }

      const updateResponse = await fetch(`${this._usersServiceApiUrl}/update`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-account-userid": this._userId,
          Authorization: this._accessToken,
        },
        body: JSON.stringify({ personalDetails: body }),
      });

      if (!updateResponse.ok) {
        const errorData = await updateResponse.json();
        throw new Error(
          errorData?.messages?.[0] ||
            errorData?.message ||
            "Something went wrong. Try again later!"
        );
      }
      const user = await updateResponse.json();

      this._personalDetails = user.personalDetails;
      this._username = user.personalDetails?.username || "";

      this.OnUsernameUpdated();
    } catch (error) {
      console.log(error);
      this.HandleError("Failed to update username: " + error.message);
    }
  }

  async _UpdateAvatar(avatar) {
    try {
      const body = { ...this._personalDetails };
      if (avatar !== "") {
        body.avatar = avatar;
      } else {
        delete body.avatar;
      }

      const updateResponse = await fetch(`${this._usersServiceApiUrl}/update`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-account-userid": this._userId,
          Authorization: this._accessToken,
        },
        body: JSON.stringify({ personalDetails: body }),
      });

      if (!updateResponse.ok) {
        const errorData = await updateResponse.json();
        throw new Error(
          errorData?.messages?.[0] ||
            errorData?.message ||
            "Something went wrong. Try again later!"
        );
      }

      const user = await updateResponse.json();

      this._personalDetails = user.personalDetails;
      this._avatar = user.personalDetails?.avatar || "";

      this.OnAvatarUpdated();
    } catch (error) {
      console.log(error);
      this.HandleError("Failed to update avatar: " + error.message);
    }
  }

  async _RequestUserScore() {
    try {
      const scoreResponse = await fetch(
        `${this._leaderboardApiUrl}/score-total/get?userId=${this._userId}&leaderboardId=${this._leaderboardId}`,
        {
          headers: {
            leaderboardApiKey: this._leaderboardApiKey,
          },
        }
      );

      if (!scoreResponse.ok) {
        const errorData = await scoreResponse.json();
        throw new Error(
          errorData?.messages?.[0] ||
            errorData?.message ||
            "Something went wrong. Try again later!"
        );
      }

      const score = await scoreResponse.json();

      this._currentScore = score?.currentRoundData?.score;
      this._totalScore = score?.totalRoundData?.score;

      this.OnUserScoreReceived();
    } catch (error) {
      console.log(error);
      this.HandleError("Requesting user score failed: " + error.message);
    }
  }

  async _CheckIfRegistered() {
    try {
      const checkWalletResponse = await fetch(
        `${this._usersServiceApiUrl}/v2/auth/web3/check/${this._account}?projectId=${this._projectId}`
      );

      if (!checkWalletResponse.ok) {
        const errorData = await checkWalletResponse.json();
        throw new Error(
          errorData?.messages?.[0] ||
            errorData?.message ||
            "Something went wrong. Try again later!"
        );
      }

      const { hasAccount, hasRulesChecked } = await checkWalletResponse.json();

      const isRegistered = hasAccount && hasRulesChecked;

      if (isRegistered) {
        this.OnIsRegistered();
      } else {
        this.OnIsNotRegistered();
      }
    } catch (error) {
      console.log(error);
      this.HandleError("Failed to check if registered: " + error.message);
    }
  }

  // Conditions
  OnAccountReceived() {
    this._triggerAccountReceived = true;
    this.Trigger(C3.Plugins.MetaproPlugin.Cnds.OnAccountReceived);
  }

  OnUserLoggedIn() {
    this._triggerUserLoggedIn = true;
    this.Trigger(C3.Plugins.MetaproPlugin.Cnds.OnUserLoggedIn);
  }

  OnLeaderboardReceived() {
    this._triggerLeaderboardReceived = true;
    this.Trigger(C3.Plugins.MetaproPlugin.Cnds.OnLeaderboardReceived);
  }

  OnUsernameUpdated() {
    this._triggerUsernameUpdated = true;
    this.Trigger(C3.Plugins.MetaproPlugin.Cnds.OnUsernameUpdated);
  }

  OnAvatarUpdated() {
    this._triggerAvatarUpdated = true;
    this.Trigger(C3.Plugins.MetaproPlugin.Cnds.OnAvatarUpdated);
  }

  OnUserScoreReceived() {
    this._triggerUserScoreReceived = true;
    this.Trigger(C3.Plugins.MetaproPlugin.Cnds.OnUserScoreReceived);
  }

  OnIsRegistered() {
    this._triggerIsRegistered = true;
    this.Trigger(C3.Plugins.MetaproPlugin.Cnds.OnIsRegistered);
  }

  OnIsNotRegistered() {
    this._triggerIsNotRegistered = true;
    this.Trigger(C3.Plugins.MetaproPlugin.Cnds.OnIsNotRegistered);
  }

  // Expressions
  _GetAccount() {
    return this._account;
  }

  _GetAvatar() {
    return this._avatar;
  }

  _GetUserId() {
    return this._userId;
  }

  _GetUsername() {
    return this._username;
  }

  _GetAccessToken() {
    return this._accessToken;
  }

  _GetLeaderboard() {
    return this._leaderboard;
  }

  _GetCurrentScore() {
    return this._currentScore;
  }

  _GetTotalScore() {
    return this._totalScore;
  }

  _GetLastError() {
    return this._errorMsg;
  }

  Release() {
    super.Release();
  }

  SaveToJson() {
    return {
      // data to be saved for savegames
    };
  }

  LoadFromJson(o) {
    // load state for savegames
  }

  GetScriptInterfaceClass() {
    return self.IMyMetaproPluginInstance;
  }
};

// Script interface. Use a WeakMap to safely hide the internal implementation details from the
// caller using the script interface.
const map = new WeakMap();

self.IMyMetaproPluginInstance = class IMyMetaproPluginInstance extends (
  self.IInstance
) {
  constructor() {
    super();

    // Map by SDK instance
    map.set(this, self.IInstance._GetInitInst().GetSdkInstance());
  }

  // Note: This is where the setter/getter properties are defined on the script interface.
};
