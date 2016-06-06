//angular.module("myEnter", []).directive('myEnter', function () {
//    return function (scope, element, attrs) {
//        element.bind("keydown keypress", function (event) {
//            if(event.which === 13) {
//                scope.$apply(function (){
//                    scope.$eval(attrs.myEnter);
//                });
//
//                event.preventDefault();
//            }
//        });
//    };
//});

angular.module("allowPattern", []).directive("allowPattern", [allowPatternDirective]);

//                    http://codepen.io/TheLarkInn/pen/GgbrWr?editors=101

function allowPatternDirective() {
	return {
		restrict: "A",
		compile: function(tElement, tAttrs) {
			return function(scope, element, attrs) {
        // I handle key events
				element.bind("keypress", function(event) {
					var keyCode = event.which || event.keyCode; // I safely get the keyCode pressed from the event.
					var keyCodeChar = String.fromCharCode(keyCode); // I determine the char from the keyCode.
                    var newPattern = "";var secondPattern = "single";
                    if (attrs.allowPattern === "currency") {
                        newPattern = "[0-9]";
//                        secondPattern = "[.]";
                    } else if (attrs.allowPattern === "size") {
                        newPattern = "[0-9]";
                        secondPattern = "[x]"
                    } else if (attrs.allowPattern === "numeric") {
                        newPattern = "[0-9]";
                        secondPattern = "[.]";
                    } else if (attrs.allowPattern === "url") {
                        newPattern = "[a-z0-9]";
                        secondPattern = "[_]";
                    } else {
                        newPattern = attrs.allowPattern;
                    }
                    if (!keyCodeChar.match(new RegExp(newPattern, "i")) && !keyCodeChar.match(new RegExp(secondPattern, "i"))) {event.preventDefault();return false;}
				});
			};
		}
	};
}

angular.module('dynamicImage', []).directive('dynamicImage', [dynamicImageDirective]);

function dynamicImageDirective(){
    return {
        restrict: 'A',
        link: function(scope, elem, attr) {
            elem.bind('load', function() {
                var w = this.width;
                var h = this.height;
                if (w > h) {
                    $(this).addClass('landscape-image');
                    // this.height = $(this).parent().width()* 1.5;
                    // $(this).css('height', 'auto');
                } else {
                    // this.height = $(this).parent().height();
                    // $(this).css('width', 'auto');
                    $(this).addClass('portrait-image');
                }
            });
            elem.bind('error', function(){

            });
        }
    };
}

//angular.module("allowPattern", []).directive("allowPattern", function() {
//    return function allowPatternDirective() {
////    function allowPatternDirective() {
//        return {
//            restrict: "A",
//            compile: function(tElement, tAttrs) {
//                return function(scope, element, attrs) {
//            // I handle key events
//                    element.bind("keypress", function(event) {
//                        var keyCode = event.which || event.keyCode; // I safely get the keyCode pressed from the event.
//                        var keyCodeChar = String.fromCharCode(keyCode); // I determine the char from the keyCode.
//
//              // If the keyCode char does not match the allowed Regex Pattern, then don't allow the input into the field.
//                        if (!keyCodeChar.match(new RegExp(attrs.allowPattern, "i"))) {
//                event.preventDefault();
//                            return false;
//                        }
//
//                    });
//                };
//            }
////	   };
//        }
//    }
//})


//angular.module("allowPattern", [])..directive('allowPattern', [allowPatternDirective]);
//                                   
//function allowPatternDirective() {
//	return {
//		restrict: "A",
//		compile: function(tElement, tAttrs) {
//			return function(scope, element, attrs) {
//        // I handle key events
//				element.bind("keypress", function(event) {
//					var keyCode = event.which || event.keyCode; // I safely get the keyCode pressed from the event.
//					var keyCodeChar = String.fromCharCode(keyCode); // I determine the char from the keyCode.
//          
//          // If the keyCode char does not match the allowed Regex Pattern, then don't allow the input into the field.
//					if (!keyCodeChar.match(new RegExp(attrs.allowPattern, "i"))) {
//            event.preventDefault();
//						return false;
//					}
//          
//				});
//			};
//		}
//	};
//}