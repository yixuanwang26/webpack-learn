
import React from 'react';
import img from '../assets/redA.jpeg';

export class Card extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        console.log('已完成渲染');
    }
    render() {
        return (
            <div className="Card">
                <p>yahahah~~</p>
                <p>{this.props.name},恭喜你~ 找到我。那就测试一下吧</p>
                <img src={img}/>
            </div>
        )
    }
}