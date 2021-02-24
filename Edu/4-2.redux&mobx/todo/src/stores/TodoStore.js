import { observable, action, computed } from 'mobx';

function getWeight() {
  return Math.floor(Math.random() * 30 + 200)
}

class TodoStore {
 
  id = 0

  @observable isAdding = false;

  @observable apples = [];

  @action.bound addApple() {
    if(this.isAdding) return

    this.isAdding = true
    setTimeout(() => {
      this.apples.push({
        id: ++this.id,
        weight: getWeight(),
        eat: false
      })
      this.isAdding = false
    }, 1500);
  }

  @action.bound eatApple(item) {
    item.eat = true
  }
  @computed get newApples() {
    return this.apples.filter(item => !item.eat )
  }

  @computed get appleCounts() {
    const [olds, news] = this.apples.reduce((pre, curr) => {
      if(curr.eat) pre[1].push(curr)
      else pre[0].push(curr)

      return pre
    }, [[], []])
    return {
      olds: {
        weight: olds.reduce((pre, curr) => pre + curr.weight, 0),
        count: olds.length
      },
      news: {
        weight: news.reduce((pre, curr) => pre + curr.weight, 0),
        count: news.length
      }
    }
  }
}

const todo = new TodoStore();

export default todo;