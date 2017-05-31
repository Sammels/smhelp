import * as React from "react";

var styles = require('./footer.css');

interface IFooter {}


const FooterClass = class Footer extends React.Component<IFooter, void> {
    render () {
        return <div className='footer'>
        </div>;
      }
}

export default FooterClass;