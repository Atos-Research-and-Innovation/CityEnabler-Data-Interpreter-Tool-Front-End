/**
 * Directive for using Dropzone.js in an AngularJS project.
 *
 * Based on angular-dropzone https://github.com/sandbochs/angular-dropzone/blob/master/lib/angular-dropzone.js
 * But implemented again, because source are not maintained
 */
angular.module('pcApp.datasets.directives.federatedopendataImport', []).directive('federatedopendataImport', [
    '$http', 'ngProgress', 'API_CONF', 'dialogs', '$location', '$anchorScroll', '$routeParams', 'creationService', function ($http, ngProgress, API_CONF, dialogs, $location, $anchorScroll, $routeParams, creationService) {
        return {
            restrict: 'A',
            templateUrl: function (el, attrs) {
                return 'modules/datasets/partials/federatedopendata-import.html';
            },
            scope: {
                'loadData': '='
            },
            link: function (scope, element, attrs, ctrls) {
            	
                scope.itemsPerPage = 10;
                scope.start = 0;
                scope.currentPage = 1;
                scope.byNumResourcesGtZero = function (result) {
                	console.log(result);
                    if(result){
                        return result.length > 0;
                    }
                    else if(scope.federateopendata){
                        return scope.federateopendata.length > 0;
                    }

                };
						
						//initialListNodes = [];
						scope.cedusnodes = [];
						
                    	$http({
                        url: API_CONF.DATASETS_MANAGER_URL + '/cedus/getnodes',
                        params: {
                            //api: attrs.apiBase,
                            //api: 'http://cityenabler.eng.it/'
                            //api: 'http://dataworkspace.eng.it/'
                            //api: 'http://217.172.12.205:8080/'
                            api: API_CONF.CITY_DATA_WORKSPACE
                        }
                    	}).then(function (response) {
                    		//console.log(response);
							//scope.cedusnodes = response.data.nodes;

							//angular.forEach(response.data.nodes, function (value, key) {
							angular.forEach(response.data, function (value, key) {
								//if (value.nodeState=='ONLINE') {
									//console.log(value);
									scope.cedusnodes.push(value);
								//}
							})
							
							
							scope.initialsearch();
                    	}
                    	, function errorCallback(response) {
    						// called asynchronously if an error occurs
    						// or server returns response with an error status.
    						scope.cedusnodes = [];
  							}
                    	);
				
				scope.not_valid = function (formatfile) {
					dialogs.error("Error", "Format '"+formatfile+"' is not valid.");
				};
				
				scope.validType = function (filetype, types) {
					
					for (var i in types) {
                            var type = types[i];
                            
                            //if (resource.format.toLowerCase() == type)
                            if (filetype.toLowerCase() == type.toLowerCase())
                                return true;
                        }
                        return false;
					
				};
				
                scope.byResourceTypeIn = function (types) {
                    return function (resource) {
                        for (var i in types) {
                            var type = types[i];
                            console.log(resource.dcat_format.value.toLowerCase());
                            //if (resource.format.toLowerCase() == type)
                            if (resource.dcat_format.value.toLowerCase() == type.toLowerCase())
                                return true;
                        }
                        return false;
                    }
                };


                scope.init = function(){
                    if(typeof $routeParams.term !== 'undefined'){
                        scope.search($routeParams.term, $routeParams.start);
                    }
                    if(typeof $routeParams.page !== 'undefined'){
                        scope.currentPage = $routeParams.page;
                    }
                }

                scope.goToTop = function(){
                    var old = $location.hash();
                    $location.hash('top');
                    $anchorScroll();
                    $location.hash(old);
                };

                scope.onPageChange = function () {
                    scope.start = ((scope.currentPage - 1) * scope.itemsPerPage) + 1
                    scope.search(scope.lastTerm, scope.start);
                    scope.goToTop();
                };

                scope.saveParameters = function(){
                    $location.search('term', scope.searchTerm);
                    $location.search('page', scope.currentPage);
                    $location.search('start', scope.start);
                }

                scope.loadResourceCEDUS = function (itemIn, dataset, resource) {
                    ngProgress.start();
                    
                    //console.log(dataset);
                    //console.log(dataset.id);
                    //console.log(dataset.dcat_distributions[0].dcat_accessUrl.value);
                    //console.log(dataset.dcat_distributions[0].dcat_format.value);
                    
                    var newformat= resource.dcat_format.value.split(" ");
                    newformat= newformat[0].split("-");
                    
                    $http({
                        url: API_CONF.DATASETS_MANAGER_URL + '/cedus/download',
                        params: {
                            //api: 'http://cityenabler.eng.it/',
                            //api: 'http://dataworkspace.eng.it/',
                            //api: 'http://217.172.12.205:8080/',
                            api: API_CONF.CITY_DATA_WORKSPACE,
                            id: dataset.id,
                            url: resource.dcat_accessUrl.value,
                            dataformat: newformat[0],
                            convert: true
                        }                        
                    }).then(function (response) {

                        if(response.data.result == 500){
                            ngProgress.complete();
                            dialogs.notify('Selected dataset cannot be displayed', 'Please choose another one.');
                        }
                        else{
                            scope.loadData(dataset, resource, response.data);

                            creationService.data.dataset.url = resource.dcat_accessUrl.value;
                            creationService.data.dataset.title = itemIn.dcat_title.value;
                            creationService.data.dataset.description = itemIn.dcat_description.value;
                            if (itemIn.dcat_keywords) {
	                            if (itemIn.dcat_keywords.length>0) {
	                            	creationService.data.dataset.keywords = itemIn.dcat_keywords.toString();	
	                            }
	                            else {
	                            	creationService.data.dataset.keywords = '';
	                            }
                            }
                            else {
                            	creationService.data.dataset.keywords = '';
                            }
                            
                            ngProgress.complete();
                            //scope.saveParameters();
                        }
                    }
                    , function errorCallback(response) {
    					// called asynchronously if an error occurs
    					// or server returns response with an error status.
    						dialogs.error("Error", response.statusText);
    						ngProgress.complete();
  						}
  					);
                };
				
				scope.nodesSelected =[];
				
				scope.initialsearch = function (term, start) {
					scope.search('',0,'all');	
				}
                scope.search = function (term, start, items) {

                	//console.log(scope.nodesSelected.length);
                	/*
                	if (!term) {
                		dialogs.error("Error", "Add some text to search");
                	}
                	else 
                	*/
                	
                	                	
                	if ((scope.nodesSelected.length==0) && (items!='all')) {
                		dialogs.error("Error", "Please select a node");
                	}
	                else {
	                		
	                    ngProgress.start();
	                    scope.lastTerm = term;
	                    scope.eurostatStart = 0;
						
						if (items=='all') {
							var nodelist= ''
							angular.forEach(scope.cedusnodes, function (value, key) {
								scope.nodesSelected.push(value.id)
								
								if (nodelist) {
									nodelist = nodelist+','
								}
								nodelist = nodelist + value.id;
							});
							
						}
						else
						{
							var nodelist=scope.nodesSelected.join();	
						}
						
						
	                    if (start>0) {
	                    }
	                    else {
	                    	scope.currentPage = 1;
	                    	$http({
	                        url: API_CONF.DATASETS_MANAGER_URL + '/cedus/searchcount',
	                        params: {
	                            //api: attrs.apiBase,
	                            //api: 'http://cityenabler.eng.it/',
	                            //api: 'http://dataworkspace.eng.it/',
	                            //api: 'http://217.172.12.205:8080/',
	                            api: API_CONF.CITY_DATA_WORKSPACE,
	                            q: term,
	                            nodes: nodelist
	                        }
	                    	}).then(function (response) {
								scope.totalitemsfederated = response.data.count;
	                    	}
	                    	, function errorCallback(response) {
	    						// called asynchronously if an error occurs
	    						// or server returns response with an error status.
	    						dialogs.error("Error", response.statusText);
	    						scope.totalitemsfederated = 0;
	  							}
	                    	);
	                    }
	                    
	                    $http({
	                        url: API_CONF.DATASETS_MANAGER_URL + '/cedus/search',
	                        params: {
	                            //api: attrs.apiBase,
	                            //api: 'http://cityenabler.eng.it/',
	                            //api: 'http://dataworkspace.eng.it/',
	                            //api: 'http://217.172.12.205:8080/',
	                            api: API_CONF.CITY_DATA_WORKSPACE,
	                            q: term,
	                            start: start,
	                            nodes: nodelist
	                        }
	                    }).then(function (response) {
	                        ngProgress.complete();
	                        
	                        //console.log(response.data);
	                        
	                        scope.federateopendata = response.data;
	                        scope.federateopendataSearchResults = response.data;
	                    }
	                    , function errorCallback(response) {
	    					// called asynchronously if an error occurs
	    					// or server returns response with an error status.
	    						dialogs.error("Error", response.statusText);
	    						ngProgress.complete();
	  						}
	                    )
	                    ;
                	};

                scope.init();
               }
            }
        }
    }
]);
