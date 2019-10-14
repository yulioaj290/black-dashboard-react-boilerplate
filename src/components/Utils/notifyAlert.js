import React from "react";

let notifyAlert = (component, type, message) => {
    let prefix = "";
    switch (type) {
        case "primary":
            prefix = "";
            break;
        case "success":
            prefix = "Success: ";
            break;
        case "danger":
            prefix = "Error: ";
            break;
        case "warning":
            prefix = "Warning: ";
            break;
        case "info":
            prefix = "Info: ";
            break;
        default:
            break;
    }
    let options = {
        place: "tc",
        message: (
            <div>
                <div>
                    {prefix + message}
                </div>
            </div>
        ),
        type: type,
        icon: "tim-icons icon-bell-55",
        autoDismiss: 7
    };
    if (typeof component.current !== "undefined" && component.current !== null) {
        component.current.notificationAlert(options);
    }
};

export default notifyAlert;