/**
 * <pc-visualization ng-if="visualization.id" visualization-id="{{visualization.id}}"></pc-visualization>
 * <pc-visualization visualization-id="9"></pc-visualization>
 * <pc-visualization visualization-id="9" small></pc-visualization>
 * <pc-visualization visualization-id="9" data-small></pc-visualization>
 * <pc-visualization visualization-id="9" x-small></pc-visualization>
 * <pc-visualization visualization-id="9" small="true"></pc-visualization>
 */

angular.module('pcApp.visualization.directives.visualizationDirective', [
])
    .directive('pcVisualization', [
        function () {
            var controller = function ($scope, $attrs, $controller, $routeParams) {
                if ($attrs.hasOwnProperty('small')) {
                    $scope.idvisulist = $scope.visualizationId;
                }
				else if ($routeParams.size) {
					
					if ($routeParams.size.toUpperCase()=='SMALL') {					
						$scope.idvisulist = $scope.visualizationId;
					}
				}
                
                $routeParams.visualizationId = $scope.visualizationId;
                $scope.randomID = Math.floor(Math.random()*16777215);
                $controller('VisualizationsEditController', { $scope: $scope });
            };
            return {
                restrict: 'EA',
                controller: ['$scope', '$attrs', '$controller', '$routeParams', controller],
                scope: {
                    visualizationId: "@"
                },
                templateUrl: 'modules/visualization/partials/graph.html'
            };
        }
    ]);
