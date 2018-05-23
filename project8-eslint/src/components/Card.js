import React from 'react';
import PropTypes from 'prop-types';
export class Card extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div>
                <p>yahahah~~</p>
                <p>{this.props.name},恭喜你~ 找到我</p>
            </div>
        );
    }
}

Card.propTypes = {
    name: PropTypes.string
};