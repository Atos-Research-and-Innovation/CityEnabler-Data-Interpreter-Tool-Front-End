/**
 * @description
 * This module sets all configuration
 *
 * policyCompassConfig is exposed as a global variable in order to use it in
 * the main app.js file. If there's a way to do the same with dependency
 * injection, this should be fixed.
 */


// Set to true to use the frontend stand-alone without installing the services
var useRemoteServices = false;

// Configuration for locally installed services
var policyCompassConfig = {
	'ORION_CONTEXT_BROKER_ENABLE_IMPORT': true,
	'ORION_CONTEXT_BROKER_URL': 'http://217.172.12.177:1026',
	'ORION_CONTEXT_BROKER_URL_GET_ENTITIES': 'http://217.172.12.177:1026/v2/entities',
	'ORION_CONTEXT_BROKER_URL_SUBSCRIBE_CONTEXT': 'http://217.172.12.177:1026/v1/subscribeContext',
	'ORION_CONTEXT_BROKER_FIWARE_SERVICE': 'malaga',
	'ORION_CONTEXT_BROKER_FIWARE_SERVICEPATH': '/analytics_kpis',	
	'ORION_CONTEXT_BROKER_KPI_TYPE': 'KeyPerformanceIndicator',
	'ORION_CONTEXT_BROKER_ENDPOINT_TO_SET': 'http://localhost:8000/api/v1/datasetmanager/cedus/dataContextBrocker',
	'ORGANIZATIONS_MANAGER_URL': 'http://localhost:8000/api/v1/datasetmanager/cedus',
	'languages': ['en', 'es', 'fr', 'it'],
	'defaultlanguage': 'en',
	'fiwarecallbackurl_old': 'http://192.168.56.1:9000/callback/',
	'fiwarecallbackurl': 'http://cedus.eu/landing',
	'fiwarelogout': 'http://cityenabler.eng.it/logout',
	'fiwareclientid__':'a201d660b1b44d149ce55578ab99dbe7',
	'fiwareclientsecret__':'d9ea03e51a094b958c730f17166cc653',
	'fiwareclientid':'ee93798c13844cd684376ffaa800181d',
	'fiwareclientsecret':'a8d2c3d57bb244369d5b93e899d9792e',
	'fiwaregetauthuserurl____': 'http://212.128.217.18:8000/oauth2/token',
	'fiwaregetauthuserurl': 'http://idm.cedus.eu/oauth2/token',
	'fiwaregetuserdata__': 'http://212.128.217.18:8000/user',
	'fiwaregetuserdata': 'http://idm.cedus.eu/user',
	'fiwaregetuserdata_internal': 'http://localhost:8000/api/v1/datasetmanager/cedus/getuserdata',
	'fiwareloginurl___':'http://212.128.217.18:8000/oauth2/authorize?response_type=code&client_id=a201d660b1b44d149ce55578ab99dbe7&state=aHR0cDovLzE5Mi4xNjguNTYuMTo5MDAwL2NhbGxiYWNrLw==&redirect_uri=http://cityenabler.eng.it/landing',	
    'fiwareloginurl': 'http://idm.cedus.eu/oauth2/authorize?response_type=code&client_id=ee93798c13844cd684376ffaa800181d&state=aHR0cDovLzE5Mi4xNjguNTYuMTo5MDAwL2FwcC8jIS9sb2dpbmNlZHVzY2s=&redirect_uri=http://cedus.eu/landing',
    'fiwarelogouturl': 'http://cedus.eu/logout',
    'URL': '/api/v1',
    'AG_MANAGER_URL': 'http://localhost:8000/api/v1/agmanager',
    'DATASETS_MANAGER_URL': 'http://localhost:8000/api/v1/datasetmanager',
    'CITY_DATA_WORKSPACE_IP': 'http://217.172.12.205:8080/',
    'CITY_DATA_WORKSPACE': 'http://dataworkspace.eng.it/',
    'VISUALIZATIONS_MANAGER_URL': 'http://localhost:8000/api/v1/visualizationsmanager',
    'EVENTS_MANAGER_URL': 'http://localhost:8000/api/v1/eventsmanager',
    'METRICS_MANAGER_URL': 'http://localhost:8000/api/v1/metricsmanager',
    'RATINGS_MANAGER_URL': 'http://localhost:8000/api/v1/ratingsmanager',
    'SEARCH_MANAGER_URL': 'http://localhost:8000/api/v1/searchmanager',
    'FORMULA_VALIDATION_URL' : 'http://localhost:8000/api/v1/metricsmanager/formulas/validate',
    'NORMALIZERS_URL': 'http://localhost:8000/api/v1/metricsmanager/normalizers',
    'REFERENCE_POOL_URL': 'http://localhost:8000/api/v1/references',
    'INDICATOR_SERVICE_URL': 'http://localhost:8000/api/v1/indicatorservice',
    'FEEDBACK_MANAGER_URL' : 'http://localhost:8000/api/v1/feedbackmanager', 
    'STORY_MANAGER_URL': 'http://localhost:8000/api/v1/storymanager',   
    'FCM_URL_m': 'https://fcm-stage.policycompass.eu/api/v1/fcmmanager',    
    'FCM_URL': 'http://mc0xaevc:8080/api/v1/fcmmanager',    
    'ELASTIC_URL' : 'http://localhost:9200/',
    'ELASTIC_INDEX_NAME' : 'policycompass_search',
    // FIXME: disabling adhocracy doesn't work due to use of
    // UserState controller in index.html
    'ENABLE_ADHOCRACY': true,
    'ADHOCRACY_BACKEND_URL': 'https://adhocracy-frontend-stage.policycompass.eu/api',
    'ADHOCRACY_FRONTEND_URL': 'https://adhocracy-frontend-stage.policycompass.eu',
    'PIWIK_TRACKER_URL': '//piwik.policycompass.eu/',
    'PIWIK_DOMAINS': ['*.policycompass.eu', 'policycompass.eu'],
    'PIWIK_SITE_ID': 2    
};

//config by domain
var policyCompassConfigByDomain = [];

policyCompassConfigByDomain['trento.cedus.eu'] = {
	'ORION_CONTEXT_BROKER_ENABLE_IMPORT': true,
	'ORION_CONTEXT_BROKER_URL': 'http://217.172.12.177:1026',
	'ORION_CONTEXT_BROKER_URL_GET_ENTITIES': 'http://217.172.12.177:1026/v2/entities',
	'ORION_CONTEXT_BROKER_URL_SUBSCRIBE_CONTEXT': 'http://217.172.12.177:1026/v1/subscribeContext',
	'ORION_CONTEXT_BROKER_FIWARE_SERVICE': 'malaga',
	'ORION_CONTEXT_BROKER_FIWARE_SERVICEPATH': '/analytics_kpis',	
	'ORION_CONTEXT_BROKER_KPI_TYPE': 'KeyPerformanceIndicator',
	'ORION_CONTEXT_BROKER_ENDPOINT_TO_SET': 'http://localhost:8000/api/v1/datasetmanager/cedus/dataContextBrocker',
	'ORGANIZATIONS_MANAGER_URL': 'http://trento.cedus.eu:8000/api/v1/datasetmanager/cedus',
	'languages': ['en', 'es','fr','it'],
	'defaultlanguage': 'it',
	'fiwarecallbackurl': 'http://cityenabler.eng.it/landing',
	'fiwarelogout': 'http://cityenabler.eng.it/logout',
	'fiwareclientid':'ee93798c13844cd684376ffaa800181d',
	'fiwareclientsecret':'a8d2c3d57bb244369d5b93e899d9792e',
	'fiwaregetauthuserurl': 'http://cityenabler.eng.it/idm/oauth2/token',
	'fiwaregetuserdata': 'http://cityenabler.eng.it/idm/user',
	'fiwaregetuserdata_internal': 'http://trento.cedus.eu:8000/api/v1/datasetmanager/cedus/getuserdata',
	'fiwareloginurl':'http://cityenabler.eng.it/idm/oauth2/authorize?response_type=code&client_id=ee93798c13844cd684376ffaa800181d&state=aHR0cDovL3RyZW50by5jZWR1cy5ldTo5MDAwL2NoYXJ0cy8jIS9sb2dpbmNlZHVzY2s=&redirect_uri=http://cityenabler.eng.it/landing',
    'fiwarelogouturl': 'http://cityenabler.eng.it/logout',
    'URL': '/api/v1',
    'AG_MANAGER_URL': 'http://trento.cedus.eu:8000/api/v1/agmanager',
    'DATASETS_MANAGER_URL': 'http://trento.cedus.eu:8000/api/v1/datasetmanager',
    'CITY_DATA_WORKSPACE_IP': 'http://217.172.12.205:8080/',
    'CITY_DATA_WORKSPACE': 'http://dataworkspace.eng.it/',
    'CITY_DATA_WORKSPACE_STAGE': 'http://217.172.12.246:8081/',
    'VISUALIZATIONS_MANAGER_URL': 'http://trento.cedus.eu:8000/api/v1/visualizationsmanager',
    'EVENTS_MANAGER_URL': 'http://trento.cedus.eu:8000/api/v1/eventsmanager',
    'METRICS_MANAGER_URL': 'http://trento.cedus.eu:8000/api/v1/metricsmanager',
    'RATINGS_MANAGER_URL': 'http://trento.cedus.eu:8000/api/v1/ratingsmanager',
    'SEARCH_MANAGER_URL': 'http://trento.cedus.eu:8000/api/v1/searchmanager',
    'FORMULA_VALIDATION_URL' : 'http://trento.cedus.eu:8000/api/v1/metricsmanager/formulas/validate',
    'NORMALIZERS_URL': 'http://trento.cedus.eu:8000/api/v1/metricsmanager/normalizers',
    'REFERENCE_POOL_URL': 'http://trento.cedus.eu:8000/api/v1/references',
    'INDICATOR_SERVICE_URL': 'http://trento.cedus.eu:8000/api/v1/indicatorservice',
    'FEEDBACK_MANAGER_URL' : 'http://trento.cedus.eu:8000/api/v1/feedbackmanager', 
    'STORY_MANAGER_URL': 'http://trento.cedus.eu:8000/api/v1/storymanager',   
    'ELASTIC_URL' : 'http://trento.cedus.eu:9200/',
    'ELASTIC_INDEX_NAME' : 'policycompass_search',
    // FIXME: disabling adhocracy doesn't work due to use of
    // UserState controller in index.html
    'ENABLE_ADHOCRACY': true,
    'ADHOCRACY_BACKEND_URL': 'https://adhocracy-frontend-stage.policycompass.eu/api',
    'ADHOCRACY_FRONTEND_URL': 'https://adhocracy-frontend-stage.policycompass.eu',
    'PIWIK_TRACKER_URL': '//piwik.policycompass.eu/',
    'PIWIK_DOMAINS': ['*.policycompass.eu', 'policycompass.eu'],
    'PIWIK_SITE_ID': 2    
};

policyCompassConfigByDomain['rennes.cedus.eu'] = {
	'ORION_CONTEXT_BROKER_ENABLE_IMPORT': true,
	'ORION_CONTEXT_BROKER_URL': 'http://217.172.12.177:1026',
	'ORION_CONTEXT_BROKER_URL_GET_ENTITIES': 'http://217.172.12.177:1026/v2/entities',
	'ORION_CONTEXT_BROKER_URL_SUBSCRIBE_CONTEXT': 'http://217.172.12.177:1026/v1/subscribeContext',
	'ORION_CONTEXT_BROKER_FIWARE_SERVICE': 'malaga',
	'ORION_CONTEXT_BROKER_FIWARE_SERVICEPATH': '/analytics_kpis',	
	'ORION_CONTEXT_BROKER_KPI_TYPE': 'KeyPerformanceIndicator',
	'ORION_CONTEXT_BROKER_ENDPOINT_TO_SET': 'http://localhost:8000/api/v1/datasetmanager/cedus/dataContextBrocker',
	'ORGANIZATIONS_MANAGER_URL': 'http://rennes.cedus.eu:8000/api/v1/datasetmanager/cedus',
	'languages': ['en', 'es','fr','it'],
	'defaultlanguage': 'fr',
	'fiwarecallbackurl': 'http://cityenabler.eng.it/landing',
	'fiwarelogout': 'http://cityenabler.eng.it/logout',
	'fiwareclientid':'ee93798c13844cd684376ffaa800181d',
	'fiwareclientsecret':'a8d2c3d57bb244369d5b93e899d9792e',
	'fiwaregetauthuserurl': 'http://cityenabler.eng.it/idm/oauth2/token',
	'fiwaregetuserdata': 'http://cityenabler.eng.it/idm/user',
	'fiwaregetuserdata_internal': 'http://rennes.cedus.eu:8000/api/v1/datasetmanager/cedus/getuserdata',
	'fiwareloginurl':'http://cityenabler.eng.it/idm/oauth2/authorize?response_type=code&client_id=ee93798c13844cd684376ffaa800181d&state=aHR0cDovL3Jlbm5lcy5jZWR1cy5ldTo5MDAwL2FwcC8jIS9sb2dpbmNlZHVzY2s=&redirect_uri=http://cityenabler.eng.it/landing',
    'fiwarelogouturl': 'http://cityenabler.eng.it/logout',
    'URL': '/api/v1',
    'AG_MANAGER_URL': 'http://rennes.cedus.eu:8000/api/v1/agmanager',
    'DATASETS_MANAGER_URL': 'http://rennes.cedus.eu:8000/api/v1/datasetmanager',
    'CITY_DATA_WORKSPACE_IP': 'http://217.172.12.205:8080/',
    'CITY_DATA_WORKSPACE': 'http://dataworkspace.eng.it/',
    'CITY_DATA_WORKSPACE_STAGE': 'http://217.172.12.246:8081/',
    'VISUALIZATIONS_MANAGER_URL': 'http://rennes.cedus.es:8000/api/v1/visualizationsmanager',
    'EVENTS_MANAGER_URL': 'http://rennes.cedus.eu:8000/api/v1/eventsmanager',
    'METRICS_MANAGER_URL': 'http://rennes.cedus.eu:8000/api/v1/metricsmanager',
    'RATINGS_MANAGER_URL': 'http://rennes.cedus.eu:8000/api/v1/ratingsmanager',
    'SEARCH_MANAGER_URL': 'http://rennes.cedus.eu:8000/api/v1/searchmanager',
    'FORMULA_VALIDATION_URL' : 'http://rennes.cedus.eu:8000/api/v1/metricsmanager/formulas/validate',
    'NORMALIZERS_URL': 'http://rennes.cedus.eu:8000/api/v1/metricsmanager/normalizers',
    'REFERENCE_POOL_URL': 'http://rennes.cedus.eu:8000/api/v1/references',
    'INDICATOR_SERVICE_URL': 'http://rennes.cedus.eu:8000/api/v1/indicatorservice',
    'FEEDBACK_MANAGER_URL' : 'http://rennes.cedus.eu:8000/api/v1/feedbackmanager', 
    'STORY_MANAGER_URL': 'http://rennes.cedus.eu:8000/api/v1/storymanager',   
    'ELASTIC_URL' : 'http://rennes.cedus.eu:9200/',
    'ELASTIC_INDEX_NAME' : 'policycompass_search',
    // FIXME: disabling adhocracy doesn't work due to use of
    // UserState controller in index.html
    'ENABLE_ADHOCRACY': true,
    'ADHOCRACY_BACKEND_URL': 'https://adhocracy-frontend-stage.policycompass.eu/api',
    'ADHOCRACY_FRONTEND_URL': 'https://adhocracy-frontend-stage.policycompass.eu',
    'PIWIK_TRACKER_URL': '//piwik.policycompass.eu/',
    'PIWIK_DOMAINS': ['*.policycompass.eu', 'policycompass.eu'],
    'PIWIK_SITE_ID': 2    
};

policyCompassConfigByDomain['malaga.cedus.eu'] = {
	'ORION_CONTEXT_BROKER_ENABLE_IMPORT': true,
	'ORION_CONTEXT_BROKER_URL': 'http://217.172.12.177:1026',
	'ORION_CONTEXT_BROKER_URL_GET_ENTITIES': 'http://217.172.12.177:1026/v2/entities',
	'ORION_CONTEXT_BROKER_URL_SUBSCRIBE_CONTEXT': 'http://217.172.12.177:1026/v1/subscribeContext',
	'ORION_CONTEXT_BROKER_FIWARE_SERVICE': 'malaga',
	'ORION_CONTEXT_BROKER_FIWARE_SERVICEPATH': '/analytics_kpis',	
	'ORION_CONTEXT_BROKER_KPI_TYPE': 'KeyPerformanceIndicator',
	'ORION_CONTEXT_BROKER_ENDPOINT_TO_SET': 'http://localhost:8000/api/v1/datasetmanager/cedus/dataContextBrocker',
	'ORGANIZATIONS_MANAGER_URL': 'http://malaga.cedus.eu:8000/api/v1/datasetmanager/cedus',
	'languages': ['en', 'es','fr','it'],
	'defaultlanguage': 'es',
	'fiwarecallbackurl': 'http://cityenabler.eng.it/landing',
	'fiwarelogout': 'http://cityenabler.eng.it/logout',
	'fiwareclientid':'ee93798c13844cd684376ffaa800181d',
	'fiwareclientsecret':'a8d2c3d57bb244369d5b93e899d9792e',
	'fiwaregetauthuserurl': 'http://cityenabler.eng.it/idm/oauth2/token',
	'fiwaregetuserdata': 'http://cityenabler.eng.it/idm/user',
	'fiwaregetuserdata_internal': 'http://malaga.cedus.eu:8000/api/v1/datasetmanager/cedus/getuserdata',
	'fiwareloginurl':'http://cityenabler.eng.it/idm/oauth2/authorize?response_type=code&client_id=ee93798c13844cd684376ffaa800181d&state=aHR0cDovL21hbGFnYS5jZWR1cy5ldTo5MDAwL2FwcC8jIS9sb2dpbmNlZHVzY2s=&redirect_uri=http://cityenabler.eng.it/landing',
    'fiwarelogouturl': 'http://cityenabler.eng.it/logout',
    'URL': '/api/v1',
    'AG_MANAGER_URL': 'http://malaga.cedus.eu:8000/api/v1/agmanager',
    'DATASETS_MANAGER_URL': 'http://malaga.cedus.eu:8000/api/v1/datasetmanager',
    'CITY_DATA_WORKSPACE_IP': 'http://217.172.12.205:8080/',
    'CITY_DATA_WORKSPACE': 'http://dataworkspace.eng.it/',
    'CITY_DATA_WORKSPACE_STAGE': 'http://217.172.12.246:8081/',
    'VISUALIZATIONS_MANAGER_URL': 'http://malaga.cedus.es:8000/api/v1/visualizationsmanager',
    'EVENTS_MANAGER_URL': 'http://malaga.cedus.eu:8000/api/v1/eventsmanager',
    'METRICS_MANAGER_URL': 'http://malaga.cedus.eu:8000/api/v1/metricsmanager',
    'RATINGS_MANAGER_URL': 'http://malaga.cedus.eu:8000/api/v1/ratingsmanager',
    'SEARCH_MANAGER_URL': 'http://malaga.cedus.eu:8000/api/v1/searchmanager',
    'FORMULA_VALIDATION_URL' : 'http://malaga.cedus.eu:8000/api/v1/metricsmanager/formulas/validate',
    'NORMALIZERS_URL': 'http://malaga.cedus.eu:8000/api/v1/metricsmanager/normalizers',
    'REFERENCE_POOL_URL': 'http://malaga.cedus.eu:8000/api/v1/references',
    'INDICATOR_SERVICE_URL': 'http://malaga.cedus.eu:8000/api/v1/indicatorservice',
    'FEEDBACK_MANAGER_URL' : 'http://malaga.cedus.eu:8000/api/v1/feedbackmanager', 
    'STORY_MANAGER_URL': 'http://malaga.cedus.eu:8000/api/v1/storymanager',   
    'ELASTIC_URL' : 'http://malaga.cedus.eu:9200/',
    'ELASTIC_INDEX_NAME' : 'policycompass_search',
    // FIXME: disabling adhocracy doesn't work due to use of
    // UserState controller in index.html
    'ENABLE_ADHOCRACY': true,
    'ADHOCRACY_BACKEND_URL': 'https://adhocracy-frontend-stage.policycompass.eu/api',
    'ADHOCRACY_FRONTEND_URL': 'https://adhocracy-frontend-stage.policycompass.eu',
    'PIWIK_TRACKER_URL': '//piwik.policycompass.eu/',
    'PIWIK_DOMAINS': ['*.policycompass.eu', 'policycompass.eu'],
    'PIWIK_SITE_ID': 2    
};

// Configuration for remote services
var remotePolicyCompassConfig = {
	'ORION_CONTEXT_BROKER_ENABLE_IMPORT': true,
	'ORION_CONTEXT_BROKER_URL': 'http://217.172.12.177:1026',
	'ORION_CONTEXT_BROKER_URL_GET_ENTITIES': 'http://217.172.12.177:1026/v2/entities',
	'ORION_CONTEXT_BROKER_URL_SUBSCRIBE_CONTEXT': 'http://217.172.12.177:1026/v1/subscribeContext',
	'ORION_CONTEXT_BROKER_FIWARE_SERVICE': 'malaga',
	'ORION_CONTEXT_BROKER_FIWARE_SERVICEPATH': '/analytics_kpis',	
	'ORION_CONTEXT_BROKER_KPI_TYPE': 'KeyPerformanceIndicator',
	'ORION_CONTEXT_BROKER_ENDPOINT_TO_SET': 'http://localhost:8000/api/v1/datasetmanager/cedus/dataContextBrocker',
	'ORGANIZATIONS_MANAGER_URL': 'http://localhost:8000/api/v1/datasetmanager/cedus',
    'languages': ['en', 'es', 'fr', 'it'],
    'defaultlanguage': 'en',
    'fiwarecallbackurl_old': 'http://212.128.217.18:9000/callback/',
    'fiwarecallbackurl': 'http://cityenabler.eng.it/landing',
    'fiwareclientid__':'a201d660b1b44d149ce55578ab99dbe7',
    'fiwareclientid':'ee93798c13844cd684376ffaa800181d',
    'fiwareclientsecret__':'d9ea03e51a094b958c730f17166cc653',
    'fiwareclientsecret':'a8d2c3d57bb244369d5b93e899d9792e',
    'fiwaregetauthuserurl__': 'http://212.128.217.18:8000/oauth2/token',
    'fiwaregetauthuserurl': 'http://cityenabler.eng.it/idm/oauth2/token',
    'fiwaregetuserdata__': 'http://212.128.217.18:8000/user',
    'fiwaregetuserdata': 'http://cityenabler.eng.it/idm/user',    
    'fiwaregetuserdata_internal': 'http://212.128.217.18:8000/api/v1/datasetmanager/cedus/getuserdata',
    'fiwareloginurl__':'http://212.128.217.18:8000/oauth2/authorize?response_type=code&client_id=a201d660b1b44d149ce55578ab99dbe7&state=aHR0cDovLzIxMi4xMjguMjE3LjE4OjkwMDAvY2FsbGJhY2sv&redirect_uri=http://cityenabler.eng.it/landing',
    'fiwareloginurl':'http://cityenabler.eng.it/idm/oauth2/authorize?response_type=code&client_id=ee93798c13844cd684376ffaa800181d&state=aHR0cDovLzIxMi4xMjguMjE3LjE4OjkwMDAvY2FsbGJhY2sv&redirect_uri=http://cityenabler.eng.it/landing',
    'fiwarelogouturl': 'http://cityenabler.eng.it/logout',
    'URL': '/api/v1',
    'AG_MANAGER_URL': 'http://212.128.217.18:8000/api/v1/agmanager',
    'DATASETS_MANAGER_URL': 'http://212.128.217.18:8000/api/v1/datasetmanager',
    'CITY_DATA_WORKSPACE': 'http://dataworkspace.eng.it/',
    'VISUALIZATIONS_MANAGER_URL': 'http://212.128.217.18:8000/api/v1/visualizationsmanager',
    'EVENTS_MANAGER_URL': 'http://212.128.217.18:8000/api/v1/eventsmanager',
    'METRICS_MANAGER_URL': 'http://212.128.217.18:8000/api/v1/metricsmanager',
    'RATINGS_MANAGER_URL': 'http://212.128.217.18:8000/api/v1/ratingsmanager',
    'SEARCH_MANAGER_URL': 'http://212.128.217.18:8000/api/v1/searchmanager',
    'FORMULA_VALIDATION_URL' : 'http://212.128.217.18:8000/api/v1/metricsmanager/formulas/validate',
    'NORMALIZERS_URL': 'http://212.128.217.18:8000/api/v1/metricsmanager/normalizers',
    'REFERENCE_POOL_URL': 'http://212.128.217.18:8000/api/v1/references',
    'INDICATOR_SERVICE_URL': 'http://212.128.217.18:8000/api/v1/indicatorservice',
    'FEEDBACK_MANAGER_URL' : 'http://212.128.217.18:8000/api/v1/feedbackmanager', 
    'STORY_MANAGER_URL': 'http://212.128.217.18:8000/api/v1/storymanager',   
    'FCM_URL_m': 'https://fcm-stage.policycompass.eu/api/v1/fcmmanager',    
    'FCM_URL': 'http://212.128.217.18:8080/api/v1/fcmmanager',    
    'ELASTIC_URL' : 'http://212.128.217.18:9200/',
    'ELASTIC_INDEX_NAME' : 'policycompass_search',
    // FIXME: disabling adhocracy doesn't work due to use of
    // UserState controller in index.html
    'ENABLE_ADHOCRACY': true,
    'ADHOCRACY_BACKEND_URL': 'https://adhocracy-frontend-stage.policycompass.eu/api',
    'ADHOCRACY_FRONTEND_URL': 'https://adhocracy-frontend-stage.policycompass.eu',
    'PIWIK_TRACKER_URL': '//piwik.policycompass.eu/',
    'PIWIK_DOMAINS': ['*.policycompass.eu', 'policycompass.eu'],
    'PIWIK_SITE_ID': 2 
};

if(useRemoteServices == false) {

	//angular.module('pcApp.config', []).constant('API_CONF', policyCompassConfig);

	//console.log(window.location.hostname);
	if (policyCompassConfigByDomain[window.location.hostname]) {
		policyCompassConfig = policyCompassConfigByDomain[window.location.hostname];
	}


	angular.module('pcApp.config', []).constant('API_CONF', policyCompassConfig);


} else {
    angular.module('pcApp.config', []).constant('API_CONF', remotePolicyCompassConfig);
}
