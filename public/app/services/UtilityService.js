(function (angular) {
    angular
        .module('artlineup.utilities').factory('UtilityService', function ($http, $q, $timeout, UserService, $sessionStorage, $location, $window, Upload, $rootScope) {
            var Utility = {};
            var user = UserService.get();

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
                            console.log('admin');
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
