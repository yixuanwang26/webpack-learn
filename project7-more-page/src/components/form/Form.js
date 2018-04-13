
import React from 'react';
import Style from './Form.css';

export class Form extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        console.log('已完成渲染');
    }
    render() {
        return (
            <div className="Form">
                <p>你好呀~~</p>
                <p>{this.props.name}</p>
            </div>
        )
    }
}