// YOUR CODE HERE:
class Application {
  constructor() {
    this.roomname = 'lobby';
    this.messages = [];
    this.oldIds = [];
    this.init = function() {
      this.fetch();
      setTimeout(function() {
        for (var i = 0; i < 20; i++) {
          app.renderMessage(app.messages[i]);
        }
      }, 1000);
      setInterval(function() {
        app.fetch();
        for (var i = 0; i < 20; i++) {
            app.renderMessage(app.messages[i]);
        }
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
        }
      });
    },
    this.clearMessages = function() {
      $.ajax({
        url: 'http://parse.la.hackreactor.com/chatterbox/classes/messages/index.html',
        type: 'POST',
        data: JSON.stringify($("#chats").empty()),
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
          console.log('delete success');
         },
        error: function (data) {
          console.error('delete failed', data);
        }
      });
    },
    this.renderMessage = function(message) {
      var username, text;
      if (message.roomname === app.roomname) {
        !message.username ? username = 'anonymous' :
          username = message.username.replace(/[^a-zA-Z0-9.,:;+=~`]/g, '');
        !message.text ? {} : 
          text = message.text.replace(/[^a-zA-Z0-9.,:;+=~`]/g, '');
          if (!app.oldIds.includes(message.objectId)) {
            $("#chats").append(`<div id="` + message.objectId + `">` + moment(message.createdAt).format('MMM Do, h:mm:ss a') + ' - ' + username + ': ' + text + `</div>`);
          } 
        app.oldIds.push(message.objectId);
      }
    }
    this.renderRoom = function(roomName) {
      app.roomname = roomName;
    }
    this.createRoom = function(roomName) {
      $("#roomSelect").append(roomName);
    }
    this.handleUsernameClick = function(username) {
      $("#friends").append(`<span>` + {username} + `</span>`);
    }
    this.handleSubmit = function(message) {
      var message = {
        username: '',
        text: $("#message").val(),
        roomname: 'lobby'
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