angular.module('pcApp.datasets.directives.snippets', [
    'pcApp.datasets.services.dataset', 'ngStorage'
])

    .directive('datasetCreateHeader', [
        '$log',
        '$location',
        '$rootScope',
        'creationService',
        '$route',
        'dialogs',
        'Auth',
        '$filter',
        function ($log, $location, $rootScope, creationService, $route, dialogs, Auth, $filter) {
            return {
                restrict: 'AEC',
                scope: {
                    step: '@',
                    beforeNextStep: '&',
                    beforePrevStep: '&',
                    save: '=',
                    dataset: '=',
                    orion: '='
                },
                templateUrl: 'modules/datasets/partials/header.html',
                controller: function ($scope, $element, $attrs) {

                    $scope.userState = Auth.state;
					
					var step3_help_text = 'help_step3_create_dataset';
					var step3_warning_text = 'help_step3_warning_message_header';
					
					if ($scope.dataset) {
						if ($scope.dataset.subscriptionId) {
						
							step3_help_text = 'help_step3_create_dataset_CB';
							step3_warning_text = 'help_step3_warning_message_header_CB';
						}							
					}
					
                    var steps = {
                        1: {
                            //'title': 'Step 1 - Provide Source Data',
                            //'help': 'Provide your source data, either by typing or copying it into the data grid ' + 'or by uploading a file (CSV, XLS, XLSX). You can easily pre-edit your data here. ' + 'A right click into the sheet offers you more options.',
                            'title': 'title_step1_create_dataset',
                            'help': 'help_step1_create_dataset',
                            'warning_header': 'help_step1_warning_message_header',
                            'warning_rule1': 'help_step1_warning_message_rule1',
                            'warning_rule2': 'help_step1_warning_message_rule2',
                            'warning_rule3': 'help_step1_warning_message_rule3',
                            'warning_rule4': 'help_step1_warning_message_rule4',
                            'prev': null,
                            'next': '/datasets/create/dimension'
                        },
                        2: {
                            //'title': 'Step 2 - Define the Dimensions',
                            //'help': 'Your data refers to a specific dimension type, e.g. countries. Please select your dimension type. ' + 'The instances for a dimension type, e.g. France for type Country are called dimensions. ' + 'Pick the corresponding cells in the source data which represent your dimensions. Furthermore you can add specific ' + 'metadata in order to describe your dataset in more detail. For example: Create a dataset for several countries, but just refering to women. ' + 'If you want to refer to men as well you need to create another dataset. ',
                            'title': 'title_step2_create_dataset',
                            'help': 'help_step2_create_dataset',
                            'prev': '/datasets/create',
                            'next': '/datasets/create/time'
                        },
                        3: {
                            //'title': 'Step 3 - Define Time Resolution, Start and End Date',
                            //'help': 'Your dataset will provide data over a specific time range. ' + 'Please select the time resolution and pick the start and end date from your source data. ',
                            'title': 'title_step3_create_dataset',
                            'help': step3_help_text,
                            'warning_header': step3_warning_text,
                            'prev': '/datasets/create/dimension',
                            'next': '/datasets/create/data'
                        },
                        4: {
                            //'title': 'Step 4 - Provide the Values',
                            //'help': 'Now please provide the actual data for each dimesion and time period by selecting it ' + 'in the source data and adding it to the target table. If your data is already in the same format' + ' like the target table you can select the "Table Mode" to copy everything in one step.',
                            'title': 'title_step4_create_dataset',
                            'help': 'help_step4_create_dataset',
                            'prev': '/datasets/create/time',
                            'next': '/datasets/create/indicator'
                        },
                        5: {
                            //'title': 'Step 5 - Set Unit',
                            //'help': 'Please provide the unit your values are in.',
                            'title': 'title_step5_create_dataset',
                            'help': 'help_step5_create_dataset',
                            'prev': '/datasets/create/data',
                            'next': '/datasets/create/preview'
                        },
                        6: {
                            //'title': 'Step 6 - Preview and Manual Editing',
                            //'help': 'Congratulations, you can now see the resulting.' + 'If you require any changes, go back to any of the previous steps and make amendments/changes as required.' + 'You can also edit the values of the dataset right here. ',
                            'title': 'title_step6_create_dataset',
                            'help': 'help_step6_create_dataset',
                            'prev': '/datasets/create/indicator',
                            'next': '/datasets/create/metadata'
                        },
                        7: {
                            'title': 'Step 7 - Metadata',
                            'help': 'Please provide additional metadata to describe the dataset further. ' + 'This allows users to easily understand what the data is and the full ' + 'provenance and context of the data.',
                            'title': 'title_step7_create_dataset',
                            'help': 'help_step7_create_dataset',
                            'prev': '/datasets/create/preview',
                            'next': null
                        }
                    };
                    $scope.stepData = steps[$scope.step];

                    $scope.nextStep = function () {
                        var result = $scope.beforeNextStep();
                        if (result != false) {
                            $location.path(steps[$scope.step].next);
                        }

                    };

                    $scope.prevStep = function () {
                        $scope.beforePrevStep();
                        $location.path(steps[$scope.step].prev);
                    };

                    $scope.cancel = function () {
                    	
                    	var label = $filter('translate')('Are you sure?');
                		var message = $filter('translate')('All your provided data will be cleared.');
                
                        //var dlg = dialogs.confirm("Are you sure?", "All your provided data will be cleared.");
                        var dlg = dialogs.confirm(label, message);
                        
                        dlg.result.then(function () {
                            creationService.reset();
                            $location.path('/datasets/create');
                            $route.reload();
                        });
                    };

                    $scope.saveFinish = function () {
                        $scope.save.saveFinish();
                    };

                    $scope.saveCopy = function () {
                        $scope.save.saveCopy();
                    }
                }
            }
        }
    ])

    .directive('datasetCreateWrapper', [
        '$log', function ($log) {
            return {
                restrict: 'AEC',
                transclude: true,
                scope: {},
                template: '<div class="container container-create-dataset" id="container-create-dataset" ng-transclude></div>',
                controller: function ($scope, $element, $attrs) {

                }
            }
        }
    ]);
