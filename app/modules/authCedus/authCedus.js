var authCedus = angular.module('pcApp.authCedus', [
    'pcApp.authCedus.controllers.authCedus', 'pcApp.authCedus.services.authCedus',
]);


authCedus.config(function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/logincedus/', {
            controller: 'loginceduscontroller',
            templateUrl: 'modules/authCedus/partials/login.html'
        })
        .when('/logincedusck', {
            controller: 'callbackloginceduscontroller',
            templateUrl: 'modules/authCedus/partials/logincedusck.html'
        })
        
        ;    
       
       //http://localhost:9000/app/#!/logincedusck?state=CEDUS&code=kERupSezMomazJtKZphL2A8oefHf0F
       // use the HTML5 History API
        //$locationProvider.html5Mode(true);
        
            
});
