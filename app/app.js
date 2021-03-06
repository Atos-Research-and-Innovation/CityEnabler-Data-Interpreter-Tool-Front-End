/**
 * Initializes all need modules
 *
 */
var pcAppDependencies_original = [
    'ngRoute',
    'ngStorage',
    'ui.bootstrap',
    'pcApp.metrics',
    'pcApp.visualization',
    'pcApp.events',
    'pcApp.common',
    'pcApp.fcm',
    'pcApp.developer',
    'pcApp.search',
    'pcApp.ratings',
    'pcApp.export',
    'pcApp.indicators',
    'pcApp.datasets',
    'pcApp.feedbacks',
    'pcApp.authCedus',
    'pcApp.ags',
    'pcApp.stories',
    'pcApp.references.directives.resolve',
    'dialogs.main',
    'dialogs.default-translations',
    'angularSpectrumColorpicker',
    'skrollrDirectives',
    'ngProgress',
    'isteven-multi-select',
    'rzModule',
    'checklist-model',
    'duScroll',
    'angulartics',
    'angulartics.piwik',
    'toggle-switch',
    'base64',
    'pascalprecht.translate'
];



var pcAppDependencies = [
    'ngRoute',
    'ngStorage',
    'ui.bootstrap',
    'pcApp.metrics',
    'pcApp.visualization',
    'pcApp.events',
    'pcApp.common',
    'pcApp.search',
    'pcApp.export',
    'pcApp.indicators',
    'pcApp.datasets',
    'pcApp.authCedus',
    'pcApp.references.directives.resolve',
    'dialogs.main',
    'dialogs.default-translations',
    'angularSpectrumColorpicker',
    'skrollrDirectives',
    'ngProgress',
    'isteven-multi-select',
    'rzModule',
    'checklist-model',
    'duScroll',
    'angulartics',
    'angulartics.piwik',
    'toggle-switch',
    'base64',
    'pascalprecht.translate'
];
/*
if (policyCompassConfig.ENABLE_ADHOCRACY) {
    pcAppDependencies.push.apply(pcAppDependencies, [
        'pcApp.adhocracyEmbedder',
        'pcApp.auth',
        'pcApp.deliberation'
    ]);
}
*/

if (policyCompassConfig.ENABLE_ADHOCRACY) {
    pcAppDependencies.push.apply(pcAppDependencies, [
        'pcApp.adhocracyEmbedder',
        'pcApp.auth'
    ]);
}

var pcApp = angular.module('pcApp', pcAppDependencies)

    .run(function ($rootScope, $location) {
        $rootScope.location = $location;
    })
	/*
    .run(['Auth', function(Auth) {
        Auth.recoverSession();
    }])
    */
   
   .run(['Auth', function(Auth) {
        Auth.recoverSessionCedus();
    }])
    

/**
 * Very simple central error handling
 */
    .factory('$exceptionHandler', [
        '$injector', '$log', function ($injector, $log) {
            return function (exception, cause) {
                // Use the dialogs module to display error messages
                var dialogs = $injector.get("dialogs");
                dialogs.notify("Error", String(exception.message));
                $log.error(cause);
                $log.error(exception);
            };
        }
    ])


    .config([
        '$locationProvider', function ($locationProvider) {
            $locationProvider.html5Mode(false).hashPrefix('!');
        }
    ])

    .config([
        '$windowProvider', function($windowProvider) {
        	/*
            if (!policyCompassConfig.PIWIK_TRACKER_URL || !policyCompassConfig.PIWIK_SITE_ID) {
                console.info("No piwik tracker enabled");
                return;
            }
			*/
			//commented to disable pikik call
			/*
            var tracker_url = policyCompassConfig.PIWIK_TRACKER_URL;
            var _paq = [];
            _paq.push(['setDomains', policyCompassConfig.PIWIK_DOMAINS || [] ]);
            _paq.push(['enableLinkTracking']);
            _paq.push(['disableCookies']);
            _paq.push(['setTrackerUrl', tracker_url + 'piwik.php']);
            _paq.push(['setSiteId', policyCompassConfig.PIWIK_SITE_ID ]);
            var $window = $windowProvider.$get();
            $window._paq = _paq;
            $.ajax({
                 url: tracker_url + "piwik.js",
                 dataType: "script"
            });
            */
        }
    ])
    

        
    .config(['$translateProvider', function($translateProvider) {
    	/*
    	useMissingTranslationHandlerLog = function (term, start, items) {
    		console.log("suseMissingTranslationHandlerLog " );
    	}
    	*/
    	
		$translateProvider.useStaticFilesLoader({
    		prefix: 'translations/',
    		suffix: '.json'
  		})
  		.preferredLanguage('en')
  		.useMissingTranslationHandlerLog()
  		
	}]);
	
    
    ;
