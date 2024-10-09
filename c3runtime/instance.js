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
    this._leaderboardId = "";
    this._leaderboardApiKey = "";
    this._usersServiceApiUrl = "";
    this._leaderboardApiUrl = "";
    this._referralApiUrl = "";
    this._nftApiUrl = "";
    this._platformId = "";

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
    this._triggerReferralCodeExists = false;
    this._triggerReferralCodeEmpty = false;
    this._triggerReferralCodeGenerated = false;
    this._triggerReferralStructureReceived = false;
    this._triggerBestScoreReceived = false;
    this._triggerBestScoresLeaderboardReceived = false;
    this._triggerReferralLeaderboardReceived = false;
    this._triggerTransactionSent = false;
    this._triggerNumberOfRunsReceived = false;
    this._triggerRefCodeFromDeeplinkExists = false;
    this._triggerReadContractDataReceived = false;
    this._triggerUserNftsReceived = false;
    this._triggerError = false;

    // User data
    this._account = null; // string
    this._accessToken = null; // string
    this._avatar = null; // string
    this._username = null; // string
    this._userId = null; // string
    this._personalDetails = {};

    this._userNfts = {};

    // Referral data
    this._referralCode = null; // string
    this._referralStructure = [];

    // Leaderboard data
    this._bestScore = 0;
    this._leaderboard = [];
    this._bestScoresLeaderboard = [];
    this._currentScore = 0;
    this._totalScore = 0;
    this._referralLeaderboard = [];
    this._numberOfRuns = 0;

    this._lastTransactionHash = null;
    this._lastReadContractData = null;

    this._refCodeFromDeeplink = "";

    if (properties) {
      this._projectId = properties[0];
      this._leaderboardId = properties[1];
      this._leaderboardApiKey = properties[2];
      this._usersServiceApiUrl = properties[3];
      this._leaderboardApiUrl = properties[4];
      this._referralApiUrl = properties[5];
      this._nftApiUrl = properties[6];
      this._platformId = properties[7];
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

  GetFunctionFromAbi(abi, functionName) {
    for (const abiItem of abi) {
      if (abiItem.type === "function" && abiItem.name === functionName)
        return abiItem;
    }
    return null;
  }

  SerializeData(data) {
    if (typeof data === "bigint") {
      return data.toString(); // Convert BigInt to string
    } else if (Array.isArray(data)) {
      return data.map(this.SerializeData); // Recursively handle arrays
    } else if (typeof data === "object" && data !== null) {
      return Object.fromEntries(
        Object.entries(data).map(([key, value]) => [
          key,
          this.SerializeData(value),
        ])
      ); // Recursively handle objects
    }
    return data; // Return other data types unchanged
  }

  GetURLParams({ params, paramsToSkip = [] }) {
    const requestParams = new URLSearchParams();

    Object.keys(params)
      .filter((param) => !paramsToSkip.includes(param))
      .forEach((param) => {
        const value = params[param];
        if (param === "sort")
          requestParams.append(
            `sort[${value.sortKey}]`,
            `${value.sortDirection}`
          );
        else if (param === "tokens" || param === "skipTokens")
          value.forEach((token) => {
            requestParams.append(
              `${param}[${token.contractAddress}]`,
              token.tokenId.toString()
            );
          });
        else if (param === "collections")
          value.forEach((collection) => {
            requestParams.append(
              `${param}[${collection.createdBy}]`,
              collection.collectionName
            );
          });
        else if (param === "properties") {
          value.forEach((item) => {
            if (item.name && isArrayPopulated(item.values)) {
              item.values.forEach((v) => {
                requestParams.append(`${param}[${item.name}]`, v.toString());
              });
            }
          });
        } else if (Array.isArray(value))
          value.forEach((item) => requestParams.append(param, item.toString()));
        else requestParams.append(param, value);
      });

    return requestParams;
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

  async _Login(referral_settings_id, referral_code, rules_checked) {
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
        platformId: this._platformId,
      };

      if (!(hasAccount && hasRulesChecked)) {
        body.rulesChecked = this.ConvertToBoolean(rules_checked);
        if (referral_code && referral_settings_id) {
          body.referralSettingsId = referral_settings_id;
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
      let personal = null;

      if (this._userId) {
        const personalResponse = await fetch(
          `${this._leaderboardApiUrl}/score-total/personal/${this._leaderboardId}/${this._userId}`,
          {
            headers: {
              leaderboardApiKey: this._leaderboardApiKey,
            },
          }
        );

        if (!personalResponse.ok) {
          const errorData = await personalResponse.json();
          throw new Error(
            errorData?.messages?.[0] ||
              errorData?.message ||
              "Something went wrong. Try again later!"
          );
        }

        const personalData = await personalResponse.json();

        if (typeof personalData === "object") {
          console.log(personalData);
          personal = {
            userId: this._userId,
            position: personalData.mainScore.position,
            currentScore: personalData.mainScore.currentRoundData.score,
            totalScore: personalData.mainScore.totalRoundData.score,
            username:
              this._personalDetails?.username ||
              this.ShortenText(this._account, 6, 4),
            avatar: this._personalDetails?.avatar || "",
          };
        }
      }

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

          if (user) {
            return {
              userId: player.userId,
              position: player.position,
              currentScore: player.currentRoundData.score,
              totalScore: player.totalRoundData.score,
              username:
                user?.personalDetails?.username ||
                this.ShortenText(walletAddress, 6, 4),
              avatar: user?.personalDetails?.avatar || "",
            };
          } else {
            return {
              userId: player.userId,
              position: player.position,
              currentScore: player.currentRoundData.score,
              totalScore: player.totalRoundData.score,
              username: player.userId,
              avatar: "",
            };
          }
        });
      }

      const countResponse = await fetch(
        `${this._leaderboardApiUrl}/score-total/count/leaderboard/${this._leaderboardId}`
      );

      if (!countResponse.ok) {
        const errorData = await countResponse.json();
        throw new Error(
          errorData?.messages?.[0] ||
            errorData?.message ||
            "Something went wrong. Try again later!"
        );
      }

      let count = 0;
      try {
        count = Number(await countResponse.text());
      } catch (err) {
        console.log(err);
      }

      this._leaderboard = {
        count,
        results: leaderboard,
        ...(!!personal && { personal }),
      };

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

  async _AddScore(score, map_id) {
    try {
      // Create match ID
      const createMatchResponse = await fetch(
        `${this._leaderboardApiUrl}/match-data/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            leaderboardApiKey: this._leaderboardApiKey,
          },
          body: JSON.stringify({
            leaderboardId: this._leaderboardId,
          }),
        }
      );

      if (!createMatchResponse.ok) {
        const errorData = await createMatchResponse.json();
        throw new Error(
          errorData?.messages?.[0] ||
            errorData?.message ||
            "Something went wrong. Try again later!"
        );
      }
      const matchId = await createMatchResponse.text();

      // Create score per map
      const scoreResponse = await fetch(
        `${this._leaderboardApiUrl}/score-map/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            leaderboardApiKey: this._leaderboardApiKey,
          },
          body: JSON.stringify({
            leaderboardId: this._leaderboardId,
            userId: this._userId,
            matchId,
            map: map_id,
            startedAt: new Date().toISOString(),
            endedAt: new Date().toISOString(),
            projectId: this._projectId,
            roundData: {
              score,
            },
          }),
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

      const params = new URLSearchParams({
        leaderboardId: this._leaderboardId,
        map: map_id,
      }).toString();

      const url = `${this._leaderboardApiUrl}/score-map/get/personal/${this._userId}?${params}`;

      const bestScoreResponse = await fetch(url, {
        headers: {
          leaderboardApiKey: this._leaderboardApiKey,
        },
      });

      if (!bestScoreResponse.ok) {
        const errorData = await bestScoreResponse.json();
        throw new Error(
          errorData?.messages?.[0] ||
            errorData?.message ||
            "Something went wrong. Try again later!"
        );
      }

      const bestScore = await bestScoreResponse.json();

      this._bestScore = bestScore?.[0]?.roundData?.score || 0;

      this.OnBestScoreReceived();
    } catch (error) {
      console.log(error);
      this.HandleError("Failed to add score: " + error.message);
    }
  }

  async _RequestBestScoresLeaderboardByMapId(map_id, limit) {
    try {
      const params = new URLSearchParams({
        map: map_id,
        leaderboardId: this._leaderboardId,
        limit: limit || 20,
      }).toString();

      const url = `${this._leaderboardApiUrl}/score-map/get?${params}`;

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

      const { results, count } = await leaderboardResponse.json();
      let leaderboard = results;
      let personal = null;

      if (this._userId) {
        const personalResponse = await fetch(
          `${this._leaderboardApiUrl}/score-map/get/personal/${this._userId}?leaderboardId=${this._leaderboardId}&map=${map_id}`,
          {
            headers: {
              leaderboardApiKey: this._leaderboardApiKey,
            },
          }
        );

        if (!personalResponse.ok) {
          const errorData = await personalResponse.json();
          throw new Error(
            errorData?.messages?.[0] ||
              errorData?.message ||
              "Something went wrong. Try again later!"
          );
        }

        const personalData = await personalResponse.json();

        if (!!personalData[0]) {
          personal = {
            userId: this._userId,
            position: personalData[0].position,
            bestScore: personalData[0].roundData.score,
            username:
              this._personalDetails?.username ||
              this.ShortenText(this._account, 6, 4),
            avatar: this._personalDetails?.avatar || "",
          };
        }
      }

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

          if (user) {
            return {
              userId: player.userId,
              position: player.position,
              bestScore: player.roundData.score,
              username:
                user?.personalDetails?.username ||
                this.ShortenText(walletAddress, 6, 4),
              avatar: user?.personalDetails?.avatar || "",
            };
          } else {
            return {
              userId: player.userId,
              position: player.position,
              bestScore: player.roundData.score,
              username: player.userId,
              avatar: "",
            };
          }
        });
      }

      this._bestScoresLeaderboard = {
        results: leaderboard,
        count,
        ...(!!personal && { personal }),
      };

      this.OnBestScoresLeaderboardReceived();
    } catch (error) {
      console.log(error);
      this.HandleError(
        "Failed to get best scores leaderboard: " + error.message
      );
    }
  }

  async _RequestBestScore(map_id) {
    try {
      const params = new URLSearchParams({
        map: map_id,
        leaderboardId: this._leaderboardId,
      }).toString();

      const url = `${this._leaderboardApiUrl}/score-map/get/personal/${this._userId}?${params}`;

      const bestScoreResponse = await fetch(url, {
        headers: {
          leaderboardApiKey: this._leaderboardApiKey,
        },
      });

      if (!bestScoreResponse.ok) {
        const errorData = await bestScoreResponse.json();
        throw new Error(
          errorData?.messages?.[0] ||
            errorData?.message ||
            "Something went wrong. Try again later!"
        );
      }

      const bestScore = await bestScoreResponse.json();

      this._bestScore = bestScore?.[0]?.roundData?.score || 0;

      this.OnBestScoreReceived();
    } catch (error) {
      console.log(error);
      this.HandleError("Failed to fetch best score: " + error.message);
    }
  }

  async _RequestReferralLeaderboard(
    ref_leaderboard_id,
    ref_leaderboard_api_key,
    limit,
    min_balance,
    max_balance
  ) {
    try {
      const params = new URLSearchParams({
        limit: limit || 20,
        ...(min_balance && { minBalance: min_balance }),
        ...(max_balance && { maxBalance: max_balance }),
      }).toString();

      const url = `${this._leaderboardApiUrl}/score-total/leaderboard/${ref_leaderboard_id}?${params}`;

      const leaderboardResponse = await fetch(url, {
        headers: {
          leaderboardApiKey: ref_leaderboard_api_key,
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
      let personal = null;

      if (this._userId) {
        const personalResponse = await fetch(
          `${this._leaderboardApiUrl}/score-total/personal/${this._leaderboardId}/${this._userId}`,
          {
            headers: {
              leaderboardApiKey: this._leaderboardApiKey,
            },
          }
        );

        if (!personalResponse.ok) {
          const errorData = await personalResponse.json();
          throw new Error(
            errorData?.messages?.[0] ||
              errorData?.message ||
              "Something went wrong. Try again later!"
          );
        }

        const personalData = await personalResponse.json();

        if (typeof personalData === "object") {
          personal = {
            userId: this._userId,
            position: personalData.mainScore.position,
            currentScore: personalData.mainScore.currentRoundData.score,
            totalScore: personalData.mainScore.totalRoundData.score,
            username:
              this._personalDetails?.username ||
              this.ShortenText(this._account, 6, 4),
            avatar: this._personalDetails?.avatar || "",
          };
        }
      }

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

          if (user) {
            return {
              userId: player.userId,
              position: player.position,
              currentScore: player.currentRoundData.score,
              totalScore: player.totalRoundData.score,
              username:
                user?.personalDetails?.username ||
                this.ShortenText(walletAddress, 6, 4),
              avatar: user?.personalDetails?.avatar || "",
            };
          } else {
            return {
              userId: player.userId,
              position: player.position,
              currentScore: player.currentRoundData.score,
              totalScore: player.totalRoundData.score,
              username: player.userId,
              avatar: "",
            };
          }
        });
      }

      const countResponse = await fetch(
        `${this._leaderboardApiUrl}/score-total/count/leaderboard/${ref_leaderboard_id}`
      );

      if (!countResponse.ok) {
        const errorData = await countResponse.json();
        throw new Error(
          errorData?.messages?.[0] ||
            errorData?.message ||
            "Something went wrong. Try again later!"
        );
      }

      let count = 0;
      try {
        count = Number(await countResponse.text());
      } catch (err) {
        console.log(err);
      }

      this._referralLeaderboard = {
        results: leaderboard,
        count,
        ...(!!personal && { personal }),
      };

      this.OnReferralLeaderboardReceived();
    } catch (error) {
      console.log(error);
      this.HandleError("Failed to get referral leaderboard: " + error.message);
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

  async _FetchReferralCode() {
    try {
      const refCodeResponse = await fetch(
        `${this._referralApiUrl}/users/projects/${this._projectId}/referral-code`,
        {
          headers: {
            "x-account-userid": this._userId,
            Authorization: this._accessToken,
          },
        }
      );

      if (!refCodeResponse.ok) {
        const errorData = await refCodeResponse.json();
        throw new Error(
          errorData?.messages?.[0] ||
            errorData?.message ||
            "Something went wrong. Try again later!"
        );
      }

      const response = await refCodeResponse.json();

      if (response.referralCode) {
        this._referralCode = response.referralCode;
        this.OnReferralCodeExists();
      } else {
        this.OnReferralCodeEmpty();
      }
    } catch (error) {
      console.log(error);
      this.HandleError("Failed to retrieve referral code: " + error.message);
    }
  }

  async _GenerateReferralCode() {
    try {
      const refCodeResponse = await fetch(
        `${this._referralApiUrl}/users/projects/referral-code`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-account-UserId": this._userId,
            Authorization: this._accessToken,
          },
          body: JSON.stringify({ projectId: this._projectId }),
        }
      );

      if (!refCodeResponse.ok) {
        const errorData = await refCodeResponse.json();
        throw new Error(
          errorData?.messages?.[0] ||
            errorData?.message ||
            "Something went wrong. Try again later!"
        );
      }

      const response = await refCodeResponse.json();

      this._referralCode = response.referralCode;

      this.OnReferralCodeGenerated();
    } catch (error) {
      console.log(error);
      this.HandleError("Failed to generate referral code: " + error.message);
    }
  }

  async _RequestReferralStructure() {
    try {
      const refStructureResponse = await fetch(
        `${this._leaderboardApiUrl}/score-total/downline/${this._leaderboardId}/${this._userId}`,
        {
          headers: {
            leaderboardApiKey: this._leaderboardApiKey,
          },
        }
      );

      if (!refStructureResponse.ok) {
        const errorData = await refStructureResponse.json();
        throw new Error(
          errorData?.messages?.[0] ||
            errorData?.message ||
            "Something went wrong. Try again later!"
        );
      }

      const response = await refStructureResponse.json();

      this._referralStructure = response.map((refLevel) => ({
        ...refLevel,
        percentage: refLevel.percentage * 10,
      }));

      this.OnReferralStructureReceived();
    } catch (error) {
      console.log(error);
      this.HandleError("Failed to get referral structure: " + error.message);
    }
  }

  async _SendContractTransaction(
    contract_address,
    abi,
    function_name,
    input_data,
    chain_id
  ) {
    try {
      if (!this._account) {
        throw new Error("Account information is missing or not initialized.");
      }

      const parsedAbi = JSON.parse(abi);
      const functionAbi = this.GetFunctionFromAbi(parsedAbi, function_name);
      if (!functionAbi) {
        throw new Error(
          `Function "${function_name}" not found in the provided ABI.`
        );
      }

      const inputData = JSON.parse(
        input_data.replace(/&quot;/g, '"').replace(/'/g, '"')
      );

      const missingKeys = functionAbi.inputs.length !== inputData.length;
      if (missingKeys) {
        throw new Error("Mismatch in number of function arguments");
      }

      await this.PostToDOMAsync("switch-chain", chain_id);

      const contract = new web3.eth.Contract(parsedAbi, contract_address);
      const estimatedGas = await contract.methods[function_name](
        ...inputData
      ).estimateGas({
        from: this._account,
      });
      const currentGasPrice = await web3.eth.getGasPrice();
      const transaction = await contract.methods[function_name](
        ...inputData
      ).send({
        from: this._account,
        gas: estimatedGas,
        gasPrice: currentGasPrice,
      });

      this._lastTransactionHash = transaction.transactionHash;

      this.OnTransactionSent();
    } catch (error) {
      console.log(error);
      this.HandleError("Failed to send transaction: " + error.message);
    }
  }

  async _ReadContract(
    contract_address,
    abi,
    function_name,
    input_data,
    rpc_url
  ) {
    try {
      const parsedAbi = JSON.parse(abi);
      const functionAbi = this.GetFunctionFromAbi(parsedAbi, function_name);
      if (!functionAbi) {
        throw new Error(
          `Function "${function_name}" not found in the provided ABI.`
        );
      }

      const inputData = JSON.parse(
        input_data.replace(/&quot;/g, '"').replace(/'/g, '"')
      );

      const missingKeys = functionAbi.inputs.length !== inputData.length;
      if (missingKeys) {
        throw new Error("Mismatch in number of function arguments");
      }
      const web3Provider = new Web3.providers.HttpProvider(rpc_url);
      const web3 = new Web3(web3Provider);
      const contract = new web3.eth.Contract(parsedAbi, contract_address);
      const readData = await contract.methods[function_name](
        ...inputData
      ).call();

      this._lastReadContractData = this.SerializeData(readData);

      this.OnReadContractDataReceived();
    } catch (error) {
      console.log(error);
      this.HandleError("Failed to send transaction: " + error.message);
    }
  }

  async _RequestNumberOfRuns(map_id) {
    try {
      const params = new URLSearchParams({
        leaderboardId: this._leaderboardId,
        ...(map_id && { map: map_id }),
      }).toString();

      const countResponse = await fetch(
        `${this._leaderboardApiUrl}/score-map/get/count/${this._userId}?${params}`,
        {
          headers: {
            leaderboardApiKey: this._leaderboardApiKey,
          },
        }
      );

      if (!countResponse.ok) {
        const errorData = await countResponse.json();
        throw new Error(
          errorData?.messages?.[0] ||
            errorData?.message ||
            "Something went wrong. Try again later!"
        );
      }

      let count = 0;
      try {
        count = Number(await countResponse.text());
      } catch (err) {
        console.log(err);
      }

      this._numberOfRuns = count;

      this.OnNumberOfRunsReceived();
    } catch (error) {
      console.log(error);
      this.HandleError("Requesting user score failed: " + error.message);
    }
  }

  _CheckReferralCodeFromDeeplink() {
    const refCode = this.PostToDOM("get-referral-code-from-deeplink");

    if (refCode) {
      this._refCodeFromDeeplink = refCode;

      this.OnRefCodeFromDeeplinkExists();
    }
  }

  async _RequestUserNfts(query) {
    try {
      let parsedQuery = {};

      if (!!query) {
        parsedQuery = JSON.parse(
          query.replace(/&quot;/g, '"').replace(/'/g, '"')
        );
      }

      const requestParams = this.GetURLParams({
        params: parsedQuery,
      });

      const nftResponse = await fetch(
        `${this._nftApiUrl}/v1/user/${this._account}/tokens?${requestParams}`
      );

      if (!nftResponse.ok) {
        const errorData = await nftResponse.json();
        throw new Error(
          errorData?.messages?.[0] ||
            errorData?.message ||
            "Something went wrong. Try again later!"
        );
      }

      const nfts = await nftResponse.json();

      this._userNfts = nfts;

      this.OnUserNftsReceived();
    } catch (error) {
      console.log(error);
      this.HandleError("Requesting user nfts failed: " + error.message);
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

  OnReferralCodeExists() {
    this._triggerReferralCodeExists = true;
    this.Trigger(C3.Plugins.MetaproPlugin.Cnds.OnReferralCodeExists);
  }

  OnReferralCodeEmpty() {
    this._triggerReferralCodeEmpty = true;
    this.Trigger(C3.Plugins.MetaproPlugin.Cnds.OnReferralCodeEmpty);
  }

  OnReferralCodeGenerated() {
    this._triggerReferralCodeGenerated = true;
    this.Trigger(C3.Plugins.MetaproPlugin.Cnds.OnReferralCodeGenerated);
  }

  OnReferralStructureReceived() {
    this._triggerReferralStructureReceived = true;
    this.Trigger(C3.Plugins.MetaproPlugin.Cnds.OnReferralStructureReceived);
  }

  OnBestScoreReceived() {
    this._triggerBestScoreReceived = true;
    this.Trigger(C3.Plugins.MetaproPlugin.Cnds.OnBestScoreReceived);
  }

  OnBestScoresLeaderboardReceived() {
    this._triggerBestScoresLeaderboardReceived = true;
    this.Trigger(C3.Plugins.MetaproPlugin.Cnds.OnBestScoresLeaderboardReceived);
  }

  OnReferralLeaderboardReceived() {
    this._triggerReferralLeaderboardReceived = true;
    this.Trigger(C3.Plugins.MetaproPlugin.Cnds.OnReferralLeaderboardReceived);
  }

  OnTransactionSent() {
    this._triggerTransactionSent = true;
    this.Trigger(C3.Plugins.MetaproPlugin.Cnds.OnTransactionSent);
  }

  OnNumberOfRunsReceived() {
    this._triggerNumberOfRunsReceived = true;
    this.Trigger(C3.Plugins.MetaproPlugin.Cnds.OnNumberOfRunsReceived);
  }

  OnRefCodeFromDeeplinkExists() {
    this._triggerRefCodeFromDeeplinkExists = true;
    this.Trigger(C3.Plugins.MetaproPlugin.Cnds.OnRefCodeFromDeeplinkExists);
  }

  OnUserNftsReceived() {
    this._triggerUserNftsReceived = true;
    this.Trigger(C3.Plugins.MetaproPlugin.Cnds.OnUserNftsReceived);
  }

  OnReadContractDataReceived() {
    this._triggerReadContractDataReceived = true;
    this.Trigger(C3.Plugins.MetaproPlugin.Cnds.OnReadContractDataReceived);
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

  _GetReferralCode() {
    return this._referralCode;
  }

  _GetReferralStructure() {
    return this._referralStructure;
  }

  _GetBestScore() {
    return this._bestScore;
  }

  _GetBestScoresLeaderboard() {
    return this._bestScoresLeaderboard;
  }

  _GetReferralLeaderboard() {
    return this._referralLeaderboard;
  }

  _GetNumberOfRuns() {
    return this._numberOfRuns;
  }

  _GetRefCodeFromDeeplink() {
    return this._refCodeFromDeeplink;
  }

  _GetLastTransactionHash() {
    return this._lastTransactionHash;
  }

  _GetLastReadContractData() {
    return this._lastReadContractData;
  }

  _GetUserNfts() {
    return this._userNfts;
  }

  _GetLastError() {
    return this._errorMsg;
  }

  _GetProjectId() {
    return this._projectId;
  }

  _GetLeaderboardId() {
    return this._leaderboardId;
  }

  _GetLeaderboardApiKey() {
    return this._leaderboardApiKey;
  }

  _GetUsersServiceApiUrl() {
    return this._usersServiceApiUrl;
  }

  _GetLeaderboardApiUrl() {
    return this._leaderboardApiUrl;
  }

  _GetReferralApiUrl() {
    return this._referralApiUrl;
  }

  _GetNftApiUrl() {
    return this._nftApiUrl;
  }

  _GetPlatformId() {
    return this._platformId;
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
