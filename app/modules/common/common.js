var commonmanager = angular.module('pcApp.common', [
    'pcApp.common.controllers',
    'pcApp.common.directives.search',
    'pcApp.common.directives.submenus',
    'pcApp.common.directives.common',
    'pcApp.common.directives.piecharts',
    'pcApp.common.directives.barscharts',
    'pcApp.common.directives.linescharts',
    'pcApp.common.directives.mapscharts',
    'pcApp.common.directives.wizard',
    'pcApp.common.directives.helpbutton',
    'pcApp.common.directives.loadpcimage',
    'pcApp.common.directives.cookieLaw'
])

commonmanager.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            controller: 'StaticController',
            templateUrl: 'modules/common/partials/main_parallax.html'
        })
        .when('/browse', {
            controller: 'searchMainController',
            templateUrl: 'modules/search/partials/browse.html',
            reloadOnSearch: false
        })
        .when('/browse/:type', {
            controller: 'searchMainController',
            templateUrl: 'modules/search/partials/browse.html',
            reloadOnSearch: false
        })
        .when('/create', {
            controller: 'StaticController',
            templateUrl: 'modules/common/partials/create.html'
        })
        .when('/how-it-works', {
            controller: 'StaticController',
            templateUrl: 'modules/common/partials/howItWorks.html'
        })
        .when('/i-want-to', {
            controller: 'wanttoController',
            templateUrl: 'modules/common/partials/wantto.html'
        })
        .when('/request', {
            controller: 'StaticController',
            templateUrl: 'modules/common/partials/request.html'
        })
        .when('/imprint', {
            templateUrl: 'modules/common/partials/imprint.html'
        })
        .when('/privacy-statement', {
            templateUrl: 'modules/common/partials/dataprotection.html'
        })
        .when('/terms-of-use', {
            templateUrl: 'modules/common/partials/termsOfUse.html'
        })
        .when('/glossary', {
            templateUrl: 'modules/common/partials/glossary.html'
        })
        .when('/login', {
            templateUrl: 'modules/common/partials/login.html'
        })
        .when('/create-dataset', {
            controller: 'StaticController',
            templateUrl: 'modules/common/partials/create-dataset.html'
        })
        .when('/create-dataset-2', {
            controller: 'CreateDataset2Controller',
            templateUrl: 'modules/common/partials/create-dataset-2.html'
        })
        .when('/create-data', {
            controller: 'StaticController',
            templateUrl: 'modules/common/partials/create-data.html'
        })
        .when('/support', {
            controller: 'StaticController',
            templateUrl: 'modules/common/partials/support.html'
        })
        .otherwise({redirectTo: '/'});
})

commonmanager.run([
    'ngProgress', '$rootScope', '$localStorage', 'API_CONF', '$http', '$base64', 'fiwareuserdataBE', 'Auth',
    'AdhocracyClient', 'dialogs', function (ngProgress, $rootScope, $localStorage, API_CONF, $http, $base64, fiwareuserdataBE, Auth, AdhocracyClient, dialogs) {
        ngProgress.color('#0d47a1');

        $rootScope.$on('$locationChangeStart', function () {
            ngProgress.start();
        });

        $rootScope.$on('$locationChangeSuccess', function () {
            ngProgress.complete();
        });
        
        
        
        $rootScope.$on('$routeChangeStart', function (event, nextRoute, currentRoute) {
        	

			refreshtokenSession = function() {
				console.log("refresh token");
				encodedCode = $base64.encode(API_CONF.fiwareclientid+':'+API_CONF.fiwareclientsecret);

				var default_headers= $http.defaults.headers;
				$http.defaults.headers=[];
							
				$http({
				    			method: 'POST',
				    			url: API_CONF.fiwaregetauthuserurl,
				    			headers: {
								'Content-Type': 'application/x-www-form-urlencoded',
								'Authorization': 'Basic '+encodedCode
				    			},
				    			data: $.param({grant_type: "refresh_token",refresh_token: $localStorage.userData.refresh_token})
				})
				.then(function(resultRefresh) {
					
					if (resultRefresh.data) {
						
						
						//console.log("new token:"+resultRefresh.data.access_token);
						//console.log("newrefresh token:"+resultRefresh.data.refresh_token);
				
						$localStorage.userData.token = resultRefresh.data.access_token;
						$localStorage.userData.refresh_token = resultRefresh.data.refresh_token;
						
						var t = new Date();
						//t.setSeconds(t.getSeconds() + 10);
						t.setSeconds(t.getSeconds() + resultRefresh.data.expires_in);
						var tokenexpiredate = t.getTime();
						
						$localStorage.userData.tokenexpires
						
						
						var userData = $localStorage.userData;
	                    
	                    fiwareuserdataBE.get({access_token:resultRefresh.data.access_token}, function (data) {
	                    	
	                    	var session = {
	                            	    tokenexpires: tokenexpiredate,
	                        			token: resultRefresh.data.access_token,
	                        			userPath: data.id,
	                    				userData: userData,
	                    				loggedIn: true
	                				};
	                            
	                            
	                        Auth.loginCedus(session, userData);	
	                            
	                            
	                        default_headers.common[AdhocracyClient.headerNames.token] = token;
                				
	                    	
	                    });
	                    
	                    
						
					}
					
				}, function(error) {
					console.log("ERROR refresh token!!")
					
					label = "Unauthorized";
					message = ("Alert", "Your session has expired");
					
					var dlg = dialogs.notify(label, message);
                                
                                dlg.result.then(function (answer) {
                    				Auth.logout();                
                                });
					
					
					
					
					//window.location = "/";
				});
							
						
				$http.defaults.headers=default_headers;


			}
			
			if ($localStorage.userData) {
				refreshtokenSession();
			}




        });
        	
    }
])
