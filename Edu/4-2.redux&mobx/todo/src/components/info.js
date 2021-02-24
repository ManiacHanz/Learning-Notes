import React, { Component } from "react";
import { inject, observer } from "mobx-react";

@inject('todo')
@observer
class Info extends Component {
  render() {
    const {todo: {appleCounts}} = this.props
    return (
      <div className="info">
        <div className='old'>
          <div>当前</div>
          <div>{appleCounts.olds.count}个苹果， {appleCounts.olds.weight}克</div>
        </div>
        <div className='new'>
          <div>已吃掉</div>
          <div>{appleCounts.news.count}个苹果， {appleCounts.news.weight}克</div>
        </div>
      </div>
    );
  }
}

export default Info;
