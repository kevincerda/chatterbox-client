// YOUR CODE HERE:
class Application {
  constructor() {
    this.messages = [];
    this.init = function() {
      this.fetch();
      setTimeout(function() {
        for (var i = 0; i < 20; i++) {
          app.renderMessage(app.messages[i]);
        }
      }, 1000);
    },
    this.send = function(message) {
      $.ajax({
        url: 'http://parse.la.hackreactor.com/chatterbox/classes/messages',
        type: 'POST',
        data: JSON.stringify(message),
        contentType: 'application/json',
        success: function (data) {
          console.log('chatterbox: Message sent');
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
        //data: JSON.stringify(response),
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
          app.messages = data.results;
         },
        error: function (data) {
          console.error('get failed', data);
        },
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
      !message.username ? username = 'anonymous' :
        username = message.username.replace(/[^a-zA-Z0-9.,:;+=~`]/g, '');
      !message.text ? text = ' ' : 
        text = message.text.replace(/[^a-zA-Z0-9.,:;+=~`]/g, '');
      $("#chats").prepend(`<div>` + moment(message.createdAt).format('MMM Do, h:mm:ss a') + ' - ' + username + ': ' + text + `</div>`);
    }
    this.renderRoom = function(roomName) {
      $("#roomSelect").append(`<div>` + {roomName} + `</div`)
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
      this.send(message);
    }
  }
}

var app = new Application();

$( document ).ready(function() {
  app.init();
});