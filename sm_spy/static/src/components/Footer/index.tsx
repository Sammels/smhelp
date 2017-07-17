import * as React from "react";

var styles = require('./footer.css');

interface IFooterProps {}


const FooterClass = class Footer extends React.Component<IFooterProps, any> {

    render () {
        return <div className='footer'>
        </div>;
      }
}

export default FooterClass;