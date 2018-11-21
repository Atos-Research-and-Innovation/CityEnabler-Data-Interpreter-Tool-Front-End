/**
 * Controllers for common purposes
 */

angular.module('pcApp.common.controllers', [])

/****
 Used to search metrics using elasticsearch api
 ******//*
 .factory('SearchMetrics',  ['$resource', 'API_CONF', function($resource, API_CONF) {
 var url = "/"+API_CONF.ELASTIC_INDEX_NAME+'/:type/_search';
 //var url = 'http://'+API_CONF.ELASTIC_URL + "/" + API_CONF.ELASTIC_INDEX_NAME + '/:type/_search';
 //console.log("url");
 //console.log(url);

 var SearchMetrics = $resource(url,
 {
 search: "@search",
 type: "@type"
 },
 {
 'update': { method:'PUT' },
 'post': { method:'POST', isArray:false },
 'query': { method: 'GET', isArray:false}
 //'query': { method: 'POST', isArray:false}
 }
 );
 return SearchMetrics;
 }])
 */

    .controller('CommonController', [
        '$scope', '$location', 'API_CONF', '$localStorage', '$translate', function ($scope, $location, API_CONF, $localStorage, $translate) {
            $scope.hideLoader = true;

			//load languages
            var ctrl = this;
  			
  			ctrl.updateLanguageCombo = function(value) {
  				console.log(ctrl.language);
  				ctrl.language = value;
  				ctrl.updateLanguage();
			};
  			
  			ctrl.updateLanguage = function() {
  				//console.log(ctrl.language);
				$translate.use(ctrl.language);
				$localStorage.defaultLanguage = ctrl.language;
			};
			
			$scope.changedefaultlang= function(id) {
				//console.log(id);
				ctrl.language = id;
				ctrl.updateLanguage();
			}
			
			$scope.updateLanguageById = function(id) {
				//console.log(id);
				//$translate.use(id);
				$localStorage.defaultLanguage = id;
			};
			
			
  			if ($localStorage.defaultLanguage) {
  				//console.log("set language default 1");
  				ctrl.language = $localStorage.defaultLanguage;
  				$translate.use(ctrl.language);
  			}
  			else if (API_CONF.defaultlanguage) {
  				//console.log("set language default 2");
  				ctrl.language = API_CONF.defaultlanguage;
  				$translate.use(ctrl.language);
  			}
  			else {
  				//console.log("set language default 3");
  				ctrl.language = 'en';
  			}
  			//console.log(API_CONF.defaultlanguage);
  			//console.log(ctrl.language);
  			//ctrl.language = 'en';
  			
  			
            ctrl.languages = remotePolicyCompassConfig.languages;
            //console.log("ctrl.languages");
            //console.log(ctrl.languages);
            //end load languages

            $scope.isActive = function (viewLocation) {
                return viewLocation === $location.path();
            };
            $scope.isCollapsed = true;
            $scope.navCollapsed = true;
            $scope.toggleCreateMenu = function () {
                $scope.isCollapsed = !$scope.isCollapsed
            }
            $scope.collapseCreateMenu = function () {
                $scope.isCollapsed = true;
            }
            $scope.expandCreateMenu = function () {
                $scope.isCollapsed = false;
            }
            /* Functions for Submenu Collapse.*/
            $(document).on('click', function (e) {
                var link = e.target.id;
                if ((link !== "createLink") && ($scope.isCollapsed == false)) {
                    $scope.isCollapsed = true;
                }
            });
            /* Functions for login Button to call a route.*/
            $scope.go = function (path) {
                $location.path(path);
            };
            
            
            $scope.cedusloginurl = API_CONF.fiwareloginurl;
                        
            //console.log($scope.cedusloginurl);


				if(!$localStorage.closedCookieLaw){
                    $scope.hideCookieLaw  = false;
                }
                else{
                    $scope.hideCookieLaw  = true;
                }

                $scope.closeCookieLaw = function(){
                	console.log("closeCookieLaw");
                    $scope.hideCookieLaw  = true;
                    $localStorage.closedCookieLaw = 'true';
                }
            
        }
    ])

    .controller('StaticController', [
        '$scope', '$modal', function ($scope, $modal) {


        }
    ])

    .controller('ControllerScroller', [
        '$scope', '$document', function ($scope, $document) {

            $scope.toTheTop = function() {
                $document.scrollTopAnimated(0, 2000).then(function() {        		
                });
            }
    		
            $scope.toSection = function(sectionId) {
                var sectionToScroll = angular.element(document.getElementById(sectionId));
                $document.scrollToElementAnimated(sectionToScroll, 0, 2000);
            }

        }
    ])
    
    .controller('wanttoController', [
        '$scope', '$rootScope', '$modal', function ($scope, $rootScope, $modal) {
            $rootScope.wizard_help = false;
        }
    ])

    .controller('CreateDataset2Controller', [
        '$scope', '$modal', function ($scope, $modal) {
            console.log("CreateDataset2Controller");

            $scope.classtypedata = [
                {
                    icon: "",
                    name: "Country",
                    maker: "",
                    ticked: false
                }, {
                    icon: "",
                    name: "Age Class",
                    maker: "",
                    ticked: false
                }, {
                    icon: "",
                    name: "Gender",
                    maker: "",
                    ticked: false
                }
            ];
            $scope.classtypedata2 = [
                {
                    icon: "",
                    name: "Country",
                    maker: "",
                    ticked: false
                }, {
                    icon: "",
                    name: "Age Class",
                    maker: "",
                    ticked: false
                }, {
                    icon: "",
                    name: "Gender",
                    maker: "",
                    ticked: false
                }
            ];

            $scope.gendermultiselect = [
                {
                    icon: "",
                    name: "Male",
                    maker: "",
                    ticked: false
                }, {
                    icon: "",
                    name: "Female",
                    maker: "",
                    ticked: false
                }, {
                    icon: "",
                    name: "Death Rate",
                    maker: "",
                    ticked: false
                }
            ];


        }
    ])

/**
 * Controller for setting the UI Bootstrap date selection.
 * ToDo: Should be a directive.
 */
    .controller('DateController', [
        '$scope', function ($scope) {

            $scope.maxDate = new Date();
            //$scope.minDate = new Date('1900-01-01');
            $scope.format = "yyyy-MM-dd";
            $scope.dateOptions = {
                formatYear: 'yyyy',
                startingDay: 1
            };

            $scope.open = function ($event) {
                $event.preventDefault();
                $event.stopPropagation();
                $scope.opened = true;
            };

        }
    ]);
