angular.module('pcApp.authCedus.services.authCedus', [
    'ngResource', 'pcApp.config'
])

    .factory('logoutfiwareuserdata', [
        '$resource', 'API_CONF', function ($resource, API_CONF) {
            // Get the base URL from the configuration
            
            headers = {}
            
            
            var url = API_CONF.fiwarelogout;
            
            var userData = $resource(url, {                            
            }, {
                'query': {
                    method: 'GET',
                    isArray: true
                }

            });

            return userData;
        }
    ])    


    .factory('fiwareuser', [
        '$resource', 'API_CONF', function ($resource, API_CONF) {
            // Get the base URL from the configuration
            
            headers = {}

            
            //headers['Authorization'] = "Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW";
            headers['Authorization'] = "Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW";
            headers['Content-Type'] = "application/x-www-form-urlencoded";
            
            var url = API_CONF.fiwaregetauthuserurl;
            var fiwareuser = $resource(url, {
                id: "@id",                
            }, {
            	'save': {
                    method: 'POST',
                    headers: headers
                },
                'query': {
                    method: 'GET',
                    isArray: false
                }

            });

            return fiwareuser;
        }
    ])

    .factory('fiwareuserdata', [
        '$resource', 'API_CONF', function ($resource, API_CONF) {
            // Get the base URL from the configuration
            
            headers = {}
            
            var url = API_CONF.fiwaregetuserdata;
            
            var userData = $resource(url, {                            
            }, {
                'query': {
                    method: 'GET',
                    isArray: true
                }

            });

			//userData = {"organizations":[],"displayName":"mmilaprat","roles":[{"name":"provider","id":"106"},{"name":"purchaser","id":"191"}],"app_id":"c591f3f33531426fa7dfa41591981a11","isGravatarEnabled":false,"email":"miquel.mila@atos.net","id":"mmilaprat","app_azf_domain":"Zf0W-bblEeaI7FJUADLrRg"}
            return userData;
        }
    ])    

    .factory('fiwareuserdataBE', [
        '$resource', 'API_CONF', function ($resource, API_CONF) {
            // Get the base URL from the configuration
            
            headers = {}
            
            var url = API_CONF.fiwaregetuserdata_internal;
            var url_idm = API_CONF.fiwaregetuserdata;
            
            var userData = $resource(url, {
            	url: url_idm,                                 
            }, {
                'query': {
                    method: 'GET',
                    isArray: true
                }

            });

			//userData = {"organizations":[],"displayName":"mmilaprat","roles":[{"name":"provider","id":"106"},{"name":"purchaser","id":"191"}],"app_id":"c591f3f33531426fa7dfa41591981a11","isGravatarEnabled":false,"email":"miquel.mila@atos.net","id":"mmilaprat","app_azf_domain":"Zf0W-bblEeaI7FJUADLrRg"}
            return userData;
        }
    ])  

.factory('AuthCedustodelete', [
        '$rootScope',
        '$http',
        '$localStorage',
        'API_CONF',
        function ($rootScope, $http, $localStorage, API_CONF) {
            var last = undefined;

            $rootScope.$on("$locationChangeSuccess",
                function(evt, nextUrl, prevUrl) {
                    /* FIXME: Is there a more generic way to get the path
                     * from the URL? */
                    var next = nextUrl.split("#!")[1];
                    var prev = prevUrl.split("#!")[1];

                    if ((next == "/login" || next == "/register" || next == "/logout")
                        && typeof prev !== "undefined"
                        && prev !== "/login"
                        && prev !== "/register"
                    ) {
                        last = prev;
                    }
                }
            );

            var Auth = {
                state: {
                    loggedIn: undefined,
                    userData: undefined,
                    userPath: undefined,
                    isAdmin: undefined,
                    isCreator: function(object) {
                        var a3Backend = API_CONF.ADHOCRACY_BACKEND_URL;

                        if (!this.userPath || !object) {
                            return false;
                        }

                        // userpath contains the user uri with trailing slash (despite its name)
                        var userPath = this.userPath.replace(a3Backend, '');
                        userPath = userPath.replace(/\/$/, '');
                        return userPath === object.creator_path;
                    }
                }
            };

            var setupSession = function(session, userData, doNotStore) {
            	console.log("setupSession")
            	console.log(session);
            	console.log(userData);
            	console.log(doNotStore);
            	
                token = session.token;
                userPath = session.userPath;

                // setup headers for backend communication
                $http.defaults.headers.common['X-User-Token'] = token;
                $http.defaults.headers.common['X-User-Path'] = 'https://account.lab.fiware.org/user?access_token='+token;

                // setup auth state
                Auth.state.loggedIn = true;
                Auth.state.userPath = userPath;

                // store session and user data to local store
                if (!doNotStore) {
                    $localStorage.token = token;
                    $localStorage.userPath = userPath;
                }

                // setup a3 session
                /*
                AdhocracyCrossWindowChannel.then(function (channel) {
                    channel.setToken(token, userPath)
                });
				*/
				
                setupUserData(userData, doNotStore);
            };

            var setupUserData = function (userData, doNotStore) {
            	console.log("setupUserData");
                if (!doNotStore) {
                    $localStorage.userData = userData;
                }
                Auth.state.userData = userData;
                if (userData.roles) {
                	Auth.state.isAdmin = userData.roles.indexOf('admin') !== -1;	
                }
                
                
                angular.forEach(userData.roles, function(value, key) {
					if (value.name=='admin') {
						Auth.state.isAdmin = true;
					}
				});
                
            };

            var teardownSession = function() {
                // the opposite of setup session
                delete $http.defaults.headers.common['X-User-Token'];
                delete $http.defaults.headers.common['X-User-Path'];

                Auth.state.loggedIn = false;
                Auth.state.userPath = undefined;
                Auth.state.userData = undefined;
                Auth.state.isAdmin = undefined;
				/*
                AdhocracyCrossWindowChannel.then(function (channel) {
                    channel.deleteToken();
                });
				*/
                delete $localStorage.token;
                delete $localStorage.userPath;
                delete $localStorage.userData;
            };

            var loadLocalSession = function() {
                if (!$localStorage.token || !$localStorage.userPath) {
                    return null
                }

                // userData will be refreshed during session validation
                var fallbackUserData = {
                    username: 'unkown user',
                    roles: [],
                    email: 'unkown email'
                };

                return {
                    session: {
                        token: $localStorage.token,
                        userPath: $localStorage.userPath
                    },
                    userData: $localStorage.userData || fallbackUserData
                }
            };

            /** Wrapper to make A3 auth features pluggable. Calls directly A3
             *  specific login code and A3 specific code to fetch user data.
             */
            Auth.login = function (nameOrEmail, password) {
                return AdhocracyClient.create_session(nameOrEmail, password)
                    .then(function (session) {
                        return AdhocracyClient.validate_session(session)
                            .then(function (userData) {
                                setupSession(session, userData);
                                beforeLogin = last || '/';
                                last = undefined;
                                return beforeLogin;
                            });
                    });
            };
            
            Auth.loginCedus = function (session, userData) {
            	console.log("loginCedus")
            	console.log(session);
            	console.log(userData);
            	
            	setupSession(session, userData);
                                beforeLogin = last || '/';
                                last = undefined;
                                return beforeLogin;
                                
                
            };

            /** Wrapper to make A3 auth features pluggable. Calls directly A3
             *  specific register code.
             */
            Auth.register = function (name, email, password) {
                return AdhocracyClient.register(name, email, password)
            };

            Auth.logout = function () {
                teardownSession();
            };

            /** Reads session data from local storage and validates it against
             *  A3 backend service
             */
            Auth.recoverSession = function () {
            	console.log("autCedusServices recoverSession");
                var local = loadLocalSession();
				console.log(local);
				
                if (!local) {
                    teardownSession();
                    return null;
                }

                var session = local.session;
                var userData = local.userData;
                var doNotStore = true;
				console.log(session);
				console.log(userData);
				
                setupSession(session, userData, doNotStore);
                setupUserData(userData);
                console.log(Auth.state);
                
				/*
                return AdhocracyClient.validate_session(session)
                    .then(function (userData) {
                        setupUserData(userData);
                    }, function (response) {
                        console.log("Session couldn't be validated", response);
                        teardownSession();
                    })
                */
            };

            return Auth;
        }
    ]);

;