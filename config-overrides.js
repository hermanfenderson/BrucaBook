
const { injectBabelPlugin } = require('react-app-rewired');
const rewireLess = require("react-app-rewire-less");

  module.exports = function override(config, env) {
//   config = injectBabelPlugin(['import', { libraryName: 'antd', style: 'css' }], config);
  config = injectBabelPlugin(['import', { libraryName: 'antd', style: true }], config);  // change importing css to less
  config = rewireLess.withLoaderOptions({
     modifyVars: { 
     	"@primary-color": "#1DA57A", 
     	"@font-size-base": "14px",
		"@font-size-sm":    "12px",
		"@form-item-margin-bottom":   "8px",
		"@input-height-base":  "20px",
"@input-height-lg":           "20px",
"@input-height-sm":            "12px",
"@input-padding-vertical-base" : "2px",
"@input-padding-vertical-sm"   : "1px",
"@input-padding-vertical-lg"   : "2px",
"@table-padding-vertical": "8px",
"@table-padding-horizontal": "8px",
"@btn-height-base"        : "20px",
"@btn-height-lg"         : "20px",
"@btn-height-sm"          : "12px",
     },
   })(config, env)
    return config;
};


