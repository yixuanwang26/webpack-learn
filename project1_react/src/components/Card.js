
import React from 'react';

export class Card extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        console.log('已完成渲染');
    }
    render() {
        return (
            <div>
                <p>yahahah~~</p>
                <p>{this.props.name},恭喜你~ 找到我</p>
            </div>
        )
    }
}