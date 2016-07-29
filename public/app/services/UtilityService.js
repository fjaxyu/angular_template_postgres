(function (angular) {
    angular
        .module('utilities').factory('UtilityService', function ($http, AdminService, $q, $timeout, UserService, $sessionStorage, $location, $log, $window, Upload, $rootScope) {
            var Utility = {};
            $rootScope.userMessage = {};
            var user;

            if (UserService.isLoggedIn()) {
                user = UserService.get();
            }

            //Capitalizes the first letter of each word
            //Params: 
            //      string = a word or sentence
            //Created By: Wesley Braithwaite - 05/01/2016
            //Last changed by: Wesley Braithwaite - 05/28/2016
            //      explanation of change: 
            Utility.capitalizeEach = function (string) {
                string = string.toLowerCase();
                return string.replace(/(?:^|\s)\S/g, function (a) {
                    return a.toUpperCase();
                });
            };


            Utility.showMessage = function (type, message, length) {
                if (length == null) {
                    length = 3000;
                }

                if (type == null) {
                    console.log('No type was defined');
                    return;
                } else if (message == null) {
                    console.log('No message was defined');
                } else {
                    $rootScope.userMessage[type] = message;
                    console.log($rootScope.userMessage);

                    $timeout(function () {
                        $rootScope.userMessage[type] = undefined;
                    }, length);
                }
            };

            //Changes the state of the controller page
            //Params:
            //      state = the string of the state that you want to show. 'update' and 'dashboard' are generally used
            //      title = the title to be displayed during the loading template page
            //      set (optional) = defaults to creating a new time, if it is set to false it will skip this feature [this is used together with the finishedLoading function to create a minimum amount of time that the loading window will be displayed]
            //      message (optional) = defaults to empty message
            //      sub (optional) = defaults to empty submessage
            //Created By: Wesley Braithwaite - 06/30/2016
            //Last changed by: Wesley Braithwaite - 06/30/2016
            //      explanation of change: created
            Utility.state = function (state, title, set, message, sub) {
                if (state == null) {
                    console.log('state is undefined');
                    return;
                } else if (title == null) {
                    console.log('title is undefined');
                    return;
                }

                if (set == null || set === true) {
                    $rootScope.min_time = new Date().getTime();
                }

                $rootScope.state = state;
                $rootScope.message = {
                    title: title,
                    message: message || '',
                    subMessage: sub || ''
                };
            };


            //Finishes loading the page from the initial display and uses a built in minimum time function
            //Params:
            //      state = the string of the state that you want to show. 'dashboard' is generally used here
            //Created By: Wesley Braithwaite - 06/30/2016
            //Last Changed By: Wesley Braithwaite - 06/30/2016
            //      Explanation of change: created
            Utility.finishLoading = function (state) {
                var minTime = 1000;
                if (state == null) {
                    console.log('state is undefined');
                    $rootScope.message = {
                        title: 'Error',
                        message: 'Please try refreshing the page',
                        subMessage: 'If this error persists, please send feedback about the current page you are using'
                    };
                    return;
                }

                var currentTime = new Date().getTime();
                var timeElapsed = currentTime - $rootScope.min_time;
                var timeRemaining;
                if (timeElapsed >= minTime) {
                    timeRemaining = 0;
                } else {
                    timeRemaining = minTime - timeElapsed;
                }
                //console.log('time elapsed: ' + timeElapsed + '; Time remaining: ' + timeRemaining + '.');
                $timeout(function () {
                    $rootScope.state = state;
                }, timeRemaining);
            };


            //Returns a duplicate of the object passed to it
            //Params:
            //      obj = a simple object
            //      type = having any value except null will return a copy of an array
            //Created By: Wesley Braithwaite - 06/18/2016
            //      explanation of change: 
            Utility.copyObject = function (obj, type) {
                if (type == null || type === 'object') {
                    return jQuery.extend(true, {}, obj);
                } else if (type === 'array') {
                    return obj.slice();
                } else {
                    $log.error = 'UtilityService.copyObject: No type was specified.';
                    return;
                }
            };


            //returns a lowercase version of the word
            //Params: 
            //      string = a word or sentence
            //Created By: Wesley Braithwaite - 05/01/2016
            //Last changed by: Wesley Braithwaite - 05/28/2016
            //      explanation of change: 
            Utility.lc = function (string) {
                return string.toLowerCase();
            };



            //Sets an ID on the current page to the focus
            //Params: 
            //      id = the name of the id of the input you want to set focus to
            //Created By: Wesley Braithwaite - 06/04/2016
            //Last changed by: Wesley Braithwaite - 06/04/2016
            //      explanation of change: 
            Utility.focus = function (id, time) {
                if (time == null) {
                    time = 0;
                }

                $timeout(function () {
                    var element = $window.document.getElementById(id);
                    if (element) {
                        element.focus();
                    }
                }, time);
            };


            //Changes the users window to the defined path
            //Params:
            //      path = location of the destination
            //      refresh = if true, a full-refresh will be done
            //Created By: Wesley Braithwaite - 05/01/2016
            //Last changed by: Wesley Braithwaite - 05/28/2016
            //      explanation of change: 
            Utility.location = function (path, refresh) {
                if (typeof refresh !== 'undefined' && refresh === true) {
                    $window.location.replace(path);
                } else {
                    $location.path(path);
                }
            };


            //Returns the current day
            //Params:
            //      type = 'text' will return today's date in 'MM/DD/YYYY' format, else it returns a date object with no time
            //Created By: Wesley Braithwaite - 05/01/2016
            //Last changed by: Wesley Braithwaite - 05/28/2016
            //      explanation of change: 
            Utility.getToday = function (type) {
                var dateObj = new Date();
                var month = dateObj.getUTCMonth();
                var day = dateObj.getUTCDate();
                var year = dateObj.getUTCFullYear();
                var string = '';

                if (month + 1 < 10) {
                    string = '0' + (month + 1);
                } else {
                    string = (month + 1);
                }

                if (day < 10) {
                    string = string + '/0' + day + '/' + year;
                } else {
                    string = string + '/' + day + '/' + year;
                }

                var myDateFormat = new Date(year, month, day);
                if (type === 'text') {
                    return string;
                } else {
                    return myDateFormat;
                }
            };


            Utility.getDate = function (text, type) {
                var dateObj = new Date(text);
                var month = dateObj.getUTCMonth();
                var day = dateObj.getUTCDate();
                var year = dateObj.getUTCFullYear();
                var string = '';

                if (month + 1 < 10) {
                    string = '0' + (month + 1);
                } else {
                    string = (month + 1);
                }

                if (day < 10) {
                    string = string + '/0' + day + '/' + year;
                } else {
                    string = string + '/' + day + '/' + year;
                }

                var myDateFormat = new Date(year, month, day);
                if (type === 'text') {
                    return string;
                } else {
                    return myDateFormat;
                }
            };


            //Deletes any images of any time, removing them from S3 and the database
            //Params:
            //      image_ids = an array of image_ids
            //      change = if false, it will automatically return a resolve message, if true, it will make the API call
            //      type = this defines what type of images will be deleted ['product', 'gallery', 'profile']
            //      id = this defines the entity_id of the images [product_id, gallery_id, user_id]
            //      quantity = if quantity is 'all' then this will delete all images of type with an entity_id of id, regardless of what is in image_ids
            //Created By: Wesley Braithwaite - 05/01/2016
            //Last changed by: Wesley Braithwaite - 05/28/2016
            //      explanation of change: 
            Utility.deleteImages = function (image_ids, change, type, id, quantity) {
                if (change === false) {
                    return $q(function (resolve, reject) {
                        resolve('complete - no images');
                    });
                } else {
                    return $http({
                        headers: {
                            'x-access-token': user.token
                        },
                        url: 'api/v1/deleteImages',
                        method: 'POST',
                        data: {
                            images: image_ids,
                            type: type,
                            id: id,
                            quantity: quantity
                        }
                    }).then(function successCallback(response) {
                        return response;
                    });
                }
            };


            //This uploades images of any type to their corresponding type
            //Params:
            //      files - this contains the image files
            //      change - if this is 'true' it will make the API call, else it will resolve the query and return to controller
            //      type - this defines the entity_type of the image: [product, gallery, user]
            //      id - this defines the entity_id of the entity_type [product_id, gallery_id, user_id]
            //Created By: Wesley Braithwaite - 05/01/2016
            //Last changed by: Wesley Braithwaite - 05/28/2016
            //      explanation of change: 
            Utility.uploadImages = function (files, change, type, id) {
                if (change === false) {
                    return $q(function (resolve, reject) {
                        resolve('complete - no images');
                    });
                } else {
                    return Upload.upload({
                        headers: {
                            'x-access-token': user.token,
                        },
                        url: '/api/v1/uploadImages',
                        data: {
                            file: files,
                            user: user,
                            entity_type: type,
                            entity_id: id
                        },
                        progress: function (e) {}
                    }).then(function (data, status, headers, config) {
                        return data;
                    });
                }
            };


            //This sets the current page title and checks if the page requires a login
            //Params:
            //      title - a string of the title
            //      required - if true, this will redirect users that are not logged in
            //      type - 'user' or 'admin'. if undefined, it will process the redirect as a user. if admin, it will redirect as an admin page.
            //Created By: Wesley Braithwaite - 05/01/2016
            //Last changed by: Wesley Braithwaite - 05/28/2016
            //      explanation of change: 
            Utility.setPage = function (title, required, type) {
                return $q(function (resolve, reject) {
                    $rootScope.pageTitle = title;
                    if (required === true) {
                        if (typeof type === 'undefined') {
                            UserService.redirectUser().then(function (data) {
                                resolve(data);
                            });
                        } else if (type === 'admin') {
                            AdminService.redirect().then(function () {
                                resolve('complete');
                            });
                        } else {
                            UserService.redirectUser().then(function (data) {
                                resolve(data);
                            });
                        }
                    } else {
                        resolve('okay');
                    }
                });
            };

            return Utility;
        });
})(angular);
