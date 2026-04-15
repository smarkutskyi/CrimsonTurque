import React from "react";


const FieldErrorv = ({message}) => {

    if (!message) {
        return null;
    }

    return (<span className="error">{message}</span>);
}

export default FieldErrorv;