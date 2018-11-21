angular.module('pcApp.authCedus.controllers.authCedus', [
    'pcApp.references.services.reference', 'pcApp.config'
])


    .controller('loginceduscontroller', [
        '$scope',
        '$route',
        '$routeParams',
        '$location',
        '$window',
        'dialogs',
        '$log',
        'API_CONF',
        function ($scope, $route, $routeParams, $location, $window, dialogs, $log, API_CONF) {

            //console.log("loginceduscontroller!!");

        }
    ])
    

    .controller('callbackloginceduscontroller', [
        '$scope',
        '$route',
        '$routeParams',
        '$location',
        'dialogs',
        '$log',
        'API_CONF',
        'fiwareuser',
        'fiwareuserdata',
        'fiwareuserdataBE',
        '$http',
        '$base64',
        'Auth',
        '$localStorage',
        '$timeout',
        '$window',
        function ($scope, $route, $routeParams, $location, dialogs, $log, API_CONF, fiwareuser, fiwareuserdata, fiwareuserdataBE, $http, $base64, Auth, $localStorage, $timeout, $window) {


            console.log("callbackloginceduscontroller");
            $scope.showLoadingDiv = true;
            
            logged = false;
            //console.log(Auth.state)
            //console.log(Auth.state.loggedIn);
            if (Auth) {
            	if (Auth.state) {
            		if (Auth.state.loggedIn==true) {
            			logged = true;
            			console.log("logged user")
            		}
            	}
            }
            
            if (logged) {
            	$scope.showUserIsLoggedrMessage = true;
            	$scope.showLoadingDiv = false;
            }
            else {
            
            	            
	            $scope.showErrorMessage = false;
	            
	            var state = $routeParams.state;
	  			var code = $routeParams.code;
	  			
	  			$scope.requesttokenData = {};
	  			$scope.requesttokenData.grant_type="authorization_code";
	  			$scope.requesttokenData.code=API_CONF.fiwareclientid;
				$scope.requesttokenData.redirect_uri=API_CONF.fiwarecallbackurl;
	  			
	  			//console.log($scope.requesttokenData);	            
	  			//console.log("state="+state);
	  			//console.log("code="+code);
	  			
	  			//console.log("API_CONF.fiwareclientid");
	  			//console.log(API_CONF.fiwareclientid);
	  			//console.log("API_CONF.fiwareclientsecret");
	  			//console.log(API_CONF.fiwareclientsecret);
	
				$scope.encodedCode = $base64.encode(API_CONF.fiwareclientid+':'+API_CONF.fiwareclientsecret);
				//console.log("Encripted code");
				//console.log($scope.encodedCode);
	
				$http({
				    method: 'POST',
				    url: API_CONF.fiwaregetauthuserurl,
				    headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
						'Authorization': 'Basic '+$scope.encodedCode
				    },
				    data: $.param({grant_type: "authorization_code",code: code, redirect_uri: API_CONF.fiwarecallbackurl})
				    })
				    .then(function(result) {
				    	//console.log("Dins!!")
						//console.log(result);
						//console.log(result.data);
						jsonToken = result.data;
						/*
						jsonToken = {
	  						"access_token": "Hexk8ViHZcmAbS1kzxPQHrR2wGocS6",
	  						"expires_in": 3600,
	  						"token_type": "Bearer",
	  						"state": "CEDUS",
	  						"scope": "all_info",
	  						"refresh_token": "eT7sNF5fHk9W1UAwjiFsgkKaxWbnPw"
						}
						*/
	
						logoutCedus = function()  {
							Auth.logout();
							$scope.auth.logout();						
							dialogs.notify("Alert", "Your session has expired");							
						}
						
						refreshSession = function() {
							console.log("dins de refreshSession");
							console.log($localStorage.userData.refresh_token)
							var default_headers= $http.defaults.headers;
							$http.defaults.headers=[];
							
							$http({
				    			method: 'POST',
				    			url: API_CONF.fiwaregetauthuserurl,
				    			headers: {
								'Content-Type': 'application/x-www-form-urlencoded',
								'Authorization': 'Basic '+$scope.encodedCode
				    			},
				    			data: $.param({grant_type: "refresh_token",refresh_token: $localStorage.userData.refresh_token})
				    		})
				    		.then(function(resultRefresh) {
				    			console.log("Dins refresh!!")
				    			console.log(resultRefresh);
							}, function(error) {
								console.log("ERROR!!")
								console.log(error);
								//window.location = "/";
							});
							
							
							$http.defaults.headers=default_headers;
							
						}
						
						if (jsonToken.expires_in) {
							//disable funtion that do a autologout after refresh time expires
							//$timeout(logoutCedus, (jsonToken.expires_in*1000));	
						}
	
						var t = new Date();
						//t.setSeconds(t.getSeconds() + 10);
						t.setSeconds(t.getSeconds() + jsonToken.expires_in);
						var tokenexpiredate = t.getTime();
						
						//$scope.user = fiwareuserdata.get({access_token:jsonToken.access_token}, function (data) {
						$scope.user = fiwareuserdataBE.get({access_token:jsonToken.access_token}, function (data) {
	                            
	                            //console.log("dins");	                            
	                            //console.log(data)
	                            
	                            var userData = {"name": data.displayName,"roles": data.roles,"email": data.email, "tokenexpires": tokenexpiredate, "organizations":data.organizations, "refresh_token":jsonToken.refresh_token, "token":jsonToken.access_token}
	                            //console.log("userData");
	                            //console.log(userData);
	                            
	                            
	                            var session = {
	                            	    tokenexpires: tokenexpiredate,
	                        			token: jsonToken.access_token,
	                        			userPath: data.id,
	                    				userData: userData,
	                    				loggedIn: true
	                				};
	                            
	                            
	                            Auth.loginCedus(session, userData);
	                            $localStorage.token = jsonToken.access_token;
	                    		$localStorage.userPath = data.id;
	                    		$localStorage.userData = userData;
	                    		
	                           	//refreshSession();
	                           	
	                           	$scope.authState = Auth.state;
					            $scope.auth = Auth;
	
	        
	                            Auth.state.loggedIn = true;
	                			Auth.state.userPath = data.id;
	                            Auth.state.userData = userData;
	                            
	                            //console.log(userData.roles);
	                            
	                			if (userData.roles) {
	                				//Auth.state.isAdmin = userData.roles.indexOf('admin') !== -1;	
	                				Auth.state.isAdmin = userData.roles.indexOf('Seller') !== -1;
	                			}
	                			
	                			
	                			angular.forEach(userData.roles, function(value, key) {
	                				//if (value.name=='admin') {
	                				if (value.name=='Seller') {
	                					Auth.state.isAdmin = true;
	                				}
	                			});
	                			
	                			
	                			//console.log(Auth.state);
	                			
	                			$scope.showUserIsLoggedrMessage = true;
            					$scope.showLoadingDiv = false;
            					
            					//window.location = "/app/#!/";
            					window.location = "/charts/#!/";
	                     		
	                            
						}, function (errorUserData) {
							
							console.log("Error getting token data");
							console.log(errorUserData.status);
							console.log(errorUserData);
							
							$scope.showErrorMessage = true;
							$scope.showLoadingDiv = false;
							
							if (errorUserData.status=='404') {
							}
							else {
								throw {message: JSON.stringify(errorUserData)};
							}
						});
						
						
					}, function(error) {
						$scope.showErrorMessage = true;
						$scope.showLoadingDiv = false;
						console.log("ERROR!!")
						console.log(error);
						//window.location = "/";
					});

			}
        }
    ])