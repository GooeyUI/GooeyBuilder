const nativeBridge = {
  runCommand: function (command) {
    return new Promise((resolve, reject) => {
      try {
        if (!command || typeof command !== "string") {
          throw new Error("Invalid command format");
        }

        window._runCommand(command)
          .then((response) => {
            if (response && response.error) {
              reject(response.error);
            } else {
              resolve(response);
            }
          })
          .catch((error) => {
            console.error("Command failed:", error);
            reject(error);
          });
      } catch (e) {
        console.error("Bridge error:", e);
        reject(e);
      }
    });
  },

  docsCommand: function () {
    return new Promise((resolve, reject) => {
      try {
        window._docsCommand()
          .then((response) => {
            if (response && response.error) {
              reject(response.error);
            } else {
              resolve(response);
            }
          })
          .catch((error) => {
            console.error("Command failed:", error);
            reject(error);
          });
      } catch (e) {
        console.error("Bridge error:", e);
        reject(e);
      }
    });
  }
};

export default nativeBridge;