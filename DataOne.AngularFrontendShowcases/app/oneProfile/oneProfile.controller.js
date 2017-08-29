(function () {
    'use strict';

    angular.module('app').controller('OneProfileController', OneProfileController);

    OneProfileController.$inject = ['$document', '$location', '$mdDialog', 'notifications', 'profilesFactory', '$scope'];

    function OneProfileController($document, $location, $mdDialog, notifications, profilesFactory, $scope) {
        var _states = [
            "Baden-Württemberg", "Bayern", "Berlin ", "Brandenburg", "Bremen ", "Hamburg ", "Hessen", "Mecklenburg-Vorpommern", "Niedersachsen",
            "Nordrhein-Westfalen", "Rheinland-Pfalz", "Saarland", "Sachsen", "Sachsen-Anhalt", "Schleswig-Holstein", "Thüringen"
        ];

        $scope.addContact = addContact;
        $scope.addNewGame = addNewGame;
        $scope.addNewHobby = addNewHobby;
        $scope.addNewMusic = addNewMusic;
        $scope.allContactsNotLoaded = true;
        $scope.dateOptions = null;
        $scope.getColor = getColor;
        $scope.isContact = false;
        $scope.isDatepickerOpen = false;
        $scope.isEditModeOn = false;
        $scope.isLoading = true;
        $scope.isOwnProfile = false;
        $scope.isValidBirthday = true;
        $scope.hobbies = [];
        $scope.minDate = new Date(1900, 0, 2);
        $scope.profile = null;
        $scope.querySearch = querySearch;
        $scope.removeContact = removeContact;
        $scope.removeHobby = removeHobby;
        $scope.removeGame = removeGame;
        $scope.removeMusic = removeMusic;
        $scope.reset = reset;
        $scope.selectedHobby = null;
        $scope.searchText = null;
        $scope.showConfirm = showConfirm;
        $scope.showProfile = showProfile;
        $scope.showPrompt = showPrompt;
        $scope.states = _states;
        $scope.today = new Date();
        $scope.toggleMode = toggleMode;
        $scope.validateBirthday = validateBirthday;

        $document.ready(function () {
            activate();
        });

        var _profileWithoutChanges = {};

        var _colors = {
            a: '#5d636d', b: '#2678ff', c: '#7ea5e5', d: '#26cae0', e: '#109674', f: '#6797b9', g: '#11b247', h: '#5a8c3f', i: '#97c41b', j: '#5e6814', k: '#69731b', l: '#bf0000', m: '#dbb915',
            n: '#b99f22', o: '#f2a710', p: '#af7a0f', q: '#c39a48', r: '#e56b0d', s: '#e55339', t: '#fc9988', u: '#5953aa', v: '#100699', w: '#8632e5', x: '#86719e', y: '#d16fd4', z: '#af4667'
        };

        var _hobbies = ['Angeln', 'Bouldern', 'Capoera', 'Dart', 'Eiskunstlauf', 'Fallschirmspringen', 'Gartenarbeit', 'Handball', 'Internet', 'Jonglieren', 'Kampfsport', 'Lesen', 'Mountainbiken',
            'Nähen', 'Ornithologie', 'Programmieren', 'Quenya', 'Reisen', 'Schwimmen', 'Tauchen', 'Unterwasserhockey', 'Volleyball', 'Wasserski', 'Xyolophon', 'Yakzucht', 'Zeichnen'];

        function activate() {
            $scope.hobbies = _hobbies;
            var params = $location.search();
            var username = params.name;

            profilesFactory.getProfile(username).then(function (profile) {
                reload(profile);
            }, function (error) {
                showToast('Fehler beim Laden des Benutzers!', 'danger');
                console.error(error);
            });
            $scope.isOwnProfile = profilesFactory.isOwnProfile;

            if (!$scope.isOwnProfile) {
                profilesFactory.getOwnContacts().then(function (contacts) {
                    setIsContact(contacts, username)
                });
            }

            var profilePicture = document.getElementById('profile-picture');
            if (profilePicture) {
                profilePicture.onload = function () {
                    if (this.width >= this.height) {
                        document.getElementById('profile-picture').className = 'wide';
                    }
                }
            }
        }

        function addContact() {
            $scope.isContact = true;
            profilesFactory.addContact($scope.profile.username).then(function (success) {
                showToast($scope.profile.username + ' ist jetzt ein Favorit von dir!', 'info');
            }, function (error) {
                showToast($scope.profile.username + ' konnte nicht hinzugefügt werden! ', 'danger');
            });
        }

        function addNewGame() {
            if ($scope.newGame && $scope.profile.games.indexOf($scope.newGame) < 0) {
                $scope.profile.games.push($scope.newGame);
            }
            $scope.newGame = '';
        }

        function addNewHobby() {
            if ($scope.newHobby && $scope.profile.hobbies.indexOf($scope.newHobby) < 0) {
                $scope.profile.hobbies.push($scope.newHobby);
            }
            $scope.newHobby = '';
        }

        function addNewMusic() {
            if ($scope.newMusic && $scope.profile.music.indexOf($scope.newMusic) < 0) {
                $scope.profile.music.push($scope.newMusic);
            }
            $scope.newMusic = '';
        }

        $scope.dateOptions = { // TODO
            maxDate: $scope.today,
            minDate: $scope.minDate,
            startingDay: 1,
            datepickerMode: 'year',
            showWeeks: false
        }

        function getColor(chipName) {
            var firstChar = chipName[0].toLowerCase();
            return _colors[firstChar] || 'black';
        }

        function querySearch(query) {
            return query ? _hobbies.filter(createFilterFor(query)) : [];
        }

        function removeContact() {
            $scope.isContact = false;
            profilesFactory.removeContact($scope.profile.username).then(function (success) {
                showToast($scope.profile.username + ' wurde von deinen Favoriten entfernt!', 'info');
            }, function (error) {
                showToast($scope.profile.username + ' konnte nicht entfernt werden! ', 'danger');
            });
        }

        function removeHobby(hobby) {
            var index = $scope.profile.hobbies.indexOf(hobby);
            $scope.profile.hobbies.splice(index, 1);
        }

        function removeGame(game) {
            var index = $scope.profile.games.indexOf(game);
            $scope.profile.games.splice(index, 1);
        }

        function removeMusic(music) {
            var index = $scope.profile.music.indexOf(music);
            $scope.profile.music.splice(index, 1);
        }

        function reset() {
            $scope.profile = angular.copy(_profileWithoutChanges);
            toggleMode();
            setContacts();
            setContactPictures();

            // to show contacts in BS-UI tabset
            setTimeout(function () {
                try {
                    document.getElementById('tabset')
                        .getElementsByTagName('ul')[0]
                        .getElementsByTagName('li')[0]
                        .getElementsByTagName('a')[0]
                        .click();
                }
                catch (ignored) { }
            }, 1);
        }

        function setIsContact(allContacts, username) {
            $scope.allContactsNotLoaded = false;

            var all = allContacts.split(';');
            for (var i = 0; i < all.length; i++) {
                if (all[i] == username) {
                    $scope.isContact = true;
                    return;
                }
            }
            $scope.isContact = false;
        }

        function setContacts() {
            var contacts = [];

            if ($scope.profile.allContacts) {
                var allContacts = $scope.profile.allContacts.split(';');

                for (var i = 0; i < allContacts.length; i++) {
                    var contact = {};
                    contact.name = allContacts[i];
                    contacts.push(contact);
                }
            }
            $scope.profile.contacts = [];
            var contactsPerTab = 12;
            for (var j = 0; j < contacts.length; j++) {
                if (j % contactsPerTab == 0) {
                    var sliceEnd = j + contactsPerTab >= contacts.length ? contacts.length : j + contactsPerTab;
                    var subArray = contacts.slice(j, sliceEnd);
                    // add dummies to last contact tab
                    if (subArray.length < contactsPerTab) {
                        var dummies = contactsPerTab - subArray.length;
                        for (var d = 0; d < dummies; d++) {
                            subArray.push({ name: 'dummy', isDummy: true });
                        }
                    }
                    $scope.profile.contacts.push(subArray);
                }
            }
        }

        function setContactPictures() {
            for (var page = 0; page < $scope.profile.contacts.length; page++) {
                for (var j = 0; j < $scope.profile.contacts[page].length; j++) {
                    var contact = $scope.profile.contacts[page][j];

                    profilesFactory.getProfilePicture(contact.name, { page: page, j: j }).then(function (response) {
                        $scope.profile.contacts[response.index.page][response.index.j].picture = response.picture ? response.picture.$1_1 : null;
                    });
                }
            }
        }

        function showConfirm(event) {
            if (!$scope.isOwnProfile) {
                return;
            }
            notifications[sessionStorage.getItem('UiFramework')].showConfirm('Änderungen speichern?', 'Alle Änderungen werden dann übernommen.', 'Speichern', 'Abbrechen', update, function () { });
        }

        function showProfile(contact) {
            $location.search('name', contact);
            activate();
        }

        function showPrompt(event) {
            $scope.activeSlide = 0;
            notifications[sessionStorage.getItem('UiFramework')].showPrompt('Bild ändern', 'Hier eine Bild-URL angeben:', 'https://...bild.jpg', 'Ok', 'Abbrechen',
                function (result) {
                    var picture = new SP.FieldUrlValue();
                    picture.set_description('Profile picture');
                    picture.set_url(result);

                    var img = new Image();
                    img.onload = function (e) {
                        $scope.profile.picture = picture;
                    };
                    img.onerror = function () {
                        showToast('Fehlerhafte Bild-URL angegeben!', 'warning');
                    };
                    img.src = result;
                }, function () { });
        }

        function toggleMode() {
            $scope.isEditModeOn = !$scope.isEditModeOn;
        }

        function validateBirthday() {
            try {
                var dateParts = toGermanDate($scope.profile.birthday).split('.');
                var date = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);

                if (date.getTime() < $scope.minDate.getTime() || date.getTime() > $scope.today.getTime()) {
                    $scope.isValidBirthday = false;
                    return;
                }
            }
            catch (e) {
                $scope.isValidBirthday = true;
                console.error('error during validation');
                return;
            }
            $scope.isValidBirthday = true;
        }

        function reload(profile) {
            $scope.isLoading = false;
            $scope.profile = profile;
            $scope.profile.formattedBirthday = toGermanDate(profile.birthday);

            setContacts();
            setContactPictures();

            // to show contacts in BS-UI tabset
            setTimeout(function () {
                try {
                    document.getElementById('tabset')
                        .getElementsByTagName('ul')[0]
                        .getElementsByTagName('li')[0]
                        .getElementsByTagName('a')[0]
                        .click();
                }
                catch (ignored) { }
            }, 1);

            _profileWithoutChanges = angular.copy($scope.profile);
        }

        function showResultToast(success) {
            if (success) {
                showToast('Änderungen gespeichert!', 'success');
                reload($scope.profile);
            }
            else {
                showToast('Fehler beim Speichern!', 'danger');
                $scope.profile = angular.copy(_profileWithoutChanges);
            }
        }

        function toGermanDate(date) {
            if (date) {
                return date.getDate() + '.' + (date.getMonth()+1) + '.' + date.getFullYear();
            }
            return null;
        }

        function update() {
            if (!$scope.profileForm.$valid) {
                showResultToast(false);
                return;
            }
            profilesFactory.updateProfile($scope.profile).then(function (success) {
                showResultToast(true);
            }, function (error) {
                showResultToast(false);
            });
            toggleMode();
        }

        function showToast(text, kind) {
            notifications[sessionStorage.getItem('UiFramework')].showMessage(text, kind);
        }

        function createFilterFor(query) {
            var lowerCaseQuery = query.toLowerCase();

            return function filterFn(hobby) {
                return (hobby.toLowerCase().indexOf(lowerCaseQuery) == 0);
            }
        }

        $scope.$watch('profile.size', function (newSize, oldSize) {
            if (!$scope.profile) {
                return;
            }
            //if (!oldSize && newSize != $scope.profile.size) {
            //    $scope.profile.size = 50;
            //    console.log('profile.size set to ', newSize);
            //    // TODO fix error with material; if set to 50 set to actual value (if not 50 too)
            //    return;
            //}
            if ($scope.profile.numberSize != newSize && newSize >= 50 && newSize <= 260) {
                $scope.profile.numberSize = parseInt(newSize);
            }
        });

        $scope.$watch('profile.numberSize', function (newSize, oldSize) {
            if (!$scope.profile) {
                return;
            }
            if ($scope.profile.size != newSize && newSize >= 50 && newSize <= 260) {
                $scope.profile.size = parseInt(newSize);
            }
        });
    }
})();