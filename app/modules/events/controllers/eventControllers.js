angular.module('pcApp.events.controllers.event', [
    'pcApp.events.services.event',
    'pcApp.events.directives.eventDirectives',
    'pcApp.references.services.reference',
    'pcApp.config'
])
/**
 * Controller to list events
 */
    .controller('EventsController', [
        '$scope', 'Event', '$routeParams', function ($scope, Event, $routeParams) {
            $scope.events = Event.query({page: $routeParams.page}, function (eventList) {
            }, function (err) {
                throw {message: JSON.stringify(err.data)};
            });
        }
    ])
/**
 * Controller to list details of an event
 */
    .controller('EventDetailController', [
        '$scope',
        '$routeParams',
        '$location',
        'Event',
        'LinkedEventVisualization',
        'Languages',
        'dialogs',
        '$log',
        'Auth',
        'PolicyDomain',
        'Individual',
        '$filter',
        function ($scope, $routeParams, $location, Event, LinkedEventVisualization, Languages, dialogs, $log, Auth, PolicyDomain, Individual, $filter) {

            $scope.userState = Auth.state;

			$scope.CanDeleteEvent = false;
			$scope.CanViewItem = false;			
			$scope.DataLoaded = false;
			
            $scope.event = Event.get({id: $routeParams.eventId}, function (event) {


				//only if I'm logged, and I'm admin of the organisation that the event belongs I can edit. It is in draft and I'm the author, I can edit
       			$scope.DataLoaded = true;
       			if ($scope.userState.loggedIn) {
       				//check idf is in draft and I'm the author	
       				if ($scope.userState.isAdmin) {
       					$scope.CanViewItem = true;
       					$scope.CanDeleteEvent = true;
       				}
       				else if ((event.is_draft==true) && (event.creator_path==$scope.userState.userPath))
       				{
       					$scope.CanViewItem = true;
       					$scope.CanDeleteEvent = true;
       				}
       				else {
       					//we check if the user is admin af the organisation
       					if (event.organization) {
       						
       						angular.forEach($scope.userState.userData.organizations, function (value, key) {
								//console.log("Org:");
								//console.log(value.id);
								if (value.id==event.organization) {
									//user belong to the same organization
									console.log("user belong to the same organization");
									$scope.CanViewItem = true;
									angular.forEach(value.roles, function (valueR, keyR) {
										console.log(valueR.name);
										if (valueR.name=="Seller") {
											$scope.CanDeleteEvent = true;
										}
									});
										
								}
							})
       						
       					}
       					else {
       						$scope.CanViewItem = true;
       					}	
       				}
       			}
               			            	
                var domains = [];
                var individuals = [];
                
                event.policy_domains.forEach(function (p) {
                    domains.push(PolicyDomain.getById(p))
                });
                event.policy_domains = domains;
/*
                event.spatials.forEach(function(i){
                    individuals.push(Individual.getById(i))
                });
*/
                if(typeof event.derived_from_id !== 'undefined'){
                    $scope.originalEvent = Event.get({id: event.derived_from_id}, function (originalEvent) {


                    }, function (error) {

                    });
                }

            }, function (error) {
                $location.path('/browse');
            });

            $scope.deleteEvent = function (event) {


                if($scope.relatedVisualizations.length == 0){
                    // Open a confirmation dialog
                    var label = $filter('translate')('Are you sure?');
                	var message = $filter('translate')('Do you want to delete the Event permanently?');
                	
                    //var dlg = dialogs.confirm("Are you sure?", "Do you want to delete the Event '" + event.title + "' permanently?");
                    var dlg = dialogs.confirm(label, message);
                    
                    dlg.result.then(function () {
                        // Delete the metric via the API
                        event.$delete({}, function () {
                            $location.path('/events');
                        }, function (error) {

						if (error.status==403) {
						
                        	var label = $filter('translate')('Error');
                			var message = $filter('translate')('You do not have permission to perform this action')+".";

                        	var dlg = dialogs.notify(label, message);						
							
						}
						else {
                			throw {message: error.data.message || JSON.stringify(error.data)};
                		}
            		});
                    });
                }else{
                	var label = $filter('translate')('Cannot delete this event');                	
                	var message = $filter('translate')('This event is being used by one or more visualizations. Please delete these visualizations first');
                	/*
                    var dlg = dialogs.notify('Cannot delete this event', 'This event is being used by one or more visualizations. Please delete these visualizations first: ' +
                        $scope.relatedVisualizationsString);
                        */
                    var dlg = dialogs.notify(label, message +': '+$scope.relatedVisualizationsString);
                   
                }
            };

            $scope.relatedVisualizations = [];
            $scope.relatedVisualizationsString = "";

            $scope.linked_event_visualization = LinkedEventVisualization.get({id: $routeParams.eventId}, function (LinkedEventVisualizationList) {
                for(i in LinkedEventVisualizationList.results){
                    var Tmp = {
                        "id": LinkedEventVisualizationList.results[i]['visualization'],
                        "title": LinkedEventVisualizationList.results[i]['title']
                    }
                    $scope.relatedVisualizations.push(Tmp);
                    $scope.relatedVisualizationsString += '<br><a href= "/app/#!/visualizations' + '/' + LinkedEventVisualizationList.results[i]['visualization'] + '" target="_blank"> '+ LinkedEventVisualizationList.results[i]['title'] + '</a>';
                }
            }, function (err) {
                throw {message: JSON.stringify(err.data)};
            });

            $scope.event.$promise.then(function (event) {
            	/*
                $scope.language = Languages.get({id: event.languageID}, function (language) {
                }, function (err) {
                    throw {message: JSON.stringify(err.data)};
                });
                */
            });

        }
    ])
/**
 * Controller to edit a metric
 */
    .controller('EventEditController', [
        '$scope',
        '$routeParams',
        'Event',
        '$location',
        '$log',
        'Auth',
        '$window',
        'dialogs',
        function ($scope, $routeParams, Event, $location, $log, Auth, $window, dialogs) {

            $scope.userState = Auth.state;
			
			$scope.CanSaveEvent = false;
            $scope.mode = "edit";
			
			$scope.organizationsList = [];
			
            $scope.event = Event.get({id: $routeParams.eventId}, function (event) {
            	
						var organizationsTmp = [];
						
						if (Auth.state) {
							if (Auth.state.userData) {
								angular.forEach(Auth.state.userData.organizations, function (valueC, keyC) {

									var vTicked = false;
									
									if (event.organization==valueC.id) {
										vTicked = true;
									}
									
									organizationsTmp.push({
									icon: "",
									name: valueC.name,
									maker: valueC.id,
									ticked: vTicked
									});
									
								}, organizationsTmp);
							}
						}
               			$scope.organizationsList = organizationsTmp;
               			
               			//only if I'm logged, and I'm admin of the organisation that the event belongs I can edit. It is in draft and I'm the author, I can edit
               			if ($scope.userState.loggedIn) {
               				//check idf is in draft and I'm the author	
               				if ($scope.userState.isAdmin) {
               					$scope.CanSaveEvent = true;
               				}
               				else if ((event.is_draft==true) && (event.creator_path==$scope.userState.userPath))
               				{
               					$scope.CanSaveEvent = true;
               				}
               				else {
               					//we check if the user is admin af the organisation
               					if (event.organization) {
               						
               						angular.forEach($scope.userState.userData.organizations, function (value, key) {
										console.log("Org:");
										console.log(value.id);
										if (value.id==event.organization) {
											//user belong to the same organization
											console.log("user belong to the same organization");
											
											angular.forEach(value.roles, function (valueR, keyR) {
												console.log(valueR.name);
												if (valueR.name=="Seller") {
													$scope.CanSaveEvent = true;
												}
											});
												
										}
									})
               						
               					}	
               				}
               			}
            
               			
            	//console.log($scope.organizationsList);
            	
                $scope.canDraft =  $scope.event.is_draft;
                $scope.spatials = {
                    input: $scope.event.spatials,
                    output: []
                };
            }, function (err) {
                $location.path('/browse');
            });

            $scope.goBackButton = function(){
                $window.history.back();
            }

            $scope.createEvent = function () {
                var canEdit = Auth.state.isAdmin || $scope.userState.userPath == $scope.event.creator_path;

                $scope.event.userID = 1;
                $scope.event.viewsCount = 1;

				$scope.event.organization = '';
				
					if ($scope.organizationsList.length > 0) {				
						angular.forEach($scope.organizationsList, function (value, key) {
													
							if (value.ticked) {
								$scope.event.organization = value.maker;
							}
						})
	                }

if ($scope.event.organization=='') {
						
						var message = '<li><b>Organization</b>' + ': Organization is mandatory.</li>';						
						dialogs.error("Error", message);
					}
					else {
				
				if ($scope.CanSaveEvent) {
                //if(canEdit){
                    $scope.event.spatials = $scope.spatials.output;
					
					 
	                    Event.update($scope.event, function (value, responseHeaders) {
	                        $location.path('/events/' + value.id);
	                    }, function (err) {
	                        throw {message: JSON.stringify(err.data)};
	                    });
                    
                }else{
                    $scope.event.derived_from_id = $scope.event.id;
                    $scope.event.title = 'Copy of ' + $scope.event.title;
                    $scope.event.id = null;

                    Event.save($scope.event, function (value, responseHeaders) {
                        $location.path('/events/' + value.id);
                    }, function (err) {
                        throw {message: JSON.stringify(err.data)};
                    });
                }
}

            };

        }
    ])
/**
 * Controller to create a metric
 */
    .controller('EventCreateController', [
        '$scope',
        'Event',
        '$location',
        '$log',
        'dialogs',
        'eventService',
        'Auth',
        '$filter',
        '$routeParams',
        '$window',
        function ($scope, Event, $location, $log, dialogs, eventService, Auth, $filter, $routeParams, $window) {

            $scope.userState = Auth.state;

            $scope.mode = "create";

			var organizationsTmp = [];
			
			if (Auth.state) {
				if (Auth.state.userData) {						
					angular.forEach(Auth.state.userData.organizations, function (valueC, keyC) {
						//console.log(valueC);
						//console.log(keyC);
						var vTicked = false;
						
						organizationsTmp.push({
							icon: "",
							name: valueC.name,
							maker: valueC.id,
							ticked: vTicked
							});
					}, organizationsTmp);
				}
			}
			
			
			
            $scope.organizationsList = organizationsTmp;
            
            $scope.CanSaveEvent = $scope.userState.loggedIn;
            
            $scope.init = function () {
                //Default search query
                if(typeof $scope.event === 'undefined'){
                    $scope.event = {};
                    $scope.event.title =  $routeParams.title || "";
                    $scope.event.keywords = $routeParams.keywords || "";
                    $scope.event.spatials = $routeParams.spatials || "";
                    $scope.event.detailsURL = $routeParams.detailsURL || "";
                    $scope.event.description = $routeParams.description || "";
                    $scope.event.startEventDate = $routeParams.start || "";
                    $scope.event.endEventDate = $routeParams.end || "";
                    $scope.event.languageID = $routeParams.language || "";
                    $scope.event.is_draft = true;
                    $scope.canDraft = $scope.event.is_draft;
                }
            }



            if (angular.toJson(eventService.getEvent()) != "[]") {
                //console.log(angular.toJson(eventService.getEvent()));
                var endDate = '';
                if(typeof eventService.getEvent()[0]['endDate'] === "undefined"){
                    endDate = eventService.getEvent()[0]['date'];
                }
                else{
                    endDate = eventService.getEvent()[0]['endDate'];
                }
                $scope.event = {
                    title: angular.toJson(eventService.getEvent()[0]['title']).replace(/\"/g, ""),
                    keywords: angular.toJson(eventService.getEvent()[0]['title']).replace(/\"/g, ""),
                    detailsURL: angular.toJson(eventService.getEvent()[0]['url']).replace(/\"/g, ""),
                    description: angular.toJson(eventService.getEvent()[0]['description']).replace(/\"/g, ""),
                    startEventDate: angular.toJson(eventService.getEvent()[0]['date']).replace(/\"/g, ""),
                    endEventDate: angular.toJson(endDate).replace(/\"/g, ""),
                    //spatials: $scope.spatials.output,
                    languageID: "38"
                }
                eventService.removeEvent();
            }

            var compareDates = function(){
                if($scope.eventForm.startEventDate.$modelValue > $scope.eventForm.endEventDate.$modelValue){
                    dialogs.error('Validation Error', 'Please provide a Start Date which is smaller than the End Date.');
                    return false;
                }
                else return true;
            };


            $scope.createEvent = function () {
                $scope.event.userID = 1;
                if(compareDates()) {
                    $scope.event.viewsCount = 1;
                    if ($scope.spatials) {
                    	$scope.event.spatials = $scope.spatials.output;	
                    }
                    
                    
                    $scope.event.organization = '';
				
					if ($scope.organizationsList.length > 0) {				
						angular.forEach($scope.organizationsList, function (value, key) {
													
							if (value.ticked) {
								$scope.event.organization = value.maker;
							}
						})
	                }
                
                    if ($scope.event.organization=='') {
						
						var message = '<li><b>Organization</b>' + ': Organization is mandatory.</li>';						
						dialogs.error("Error", message);
					}
                    else {
	                    Event.save($scope.event, function (value, responseHeaders) {
	                        $location.path('/events/' + value.id);
	                    }, function (err) {
	                        throw {message: JSON.stringify(err.data)};
	                    });
                    
                    }
                }
            };

            $scope.saveParameters = function(){
                $location.search('title', $scope.event.title);
                $location.search('keywords', $scope.event.keywords);
                $location.search('detailsURL', $scope.event.detailsURL);
                $location.search('description', $scope.event.descritption);
                $location.search('spatials', $scope.event.spatials);
                $location.search('start', $scope.event.startEventDate);
                $location.search('end', $scope.event.endEventDate);
                $location.search('language', $scope.event.languageID);
                $location.search('draft', $scope.event.is_draft);
            }

            $scope.goBackButton = function(){
                $window.history.back();
            }


            $scope.init();
        }
    ])

/**
 * Controller to search and import events from external resources
 */
    .controller('EventSearchController', [
        '$scope',
        '$filter',
        'Event',
        '$location',
        '$log',
        '$http',
        'API_CONF',
        'eventService',
        'Auth',
        'dialogs',
        '$route',
        '$routeParams',
        '$anchorScroll',
        'ngProgress',
        function ($scope, $filter, Event, $location, $log, $http, API_CONF, eventService, Auth, dialogs, $route, $routeParams, $anchorScroll, ngProgress) {

            $scope.userState = Auth.state;

            $scope.step = 'one';
            $scope.nextStep = function () {

            };

            $scope.prevStep = function () {
                $scope.step = 'one';
            };

            $scope.search = {};
            $scope.availableExtractors = [];


            var showPerPage;


            $scope.init = function () {
                $scope.tabsActive = false;
                $scope.activeTab = 0;
                $scope.searched = false;
                $scope.searchedForWikiEvents = false;
                //Set Pagination defaults
                //Default value for how many pages to show in the page navigation control
                $scope.paginationSize = 5;
                //Default values for how many items per page
                $scope.itemsperPage = 10;

                //showPerPage = $routeParams.show-0 || 10;

                //Default search query
                $scope.search_title =  $routeParams.q || "";
                $scope.search.startRange = $routeParams.start || "";
                $scope.search.endRange = $routeParams.end || "";
                $scope.wikiTitle = $routeParams.wikiTitle || "";

                $scope.selectedExtractors = [];

                $scope.searchResults = eventService.getSearchResults();
                $scope.wikiSearchResults = eventService.getWikiSearchResults();

                //Default sort
                $scope.sortByItem = 'Relevance';

                //Default current page
                if($routeParams.page != 0){
                    $scope.currentPage = $routeParams.page || 1;
                    $scope.currentPageWikiTitles = $routeParams.pageWikiTitles || 1;
                    $scope.currentPageWikiResults= $routeParams.pageWikiResults || 1;
                }else{
                    $scope.currentPage = 1;
                    $scope.currentPageWikiTitles = 1;
                    $scope.currentPageWikiResults = 1;
                }



                var sortBy = $routeParams.sort;
                angular.forEach($scope.sortOptions, function(option) {
                    if (option.id === sortBy){
                        $scope.sortByItem = sortBy;
                        $scope.selectedSortItem = option;
                    }
                });

                var showPerPage = $routeParams.show-0 || 10;

                angular.forEach($scope.itemsPerPageChoices, function(option) {
                    if (option.id === showPerPage){
                        $scope.itemsperPage = showPerPage;
                        $scope.selectedItemPerPage = option;
                    }
                });


                $http.get(API_CONF.EVENTS_MANAGER_URL + '/getextractor').

                    success(function (data, status, headers, config) {
                        data[1].valid=true;
                        $scope.availableExtractors = data;

                        $scope.availableExtractors.forEach(function (extractor){
                            $scope.selectedExtractors.push(extractor.name);
                        });

                        if($routeParams.extractors instanceof Array){
                            $scope.selectedExtractors = $routeParams.extractors;
                        }
                        else if(typeof $routeParams.extractors !== "undefined"){
                            $scope.selectedExtractors.push($routeParams.extractors);
                        }

                        $scope.searchEvent();


                    }).error(function (data, status, headers, config) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                    });

                $location.search('page', 0);
                $location.search('pageWikiResults' , 0);

            };

            $scope.saveParameters = function() {

                if ($scope.search.startRange) {
                    $scope.search.startRange = $filter('date')(new Date($scope.search.startRange), 'yyyy-MM-dd');
                }

                if($scope.search.endRange){
                    $scope.search.endRange = $filter('date')(new Date($scope.search.endRange), 'yyyy-MM-dd');
                }

                $location.search('extractors' , $scope.selectedExtractors);

                $location.search('page', $scope.currentPage);
                $location.search('pageWikiTitles', $scope.currentPageWikiTitles);
                $location.search('pageWikiResults', $scope.currentPageWikiResults);


                $location.search('q', $scope.search_title);

                $location.search('start', $scope.search.startRange);
                $location.search('end', $scope.search.endRange);

                $location.search('show', $scope.itemsperPage);

                $location.search('sort', $scope.sortByItem);

                $location.search('wikiTitle' , $scope.wikiTitle);
            }


            //Define function that fires search when page changes
            $scope.pageChanged = function () {
                if (typeof $scope.totalItems === "undefined") {
                    if ($routeParams.hasOwnProperty("page") && $scope.currentPage != $routeParams.page)
                        $scope.currentPage = $routeParams.page;
                    return;
                }

                $scope.itemOffset = ($scope.currentPage - 1 ) * $scope.itemsperPage;

                $scope.fillSearchResults($scope.searchResultsTotal);
                $scope.totalItems = $scope.searchResultsTotal.length;


                $scope.goToTop();
            };

            $scope.pageChangedWikiTitles = function(){
                if (typeof $scope.wikipedia_title_results === "undefined") {
                    if ($routeParams.hasOwnProperty("pageWikiTitles") && $scope.currentPageWikiTitles != $routeParams.pageWikiTitles)
                        $scope.currentPageWikiTitles = $routeParams.pageWikiTitles;
                    return;
                }

                $scope.itemOffsetWikiTitles = ($scope.currentPageWikiTitles - 1 ) * $scope.itemsperPage;

                $scope.goToTop();
            }

            $scope.pageChangedWikiResults = function(){
                if (typeof $scope.wikiSearchResultsTotal === "undefined") {
                    if ($routeParams.hasOwnProperty("pageWikiResults") && $scope.currentPageWikiResults != $routeParams.pageWikiResults)
                        $scope.currentPageWikiResults = $routeParams.pageWikiResults;
                    return;
                }

                $scope.itemOffsetWikiResults = ($scope.currentPageWikiResults - 1 ) * $scope.itemsperPage;

                $scope.fillWikiSearchResults($scope.wikiSearchResultsTotal);

                $scope.goToTop();
            }


            //Define function that fires search when Items Per Page selection box changes
            $scope.itemsPerPageChanged = function () {
                $scope.itemsperPage = $scope.selectedItemPerPage.id;
                $location.search('show', $scope.itemsperPage);
                $scope.searchEvent();
            };


            //Define function that fires search when Sort By selection box changes
            $scope.sortItemsChanged = function () {
                $scope.sortByItem = $scope.selectedSortItem.id;
                $location.search('sort', $scope.sortByItem);
                $scope.searchEvent();
            };

            //Init Sort Options
            $scope.sortOptions = [
                {
                    id: 'relevance',
                    name: 'Relevance'
                }, {
                    id: 'title',
                    name: 'Title'
                }, {
                    id: 'date',
                    name: 'Date'
                }
            ];

            //Init Selectable number of items per page
            $scope.itemsPerPageChoices = [
                {
                    id: 10,
                    name: '10'
                }, {
                    id: 20,
                    name: '20'
                }, {
                    id: 30,
                    name: '30'
                }
            ];

            //Sort the Search Results by Selected Sort Item
            var sortByKey = function(array,key){
                return array.sort(function(a,b){
                    var x = a[key];
                    var y = b[key];
                    return((x<y)? -1 : ((x>y) ? 1 : 0));
                })
            }

            $scope.fillSearchResults = function(data){

                $scope.searchResultsTotal = data;
                $scope.searchResultsTotal = sortByKey($scope.searchResultsTotal, $scope.sortByItem);

                var searchResults = [];

                var length = $scope.itemOffset+$scope.itemsperPage;

                if(length > $scope.searchResultsTotal.length){
                    length = $scope.searchResultsTotal.length;
                }

                for(var i = $scope.itemOffset; i < length; i++){
                    searchResults[i-$scope.itemOffset] = $scope.searchResultsTotal[i];
                }
                eventService.setSearchResults(searchResults);
                $scope.searchResults = searchResults;
            }

            $scope.fillWikiSearchResults = function(data){

                $scope.wikiSearchResultsTotal = data;
                $scope.wikiSearchResultsTotal = sortByKey($scope.wikiSearchResultsTotal, $scope.sortByItem);

                var wikiSearchResults = [];

                var length = $scope.itemOffsetWikiResults+$scope.itemsperPage;


                if(length > $scope.wikiSearchResultsTotal.length){
                    length = $scope.wikiSearchResultsTotal.length;
                }

                for(var i = $scope.itemOffsetWikiResults; i < length; i++){
                    wikiSearchResults[i-$scope.itemOffsetWikiResults] = $scope.wikiSearchResultsTotal[i];
                }

                eventService.setWikiSearchResults(wikiSearchResults);
                $scope.wikiSearchResults = wikiSearchResults;
            }


            $scope.searchEvent = function () {
                if($scope.search_title.length > 0) {
                    $scope.wikipedia_title_active = true;
                    $scope.tabsActive = false;
                    $scope.searched = false;
                    $scope.searchedForWikiEvents = false;
                    $scope.wikipedia_event_active = false;
                    $scope.fillSearchResults([]);
                    $scope.fillWikiSearchResults([]);
                    $scope.totalItems = $scope.searchResultsTotal.length;
                    $scope.wikipedia_title_results = [];
                    ngProgress.start();
                    var startRange, endRange;

                    if (!$scope.search.startRange) {
                        startRange = "0001-01-01";
                    }
                    else {
                        startRange = $scope.search.startRange;
                    }
                    if (!$scope.search.endRange) {
                        endRange = "2099-12-01";
                    }
                    else {
                        endRange = $scope.search.endRange;
                    }

                    $scope.itemOffset = ($scope.currentPage - 1 ) * $scope.itemsperPage;
                    $scope.itemOffsetWikiTitles = ($scope.currentPageWikiTitles - 1 ) * $scope.itemsperPage;

                    var selectedExtractors = selectedExtractorsWithoutWiki();

                    $http.get(
                        API_CONF.EVENTS_MANAGER_URL +
                        '/harvestevents?keyword=' +
                        $scope.search_title +
                        '&extractors=' +
                        selectedExtractors +
                        '&start=' +
                        $filter('date')(startRange, "yyyy-MM-dd") +
                        '&end=' +
                        $filter('date')(endRange, "yyyy-MM-dd")).

                    success(function (data, status, headers, config) {
                        $scope.tabsActive = true;
                        $scope.fillSearchResults(data);
                        $scope.totalItems = $scope.searchResultsTotal.length;
                        $scope.searchResultsTotalBackup = $scope.searchResultsTotal;
                        $scope.searched = true;
                        ngProgress.complete();

                    }).error(function (data, status, headers, config) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                    });

                    $scope.searchForWikipediaTitles($scope.search_title);

                }
                else{
                    $scope.searchResults = [];
                }

            };

            $scope.searchForWikipediaTitles = function(search_title){
                $.ajax( {
                    url: "https://en.wikipedia.org/w/api.php",
                    jsonp: "callback",
                    dataType: 'jsonp',
                    data: {
                        action: "opensearch",
                        list: "search",
                        srsearch: "javascript",
                        format: "json",
                        search: search_title
                    },
                    xhrFields: { withCredentials: true },
                    success: function(response) {
                        $scope.wikipedia_title_results = [];
                        for(var i = 0; i<response[1].length;i++){
                            if(!response[2][i].startsWith("This is a redirect from a title")) {
                                $scope.wikipedia_title_results.push([response[1][i], response[2][i], response[3][i]]);
                            }
                        }
                        loadWikiSearchResults();
                    }
                });
            }

            var loadWikiSearchResults = function(){
                if(typeof $scope.wikipedia_title_results !== "undefined" && $scope.wikiTitle.length > 0){
                    $scope.wikipedia_title_results.forEach(function(_title){
                        if(_title[0] == $scope.wikiTitle){
                            $scope.searchForWikipediaEvents($scope.wikiTitle);
                        }
                    });
                }
            }

            $scope.searchForWikipediaEvents = function(wiki_title){
                ngProgress.start();
                $scope.searchedForWikiEvents = false;
                $scope.wikiTitle = wiki_title;
                $scope.wikiSearchResults = [];

                var startRange, endRange;

                if (!$scope.search.startRange) {
                    startRange = "0001-01-01";
                }
                else {
                    startRange = $scope.search.startRange;
                }
                if (!$scope.search.endRange) {
                    endRange = "2099-12-01";
                }
                else {
                    endRange = $scope.search.endRange;
                }

                $scope.itemOffsetWikiResults = ($scope.currentPageWikiResults - 1 ) * $scope.itemsperPage;


                $http.get(
                    API_CONF.EVENTS_MANAGER_URL +
                    '/harvestevents?keyword=' +
                    wiki_title +
                    '&extractors=' +
                    'Wikipedia' +
                    '&start=' +
                    $filter('date')(startRange, "yyyy-MM-dd") +
                    '&end=' +
                    $filter('date')(endRange, "yyyy-MM-dd")).

                success(function (data, status, headers, config) {
                    $scope.fillWikiSearchResults(data);
                    $scope.wikiTotalItems = $scope.wikiSearchResultsTotal.length;
                    $scope.wikiSearchResultsTotalBackup = $scope.wikiSearchResultsTotal;
                    $scope.searched = true;
                    $scope.searchedForWikiEvents = true;
                    $scope.wikipedia_event_active = true;
                    if(data.length == 0){
                        dialogs.notify('Events from selected Wikipedia article cannot be extracted', 'Please choose another article.');
                    }
                    ngProgress.complete();
                    $scope.goToTop();

                }).error(function (data, status, headers, config) {
                    ngProgress.complete();
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });

            };

            var selectedExtractorsWithoutWiki = function(){
                var _extractors = [];
                $scope.selectedExtractors.forEach(function (selectedExtractor) {
                    if(selectedExtractor != 'Wikipedia'){
                        _extractors.push(selectedExtractor);
                    }
                });

                return _extractors;
            }


            $scope.selectEvent = function () {
                eventService.addEvent($scope.search.selectedEvent);
                $scope.saveParameters();
            };

            $scope.goToTop = function(){
                var old = $location.hash();
                $location.hash('top');
                $anchorScroll();
                $location.hash(old);
            };


            $scope.$on('$routeUpdate', function(){
                if($scope.searched && $scope.search_title.length > 0)$location.path('/events/create');
            });


            $scope.setActiveTab = function(_active){
                $scope.activeTab = _active;
            };

            $scope.filterSearchResults = function(search_term){
                $scope.fillSearchResults($scope.searchResultsTotalBackup);
                $scope.totalItems = $scope.searchResultsTotal.length;

                var filteredArray = [];
                var term = search_term.toLowerCase().split(" ");

                for(var i=0; i<$scope.searchResultsTotal.length; i++){
                    var found = false;

                    for(var k=0; k<term.length; k++){
                        if($scope.searchResultsTotal[i]['title'].toLowerCase().includes(term[k]) || $scope.searchResultsTotal[i]['description'].toLowerCase().includes(term[k])){
                            found = true;
                        }
                        else{
                            found = false;
                            break;
                        }
                    }
                    if(found){
                        filteredArray.push($scope.searchResultsTotal[i]);
                    }
                }

                if(filteredArray.length > 0){
                    $scope.fillSearchResults(filteredArray);
                    $scope.totalItems = $scope.searchResultsTotal.length;
                }
                else if(term.length > 0){
                    $scope.fillSearchResults([]);
                    $scope.totalItems = $scope.searchResultsTotal.length;
                }

            }

            $scope.filterWikiSearchResults = function(search_term){
                $scope.fillWikiSearchResults($scope.wikiSearchResultsTotalBackup);
                $scope.wikiTotalItems = $scope.wikiSearchResultsTotal.length;

                var filteredArray = [];
                var term = search_term.toLowerCase().split(" ");

                for(var i=0; i<$scope.wikiSearchResultsTotal.length; i++){
                    var found = false;

                    for(var k=0; k<term.length; k++){
                        if($scope.wikiSearchResultsTotal[i]['title'].toLowerCase().includes(term[k]) || $scope.wikiSearchResultsTotal[i]['description'].toLowerCase().includes(term[k])){
                            found = true;
                        }
                        else{
                            found = false;
                            break;
                        }
                    }

                    if(found){
                        filteredArray.push($scope.wikiSearchResultsTotal[i]);
                    }
                }

                if(filteredArray.length > 0) {
                    $scope.fillWikiSearchResults(filteredArray);
                    $scope.wikiTotalItems = $scope.wikiSearchResultsTotal.length;
                }
                else if(term.length > 0){
                    $scope.fillWikiSearchResults([]);
                    $scope.wikiTotalItems = $scope.wikiSearchResultsTotal.length;
                }
            }

            $scope.init();

        }
    ])
/**
 * Controller to add and edit a datasource
 */
    .controller('EventConfigController', [
        '$scope',
        '$window',
        '$route',
        '$log',
        '$http',
        'API_CONF',
        function ($scope, $window, $route, $log, $http, API_CONF) {
            $scope.showContent = function ($fileContent) {
                $scope.content = $fileContent;
            };
            $scope.ex_added = function () {
                $window.alert("Script added!");
                $route.reload();
            };
            $scope.post = function () {
                //$log.info($scope.modul.name);
                //$log.info($scope.content);
                $http.post(API_CONF.EVENTS_MANAGER_URL + '/configextractor', {
                    name: $scope.modul.name,
                    script: $scope.content
                }).then(function (response) {
                    if (response) {
                        $scope.ex_added = function () {
                            $window.alert("Script added!");
                            $route.reload();
                        };
                    }
                    // this callback will be called asynchronously
                    // when the response is available
                }, function (response) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
            }
        }
    ])
/**
 * Directive to read files
 */
    .directive('onReadFile', function ($parse) {
        return {
            restrict: 'A',
            scope: false,
            link: function (scope, element, attrs) {
                var fn = $parse(attrs.onReadFile);

                element.on('change', function (onChangeEvent) {
                    var reader = new FileReader();

                    reader.onload = function (onLoadEvent) {
                        scope.$apply(function () {
                            fn(scope, {$fileContent: onLoadEvent.target.result});
                        });
                    };

                    reader.readAsText((onChangeEvent.srcElement || onChangeEvent.target).files[0]);
                });
            }
        };
    });
