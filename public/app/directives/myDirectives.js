angular.module('UtilityDirectives').directive('loadingTemplate', function () {
    return {
        restrict: 'EA',
        templateUrl: '/app/directives/templates/loadingTemplate.html'
    };
});

angular.module('UtilityDirectives').directive('req', function () {
    return {
        restrict: 'EA',
        templateUrl: '/app/directives/templates/req.html'
    };
});

angular.module('UtilityDirectives').directive('messages', function () {
    return {
        restrict: 'EA',
        scope: {
          message: '='  
        },
        templateUrl: '/app/directives/templates/messages.html'
    };
});

angular.module('UtilityDirectives').directive('paddedCard', function () {
    var link = function (scope, element, attrs) {
        
    };
    return {
        restrict: 'EA',
        transclude: true,
        link: link,
        scope: {
            padding: '=', //'medium', 'small' -- defaults to a large padding
            background: '=', //a color value like 'white' or '#eee'
            round: '=', //a value of true will round the corners
            fit: '=',   //a value of true will fit the card to the contents instead of 100%
            float: '=', //the direction of the card
            bottom: '=', //a value of false will hide this piece
            height: '=' //the height of the card
        },
        templateUrl: '/app/directives/templates/paddedCard.html'
    };
});

angular.module('UtilityDirectives').directive('lb', function () {
    return {
        restrict: 'EA',
        transclude: true,
        templateUrl: '/app/directives/templates/lineBreak.html'
    };
});

angular.module('UtilityDirectives').directive('responsiveTable', function () {
    var link = function (scope, element, attrs) {
        scope.changeFilter = function (value) {
            if (scope.predicate === value && scope.reverse === 0) {
                scope.reverse = 1;
            } else if (scope.predicate === value && scope.reverse === 1) {
                scope.reverse = 0;
            } else {
                scope.predicate = value;
                scope.reverse = 0;
            }
        };
    };

    return {
        restrict: 'EA',
        //transclude: true,
        scope: {
            rows: '=',
            columns: '=',
            rowClick: '=',
            rowValue: '=',
            predicate: '=',
            reverse: '='
        },
        link: link,
        templateUrl: '/app/directives/templates/responsiveTable.html'
    };
});

angular.module('UtilityDirectives').directive('helperText', function () {
    var link = function (scope, element, attrs) {
        console.log(scope.focus);
        console.log(scope.htName);
    };

    return {
        scope: {
            htName: '=',
            focus: '='
        },
        restrict: 'EA',
        link: link,
        transclude: true,
        templateUrl: '/app/directives/templates/helperText.html'
    };
});

angular.module('UtilityDirectives').directive('transitionWindow', function () {
    var link = function (scope, element, attrs) {
        setTimeout(function () {
            console.log(scope.myShow);
            console.log(scope.z);
            console.log(scope.show);
            console.log(scope.return);
            console.log(scope.enter);
            console.log(scope.leave);
            console.log(scope.returnLeave);
        }, 3000);
    };

    return {
        scope: {
            myShow: '@myShow',
            z: '@z',
            show: '=',
            return: '=',
            enter: '=',
            leave: '=',
            returnLeave: '='
        },
        restrict: 'EA',
        link: link,
        transclude: true,
        templateUrl: '/app/directives/templates/transitionWindow.html'
    };
});


angular.module('UtilityDirectives').directive('eventFocus', function (focus) {
    return function (scope, elem, attr) {
        elem.on(attr.eventFocus, function () {
            focus(attr.eventFocusId);
        });

        // Removes bound events in the element itself
        // when the scope is destroyed
        scope.$on('$destroy', function () {
            element.off(attr.eventFocus);
        });
    };
});

angular.module('UtilityDirectives').directive('slideable', function () {
    return {
        restrict: 'C',
        transclude: true,
        template: '<div class="slideable_content" ng-transclude></div>'
    };
});

angular.module('UtilityDirectives').directive('slideToggle', function () {
    return {
        restrict: 'A',
        scope: {
            slideToggle: '=',
            data: '='
        },
        link: function (scope, element, attrs) {
            var target = document.querySelector(attrs.slideToggle);
            attrs.expanded = false;
            var item = $('#' + attrs.slideToggle);
            item.hide();

            element.bind('click', function () {
                item.slideToggle();
                attrs.expanded = !attrs.expanded;
            });
        }
    };
});
