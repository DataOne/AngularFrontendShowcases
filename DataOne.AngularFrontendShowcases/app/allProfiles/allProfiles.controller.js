(function () {
    'use strict';

    angular.module('app').controller('AllProfilesController', AllProfilesController);

    AllProfilesController.$inject = ['$document', 'notifications', 'profilesFactory', '$scope', '$state', '$timeout'];

    function AllProfilesController($document, notifications, profilesFactory, $scope, $state, $timeout) {

        $scope.addContact = addContact;
        $scope.areButtonsDisabled = false;
        $scope.getMoreProfiles = getMoreProfiles;
        $scope.isLoading = true;
        $scope.isLoadingMore = false;
        $scope.profiles = [];
        $scope.removeContact = removeContact;
        $scope.showMoreButton = false;
        $scope.showProfile = showProfile;

        var _lastId = 0;

        $document.ready(function () {
            profilesFactory.getAllProfiles(_lastId).then(function (response) {
                $scope.profiles = response.profiles;
                $scope.isLoading = false;
                $scope.showMoreButton = true;
                _lastId = response.id;
            });
        });

        function addContact(profile) {
            $scope.areButtonsDisabled = true;
            profile.isContact = true;
            profilesFactory.addContact(profile.username).then(function () {
                $scope.areButtonsDisabled = false;
                showToast(profile.username + ' ist jetzt ein Favorit von dir!', 'info');
            }, function (error) {
                showToast(profile.username + ' konnte nicht hinzugefügt werden!', 'danger');
            });
        }

        function getMoreProfiles() {
            $scope.isLoadingMore = true;
            if (_lastId != 0) {
                profilesFactory.getAllProfiles(_lastId).then(function (response) {
                    $scope.isLoadingMore = false;
                    _lastId = response.id;
                    $scope.profiles = $scope.profiles.concat(response.profiles);
                });
            }
            else {
                $scope.showMoreButton = false;
                $scope.isLoadingMore = false;
            }
        }

        function showProfile(contact) {
            $state.go('user', { name: contact });
        }

        function removeContact(profile) {
            $scope.areButtonsDisabled = true;
            profile.isContact = false;
            profilesFactory.removeContact(profile.username).then(function () {
                $scope.areButtonsDisabled = false;
                showToast(profile.username + ' wurde von deinen Favoriten entfernt!', 'info');
            }, function (error) {
                showToast(profile.username + ' konnte nicht entfernt werden!', 'danger');
            });
        }

        function showToast(text, kind) {
            notifications[sessionStorage.getItem('UiFramework')].showMessage(text, kind);
        }
    }
})();