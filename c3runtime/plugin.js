
const C3 = self.C3;

const DOM_COMPONENT_ID = "MetaproPlugin";

C3.Plugins.MetaproPlugin = class MetaproPluginPlugin extends C3.SDKDOMPluginBase
{
	constructor(opts)
	{
		super(opts, DOM_COMPONENT_ID);
	}
	
	Release()
	{
		super.Release();
	}
}; 