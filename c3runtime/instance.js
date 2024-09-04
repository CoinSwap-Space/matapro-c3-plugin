let stripe = null;
const C3 = self.C3;

const DOM_COMPONENT_ID = "MetaproPlugin";

C3.Plugins.MetaproPlugin.Instance = class MetaproPluginInstance extends C3.SDKInstanceBase {
    constructor(inst, properties) {
        super(inst, DOM_COMPONENT_ID);
        
        // Initial setup
        this._projectId = '';
        this._referralSettingsId = '';
        this._leaderboardId = '';
        this._leaderboardApiKey = '';
        this._usersServiceApiUrl = 'https://test-api.coinswap.space/users-service'; // Testnet
        this._clickerApiUrl = 'https://test-api.metaprotocol.com/ms/clicker'; // Testnet

        // Error
        this._errorMsg = '';

        // Triggers
        this._triggerAccountReceived = false;
        this._triggerUserLoggedIn = false;
        this._triggerLeaderboardReceived = false;
        this._triggerError = false;

        // User data
        this._account = null; // string
        this._accessToken = null; // string
        this._avatar = null; // string
        this._username = null; // string
        this._userId = null; // string

        // Leaderboard data
        this._personalLeaderboard = []; // array
        this._userPosition = null; // number
        this._leaderboard = []; // array

        if (properties) {
            this._projectId = properties[0];
            this._referralSettingsId = properties[1];
            this._leaderboardId = properties[2];
            this._leaderboardApiKey = properties[3];
            this._usersServiceApiUrl = properties[4];
            this._clickerApiUrl = properties[5];
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
        console.log(this.ConvertToBoolean(rules_checked))
        try {
            const hashResponse = await fetch(`${this._usersServiceApiUrl}/v2/auth/web3/signature/hash`, {
                headers: {
                    'x-account-wallet': this._account,
                },
            });

            if (!hashResponse.ok) {
                const errorData = await hashResponse.json();
                throw new Error(errorData?.messages?.[0] || errorData?.message || 'Something went wrong. Try again later!');
            }

            const { hash } = await hashResponse.json();
            const signature = await this.PostToDOMAsync("get-signature", { account: this._account, hash });

            const checkWalletResponse = await fetch(
                `${this._usersServiceApiUrl}/v2/auth/web3/check/${this._account}?projectId=${this._projectId}`
            );

            if (!checkWalletResponse.ok) {
                const errorData = await checkWalletResponse.json();
                throw new Error(errorData?.messages?.[0] || errorData?.message || 'Something went wrong. Try again later!');
            }

            const { hasAccount, hasRulesChecked } = await checkWalletResponse.json();

            let body = {
                wallet: this._account,
                signature,
                projectId: this._projectId
            };

            if (hasAccount && !hasRulesChecked) {
                body.rulesChecked = this.ConvertToBoolean(rules_checked);
            } else if (!hasAccount && !hasRulesChecked) {
                body.rulesChecked = this.ConvertToBoolean(rules_checked);
                if (referral_code) {
                    body.referralSettingsId = this._referralSettingsId;
                    body.referralCode = referral_code;
                }
            }
            
            const loginResponse = await fetch(`${this._usersServiceApiUrl}/v2/auth/web3/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-account-wallet': this._account,
                    'x-account-login-hash': hash 
                },
                body: JSON.stringify(body)
            });

            if (!loginResponse.ok) {
                const errorData = await loginResponse.json();
                throw new Error(errorData?.messages?.[0] || errorData?.message || 'Something went wrong. Try again later!');
            }

            const user = await loginResponse.json();

            this._accessToken = user.token.accessToken;
            this._username = user.account.personalDetails?.username;
            this._avatar = user.account.personalDetails?.avatar;
            this._userId = user.account.userId;

            this.OnUserLoggedIn();
            
        } catch (error) {
            console.log(error);
            this.HandleError("Login failed: " + error.message);
        }
    }

    async _RequestLeaderboard(level_id, scores_after, scores_before, limit) {
        try {
            const params = new URLSearchParams({
                levelId: level_id,
                scoresAfter: scores_after,
                scoresBefore: scores_before,
                limit
            }).toString();

            const url = `${this._clickerApiUrl}/scores-clicker/leaderboard/${this._leaderboardId}/${this._userId}?${params}`;

            const leaderboardResponse = await fetch(url, {
                headers: {
                    'leaderboardApiKey': this._leaderboardApiKey,
                }
            });

            if (!leaderboardResponse.ok) {
                const errorData = await leaderboardResponse.json();
                throw new Error(errorData?.messages?.[0] || errorData?.message || 'Something went wrong. Try again later!');
            }

            const data = await leaderboardResponse.json();
            
            this._personalLeaderboard = data.personal;
            this._userPosition = data.userPosition;
            this._leaderboard = data.leaderboard;

            this.OnLeaderboardReceived();
        } catch (error) {
            console.log(error);
            this.HandleError("Failed to get leaderboard: " + error.message);
        }
    }

    // Conditions
    OnAccountReceived() {
        this._triggerAccountReceived = true;
        this.Trigger(C3.Plugins.MetaproPlugin.Cnds.OnAccountReceived);
    };

    OnUserLoggedIn() {
        this._triggerUserLoggedIn = true;
        this.Trigger(C3.Plugins.MetaproPlugin.Cnds.OnUserLoggedIn);
    };

    OnLeaderboardReceived() {
        this._triggerLeaderboardReceived = true;
        this.Trigger(C3.Plugins.MetaproPlugin.Cnds.OnLeaderboardReceived);
    };

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
    
    _GetPersonalLeaderboard() {
        return this._personalLeaderboard;
    }

    _GetLeaderboard() {
        return this._leaderboard;
    }   
    
    _GetUserPosition() {
        return this._userPosition;
    }

    _GetLastError() {
        return this._errorMsg;
    }

    _SetProjectId(n) {
        this._projectId = n;
    }

    _GetProjectId() {
        return this._projectId;
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

self.IMyMetaproPluginInstance = class IMyMetaproPluginInstance extends self.IInstance {
    constructor() {
        super();
        
        // Map by SDK instance
        map.set(this, self.IInstance._GetInitInst().GetSdkInstance());
    }

    // Note: This is where the setter/getter properties are defined on the script interface.

};
