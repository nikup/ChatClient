﻿/// <reference path="controller.js" />
/// <reference path="data-persister.js" />

String.prototype.escape = function () {
    var tagsToReplace = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;'
    };
    return this.replace(/[&<>]/g, function (tag) {
        return tagsToReplace[tag] || tag;
    });
};

$(function () {
    var serviceRoot = "http://teammilhouse-2.apphb.com/api/"

    var localPersister = ChatClient.persisters.getPersister(serviceRoot);
    
    var accessController = ChatClient.controller.getAccessController(localPersister, "#top-navbar");
    var gameController = ChatClient.controller.getGameController(localPersister, "#main-content");
    
    if (accessController.isUserLoggedIn()) {
        PresentGamePage(accessController, gameController);
    }
    else {
        PresentLoginPage(accessController, gameController);
    }
    // localPersister.user.login("asen", "asen");
    // localPersister.user.logout();
});

function PresentLoginPage(accessController, gameController) {
    $("#btn-login-display").show();
    $("#btn-register-display").show();
    $("#btn-logout").hide();
    $("#btn-scores").hide();

    accessController.loginUser().then(function () {
        
        PresentGamePage(accessController, gameController);
        return false;
    }, function (error) {
        alert(error.responseJSON.Message);
        PresentLoginPage(accessController, gameController);
        $("#login-container").hide();
        $("#register-container").hide();
    }).done();
}

function PresentGamePage(accessController, gameController) {
    $("#btn-login-display").hide();
    $("#btn-register-display").hide();
    $("#btn-logout").show();
    $("#btn-scores").show();
    $("#user-nickname").text("Hi, " + localStorage.getItem("username"));

    $("#btn-logout").on("click", function () {
        gameController.stopGame();
        accessController.logoutUser();
        PresentLoginPage(accessController, gameController);
        return false;
    });

    $("#btn-scores").on("click", function () {
        accessController.showScores();
    });


    gameController.startGame();
}