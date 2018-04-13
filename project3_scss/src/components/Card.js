
import React from 'react';
import styles from './Card.scss';


export class Card extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        console.log('已完成渲染');
    }
    render() {
        return (
            <div className={styles.Card}>
                <p className={styles.title}>yahahah~~</p>
                <p className={styles.content}>{this.props.name},恭喜你~ 找到我。那就测试一下吧</p>
            </div>
        )
    }
}