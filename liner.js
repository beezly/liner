Tasks = new Ground.Collection("tasks");

Tasks.allow({
  insert: function (userId, doc) {
    return (userId && doc.owner === userId);
  },
  update: function (userId, doc, fields, modifier) {
    // can only change your own documents
    return doc.owner === userId;
  },
  remove: function (userId, doc) {
    // can only remove your own documents
    return doc.owner === userId;
  },
  fetch: ['owner']
});

Tasks.deny({
  update: function (userId, doc, fields, modifier) {
    // can't change owners
    return _.contains(fields, 'owner');
  },
  remove: function (userId, doc) {
    // can't remove locked documents
    return false; 
  },
  fetch: ['locked'] // no need to fetch 'owner'
});

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
