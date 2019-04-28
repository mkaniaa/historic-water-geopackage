import React from 'react';
import { Card, CardText } from 'reactstrap';

const Footer = () => (
    <Card className = "footer-license">
        <CardText>
            Historic Water created by Marek Kania is licensed under a 
            <a rel="license" href="https://github.com/mkaniaa/historic-water/blob/master/LICENSE"> GNU GENERAL PUBLIC LICENSE</a>
        </CardText>                
    </Card>
);

export default Footer;