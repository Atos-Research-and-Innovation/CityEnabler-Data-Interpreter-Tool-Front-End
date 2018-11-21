/**
 * Directive for using Dropzone.js in an AngularJS project.
 *
 * Based on angular-dropzone https://github.com/sandbochs/angular-dropzone/blob/master/lib/angular-dropzone.js
 * But implemented again, because source are not maintained
 */

angular.module('pcApp.datasets.directives.orioncontextbrockerImport', []).directive('orioncontextbrockerImport', [
    '$http', 'ngProgress', 'API_CONF', 'dialogs', '$location', '$anchorScroll', '$routeParams', 'creationService', '$filter', function ($http, ngProgress, API_CONF, dialogs, $location, $anchorScroll, $routeParams, creationService, $filter) {
        return {
            restrict: 'A',
            templateUrl: function (el, attrs) {
                return 'modules/datasets/partials/orioncontextbrocker-import.html';
            },
            scope: {
                'loadData': '=',
                'hidemaindiv': '='
            },
            link: function (scope, element, attrs, ctrls) {
            	
                scope.itemsPerPage = 10;
                scope.start = 0;
                scope.currentPage = 1;
				
				scope.dataset = creationService.data.dataset;
				
				scope.init = function () {
					scope.subscription_throttling_period = 'S';
					scope.create_subscription_step1 = true;
					scope.create_subscription_step2 = false;
					scope.create_subscription_step3 = false;						
					scope.selectedEntity = '';
				}

				scope.init();
				
				scope.hideDiv = function() {
					
                	var label = $filter('translate')('Are you sure?');
                	//var message = $filter('translate')('Do you really want to clear the Dataset Content?');
                	message = $filter('translate')('Do you really want to cancel the creation of this subscription?');
                
                	var dlg = dialogs.confirm(label, message);
                	
                	dlg.result.then(function () {					
						scope.hidemaindiv();
						scope.init();
						
                	});						
				}
				
				scope.nextSubscriptionStep = function(nextstep, entitySelected) {
					scope.create_subscription_step1 = false;
					scope.create_subscription_step2 = false;
					scope.create_subscription_step3 = false;
					
					if (nextstep==1) {
						scope.create_subscription_step1 = true;
					}
					else if (nextstep==2) {
						scope.create_subscription_step2 = true;
						
						if (entitySelected) {
							scope.selectedEntity = entitySelected
							//console.log(scope.selectedEntity)
						}
					}
					else if (nextstep==3) {
						scope.create_subscription_step3 = true;
					}
					else if (nextstep==4) {
						scope.create_subscription_step3 = false;
						
						dataset = {};
						dataset.title = scope.selectedEntity.id;
						
						resource = {};
						resource.name = scope.selectedEntity.id;
						resource.description = scope.selectedEntity.description.value;
						
						
						response = [];
						response.data = [];		
						response.data['result'] = [];	
						
						var fullIntTime = [];
						fullIntTime = scope.selectedEntity.dateModified.value.split('T')
						
						//console.log(fullIntTime);
						var  initTime = [];
						initTime  = fullIntTime[0].split('-');
						
						var dateToSet = '';
						if (scope.selectedEntity.calculationFrequency.value=='yearly') {
							dateToSet = initTime[0];
							calculationFrequency = "year";
						}
						else if (scope.selectedEntity.calculationFrequency.value=='monthly') {
							dateToSet = initTime[0]+"-"+initTime[1];
							calculationFrequency = "month";
						}
						else if (scope.selectedEntity.calculationFrequency.value=='daily') {
							dateToSet = initTime[0]+"-"+initTime[1]+"-"+initTime[2];
							calculationFrequency = "day";
						}
			
						response.data['result'].push(['', dateToSet]);						 

						response.data['result'].push([scope.selectedEntity.category.value, scope.selectedEntity.kpiValue.value]); 
						
						//console.log("subscription_duration_number");
						//console.log(scope.subscription_duration_number);
						//console.log("scope.subscription_duration_period");
						//console.log(scope.subscription_duration_period);
						
						subscriptionDuration = "P"+scope.subscription_duration_number+""+scope.subscription_duration_period;
						
						//console.log("subscription_throttling_number");
						//console.log(scope.subscription_throttling_number);
						//console.log("scope.subscription_throttling_period");						
						//console.log(scope.subscription_throttling_period);
						
						//subscriptionThrottling = "PT"+scope.subscription_throttling_number+""+scope.subscription_throttling_period;
						subscriptionThrottling = "PT10S";
						
						//console.log(scope.selectedEntity.id);
						
						entityDataToPost = {
							"entities": [{"id": scope.selectedEntity.id, "type": API_CONF.ORION_CONTEXT_BROKER_KPI_TYPE, "isPattern": "false"}],
							"reference": API_CONF.ORION_CONTEXT_BROKER_ENDPOINT_TO_SET,
							"duration": subscriptionDuration,
							"notifyConditions": [{"type": "ONCHANGE","condValues": ["dateModified"]}],
							"throttling": subscriptionThrottling}
						
						$http({
            				method: 'POST',
                			url: API_CONF.DATASETS_MANAGER_URL+"/cedus/postSubscriptionContextBrocker",
                			params: {'endpoint':API_CONF.ORION_CONTEXT_BROKER_URL_SUBSCRIBE_CONTEXT, 'fiware-service': API_CONF.ORION_CONTEXT_BROKER_FIWARE_SERVICE, 'fiware-servicepath': API_CONF.ORION_CONTEXT_BROKER_FIWARE_SERVICEPATH},
                			data: entityDataToPost
            			}).then(function (responsePOST) {
							//console.log("responsePOST");
            				//console.log(responsePOST);
            				//console.log("subscriptionId");
            				//console.log(responsePOST.data.subscribeResponse.subscriptionId)
            				
            				var subscriptionId = responsePOST.data.subscribeResponse.subscriptionId;
							//scope.cedusnodes = response.data.nodes;

							
							response.data['subscriptionId'] = subscriptionId;
							response.data['frequency'] = calculationFrequency;
							response.data['time_start'] = dateToSet;
							response.data['time_end'] = dateToSet;

							scope.loadData(dataset, resource, response.data);
														
                        	/*
                        	var label = "Subscription created";
                			//var message = $filter('translate')('Please contact the Administrators.');
                    		var message = "The subscription "+subscriptionId+" has been created.";
                    		dialogs.notify(label, message);
                    		*/
                                        
														
							$location.path('/datasets/create/dimension')
							
            			}
            			, function errorCallback(response) {
							
							console.log("error creating subscription")
	                        var label = $filter('translate')('Internal Server Error');
                			var message = $filter('translate')('Please contact the Administrators.');                    		
                    		dialogs.error(label, message);


						}
            		);						
						
					} 
				}
				
				scope.entities = [];
				
				scope.enpointOrionCB = API_CONF.ORION_CONTEXT_BROKER_URL
				scope.typeEntityFilter = API_CONF.ORION_CONTEXT_BROKER_KPI_TYPE;
				
            	$http({
            		method: 'GET',
                	url: API_CONF.DATASETS_MANAGER_URL+"/cedus/getEntitiesContextBrocker",
                	params: {'endpoint':API_CONF.ORION_CONTEXT_BROKER_URL_GET_ENTITIES+'?type='+API_CONF.ORION_CONTEXT_BROKER_KPI_TYPE, 'fiware-service': API_CONF.ORION_CONTEXT_BROKER_FIWARE_SERVICE, 'fiware-servicepath': API_CONF.ORION_CONTEXT_BROKER_FIWARE_SERVICEPATH}
            	}).then(function (response) {
            		//console.log(response);
					//scope.cedusnodes = response.data.nodes;

					//angular.forEach(response.data.nodes, function (value, key) {
					angular.forEach(response.data, function (value, key) {
						//if (value.nodeState=='ONLINE') {
							//console.log(value);
							scope.entities.push(value);
						//}
					})
					
					
					
            	}
            	, function errorCallback(response) {
					// called asynchronously if an error occurs
					// or server returns response with an error status.
					scope.entities = [];
					}
            	);
				
				

				
            }
        }
    }
]);
