const { Register } = require("./register");
const { Agent } = require("./agent");
const { Customer } = require("./customer");

module.exports = function (userId, newRole, callback) {
  Register.findById(userId, (err, user) => {
    if (err) {
      console.error(err);
      return callback(err);
    }
    if (user.role === "customer") {
      Customer.findById(user.customerId, (err, customer) => {
        if (err) {
          console.error(err);
          return callback(err);
        }
        const agent = new Agent();
        // Copy some data from customer to Agent table before we delete the customer record
        agent.fname = customer.fname;
        agent.lname = customer.lname;
        agent._id = customer._id;
        agent.registeredOn = customer.registeredOn;
        customer.delete((err) => {
          if (err) return console.error(err);
          agent.save((err) => {
            if (err) {
              console.error(err);
              return callback(err);
            }
            user.role = newRole;
            user.agentId = agent._id;
            user.customerId = null;
            user.save((err) => {
              if (err) {
                console.error(err);
                return callback(err);
              }
              callback(null);
            });
          });
        });
      });
    } else {
      if (newRole !== "customer") {
        // will process manager <-> agent
        user.role = newRole;
        user.save((err) => {
          if (err) {
            console.error(err);
            return callback(err);
          }
          callback(null);
        });
      }
    }
  });
};
