/* eslint-disable no-unused-vars */
module.exports = function (on, config) {
  on('task', {
    log(message) {
      console.log(message);
      return message;
    }
  });
};
