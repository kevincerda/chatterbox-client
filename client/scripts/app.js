// YOUR CODE HERE:
class Application {
  constructor() {
    this.username = window.location.search.substr(10);
    this.friends = [];
    this.roomname = 'lobby';
    this.roomList = [];
    this.messages = [];
    this.oldIds = [];
    this.init = function() {
      this.fetch();
      setTimeout(function() {
        for (var i = 0; i < 20; i++) {
          app.renderMessage(app.messages[i]);
        }
        app.renderRoomList();
      }, 1000);
      setInterval(function() {
        app.fetch();
        for (var i = 0; i < 20; i++) {
            app.renderMessage(app.messages[i]);
        }
        app.renderRoomList();
      }, 3000);
    }
    this.send = function(message) {
      $.ajax({
        url: 'http://parse.la.hackreactor.com/chatterbox/classes/messages',
        type: 'POST',
        data: JSON.stringify(message),
        contentType: 'application/json',
        success: function (response) {
          console.log('chatterbox: Message sent')
          app.oldIds.push(response.objectId);
         },
        error: function (data) {
          console.error('chatterbox: Failed to send message', data);
      }
    });
    },
    this.fetch = function(response) {
      $.ajax({
        url: 'http://parse.la.hackreactor.com/chatterbox/classes/messages',
        type: 'GET',
        data: "order=-createdAt",
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
          app.messages = data.results;
        },
        error: function (data) {
          console.error('get failed', data);
        },
        complete: function() {
          app.messages.sort(function(a, b) {
            return (b.createdAt) > (a.createdAt);
          });
          app.messages.forEach(function(m) {
            m.roomname !== undefined && !app.roomList.includes(m.roomname) && app.roomList.push(m.roomname);
          });
        }
      });
    },
    this.clearMessages = function() {
      $("#chats").empty();
    },
    this.renderMessage = function(message) {
      if (message.roomname && message.username) {
        var username, text;
        if (message.roomname === app.roomname) {
        username = message.username.replace(/[^a-zA-Z0-9.,:;+=~`]/g, '');
        username = username.slice(0, 15);
          !message.text ? {} : 
            text = message.text.replace(/[^a-zA-Z0-9.,:;+=~`]/g, '');
            if (app.friends.includes(username)) { text = `<b>` + text + `</b>` };
            if (!app.oldIds.includes(message.objectId)) {
              $("#chats").append(`<div id="` + message.objectId + `">` + moment(message.createdAt).format('MMM Do, h:mm:ss a') 
                + ' - ' + `<div class="user" onclick="app.handleUsernameClick(this)">${username}</div>: <div class="${username}" style="display: inline-block">${text}</div></div>`);
            } 
          app.oldIds.push(message.objectId);
        }
      }
    }
    this.chooseRoom = function(choice) {
      choice.innerHTML ? app.roomname = choice.innerHTML : app.roomname = choice;
      $("#roomId").html(`You are in: ` + app.roomname);
      app.clearMessages();
      app.oldIds = [];
      app.fetch();
    }
    this.createRoom = function(roomName) {
      !app.roomList.includes(roomName) && app.roomList.push(roomName);
      app.renderRoomList();
    }
    this.renderRoomList = function() {
      $("#roomList").empty();
      for (var i = 0; i < app.roomList.length; i++) {
        var room = app.roomList[i];
        $("#roomList").append(`<div class="room" onclick="app.chooseRoom(this)">${room}</div>`);
      };
    }
    this.handleUsernameClick = function(user) {
      var friend = user.innerHTML;
      if (friend === "anonymous") {
        $("#addFriend").html(`<div class="anon">'anonymous' doesn't want to be your friend.</div>`);
        $(".anon").fadeOut(2500);
      } else {
        if (!app.friends.includes(friend) && friend !== app.username) {
          app.friends.push(friend);
          $("#addFriend").html(`<div class="added"> *** friend added! *** </div>`);
          $(".added").fadeOut(2500);
          app.renderFriendList();
          $("." + friend).css("font-weight", "bold");
        }
      }
    }
    this.deleteFriend = function(friend) {
      var friend = friend.innerHTML.toString().split('<')[0];
      app.friends.splice(app.friends.indexOf(friend), 1);
      console.log(app.friends);
      $("#addFriend").html(`<div class="added"> *** friend deleted *** </div>`);
      $(".added").fadeOut(2500);
      app.renderFriendList();
      $("." + friend).css("font-weight", "normal");
    }
    this.renderFriendList = function() {
      $("#friendList").empty();
      for (var i = 0; i < app.friends.length; i++) {
        var friend = app.friends[i];
      $("#friendList").append(`<div class="friendOnList" id="` + friend + `">` + friend + `<img onclick="app.deleteFriend(${friend})" 
        src="images/delete.png" height="14px" style="float:right" /> </div>`);
      }
    }
    this.handleSubmit = function(message) {
      var message = {
        username: app.username,
        text: $("#message").val(),
        roomname: app.roomname,
      }
      this.renderMessage(message);
      this.send(message);
    }
  }
}

var app = new Application();

$( document ).ready(function() {
  app.init();
});

function showRooms() {
    document.getElementById("roomList").classList.toggle("show");
}

function showFriends() {
    document.getElementById("friendList").classList.toggle("show");
}

window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("drop-content", "drop-content2");
    for (var i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}