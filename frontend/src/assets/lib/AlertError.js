/* Error, which text need to be showed to user!*/
const Swal = require("sweetalert2");

class AlertError extends Error{
    constructor(message){
        super();
        this.name = "AlertError";
        this.message = message;
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, AlertError);
          } else {
            this.stack = (new Error()).stack;
        }
        Swal.fire({
            title: 'Ошибка!',
            text: message,
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
}


module.exports = AlertError;