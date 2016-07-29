(function (angular) {
    angular
        .module('admin').controller('AdminDashboardController', function ($scope, $q, $rootScope, AdminService, UtilityService) {

            UtilityService.state('update', 'Loading Admin Dashboard');

            AdminService.redirect();

            $scope.today = UtilityService.getToday();

            function addDays(date, days) {
                var result = new Date(date);
                result.setDate(result.getDate() + days);
                return result;
            }

            $scope.getDetails = function (v) {
                return $q(function (resolve, reject) {
                    AdminService.getDetails(v).then(function (response) {
                        console.log(response);
                        $scope.feedback = response.data.feedback;
                        $scope.logs = response.data.logs;
                        resolve('complete');
                    });
                });
            };

            $scope.updateLogDueDates = function () {
                return $q(function (resolve, reject) {
                    var last_date;
                    console.log($scope.logs);
                    if ($scope.logs.log_due_date_totals.length === 0) {
                        resolve('complete');
                    } else {
                        $scope.logs.log_due_date_totals.forEach(function (v, i) {
                            if (i === 0) {
                                last_date = new Date(v.deadline);
                            }
                            if (i > 0) {
                                last_date = addDays(last_date, v.estimated_days);
                            }
                            v.due_date = new Date(v.due_date);
                            v.deadline = new Date(last_date);

                            var timeDiff = Math.abs(v.deadline.getTime() - v.due_date.getTime());

                            if (v.deadline < v.due_date) {
                                timeDiff = timeDiff * -1;
                            }

                            v.days_over = Math.ceil(timeDiff / (1000 * 3600 * 24));

                            if (i + 1 === $scope.logs.log_due_date_totals.length) {
                                resolve('complete');
                            }
                        });
                    }
                });
            };

            function createFixedRow(v) {
                var obj = v;
                obj.average_this_week = v.minutes_this_week / v.fixed_this_week || 0;
                obj.average_two_weeks = v.minutes_two_weeks / v.fixed_two_weeks || 0;
                obj.average_this_month = v.minutes_this_month / v.fixed_this_month || 0;
                obj.average_all_time = v.minutes_all_time / v.fixed_all_time || 0;

                var items = ['average_this_week', 'average_two_weeks', 'average_this_month', 'average_all_time'];

                var count = 0;
                var total = 0;

                items.forEach(function (v, i) {
                    if (obj[v] !== 0) {
                        count = count + 1;
                        total = total + obj[v];
                    }
                });

                obj.weighted_average = total / count;

                return obj;
            }

            $scope.updateLogFixed = function () {
                return $q(function (resolve, reject) {
                    $scope.fixed_table = [];
                    if ($scope.logs.admin_fixed_by_user.length === 0) {
                        resolve('complete');
                    } else {
                        $scope.logs.admin_fixed_by_user.forEach(function (v, i) {
                            $scope.fixed_table.push(createFixedRow(v));

                            if (i + 1 === $scope.logs.admin_fixed_by_user.length) {
                                console.log($scope.fixed_table);
                                resolve('complete');
                            }
                        });
                    }
                });
            };

            $scope.updateLogUnfixed = function () {
                return $q(function (resolve, reject) {
                    $scope.table_unfixed = [];
                    if ($scope.logs.admin_unfixed_by_user.lenth === 0) {
                        resolve('complete');
                    } else {
                        $scope.table_unfixed = $scope.logs.admin_unfixed_by_user;
                        console.log($scope.table_unfixed);
                        resolve('complete');
                    }
                });
            };

            UtilityService.setPage('Art Lineup - Admin Dashboard', true, 'admin').then(function (response) {
                $scope.admin = AdminService.getAdmin();
                $scope.getDetails('all').then(function (response) {
                    return $scope.updateLogDueDates();
                }).then(function (response) {
                    return $scope.updateLogFixed();
                }).then(function(response){
                    return $scope.updateLogUnfixed();
                }).then(function (response) {
                    UtilityService.finishLoading('dashboard');
                });
            });

            $scope.adminLogout = function () {
                AdminService.logout();
            };

        });
})(angular);
