"use strict";

{
  // In the C3 runtime's worker mode, all the runtime scripts (e.g. plugin.js, instance.js, actions.js)
  // are loaded in a Web Worker, which has no access to the document so cannot make DOM calls. To help
  // plugins use DOM elements the runtime internally manages a postMessage() bridge wrapped in some helper
  // classes designed to manage DOM elements. Then this script (domSide.js) is loaded in the main document
  // (aka the main thread) where it can make any DOM calls on behalf of the runtime. Conceptually the two
  // ends of the messaging bridge are the "Runtime side" in a Web Worker, and the "DOM side" with access
  // to the Document Object Model (DOM). The addon's plugin.js specifies to load this script on the
  // DOM side by making the call: this._info.SetDOMSideScripts(["c3runtime/domSide.js"])
  // Note that when NOT in worker mode, this entire framework is still used identically, just with both
  // the runtime and the DOM side in the main thread. This allows non-worker mode to work the same with
  // no additional code changes necessary. However it's best to imagine that the runtime side is in a
  // Web Worker, since that is when it is necessary to separate DOM calls from the runtime.

  // NOTE: use a unique DOM component ID to ensure it doesn't clash with anything else
  // This must also match the ID in instance.js and plugin.js.
  const DOM_COMPONENT_ID = "MetaproPlugin";

  const HANDLER_CLASS = class MetaproDOMHandler extends self.DOMElementHandler {
    constructor(iRuntime) {
      super(iRuntime, DOM_COMPONENT_ID);

      // Add web3.js library
      var web3ScriptEl = document.createElement("script");
      web3ScriptEl.type = "text/javascript";
      web3ScriptEl.src =
        "https://cdn.jsdelivr.net/npm/web3@4.13.0/dist/web3.min.js";
      document.getElementsByTagName("head")[0].appendChild(web3ScriptEl);

      web3ScriptEl.onload = function () {
        if (typeof window.ethereum !== "undefined") {
          window.Web3 = Web3;
          window.web3 = new Web3(window.ethereum);
          console.log("web3.js library loaded successfully!");
        } else {
          console.log("web3.js library failed to load!");
        }
      };

      this.AddRuntimeMessageHandlers([
        ["eth-request-accounts", () => this._ETHRequestAccounts()],
        ["get-signature", (payload) => this._GetSignature(payload)],
        ["switch-chain", (chainId) => this._SwitchChain(chainId)],
        [
          "get-referral-code-from-deeplink",
          () => this._GetReferralCodeFromDeeplink(),
        ],
      ]);
    }
    // Custom method to handle messages
    async _ETHRequestAccounts() {
      const provider = window.ethereum;

      await provider.request({ method: "eth_requestAccounts" });
      const accounts = await provider.request({ method: "eth_accounts" });

      return accounts;
    }

    async _GetSignature(payload) {
      const { account, hash } = payload;
      const provider = window.ethereum;
      const verifyMessage = `Please sign to let us verify\nthat you are the owner of this address\n${account}\n\nRequest ID ${hash}`;
      let signature;

      if (
        provider.provider?.signer?.connection?.bridge ===
        "https://tst-bridge.metaprotocol.one"
      ) {
        signature =
          await provider.provider.signer.connection.wc.signPersonalMessage([
            verifyMessage,
            account,
          ]);
      } else {
        signature = await provider.request({
          method: "personal_sign",
          params: [verifyMessage, account],
        });
      }

      return signature;
    }

    async _SwitchChain(chainId) {
      const provider = window.ethereum;
      const currentChainId = parseInt(provider?.chainId, 16);
      if (currentChainId !== chainId) {
        try {
          await provider.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: `0x${chainId.toString(16)}` }],
          });
        } catch {
          throw new Error("Incorrect chain selected.");
        }
      }
    }

    _GetReferralCodeFromDeeplink() {
      return window.metapro?.queryParams?.refCode;
    }
  };

  self.RuntimeInterface.AddDOMHandlerClass(HANDLER_CLASS);
}
