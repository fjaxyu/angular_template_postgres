(function (angular) {
    angular.module('artlineup.utilities').controller('PaymentController', function ($scope, $location, $rootScope, $sessionStorage, UserService, GalleryService, ProductService, $timeout, $q, $routeParams, UtilityService) {

        var id = $routeParams.id || 'all';
        var type = $routeParams.type || 'all';

        $scope.state = 'update';
        $scope.message = {
            title: 'Loading Gallery',
            message: '',
            subMessage: ''
        };

        //min loading time
        var min_time = false;

        $timeout(function () {
            min_time = true;
        }, 500);

        var finishLoading = function (state) {
            if (min_time === false) {
                $timeout(function () {
                    $scope.state = state;
                }, 500);
            } else {
                $scope.state = state;
            }
        };

        $scope.predicate = {};
        $scope.reverse = {};
        $scope.newPayment = {};

        $scope.paymentButton = 'Add Payment';

        $scope.selectedItems = {};
        $scope.selectedItems.products = [];

        $scope.sort = function (value, type) {
            if ($scope.predicate[type] === value && $scope.reverse[type] === 0) {
                $scope.reverse[type] = 1;
            } else if ($scope.predicate[type] === value && $scope.reverse[type] === 1) {
                $scope.reverse[type] = 0;
            } else {
                $scope.predicate[type] = value;
                $scope.reverse[type] = 0;
            }
        };

        UtilityService.setPage('Payment', true).then(function (response) {
            GalleryService.getGalleryByID('all').then(function (response) {
                console.log(response);

                $scope.predicate.gallery = 'name';
                $scope.reverse.gallery = true;

                $scope.galleries = [];
                response.data.forEach(function (v, i) {
                    if (i + 1 === response.data.length) {
                        $scope.finalGallery = true;
                    }
                    if (v.gallery_details != null && v.gallery_details.total_due > 0) {
                        $scope.galleries.push(v.gallery);
                        i = $scope.galleries.length - 1;
                        $scope.galleries[i].gallery_details = v.gallery_details;
                        $scope.galleries[i].quantities = v.quantities;
                        $scope.galleries[i].show = true;
                    }


                    if ($scope.finalGallery === true) {
                        console.log($scope.galleries);
                        finishLoading('dashboard');
                    }
                });
            });

            UserService.getOutstandingTimeline().then(function (response) {
                console.log(response.data);
                $scope.products = response.data;
            });
        });

        $scope.status = {
            isCustomHeaderOpen: false,
            oneAtATime: true,
            isFirstDisabled: false,
            gallery: true
        };

        $scope.selectGallery = function (gallery) {
            $scope.selectedItems.gallery = gallery;
            $scope.status.gallery = false;
            $scope.status.payment_details = true;

            $scope.filterProducts(true);

        };

        $scope.filterProducts = function (initialize) {
            if (initialize === true) {
                $scope.selectedItems.products = [];
            }

            $scope.products.forEach(function (v, i) {
                if (v.relation_name !== $scope.selectedItems.gallery.name) {
                    v.show = false;
                    return;
                }


                v.show = true;
            });
        };

        $scope.addProduct = function (product, i) {
            var newProduct = jQuery.extend(true, {}, product);
            $scope.products[i].show = false;
            newProduct.index = i;
            var newPayment = jQuery.extend(true, {}, $scope.selectedItems.payment_details);
            newProduct.payment = newPayment;
            newProduct.payment.discount = false;
            $scope.selectedItems.products.push(newProduct);
            $timeout(function(){
                 $scope.allocatePayments();
            }, 100);
        };

        $scope.removeProduct = function (product, i) {
            $scope.products[product.index].show = true;
            $scope.selectedItems.products.splice(i, 1);
            $scope.allocatePayments();
        };

        $scope.moveToAllocation = function () {
            $scope.status.products = false;
            $scope.status.allocation = true;
        };

        $scope.allocatePayments = function (type) {
            var totalDue = 0;
            var totalPayment = 0;
            $scope.selectedItems.products.forEach(function (v, e) {
                totalDue = totalDue + v.total_due;
                totalPayment = totalPayment + v.payment.value;
                if (e + 1 === $scope.selectedItems.products.length) {
                    $scope.selectedTotal = totalDue;
                    if (type === 'none') {
                        if (totalDue === $scope.selectedItems.payment_details.value) {
                            $scope.selectedPayment = $scope.selectedItems.payment_details.value;
                        } else {
                            $scope.selectedPayment = totalPayment;   
                        }
                    } else {
                        $scope.makeAllocations(totalDue, type);
                    }
                }
            });
        };

        $scope.makeAllocations = function (totalDue, type) {
            if ($scope.selectedItems.products.length === 1) {
                $scope.selectedItems.products[0].payment.value = $scope.selectedItems.payment_details.value;
                $scope.selectedPayment = Math.round(($scope.selectedItems.payment_details.value) * 100)/100;
                return;
            } else if (totalDue === $scope.selectedItems.payment_details.value) {
                $scope.selectedItems.products.forEach(function (v, i) {
                    v.payment.value = v.total_due;
                });
            } else {
                var remainingTotal = $scope.selectedItems.payment_details.value;
                if (type === 'full') {
                    $scope.selectedItems.products.forEach(function (v, i) {
                        console.log(remainingTotal);
                        if (v.total_due >= remainingTotal) {

                            v.payment.value = remainingTotal;
                            remainingTotal = 0;
                        } else {
                            if (i + 1 === $scope.selectedItems.products.length) {
                                v.payment.value = remainingTotal;
                            } else {
                                v.payment.value = v.total_due;
                                remainingTotal = remainingTotal - v.total_due;
                            }
                        }
                        $scope.selectedPayment = Math.round(($scope.selectedItems.payment_details.value) * 100)/100;
                    });
                } else {
                    $scope.selectedItems.products.forEach(function (v, i) {
                        console.log(remainingTotal);
                        v.payment.value = Math.round((v.total_due / totalDue * remainingTotal) * 100) / 100;
                    });
                    $scope.selectedPayment = Math.round(($scope.selectedItems.payment_details.value) * 100)/100;
                }
            }
        };
        
        $scope.completePayments = function() {
            console.log($scope.selectedItems);
        };

        //=============FUNCTION - Add Payment
        $scope.addPayment = function (payment) {
            $scope.paymentDateError = undefined;
            $scope.paymentValueError = undefined;
            $scope.paymentTypeError = undefined;
            $scope.paymentDescriptionError = undefined;

            var error = 0;
            if ($scope.newPayment.timeline_date instanceof Date === false) {
                error = error + 1;
                $scope.paymentDateError = 'Date cannot be empty';
            }

            if (typeof $scope.newPayment.value === 'undefined' || $scope.newPayment.value === '') {
                error = error + 1;
                $scope.paymentValueError = 'Value field cannot be empty';
            }

            if ($scope.newPayment.value === 0) {
                error = error + 1;
                $scope.paymentValueError = 'Value cannot be equal to 0';
            }

            if (typeof $scope.newPayment.value_type === 'undefined' || $scope.newPayment.value_type === '') {
                error = error + 1;
                $scope.paymentTypeError = 'Type field cannot be empty';
            }

            if (typeof $scope.newPayment.timeline_description === 'undefined' || $scope.newPayment.timeline_description === '') {
                error = error + 1;
                $scope.paymentDescriptionError = 'Description cannot be empty';
            }

            if (error > 0) {
                return;
            }

            //        add the timeline type of payment
            payment.timeline_type = 'payment';
            payment.relation_type = 'product';

            $scope.paymentButton = 'Update Payment';

            //        Copy the payment
            var newPayment = jQuery.extend(true, {}, payment);

            $scope.filterProducts(true);

            //        Add the payment to paymentTimeline and then calculate the Total of all Payments Received
            $scope.selectedItems.payment_details = newPayment;
            $scope.selectedItems.payment_details.value = Math.round(($scope.selectedItems.payment_details.value) * 100)/100;
            $scope.status.payment_details = false;
            $scope.status.products = true;

            console.log($scope.selectedItems);
        };

        //========================================================================================================================
        //        DATEPICKER
        //========================================================================================================================

        $scope.today = function () {
            $scope.dt = new Date();
        };

        $scope.today();

        $scope.clear = function () {
            $scope.dt = null;
        };

        // Disable weekend selection
        $scope.disabled = function (date, mode) {
            //    return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
        };

        $scope.toggleMin = function () {
            //    $scope.minDate = $scope.minDate ? null : new Date();
        };

        $scope.toggleMin();
        $scope.maxDate = new Date(2020, 5, 22);

        $scope.open = function ($event) {
            $scope.dateStatus.opened = true;
        };

        $scope.setDate = function (year, month, day) {
            $scope.dt = new Date(year, month, day);
        };

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate', 'mediumDate'];
        $scope.format = $scope.formats[4];

        $scope.dateStatus = {
            opened: false
        };

        $scope.calendar = {
            opened: {},
            dateFormat: 'MM/dd/yyyy',
            dateOptions: {},
            open: function ($event, which) {
                $event.preventDefault();
                $event.stopPropagation();
                $scope.calendar.opened[which] = true;
            }
        };

        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        var afterTomorrow = new Date();
        afterTomorrow.setDate(tomorrow.getDate() + 2);
        $scope.events = [
            {
                date: tomorrow,
                status: 'full'
                },
            {
                date: afterTomorrow,
                status: 'partially'
                }
            ];

        $scope.getDayClass = function (date, mode) {
            if (mode === 'day') {
                var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

                for (var i = 0; i < $scope.events.length; i++) {
                    var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

                    if (dayToCheck === currentDay) {
                        return $scope.events[i].status;
                    }
                }
            }

            return '';
        };


    });
})(angular);
