(function (angular) {
    angular
        .module('artlineup.admin').controller('AdminDashboardController', function ($scope, $rootScope, AdminService) {

            $rootScope.pageTitle = 'Art Lineup - Admin Dashboard';
            console.log('Admin Dashboard Page Controller');

            AdminService.redirect();

            function addDays(date, days) {
                var result = new Date(date);
                result.setDate(result.getDate() + days);
                return result;
            }

            if (AdminService.isLoggedIn()) {
                $scope.admin = AdminService.getAdmin();
                console.log($scope.admin);
                AdminService.getDetails('all').then(function (response) {
                    console.log(response.data);
                    $scope.feedback = response.data.feedback;
                    $scope.logs = response.data.logs;
                    var last_date;
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
                        console.log(timeDiff);
                        v.days_over = Math.ceil(timeDiff / (1000 * 3600 * 24));
                        
                    });
                });
            }

            $scope.adminLogout = function () {
                AdminService.logout();
            };

        });
})(angular);
