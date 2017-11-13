import * as React from "react";


interface IModalProps {
    message: string
}

interface IModalStates {}


class Modal extends React.Component<IModalProps, IModalStates> {

    props: IModalProps;

    render () {
        alert(this.props.message);
        return null;
      }
}

export default Modal;