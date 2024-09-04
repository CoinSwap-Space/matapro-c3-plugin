
const SDK = self.SDK;

const PLUGIN_CLASS = SDK.Plugins.MetaproPlugin;

PLUGIN_CLASS.Type = class MetaproPluginType extends SDK.ITypeBase
{
	constructor(sdkPlugin, iObjectType)
	{
		super(sdkPlugin, iObjectType);
	}
};
