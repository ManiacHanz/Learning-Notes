import React, { Component } from "react";
import { inject, observer } from "mobx-react";

@inject("todo")
@observer
class List extends Component {
  handleClick = () => {
    console.log(8)
  }
  render() {
    const {todo: {addApple, newApples, eatApple, isAdding}} = this.props

    return (
      <footer className="footer">
        {!newApples.length ? '苹果篮子空空如也' : '' }
        {newApples.map(item => {
          return (
            <div key={item.id} className="appleItem">
              <div>
                <span>红苹果 - {item.id} 号</span>
                <span>{item.weight}克</span>
              </div>
              <div className='eat-btn' onClick={() => eatApple(item)}>吃掉</div>
            </div>
          )
        })}
        <div className={isAdding ? 'btn disable': 'btn' } onClick={addApple}>{ isAdding ? `正在采摘...` : `摘苹果`}</div>
      </footer>
    );
  }
}

export default List;
