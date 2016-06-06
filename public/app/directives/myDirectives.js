angular.module('UtilityDirectives').directive('loadingTemplate', function () {
    //    include <loading-template></loading-template> in your html files
    return {
        restrict: 'EA',
        templateUrl: '/app/directives/templates/loadingTemplate.html'
    };
});

angular.module('UtilityDirectives').directive('paddedCard', function () {
    //    include <padded-card></padded-card> in your html files
    return {
        restrict: 'EA',
        transclude: true,
        templateUrl: '/app/directives/templates/paddedCard.html'
    };
});

angular.module('UtilityDirectives').directive('lb', function () {
    //    include <lb></lb> in your html files to create a line-break
    return {
        restrict: 'EA',
        transclude: true,
        templateUrl: '/app/directives/templates/lineBreak.html'
    };
});