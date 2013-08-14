/// <reference path="http-requester.js" />
/// <reference path="class.js" />
/// <reference path="http://crypto-js.googlecode.com/svn/tags/3.1.2/build/rollups/sha1.js" />
var persisters = (function () {
	var username = localStorage.getItem("username");
	var sessionKey = localStorage.getItem("sessionKey");
	function saveUserData(userData) {
		localStorage.setItem("username", userData.username);
		localStorage.setItem("sessionKey", userData.sessionKey);
		username = userData.username;
		sessionKey = userData.sessionKey;
	}
	function clearUserData() {
		localStorage.removeItem("username");
		localStorage.removeItem("sessionKey");
		username = "";
		sessionKey = "";
	}

	var MainPersister = Class.create({
		init: function (rootUrl) {
			this.rootUrl = rootUrl;
			this.user = new UserPersister(this.rootUrl);
			this.game = new GamePersister(this.rootUrl);
			this.battle = new BattlePersister(this.rootUrl);
			this.message = new MessagesPersister(this.rootUrl);
		},
		isUserLoggedIn: function () {
			var isLoggedIn = username != null && sessionKey != null;
			return isLoggedIn;
		},
		username: function () {
			return username;
		}
	});
	var UserPersister = Class.create({
		init: function (rootUrl) {
			//...api/user/
			this.rootUrl = rootUrl + "user/";
		},
		login: function (user, success, error) {
			var url = this.rootUrl + "login";
			var userData = {
				username: user.username,
				authCode: CryptoJS.SHA1(user.username + user.password).toString()
			};

			httpRequester.postJSON(url, userData,
				function (data) {
					saveUserData(data);
					success(data);
				}, error);
		},
		register: function (user, success, error) {
			var url = this.rootUrl + "register";
			var userData = {
				username: user.username,
				authCode: CryptoJS.SHA1(user.username + user.password).toString()
			};
			httpRequester.postJSON(url, userData,
				function (data) {
					saveUserData(data);
					success(data);
				}, error);
		},
		logout: function (success, error) {
			var url = this.rootUrl + "logout/" + sessionKey;
			httpRequester.getJSON(url, function (data) {
				clearUserData();
				success(data);
			}, error)
		},
		scores: function (success, error) {
		    var url = this.rootUrl + "scores/" + sessionKey;
		    httpRequester.getJSON(url, success(data), error);
		}
	});
	var GamePersister = Class.create({
		init: function (url) {
			this.rootUrl = url + "game/";
		},
		create: function (game, success, error) {
			var gameData = {
				title: game.title
			};
			if (game.password) {
				gameData.password = CryptoJS.SHA1(game.password).toString();
			}
			var url = this.rootUrl + "create/" + sessionKey;
			httpRequester.postJSON(url, gameData, success, error);
		},
		join: function (game, success, error) {
			var gameData = {
				id: game.id
			};
			if (game.password) {
				gameData.password = CryptoJS.SHA1(game.password).toString();
			}
			var url = this.rootUrl + "join/" + sessionKey;
			httpRequester.postJSON(url, gameData, success, error);
		},
		start: function (id, success, error) {
			var url = this.rootUrl + id + "/start/" + sessionKey;
			httpRequester.getJSON(url, success, error);
		},
		myActive: function (success, error) {
			var url = this.rootUrl + "my-active/" + sessionKey;
			httpRequester.getJSON(url, success, error);
		},
		open: function (success, error) {
			var url = this.rootUrl + "open/" + sessionKey;
			httpRequester.getJSON(url, success, error);
		},
		field: function (id, success, error) {
			var url = this.rootUrl + id + "/field/" + sessionKey;
			httpRequester.getJSON(url, success, error);
		}
	});
	var BattlePersister = Class.create({
		init: function (url) {
		    this.rootUrl = url + "battle/";
		},
		move: function (gameId, unit, success, error) {
		    var url = this.rootUrl + gameId + "/move/" + sessionKey;
		    var unitData = {
		        unitId: unit.unitId,
		        position: unit.position
		    };

		    httpRequester.postJSON(url, unitData, success, error);
		},
		attack: function (gameId, unit, success, error) {
		    var url = this.rootUrl + gameId + "/attack/" + sessionKey;
		    var unitData = {
		        unitId: unit.unitId,
		        position: unit.position
		    };

		    httpRequester.postJSON(url, unitData, success, error);
		},
		defend: function (gameId, unit, success, error) {
		    var url = this.rootUrl + gameId + "/defend/" + sessionKey;
		    var unitData = {
		        unitId: unit.unitId
		    };

		    httpRequester.postJSON(url, unitData, success, error);
		}
	});
	var MessagesPersister = Class.create({
		init: function (url) {
			this.rootUrl = url + "messages/";
		},
		unread: function (success, error) {
			var url = this.rootUrl + "unread/" + sessionKey;
			httpRequester.getJSON(url, success, error);
		},
		all: function (success, error) {
			var url = this.rootUrl + "all/" + sessionKey;
			httpRequester.getJSON(url, success, error);
		}
	});
	return {
		get: function (url) {
			return new MainPersister(url);
		}
	};
}());