(function (angular) {
    angular
        .module('admin').controller('AdminLogsController', function ($scope, $location, $window, $sessionStorage, $rootScope, AdminService, UtilityService, $q) {

            UtilityService.state('update', 'Loading Admin Logs');

            $scope.predicate = ['date_due', 'group', 'subgroup'];

            $scope.reverse = false;

            $scope.filter = {
                fixed: false,
                date_due: 'all',
                device: 'all',
                priority: 'all',
                public: 'all',
                type: 'all',
                assigned: 'all',
                text: '',
                userText: ''
            };

            $scope.getAdminLogs = function () {
                return $q(function (resolve, reject) {
                    AdminService.getAdminLogs('all').then(function successCallback(response) {
                        $scope.logs = response.data;
                        console.log($scope.logs);

                        if ($scope.logs.length !== 0) {
                            $scope.logs.forEach(function (v, i) {
                                v.estimated_time = Number(v.estimated_time);
                                if (i + 1 === $scope.logs.length) {
                                    resolve('complete');
                                }
                            });
                        } else {
                            resolve('complete');
                        }
                    });
                });
            };

            $scope.getLogDates = function () {
                return $q(function (resolve, reject) {
                    AdminService.getLogDates().then(function (response) {
                        $scope.dates = ['all'];
                        console.log(response);
                        
                        if (response.data.length > 0) {
                            response.data.forEach(function (v, i) {
                                var newDate = new Date(v.due_date);
                                $scope.dates.push(newDate);
                                
                                if (i + 1 === response.data.length) {
                                    $scope.filter.date = $scope.dates[0];
                                    resolve('complete');
                                }
                            });
                        } else {
                            resolve('complete');
                        }

                    });
                });
            };

            UtilityService.setPage('Dashboard', true, 'admin').then(function (response) {
                $scope.admin = AdminService.getAdmin();
                $scope.getAdminLogs().then(function (response) {
                    return $scope.getLogDates();
                }).then(function (response) {
                    $scope.filterTable();
                    UtilityService.finishLoading('dashboard');
                });
            });

            $scope.adminLogout = function () {
                AdminService.logout();
            };

            $scope.edit = function (id) {
                $location.path('/admin/edit/logs/' + id);
            };

            $scope.updateTable = function (item) {
                var type;
                if (typeof item === 'object') {
                    type = item[0];
                } else {
                    type = item;
                }

                var predicateType;
                if (typeof $scope.predicate === 'object') {
                    predicateType = $scope.predicate[0];
                } else {
                    predicateType = $scope.predicate;
                }

                if (type === predicateType) {
                    if ($scope.reverse === false) {
                        $scope.reverse = true;
                    } else {
                        $scope.reverse = false;
                    }
                } else {
                    $scope.predicate = item;
                }
            };

            $scope.filterTable = function (type, value) {
                $scope.count = 0;
                $scope.total_minutes = 0;

                if ($scope.filter.date !== 'all') {
                    var filterDate = UtilityService.getDate($scope.filter.date, 'text');
                }

                $scope.logs.forEach(function (v, i) {

                    if ($scope.filter.text !== '') {
                        if (v.public_title.toLowerCase().indexOf($scope.filter.text.toLowerCase()) < 0 && (v.log_message == null || v.log_message.toLowerCase().indexOf($scope.filter.text.toLowerCase()) < 0) && v.subgroup.toLowerCase().indexOf($scope.filter.text.toLowerCase()) < 0 && v.group.toLowerCase().indexOf($scope.filter.text.toLowerCase()) < 0) {
                            v.show = false;
                            return;
                        }
                    }

                    if ($scope.filter.date !== 'all') {
                        if (v.date_due != null) {
                            var tempDate = UtilityService.getDate(v.date_due, 'text');
                            if (tempDate !== filterDate) {
                                v.show = false;
                                return;
                            }
                        } else {
                            v.show = false;
                            return;
                        }
                    }

                    if ($scope.filter.userText !== '') {
                        if (v.assigned_to == null || v.assigned_to.toLowerCase().indexOf($scope.filter.userText.toLowerCase()) < 0) {
                            v.show = false;
                            return;
                        }
                    }

                    if ($scope.filter.assigned !== 'all') {
                        if ($scope.filter.assigned === false) {
                            if (v.assigned_to != null) {
                                v.show = false;
                                return;
                            }
                        } else {
                            if (v.assigned_to == null) {
                                v.show = false;
                                return;
                            }
                        }
                    }

                    if ($scope.filter.fixed !== 'all') {
                        if ($scope.filter.fixed === false) {
                            if (v.fixed === true) {
                                v.show = false;
                                return;
                            }
                        } else {
                            if (v.fixed === false || v.fixed == null) {
                                v.show = false;
                                return;
                            }
                        }
                    }

                    if ($scope.filter.date_due !== 'all') {
                        if ($scope.filter.date_due === 'with') {
                            if (typeof v.date_due === 'undefined' || v.date_due === '' || v.date_due === null) {
                                v.show = false;
                                return;
                            }
                        } else {
                            if (typeof v.date_due !== 'undefined' && v.date_due !== '' && v.date_due !== null) {
                                v.show = false;
                                return;
                            }
                        }
                    }

                    if ($scope.filter.device !== 'all') {
                        if (v.device !== $scope.filter.device) {
                            v.show = false;
                            return;
                        }
                    }

                    if ($scope.filter.priority !== 'all') {
                        if (v.priority !== $scope.filter.priority) {
                            v.show = false;
                            return;
                        }
                    }

                    if ($scope.filter.public !== 'all') {
                        if (v.public !== $scope.filter.public) {
                            v.show = false;
                            return;
                        }
                    }

                    if ($scope.filter.type !== 'all') {
                        if (v.type !== $scope.filter.type) {
                            v.show = false;
                            return;
                        }
                    }

                    v.show = true;
                    $scope.total_minutes = $scope.total_minutes + v.estimated_minutes;
                    $scope.count = $scope.count + 1;

                });
            };

        });
})(angular);
