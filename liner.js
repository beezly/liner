Tasks = new Ground.Collection("tasks");

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish("tasks", function () {
    return Tasks.find({ owner: this.userId } );
  });
}

if (Meteor.isClient) {
  // This code only runs on the client

  Meteor.subscribe("tasks");

  Template.body.helpers({
    tasks: function () {
      return Tasks.find({}, {sort: {createdAt: -1}});
    }
  });

  Template.body.events({
    "submit .new-task": function (event) {
      // Prevent default browser form submit
      event.preventDefault();
 
      // Get value from form element
      var text = event.target.text.value;
 
      // Insert a task into the collection
      Tasks.insert({
        text: text,
        createdAt: new Date(), // current time
        owner: Meteor.userId(),
        username: Meteor.user().username
      });
 
      // Clear form
      event.target.text.value = "";
    }
  });

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });
}
