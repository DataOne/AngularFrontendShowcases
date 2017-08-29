(function () {
    'use strict';

    angular.module('app').config(stateProvider);

    stateProvider.$inject = ['$urlRouterProvider', '$stateProvider'];

    function stateProvider($urlRouterProvider, $stateProvider) {
        var rootState = {
            name: 'index',
            abstract: true,
            template: '<div ui-view></div>'
        }

        var oneProfileState = {
            name: 'user',
            parent: 'index',
            url: '/user?name',
            views: {
                '@': {
                    template: '<div><div ui-view="navigation"></div> <div ui-view="content"></div></div>'
                },
                'navigation@user': {
                    templateUrl: function () {
                        if (sessionStorage.getItem('UiFramework') === 'material') {
                            return "navigation_Material.html";
                        }
                        return "navigation_Bootstrap.html";
                    },
                    controller: 'NavigationController'
                },
                'content@user': {
                    templateUrl: function () {
                        if (sessionStorage.getItem('UiFramework') === 'material') {
                            return "../oneProfile/oneProfile_Material.html";
                        }
                        return "../oneProfile/oneProfile_Bootstrap.html";
                    },
                    controller: 'OneProfileController'
                }
            }
        }

        var allProfilesState = {
            name: 'all',
            parent: 'index',
            url: '/all',
            views: {
                '@': {
                    template: '<div><div ui-view="navigation"></div> <div ui-view="content"></div></div>'
                },
                'navigation@all': {
                    templateUrl: function () {
                        if (sessionStorage.getItem('UiFramework') === 'material') {
                            return "navigation_Material.html";
                        }
                        return "navigation_Bootstrap.html";
                    },
                    controller: 'NavigationController'
                },
                'content@all': {
                    templateUrl: function () {
                        if (sessionStorage.getItem('UiFramework') === 'material') {
                            return "../allProfiles/allProfiles_Material.html";
                        }
                        return "../allProfiles/allProfiles_Bootstrap.html";
                    },
                    controller: 'AllProfilesController'
                }
            }
        }

        var createProfilesState = {
            name: 'create',
            parent: 'index',
            url: '/create',
            views: {
                '@': {
                    template: '<div><div ui-view="navigation"></div> <div ui-view="content"></div></div>'
                },
                'navigation@create': {
                    templateUrl: function () {
                        if (sessionStorage.getItem('UiFramework') === 'material') {
                            return "navigation_Material.html";
                        }
                        return "navigation_Bootstrap.html";
                    },
                    controller: 'NavigationController'
                },
                'content@create': {
                    templateUrl: function () {
                        if (sessionStorage.getItem('UiFramework') === 'material') {
                            return "../createProfile/createProfile_Material.html";
                        }
                        return "../createProfile/createProfile_Bootstrap.html";
                    },
                    controller: 'CreateProfileController'
                }
            }
        }

        $stateProvider.state(rootState);
        $stateProvider.state(oneProfileState);
        $stateProvider.state(allProfilesState);
        $stateProvider.state(createProfilesState);

        $urlRouterProvider.otherwise('/user');
    }

})();