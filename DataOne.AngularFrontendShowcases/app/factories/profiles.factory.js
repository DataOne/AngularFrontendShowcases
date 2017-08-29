(function () {
    'use strict';
    angular.module('app').factory('profilesFactory', profilesFactory);

    profilesFactory.$inject = ['$http', '$q', 'OwnUser'];

    function profilesFactory($http, $q, OwnUser) {
        var _listTitle = 'UserList';
        var _ownUser = OwnUser;
        var _ownProfile = null;
        var _isOwnProfile = true;

        return {
            get isOwnProfile() { return _isOwnProfile },
            createProfile: createProfile,
            updateProfile: updateProfile,
            getProfile: getProfile,
            getProfilePicture: getProfilePicture,
            getAllProfiles: getAllProfiles,
            getOwnContacts: getOwnContacts,
            addContact: addContact,
            removeContact: removeContact
        };

        function createProfile(profileValues) {
            var deferred = $q.defer();

            getProfile(profileValues.username).then(function (profile) {
                deferred.reject('Der Benutzer existiert bereits!');
            }, function (error) {
                var context = SP.ClientContext;
                context = context.get_current();
                var web = context.get_web();
                var list = web.get_lists().getByTitle(_listTitle);

                var itemCreateInfo = new SP.ListItemCreationInformation();
                var listItem = list.addItem(itemCreateInfo);

                listItem.set_item('Title', profileValues.username);
                listItem.set_item('RealName', profileValues.realName);
                listItem.set_item('UeberMich', profileValues.aboutMe);
                listItem.set_item('PLZ', profileValues.plz);
                listItem.set_item('Roboter', profileValues.isRobot);
                listItem.set_item('Gender', profileValues.gender);
                listItem.update();

                context.load(listItem);
                context.executeQueryAsync(Function.createDelegate(this, function (sender, args) {
                    deferred.resolve('user created');
                }), Function.createDelegate(this, function (sender, args) {
                    deferred.reject(args.get_message());
                }));
            });
            return deferred.promise;
        }

        function updateProfile(updatedProfile) {
            var deferred = $q.defer();

            var context = SP.ClientContext;
            context = context.get_current();
            var web = context.get_web();
            var list = web.get_lists().getByTitle(_listTitle);

            var listItem = list.getItemById(updatedProfile.id);

            listItem.set_item('RealName', updatedProfile.realName);
            listItem.set_item('UeberMich', updatedProfile.aboutMe);
            listItem.set_item('PLZ', updatedProfile.plz);

            updatedProfile.hobbies = updatedProfile.hobbies.filter(function (x, index, array) {
                return array.indexOf(x) == index;
            });
            updatedProfile.hobbies.forEach(function (value, index, array) {
                array[index] = value.trim();
            });
            listItem.set_item('Hobbys', updatedProfile.hobbies.join(';'));

            updatedProfile.games = updatedProfile.games.filter(function (x, index, array) {
                return array.indexOf(x) == index;
            });
            updatedProfile.games.forEach(function (value, index, array) {
                array[index] = value.trim();
            });
            listItem.set_item('Spiele', updatedProfile.games.join(';'));

            updatedProfile.music = updatedProfile.music.filter(function (x, index, array) {
                return array.indexOf(x) == index;
            });
            updatedProfile.music.forEach(function (value, index, array) {
                array[index] = value.trim();
            });
            listItem.set_item('Musik', updatedProfile.music.join(';'));

            listItem.set_item('Birthday', updatedProfile.birthday);
            listItem.set_item('Groesse', updatedProfile.size);
            listItem.set_item('Kontakte', updatedProfile.allContacts);
            listItem.set_item('Roboter', updatedProfile.isRobot);
            listItem.set_item('Bundesland', updatedProfile.state);
            listItem.set_item('Gender', updatedProfile.gender);
            listItem.set_item('Bild', updatedProfile.picture);
            listItem.update();

            context.load(listItem);
            context.executeQueryAsync(Function.createDelegate(this, function (sender, args) {
                deferred.resolve();
                if (updatedProfile.username == _ownUser) {
                    _isOwnProfile = true;
                    // only update if successful
                    _ownProfile = {};
                    angular.copy(updatedProfile, _ownProfile);
                }
            }), Function.createDelegate(this, function (sender, args) {
                deferred.reject(args.get_message());
                console.debug(args.get_message());
            }));

            return deferred.promise;
        }

        function getProfile(username) {
            var deferred = $q.defer();
            var profile = {};

            if (!username || username == _ownUser) {
                username = _ownUser;
                _isOwnProfile = true;
            }
            else {
                _isOwnProfile = false;
            }
            if (_isOwnProfile && _ownProfile) {
                var returnObject = {};
                angular.copy(_ownProfile, returnObject);
                deferred.resolve(returnObject);
                return deferred.promise;
            }

            var context = SP.ClientContext;
            context = context.get_current();
            var web = context.get_web();
            var list = web.get_lists().getByTitle(_listTitle);

            var camlQuery = new SP.CamlQuery();
            camlQuery.set_viewXml("<View><Query><Where><Eq><FieldRef ID='{fa564e0f-0c70-4ab9-b863-0177e6ddd247}' /><Value Type='Text'>" + username + "</Value></Eq></Where></Query></View>");

            var collListItem = list.getItems(camlQuery);

            context.load(collListItem);
            context.executeQueryAsync(Function.createDelegate(this, function (sender, args) {
                var listItem = collListItem.getItemAtIndex(0);

                if (!listItem) {
                    deferred.reject('user not found');
                    return deferred.promise;
                }

                var user = listItem.get_item('Title');
                profile.id = listItem.get_item('ID');
                profile.username = username;
                profile.realName = listItem.get_item('RealName');
                profile.aboutMe = listItem.get_item('UeberMich');
                profile.plz = listItem.get_item('PLZ');

                var hobbies = listItem.get_item('Hobbys');
                profile.hobbies = hobbies == null ? [] : hobbies.split(';');

                var games = listItem.get_item('Spiele');
                profile.games = games == null ? [] : games.split(';');

                var music = listItem.get_item('Musik');
                profile.music = music == null ? [] : music.split(';');

                profile.birthday = listItem.get_item('Birthday');
                profile.size = listItem.get_item('Groesse');
                if (!profile.size) {
                    profile.size = 50;
                }
                profile.allContacts = listItem.get_item('Kontakte') || "";
                profile.isRobot = listItem.get_item('Roboter');
                profile.state = listItem.get_item('Bundesland');
                profile.gender = listItem.get_item('Gender');

                if (listItem.get_item('Bild')) {
                    profile.picture = listItem.get_item('Bild');
                }
                if (username == _ownUser) {
                    _ownProfile = {};
                    angular.copy(profile, _ownProfile);
                }
                deferred.resolve(profile);
            }), Function.createDelegate(this, function (sender, args) {
                deferred.reject(args.get_message());
                console.debug(args.get_message());
            }));
            return deferred.promise;
        }

        function getProfilePicture(username, index) {
            var deferred = $q.defer();
            var picture;

            var context = SP.ClientContext;
            context = context.get_current();
            var web = context.get_web();
            var list = web.get_lists().getByTitle(_listTitle);

            var camlQuery = new SP.CamlQuery();
            camlQuery.set_viewXml("<View><Query><Where><Eq><FieldRef ID='{fa564e0f-0c70-4ab9-b863-0177e6ddd247}' /><Value Type='Text'>" + username + "</Value></Eq></Where></Query></View>");
            camlQuery.ViewFields = "<FieldRef ID='{19b9f6ca-4e8a-4f3e-8ad9-98b7fff3b1cf}' />";

            var collListItem = list.getItems(camlQuery);

            context.load(collListItem);
            context.executeQueryAsync(Function.createDelegate(this, function (sender, args) {
                var listItemEnumerator = collListItem.getEnumerator();

                while (listItemEnumerator.moveNext()) {
                    var listItem = listItemEnumerator.get_current();
                    picture = listItem.get_item('Bild');
                    break;
                }
                deferred.resolve({ picture: picture, index: index });
            }), Function.createDelegate(this, function (sender, args) {
                deferred.reject(args.get_message());
                console.debug(args.get_message());
            }));
            return deferred.promise;
        }

        function getAllProfiles(lastId) {
            var deferred = $q.defer();

            if (!_ownProfile) {
                getProfile(_ownUser).then(function (profile) {
                    getAll(lastId).then(function (d) {
                        deferred.resolve(d);
                    }, function (e) {
                        deferred.reject(e);
                    });
                });
            }
            else {
                getAll(lastId).then(function (d) {
                    deferred.resolve(d);
                }, function (e) {
                    deferred.reject(e);
                });;
            }
            return deferred.promise;
        }

        function getAll(lastId) {
            var deferred = $q.defer();
            var profiles = [];

            $http({
                method: 'GET',
                url: location.pathname.slice(0, location.pathname.indexOf('app')) + "_api/lists/GetByTitle('UserList')/Items?$top=10&$skiptoken=Paged=TRUE%26p_ID=" + lastId,
                headers: {
                    'accept': 'application/json;odata=verbose'
                }
            }).then(function success(response) {
                var allProfiles = response.data.d.results;
                var id = 0;

                for (var i = 0; i < allProfiles.length; i++) {
                    var listItem = allProfiles[i];
                    var profile = {};
                    id = listItem['ID'];
                    profile.id = id;
                    profile.username = listItem['Title'];

                    if (profile.username == _ownUser) {
                        continue;
                    }

                    profile.realName = listItem['RealName'];
                    profile.birthday = listItem['Birthday'];
                    profile.plz = listItem['PLZ'];
                    profile.gender = listItem['Gender'];
                    profile.state = listItem['Bundesland'];
                    profile.isRobot = listItem['Roboter'];
                    profile.isContact = false;

                    if (_ownProfile && _ownProfile.username) {
                        var allContacts = _ownProfile.allContacts.split(';');
                        for (var j = 0; j < allContacts.length; j++) {
                            if (allContacts[j] == profile.username) {
                                profile.isContact = true;
                                break;
                            }
                        }
                    }
                    if (listItem['Bild']) {
                        profile.picture = listItem['Bild'].Url;
                    }

                    if (profile.birthday) {
                        profile.birthday = new Date(profile.birthday);
                        profile.age = Date.now() - profile.birthday.getTime();
                        profile.age = Math.abs(new Date(profile.age).getUTCFullYear() - 1970);
                    }

                    profiles.push(profile);
                }
                if (!response.data.d.__next) {
                    id = 0;
                }
                deferred.resolve({
                    id: id,
                    profiles: profiles
                });
            }, function error(response) {
                deferred.reject(response.status);
            })

            return deferred.promise;
        }

        function getOwnContacts() {
            var deferred = $q.defer();

            if (_ownProfile && _ownProfile.allContacts) {
                deferred.resolve(_ownProfile.allContacts);
            }
            getProfile(_ownUser).then(function (profile) {
                deferred.resolve(profile.allContacts);
            }, function (error) {
                deferred.resolve("");
            });
            return deferred.promise;
        }

        function addContact(contact) {
            var deferred = $q.defer();

            if (!_ownProfile) {
                deferred.reject(error);
            }
            else {
                add();
            }

            function add() {
                var allContacts = _ownProfile.allContacts.split(';');
                for (var i = 0; i < allContacts.length; i++) {
                    if (allContacts[i] == contact) {
                        deferred.reject('contact already exists');
                        return;
                    }
                }

                if (_ownProfile.allContacts.length > 0 && !_ownProfile.allContacts.endsWith(';')) {
                    contact = ';' + contact;
                }
                _ownProfile.allContacts = _ownProfile.allContacts.concat(contact);

                updateProfile(_ownProfile).then(function (message) {
                    deferred.resolve(message);
                }, function (error) {
                    deferred.reject(error)
                });
            }

            return deferred.promise;
        }

        function removeContact(contact) {
            var deferred = $q.defer();

            if (!_ownProfile) {
                deferred.reject(error);
            }
            else {
                remove();
            }

            function remove() {
                var contacts = _ownProfile.allContacts.split(';');
                for (var i = 0; i < contacts.length; i++) {
                    if (contacts[i] == contact) {
                        contacts.splice(i, 1);
                        break;
                    }
                }
                var all = contacts[0];
                for (var i = 1; i < contacts.length; i++) {
                    all += ';' + contacts[i];
                }
                _ownProfile.allContacts = all || "";
                updateProfile(_ownProfile).then(function (message) {
                    deferred.resolve(message);
                }, function (error) {
                    deferred.reject(error);
                });
            }

            return deferred.promise;
        }
    }
})();